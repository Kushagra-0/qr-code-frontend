import { useParams } from "react-router-dom";
import EditBlogForm from "../../../components/blog/EditBlogForm";
import Navbar from "../../../components/common/Navbar";

const EditBlog = () => {
  const { slug } = useParams();

  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 h-full w-full">
      <Navbar />
      <EditBlogForm slug={slug} />
    </div>
  );
};

export default EditBlog;
