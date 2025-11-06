import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import Store from '../../components/Authentication/Store';
import StoreAccountComp from '../../components/Store/StoreAccountComp';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';

const StoreAccount = () => {
    return (
        <Store>
            <Navbar />
            <StoreAccountComp />
            <Subscribe />
            <Footer />
        </Store>
    );
};

export default StoreAccount;
