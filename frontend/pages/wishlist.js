import React from 'react';
import Private from '../components/Authentication/Private';
import Navbar from '../components/Layout/Navbar';
import PageTitle from '../components/Common/PageTitle';
import WishlistComp from '../components/Wishlist/WishlistComp';
import Subscribe from '../components/Common/Subscribe';
import Footer from '../components/Layout/Footer';

const WishlistPage = () => {
    return (
        <Private>
            <Navbar />
            <PageTitle
                pageTitle='Wishlist'
                othersPage={[{ url: '/', text: 'Home' }]}
                activePage='Wishlist'
            />
            <WishlistComp />
            <Subscribe />
            <Footer />
        </Private>
    );
};

export default WishlistPage;
