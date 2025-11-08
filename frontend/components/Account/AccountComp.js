import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../../store/action';
import React from 'react';
import Dashboard from './Dashboard';
import Orders from './Orders';
import Download from './Download';
import Addresses from './Addresses';
import AccountDetails from './AccountDetails';
import { getFullImageUrl } from '../../store/helpers';

const AccountComp = ({ section, username, email }) => {
    const dispatch = useDispatch();

    const { image } = useSelector((state) => {
        return {
            image: state.users.image,
        };
    });

    return (
        <div className='account-comp'>
            <div className='account-title'>
                <div className='row no-gutters'>
                    <div className='col-md-12 col-lg-4'></div>
                    <div className='col-md-12 col-lg-8'>
                        <div className='account-subtitle d-flex justify-content-between align-items-center px-4'>
                            <p className='text-light mb-0'>Hello, {username}</p>
                            <Link href='/'>
                                <a>
                                    <button
                                        type='button'
                                        className='btn btn-outline-primary'
                                        onClick={() => dispatch(userLogout())}
                                    >
                                        <i className='bx bx-log-out'></i> Logout
                                    </button>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row no-gutters'>
                <div className='col-lg-4 pl-4 pr-4'>
                    <div className='account-sidebar shadow'>
                        <div className='top-sidebar'>
                            <div className='row no-gutters'>
                                <div className='col-lg-4'>
                                    <img
                                        src={getFullImageUrl(image || 'image/users/avatar.jpg')}
                                        className='img-circle img-profile'
                                    />
                                </div>
                                <div className='col-lg-8 px-0'>
                                    <p className='username'>{username}</p>
                                    <p className='email'>{email}</p>
                                </div>
                            </div>
                        </div>
                        <ul>
                            <li>
                                <Link href='/account?section=dashboard'>
                                    <a
                                        style={{
                                            color:
                                                `${section}`.toLowerCase() === 'dashboard'
                                                    ? '#172C93'
                                                    : '',
                                        }}
                                    >
                                        <i className='bx bx-home mr-2'></i>Dashboard
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href='/account?section=orders'>
                                    <a
                                        style={{
                                            color:
                                                `${section}`.toLowerCase() === 'orders'
                                                    ? '#172C93'
                                                    : '',
                                        }}
                                    >
                                        <i className='bx bx-shopping-bag mr-2'></i>Orders
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href='/account?section=download'>
                                    <a
                                        style={{
                                            color:
                                                `${section}`.toLowerCase() === 'download'
                                                    ? '#172C93'
                                                    : '',
                                        }}
                                    >
                                        <i className='bx bx-cloud-download mr-2'></i>Download
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href='/account?section=addresses'>
                                    <a
                                        style={{
                                            color:
                                                `${section}`.toLowerCase() === 'addresses'
                                                    ? '#172C93'
                                                    : '',
                                        }}
                                    >
                                        <i className='bx bx-map mr-2'></i>Addresses
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href='/account?section=account-details'>
                                    <a
                                        style={{
                                            color:
                                                `${section}`.toLowerCase() === 'account-details'
                                                    ? '#172C93'
                                                    : '',
                                        }}
                                    >
                                        <i className='bx bx-user mr-2'></i>Account Details
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='col-lg-8 pl-4 pr-4 pb-3 pt-5'>
                    {section === 'dashboard' ? (
                        <Dashboard />
                    ) : section === 'orders' ? (
                        <Orders type='users' />
                    ) : section === 'download' ? (
                        <Download />
                    ) : section === 'addresses' ? (
                        <Addresses type='user-address' />
                    ) : section === 'account-details' ? (
                        <AccountDetails />
                    ) : (
                        <Dashboard />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountComp;
