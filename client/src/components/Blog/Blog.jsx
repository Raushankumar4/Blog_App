import { useDispatch, useSelector } from "react-redux";
import BlogCard from "./Blogcard";
import { useGetMyPost } from "../../hooks/useGetMyPost";
import axios from "axios";
import { url, user, vlogrl } from "../../constant";
import { deleteVlog, getRefresh } from "../Redux/Store/Slices/vlogSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Blog = () => {
  const userId = useSelector((state) => state.user.user);
  const vlog = useSelector((state) => state.vlog.myVlogs);
  const token = useSelector((state) => state.auth.token);
  const id = userId?._id;
  const dispatch = useDispatch();
  useGetMyPost(id);

  const handleWishlistClick = async (vlogId) => {
    try {
      const { data } = await axios.post(
        `${url}${user}/savepost/${vlogId}`,
        {
          userId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log(data.message);

      dispatch(getRefresh());
      toast.success(data?.message);
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleDelete = async (vlogId) => {
    try {
      const { data } = await axios.delete(`${url}${vlogrl}/delete/${vlogId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(getRefresh());
      dispatch(deleteVlog({ id: vlogId }));
      toast.success(data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      {vlog?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen w-full text-center ">
          <span className="font-bold text-4xl">No vlogs found.</span>
          <Link
            className="my-2 p-2 bg-blue-800 text-white rounded-md shadow-lg hover:scale-110 duration-200  transition-all ease-in-out hover:bg-blue-700 hover:shadow-xl  "
            to="/createVlog"
          >
            Create Vlog
          </Link>
        </div>
      ) : (
        vlog?.map((vlogItem) => (
          <BlogCard
            vlog={vlogItem}
            key={vlogItem._id}
            onDelete={() => handleDelete(vlogItem._id)}
            onWishlistClick={() => handleWishlistClick(vlogItem._id)}
          />
        ))
      )}
    </div>
  );
};

export default Blog;
