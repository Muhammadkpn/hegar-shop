import React from 'react';
import { getBlogDetails, getOthersBlog, getCommentsByBlog, countView } from '../../store/action';
import { useRouter } from 'next/router';
import Navbar from '../../components/Layout/Navbar';
import PageTitle from '../../components/Common/PageTitle';
import BlogDetails from '../../components/Blog/BlogDetails';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';
import { wrapper } from '../../store/store';
import axios from 'axios';
import { URL } from '../../store/helpers';

const BlogDetailsPage = ({ blogDetails, othersBlog }) => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <React.Fragment>
            <Navbar />
            <PageTitle
                pageTitle='Blog Details'
                othersPage={[
                    { url: '/', text: 'Home' },
                    { url: '/blog', text: 'Blog' },
                ]}
                activePage='Blog Details'
            />
            <BlogDetails blog_id={id} blogDetails={blogDetails} othersBlog={othersBlog} />
            <Subscribe />
            <Footer />
        </React.Fragment>
    );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
    const { id } = params;
    await store.dispatch(countView(id));
    await store.dispatch(getBlogDetails(id));
    await store.dispatch(getCommentsByBlog(id));
    await store.dispatch(getOthersBlog(id));

    const { blogDetails, othersBlog } = store.getState().blog;
    return {
        props: {
            blogDetails,
            othersBlog,
        },
        revalidate: 60 * 60 * 12,
    };
});

export async function getStaticPaths() {
    const blog = await axios.get(`${URL}/blog`);
    const paths = blog.data.data.map((item) => {
        return {
            params: {
                id: `${item.id}`,
            },
        };
    });
    return {
        paths,
        fallback: false,
    };
}

export default BlogDetailsPage;
