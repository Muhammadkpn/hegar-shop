import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import PageTitle from '../../components/Common/PageTitle';
import AuthComp from '../../components/Authentication/AuthComp';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';

const Authentication = () => {
    const router = useRouter();
    const { id } = useSelector((state) => {
        return {
            id: state.users.id,
        };
    });

    React.useEffect(() => {
        if (id) {
            return router.push('/');
        }
    }, []);

    return (
        <React.Fragment>
            <Navbar />
            <PageTitle
                pageTitle='Authentication'
                othersPage={[{ url: '/', text: 'Home' }]}
                activePage='Authentication'
            />
            <AuthComp />
            <Subscribe />
            <Footer />
        </React.Fragment>
    );
};

export default Authentication;
