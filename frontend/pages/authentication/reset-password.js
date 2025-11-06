import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import ResetPassword from '../../components/Authentication/ResetPassword';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';

const ResetPasswordPage = () => {
    return (
        <React.Fragment>
            <Navbar />
            <ResetPassword />
            <Subscribe />
            <Footer />
        </React.Fragment>
    );
};

export default ResetPasswordPage;
