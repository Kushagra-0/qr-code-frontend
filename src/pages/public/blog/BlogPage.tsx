import { useParams } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import BlogDetails from "../../../components/blog/BlogDetails";

const BlogPage = () => {
    const { slug } = useParams();

    return (
        <div className="bg-gradient-to-r from-blue-200 to-pink-200 p-4 md:p-8 min-h-screen w-full">
            <Navbar />
            <BlogDetails slug={slug} />
        </div>
    );
};

export default BlogPage;
