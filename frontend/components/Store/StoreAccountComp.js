import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFullImageUrl } from '../../store/helpers';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getSalesSummary, getWishlist, userLogout, getCart } from '../../store/action';
import StoreSettings from './StoreSettings';
import StoreOrders from './StoreOrders';
import StoreSales from './StoreSales';
import StoreProducts from './StoreProducts';
import StoreWithdraw from './StoreWithdraw';
import StoreShipping from './StoreShipping';

const StoreAccountComp = () => {
    const [btnCollapse, setBtnCollapse] = React.useState(false);
    const router = useRouter();
    const { section } = router.query;

    const { user_id, salesSummary } = useSelector((state) => {
        return {
            user_id: state.users.id,
            salesSummary: state.store.salesSummary,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        if (user_id) {
            `${section}`.toLowerCase() === 'settings' ||
            `${section}`.toLowerCase() === 'orders' ||
            `${section}`.toLowerCase() === 'sales' ||
            `${section}`.toLowerCase() === 'products' ||
            `${section}`.toLowerCase() === 'shipping' ||
            `${section}`.toLowerCase() === 'withdraw'
                ? router.push(`/store/account?section=${section}`)
                : router.push('/store/account?section=sales');
            dispatch(getSalesSummary('type=by-store', user_id));
        } else {
            router.push('/');
        }
    }, []);

    const handleLogout = () => {
        dispatch(userLogout());
        dispatch(getCart(user_id));
        dispatch(getWishlist(user_id));
    };

    return (
        <div className='store-account-container'>
            <div className='store-name'>
                <div className='row justify-content-center'>
                    <div className='col-10 col-md-6'>
                        <div className='row'>
                            <div className='col-12 col-md-2'>
                                <img
                                    src={getFullImageUrl(salesSummary?.image ? salesSummary.image : 'image/users/avatar.jpg')}
                                    alt='store-profile-img'
                                    className='store-img img-circle border bg-light'
                                />
                            </div>
                            <div className='col-12 col-md-6 p-0'>
                                <h5>{salesSummary?.username}</h5>
                                <p>
                                    Member since{' '}
                                    {
                                        new Date(salesSummary?.user_reg_date)
                                            .toLocaleDateString()
                                            .split('/')[2]
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='col-10 col-md-6'>
                        <h5 className='text-right'>Total Quantity Orders</h5>
                        <p className='text-right text-light'>
                            {salesSummary?.qty_per_status} Items
                        </p>
                    </div>
                </div>
            </div>
            <div className='store-account-content rounded shadow'>
                <div className='store-account-sidebar'>
                    <div className='row no-gutters'>
                        <div className='col-lg-3 border-right pr-0'>
                            <div className='store-menu'>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary btn-block'
                                    data-toggle='collapse'
                                    data-target='#store-menu-collapse'
                                    aria-controls='store-menu-collapse'
                                    onClick={() => setBtnCollapse(!btnCollapse)}

                                >
                                    Store Menu &nbsp; <i className='bx bx-menu'></i>
                                </button>
                            </div>
                            <div className={`collapse ${btnCollapse ? 'd-none' : 'd-block'}`} id='store-menu-collapse'>
                                <h6 className='title-sidebar p-3'>Account</h6>
                                <Link href='/store/account?section=settings'>
                                    <p
                                        className='subtitle-sidebar p-3'
                                        style={
                                            `${section}`.toLowerCase() === 'settings'
                                                ? { color: '#172C93', fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        <i className='bx bx-cog mr-2'></i>Settings
                                    </p>
                                </Link>
                                <div className='dropdown-divider'></div>
                                <Link href='/store/account?section=orders'>
                                    <p
                                        className='subtitle-sidebar p-3'
                                        style={
                                            `${section}`.toLowerCase() === 'orders'
                                                ? { color: '#172C93', fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        <i className='bx bx-money mr-2'></i>Orders
                                    </p>
                                </Link>
                                <h6 className='title-sidebar p-3'>Store Dashboard</h6>
                                <Link href='/store/account?section=sales'>
                                    <p
                                        className='subtitle-sidebar p-3'
                                        style={
                                            `${section}`.toLowerCase() === 'sales'
                                                ? { color: '#172C93', fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        <i className='bx bx-dollar mr-2'></i>Sales
                                    </p>
                                </Link>
                                <div className='dropdown-divider'></div>
                                <Link href='/store/account?section=products'>
                                    <p
                                        className='subtitle-sidebar p-3'
                                        style={
                                            `${section}`.toLowerCase() === 'products'
                                                ? { color: '#172C93', fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        <i className='bx bx-package mr-2'></i>Products
                                    </p>
                                </Link>
                                <div className='dropdown-divider'></div>
                                <Link href='/store/account?section=shipping'>
                                    <p
                                        className='subtitle-sidebar p-3'
                                        style={
                                            `${section}`.toLowerCase() === 'shipping'
                                                ? { color: '#172C93', fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        <i className='bx bxs-truck mr-2'></i>Shipping
                                    </p>
                                </Link>
                                <div className='dropdown-divider'></div>
                                <Link href='/store/account?section=withdraw'>
                                    <p
                                        className='subtitle-sidebar p-3'
                                        style={
                                            `${section}`.toLowerCase() === 'withdraw'
                                                ? { color: '#172C93', fontWeight: 'bold' }
                                                : {}
                                        }
                                    >
                                        <i className='bx bx-refresh mr-2'></i>Withdraw
                                    </p>
                                </Link>
                                <div className='dropdown-divider'></div>
                                <Link href='/' onClick={() => handleLogout()}>
                                    <p className='subtitle-sidebar p-3'>
                                        <i className='bx bx-log-out mr-2'></i>Sign out
                                    </p>
                                </Link>
                            </div>
                        </div>
                        <div className='col-lg-9'>
                            {section === 'settings' ? (
                                <StoreSettings />
                            ) : section === 'orders' ? (
                                <StoreOrders />
                            ) : section === 'sales' ? (
                                <StoreSales type='store-sales' />
                            ) : section === 'products' ? (
                                <StoreProducts />
                            ) : section === 'shipping' ? (
                                <StoreShipping />
                            ) : section === 'withdraw' ? (
                                <StoreWithdraw />
                            ) : (
                                <StoreSales type='store-sales' />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreAccountComp;
