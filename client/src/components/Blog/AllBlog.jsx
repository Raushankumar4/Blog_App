import React from "react";
import { useSelector } from "react-redux";
import AllBlogCard from "./AllBlogCar";
import { useGetAllPost } from "../../hooks/useGetAllPost";
import { Link } from "react-router-dom";
import Footer from "../Pages/Footer/Footer";

const AllBlog = () => {
  const allVlogs = useSelector((state) => state.vlog.allVlogs);
  useGetAllPost();

  return (
    <div className="w-full h-screen bg-gray-200  dark:bg-gray-900">
      {allVlogs && allVlogs?.length === 0 ? (
        <div className="flex dark:bg-gray-900  flex-col items-center justify-center h-screen w-full text-center space-y-4 bg-gray-200">
          <span className="font-bold text-4xl">No vlogs found.</span>
          <Link
            to="/createVlog"
            className="text-lg bg-gray-800 rounded-md shadow-md p-3"
          >
            Please create a vlog.
          </Link>
        </div>
      ) : (
        allVlogs?.map((vlogItem) => (
          <AllBlogCard vlog={vlogItem} key={vlogItem?._id} />
        ))
      )}
      <Footer />
    </div>
  );
};

export default AllBlog;
