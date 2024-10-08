import { Vlog } from "../models/vlog.model.js";
import { Comment } from "../models/comment.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

export const postTheVlog = async (req, res) => {
  try {
    const { description, id, title, categories } = req.body;
    if (!description || !id || !title || !categories) {
      return res.status(401).json({
        message: "Description title and categories are required",
        success: false,
      });
    }
    let postImageurl = null;
    if (req.file) {
      const postImageLocalPath = req.file.path;
      const postImage = await uploadOnCloudinary(postImageLocalPath);
      postImageurl = postImage.url;
    }

    // now create post

    const postCreated = await Vlog.create({
      userId: id,
      description,
      title,
      categories,
      postImage: postImageurl,
    });

    if (!postCreated) {
      return res
        .status(403)
        .json({ message: "Failed to create post", success: false });
    }
    return res.status(200).json({
      message: "Post Created Successfully !",
      postCreated,
      success: true,
    });
  } catch (error) {
    console.error(`Error While posting: ${error.message}`);
    return res.status(500).json({ message: "Error While posting" });
  }
};

// delete vlog

export const deleteVlog = async (req, res) => {
  try {
    const id = req.params.id;
    // Find the vlog by ID
    const post = await Vlog.findById(id);
    if (!post) {
      return res.status(404).json({ message: "No post found" });
    }

    // If the post has an image, delete it from Cloudinary
    if (post.postImage) {
      const urlParts = post.postImage.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = filename.split(".")[0];

      console.log("urlParts:", urlParts);
      console.log("filename:", filename);
      console.log("publicId:", publicId);

      const deleteResult = await deleteFromCloudinary(publicId);
      if (!deleteResult.success) {
        return res.status(500).json({
          message: `Failed to delete image from Cloudinary: ${deleteResult.error}`,
          success: false,
        });
      }
    }

    // Delete the vlog from MongoDB
    await Vlog.findByIdAndDelete(id);

    // Return success response
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(`Error while deleting post: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error while deleting post" });
  }
};

// updatepost

export const updatePost = async (req, res) => {
  const postId = req.params.id;
  const { description, title, categories } = req.body;

  if (!description || !title) {
    return res
      .status(400)
      .json({ message: "All fields required", success: false });
  }

  let postImageUrl = null;
  if (req.file) {
    try {
      // Handle image upload
      const uploadResult = await uploadOnCloudinary(req.file.path);
      if (!uploadResult || !uploadResult.url) {
        throw new Error("Failed to upload image to Cloudinary");
      }
      postImageUrl = uploadResult.url;

      // Find the existing vlog to get the current image URL
      const existingVlog = await Vlog.findById(postId);
      if (existingVlog && existingVlog.postImage) {
        // Delete the old image from Cloudinary
        const urlParts = existingVlog.postImage.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split(".")[0]; // Extract public ID

        const deleteResult = await deleteFromCloudinary(publicId);
        if (!deleteResult.success) {
          throw new Error(
            `Failed to delete old image from Cloudinary: ${deleteResult.error}`
          );
        }
      }
    } catch (error) {
      console.error("Error handling image upload:", error);
      return res.status(500).json({
        message: `Error uploading or processing image: ${error.message}`,
        success: false,
      });
    }
  }

  try {
    // Update the post with new description and (optional) new image
    const updatedPost = await Vlog.findOneAndUpdate(
      { _id: postId },
      { description, title, categories, postImage: postImageUrl || undefined },
      { new: true }
    );

    if (!updatedPost) {
      return res
        .status(404)
        .json({ message: "Failed to update", success: false });
    }

    return res.status(200).json({
      message: "Post Updated Successfully",
      updatedPost,
      success: true,
    });
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({
      message: `Error updating post: ${error.message}`,
      success: false,
    });
  }
};

// get  my posts
export const getMyPosts = async (req, res) => {
  try {
    const id = req.params.id;
    const posts = await Vlog.find({ userId: id });
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    return res.status(200).json({ message: "My Vlogs", posts, success: true });
  } catch (error) {
    console.error(`Error while getting Vlogs: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error while getting vlogs" });
  }
};

// get all post

export const getAllPosts = async (req, res) => {
  try {
    // Find all posts and populate the userId field
    const posts = await Vlog.find().populate({
      path: "userId",
      select: "-password",
    });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    return res.status(200).json({ message: "Blogs", posts, success: true });
  } catch (error) {
    console.error(`Error while getting posts: ${error.message}`);
    return res.status(500).json({
      message: "Internal server error while getting posts",
    });
  }
};

// add comment on post

export const addComment = async (req, res) => {
  try {
    const { userId, vlogId, text } = req.body;
    if (!userId || !vlogId || !text) {
      return res.status(400).json({
        message: "User ID, Vlog ID, and text are required",
        success: false,
      });
    }
    // create comment
    const comment = new Comment({ userId, vlogId, text });
    await comment.save();
    // Add the comment to the vlog's comments array
    await Vlog.findByIdAndUpdate(vlogId, { $push: { comments: comment._id } });
    return res
      .status(200)
      .json({ message: "Comment added successfully", success: true, comment });
  } catch (error) {
    console.error(`Error while adding comment: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error while adding comment" });
  }
};

// export const addComment = async (req, res) => {
//   try {
//     const { userId, vlogId, text } = req.body;

//     if (!userId || !vlogId || !text) {
//       return res.status(400).json({
//         message: "User ID, Vlog ID, and text are required",
//         success: false,
//       });
//     }

//     // Create comment
//     const comment = new Comment({ userId, vlogId, text });
//     await comment.save();

//     // Add the comment to the vlog's comments array
//     await Vlog.findByIdAndUpdate(vlogId, { $push: { comments: comment._id } });

//     // Fetch user details
//     const user = await User.findById(userId);

//     // Return response with user details
//     return res.status(200).json({
//       message: "Comment added successfully",
//       success: true,
//       comment: {
//         ...comment.toObject(),
//         user: {
//           _id: user._id,
//           fullName: user.fullName,
//           profileImage: user.profileImage,
//         },
//       },
//     });
//   } catch (error) {
//     console.error(`Error while adding comment: ${error.message}`);
//     return res.status(500).json({
//       message: "Internal server error while adding comment",
//       success: false,
//     });
//   }
// };

// Get comments for a post
export const getComments = async (req, res) => {
  try {
    const { vlogId } = req.params;

    // Find the vlog and populate comments
    const vlog = await Vlog.findById(vlogId).populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "-password",
      },
    });
    if (!vlog) {
      return res
        .status(404)
        .json({ message: "Vlog not found", success: false });
    }

    return res.status(200).json({ comments: vlog.comments, success: true });
  } catch (error) {
    console.error(`Error while getting comments: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error while getting comments" });
  }
};

// Delete a comment

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    // Find and delete the comment
    const comment = await Comment.findOneAndDelete(commentId);
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }

    // Remove the comment from the associated vlog's comments array
    await Vlog.findByIdAndUpdate(comment.vlogId, {
      $pull: { comments: commentId },
    });

    return res
      .status(200)
      .json({ message: "Comment deleted successfully", success: true });
  } catch (error) {
    console.error(`Error while deleting comment: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error while deleting comment" });
  }
};

// update comment

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Text field is required", success: false });
    }

    // Find and update the comment
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { text },
      { new: true }
    );
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found", success: false });
    }

    return res.status(200).json({
      message: "Comment updated successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.error(`Error while updating comment: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Internal server error while updating comment" });
  }
};
