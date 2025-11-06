import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PageTitle from '../Common/PageTitle';
import SuperAdminProducts from './SuperAdminProducts';
import SuperAdminProductCategory from './SuperAdminProductCategory';
import SuperAdminProductTag from './SuperAdminProductTag';
import SuperAdminOrders from './SuperAdminOrder';
import SuperAdminSales from './SuperAdminSales';
import SuperAdminPayment from './SuperAdminPayment';
import SuperAdminBlog from './SuperAdminBlog';
import SuperAdminBlogCategory from './SuperAdminBlogCategory';
import SuperAdminBlogTag from './SuperAdminBlogTag';
import SuperAdminUsers from './SuperAdminUsers';
import SuperAdminKtp from './SuperAdminKtp';
import SuperAdminBank from './SuperAdminBank';
import SuperAdminBalance from './SuperAdminBalance';
import SuperAdminShipping from './SuperAdminShipping';
import { useRouter } from 'next/router';

const SuperAdminComp = () => {
    const [btnCollapse, setBtnCollapse] = React.useState(false);
    const titleSidebar = [
        {
            title: 'Products',
            subtitle: [
                { name: 'Products', section: 'products', icon: 'bxl-dropbox' },
                { name: 'Product Category', section: 'product-category', icon: 'bx-archive-in' },
                { name: 'Product Tag', section: 'product-tag', icon: 'bx-tag' },
            ],
        },
        {
            title: 'Transaction',
            subtitle: [
                { name: 'History Order', section: 'history-order', icon: 'bx-shopping-bag' },
                { name: 'Sales', section: 'sales', icon: 'bx-line-chart' },
                { name: 'Shipping', section: 'shipping', icon: 'bxs-truck' },
                { name: 'Payment Confirmation', section: 'payment-confirmation', icon: 'bx-money' },
            ],
        },
        {
            title: 'Blog',
            subtitle: [
                { name: 'Blog', section: 'blog', icon: 'bx-news' },
                { name: 'Blog Category', section: 'blog-category', icon: 'bxs-archive-in' },
                { name: 'Blog Tag', section: 'blog-tag', icon: 'bxs-tag' },
            ],
        },
        {
            title: 'Users',
            subtitle: [
                { name: 'Users', section: 'users', icon: 'bxs-id-card' },
                { name: 'Ktp', section: 'ktp', icon: 'bxs-user-detail' },
                { name: 'Bank Account', section: 'bank-account', icon: 'bxs-bank' },
                { name: 'Balance', section: 'balance', icon: 'bx-money' },
            ],
        },
    ];
    const sectionName = [
        ...titleSidebar[0].subtitle,
        ...titleSidebar[1].subtitle,
        ...titleSidebar[2].subtitle,
        ...titleSidebar[3].subtitle,
    ];
    const [linkSection, setLinkSection] = React.useState(null);
    const router = useRouter();
    const { section } = router.query;

    const { user_id } = useSelector((state) => {
        return {
            user_id: state.users.id,
        };
    });

    React.useEffect(() => {
        if (user_id) {
            if (sectionName.filter((item) => item.section === section?.toLowerCase()).length > 0) {
                router.push(`/super-admin?section=${section}`);
            } else {
                router.push('/super-admin?section=products');
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
        <div className='store-account-container'>
            <PageTitle
                pageTitle={linkSection || 'Products'}
                othersPage={[
                    { url: '/', text: 'Home' },
                    { url: '/super-admin?section=products', text: 'Super Admin' },
                ]}
                activePage={linkSection || 'Products'}
            />
            <div className='pb-4'></div>
            <div className='store-account-content rounded shadow'>
                <div className='store-account-sidebar'>
                    <div className='row no-gutters'>
                        <div className='col-lg-3 border-right pr-0'>
                            <div className='store-menu'>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary btn-block'
                                    data-toggle='collapse'
                                    data-target='#super-admin-collapse'
                                    aria-controls='super-admin-collapse'
                                    onClick={() => setBtnCollapse(!btnCollapse)}
                                >
                                    Super Admin Menu &nbsp; <i className='bx bx-menu'></i>
                                </button>
                            </div>
                            {titleSidebar.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`collapse ${btnCollapse ? 'd-none' : 'd-block'}`}
                                        id='super-admin-collapse'
                                    >
                                        <h6 className='title-sidebar p-3'>{item.title}</h6>
                                        {item.subtitle.map((value, idx) => {
                                            return (
                                                <div key={idx}>
                                                    <Link
                                                        href={`/super-admin?section=${value.section}`}
                                                    >
                                                        <a>
                                                            <p
                                                                className='subtitle-sidebar p-3'
                                                                style={
                                                                    `${section}`.toLowerCase() ===
                                                                    value.section
                                                                        ? {
                                                                              color: '#172C93',
                                                                              fontWeight: 'bold',
                                                                          }
                                                                        : {}
                                                                }
                                                            >
                                                                <i
                                                                    className={`bx ${value.icon} mr-2`}
                                                                ></i>
                                                                {value.name}
                                                            </p>
                                                        </a>
                                                    </Link>
                                                    {idx === item.subtitle.length - 1 ? null : (
                                                        <div className='dropdown-divider'></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                        <div className='col-lg-9'>
                            {section?.toLowerCase() === 'products' ? (
                                <SuperAdminProducts />
                            ) : section?.toLowerCase() === 'product-category' ? (
                                <SuperAdminProductCategory />
                            ) : section?.toLowerCase() === 'product-tag' ? (
                                <SuperAdminProductTag />
                            ) : section?.toLowerCase() === 'history-order' ? (
                                <SuperAdminOrders />
                            ) : section?.toLowerCase() === 'sales' ? (
                                <SuperAdminSales />
                            ) : section?.toLowerCase() === 'shipping' ? (
                                <SuperAdminShipping />
                            ) : section?.toLowerCase() === 'payment-confirmation' ? (
                                <SuperAdminPayment />
                            ) : section?.toLowerCase() === 'blog' ? (
                                <SuperAdminBlog />
                            ) : section?.toLowerCase() === 'blog-category' ? (
                                <SuperAdminBlogCategory />
                            ) : section?.toLowerCase() === 'blog-tag' ? (
                                <SuperAdminBlogTag />
                            ) : section?.toLowerCase() === 'users' ? (
                                <SuperAdminUsers />
                            ) : section?.toLowerCase() === 'ktp' ? (
                                <SuperAdminKtp />
                            ) : section?.toLowerCase() === 'bank-account' ? (
                                <SuperAdminBank />
                            ) : section?.toLowerCase() === 'balance' ? (
                                <SuperAdminBalance />
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminComp;
