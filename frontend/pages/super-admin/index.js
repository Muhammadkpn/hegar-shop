import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import SuperAdmin from '../../components/Authentication/SuperAdmin';
import SuperAdminComp from '../../components/SuperAdmin/SuperAdminComp';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';

const SuperAdminPage = () => {
    return (
        <SuperAdmin>
            <Navbar />
            <SuperAdminComp />
            <Subscribe />
            <Footer />
        </SuperAdmin>
    );
};

export default SuperAdminPage;
