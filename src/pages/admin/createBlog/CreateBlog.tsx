import CreateBlogForm from "../../../components/blog/CreateBlogForm";
import Navbar from "../../../components/common/Navbar";

const CreateBlog = () => {

  return (
    <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-8 h-full w-full">
      <Navbar />
      <CreateBlogForm />
    </div>
  );
};

export default CreateBlog;
