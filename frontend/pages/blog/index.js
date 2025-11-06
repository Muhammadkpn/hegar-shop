import React from 'react';
import { useRouter } from 'next/router'
import Navbar from'../../components/Layout/Navbar';
import PageTitle from '../../components/Common/PageTitle'
import BlogComp from '../../components/Blog/BlogComp'
import Subscribe from '../../components/Common/Subscribe'
import Footer from'../../components/Layout/Footer';

const BlogHome = () => {
    const router = useRouter();
    const { category } = router.query;

    return (
        <React.Fragment>
            <Navbar />
            <PageTitle 
                pageTitle={category ? `${category}`[0].toUpperCase() + `${category}`.slice(1) : 'Blog'}
                othersPage={category ? [{url: '/', text: 'Home'}, {url: '/blog', text: 'Blog'}] : [{url: '/', text: 'Home'}]}
                activePage={category ? `${category}`[0].toUpperCase() + `${category}`.slice(1) : 'Blog'}
            />
            <BlogComp />
            <Subscribe />
            <Footer />
        </React.Fragment>
    )
}

export default BlogHome;