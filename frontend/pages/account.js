import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import Private from '../components/Authentication/Private';
import Navbar from '../components/Layout/Navbar';
import PageTitle from '../components/Common/PageTitle';
import AccountComp from '../components/Account/AccountComp';
import Subscribe from '../components/Common/Subscribe';
import Footer from '../components/Layout/Footer';
import { getKtpById, getUserById } from '../store/action';

const AccountPage = () => {
    const [linkSection, setLinkSection] = React.useState(null);
    const sectionName = [
        { name: 'Dashboard', section: 'dashboard' },
        { name: 'Orders', section: 'orders' },
        { name: 'Download', section: 'download' },
        { name: 'Addresses', section: 'addresses' },
        { name: 'Account Details', section: 'account-details' },
    ];
    const router = useRouter();
    const dispatch = useDispatch();
    const { section } = router.query;
    const { user_id, email, username } = useSelector((state) => {
        return {
            user_id: state.users.id,
            email: state.users.email,
            username: state.users.username,
        };
    });

    React.useEffect(() => {
        if (user_id) {
            dispatch(getUserById(user_id));
            dispatch(getKtpById(user_id));
            if (sectionName.filter((item) => item.section === section?.toLowerCase()).length > 0) {
                router.push(`/account?section=${section}`);
            } else {
                router.push('/account?section=Dashboard');
            }
        }
    }, []);

    React.useEffect(() => {
        sectionName.forEach((item) => {
            if (item.section === section?.toLowerCase()) {
                setLinkSection(item.name);
            }
        });
    }, [section]);

    return (
        <Private>
            <Navbar />
            <PageTitle
                pageTitle={linkSection || 'Dashboard'}
                othersPage={[
                    { url: '/', text: 'Home' },
                    { url: '/account?section=Dashboard', text: 'My Account' },
                ]}
                activePage={linkSection || 'Dashboard'}
            />
            <AccountComp section={section?.toLowerCase()} email={email} username={username} />
            <Subscribe />
            <Footer />
        </Private>
    );
};

export default AccountPage;
