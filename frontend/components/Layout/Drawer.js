import React, { Component } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Drawer = ({ active, onClick }) => {
    const [modal, setModal] = React.useState(false);
    const [arrow1, setArrow1] = React.useState(false);
    const [arrow2, setArrow2] = React.useState(false);

    const { user_id, role_id, categoryChild, cart, wishlist } = useSelector((state) => {
        return {
            user_id: state.users.id,
            role_id: state.users.role,
            categoryChild: state.categoryProduct.categoryChild,
            cart: state.cart.cart,
            wishlist: state.wishlist.wishlist,
        };
    });

    const menuSection = () => {
        return (
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <Link href='/shop'>
                        <a className='nav-link'>Shop</a>
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link href='/store'>
                        <a className='nav-link'>Store List</a>
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link href='/blog'>
                        <a className='nav-link'>Blog</a>
                    </Link>
                </li>
                <li className='nav-item'>
                    <Link href='/contact'>
                        <a className='nav-link'>Contact</a>
                    </Link>
                </li>
            </ul>
        );
    };

    const categorySection = () => {
        return (
            <div>
                {categoryChild?.parent?.map((item, index) => {
                    return (
                        <ul key={index} className='navbar-nav'>
                            <li
                                data-toggle='collapse'
                                href={`#cat-parent1-${item.id}`}
                                role='button'
                                aria-expanded='false'
                                aria-controls={`cat-parent1-${item.id}`}
                                className='nav-item d-flex justify-content-between py-3'
                            >
                                <Link href={`/shop?category=${item.name}`}>
                                    <a>{item.name}</a>
                                </Link>
                                {categoryChild?.child1?.filter((val) => item.id === val.parent_id)
                                    .length > 0 ? (
                                    <i
                                        className={`bx bx-chevron-${
                                            arrow1 ? 'up' : 'down'
                                        }-circle bx-sm`}
                                        onClick={() => setArrow1(!arrow1)}
                                    ></i>
                                ) : null}
                            </li>
                            {categoryChild?.child1?.map((value, idx) => {
                                if (item.id === value.parent_id) {
                                    return (
                                        <ul
                                            className='collapse navbar-nav'
                                            id={`cat-parent1-${item.id}`}
                                            key={idx}
                                        >
                                            <li
                                                className='ml-3 nav-item d-flex justify-content-between py-3'
                                                data-toggle='collapse'
                                                href={`#cat-child1-${value.id}`}
                                                role='button'
                                                aria-expanded='false'
                                                aria-controls={`cat-child1-${value.id}`}
                                            >
                                                <Link href={`/shop?category=${value.name}`}>
                                                    <a>{value.name}</a>
                                                </Link>
                                                {categoryChild?.child2?.filter(
                                                    (val) => value.id === val.parent_id
                                                ).length > 0 ? (
                                                    <i
                                                        className={`bx bx-chevron-${
                                                            arrow2 ? 'up' : 'down'
                                                        }-circle bx-sm`}
                                                        onClick={() => setArrow2(!arrow2)}
                                                    ></i>
                                                ) : null}
                                            </li>
                                            {categoryChild?.child2?.map((val, id) => {
                                                if (value.id === val.parent_id) {
                                                    return (
                                                        <ul
                                                            className='collapse navbar-nav'
                                                            id={`cat-child1-${value.id}`}
                                                            key={id}
                                                        >
                                                            <li className='ml-5 nav-item py-3'>
                                                                <Link
                                                                    href={`/shop?category=${val.name}`}
                                                                >
                                                                    <a>{val.name}</a>
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    );
                                                }
                                            })}
                                        </ul>
                                    );
                                }
                            })}
                        </ul>
                    );
                })}
            </div>
        );
    };
    return (
        <React.Fragment>
            <div className={`sidebarModal right ${active}`}>
                <div className='modal-innter-content'>
                    <button type='button' className='close' onClick={() => onClick(modal)}>
                        <span aria-hidden='true'>
                            <i className='bx bx-x'></i>
                        </span>
                    </button>

                    <div className='modal-body'>
                        <h3>Menu</h3>
                        <div className='search-container'>
                            <div className='input-group'>
                                <div className='input-group-prepend'>
                                    <button type='button' className='btn btn-outline-primary'>
                                        <i className='bx bx-search-alt'></i>
                                    </button>
                                </div>
                                <input
                                    type='text'
                                    name='drawer-search-product'
                                    className='form-control'
                                    placeholder='Search products'
                                />
                            </div>
                            <div className='others-option'>
                                <div className='option-item'>
                                    <div
                                        data-toggle='tooltip'
                                        data-placement='bottom'
                                        title='Wishlist'
                                        className='icon-btn-box'
                                    >
                                        <Link href={user_id ? '/wishlist' : '/authentication'}>
                                            <a className='icon-btn'>
                                                <i className='icon-btn far fa-heart'></i>
                                                <span>
                                                    {wishlist?.products
                                                        ? wishlist.products.length
                                                        : 0}
                                                </span>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <div className='option-item'>
                                    <div
                                        data-toggle='tooltip'
                                        data-placement='bottom'
                                        title='Wishlist'
                                        className='icon-btn-box'
                                    >
                                        <Link
                                            href={
                                                role_id === 1
                                                    ? '/super-admin'
                                                    : role_id === 2
                                                    ? '/store/account'
                                                    : role_id === 3
                                                    ? '/account'
                                                    : '/authentication'
                                            }
                                        >
                                            <a className='icon-btn'>
                                                <i className='icon-btn far fa-user'></i>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                                <div className='option-item'>
                                    <div
                                        data-toggle='tooltip'
                                        data-placement='bottom'
                                        title='Cart'
                                        className='icon-btn-box'
                                    >
                                        <Link href={user_id ? '/shop/cart' : '/authentication'}>
                                            <a className='icon-btn'>
                                                <i className='fas fa-shopping-cart'></i>
                                                <span>{cart.total_qty || 0}</span>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <ul
                            className='nav nav-tabs nav-pills nav-justified'
                            id='drawerTab'
                            role='tablist'
                        >
                            <li className='nav-item' role='presentation'>
                                <a
                                    className='nav-link active'
                                    id='menu-tab'
                                    data-toggle='tab'
                                    href='#menu'
                                    role='tab'
                                    aria-controls='menu'
                                    aria-selected='true'
                                >
                                    Menu
                                </a>
                            </li>
                            <li className='nav-item' role='presentation'>
                                <a
                                    className='nav-link'
                                    id='category-tab'
                                    data-toggle='tab'
                                    href='#category'
                                    role='tab'
                                    aria-controls='category'
                                    aria-selected='false'
                                >
                                    Category
                                </a>
                            </li>
                        </ul>
                        <div className='tab-content'>
                            <div
                                className='tab-pane active'
                                id='menu'
                                role='tabpanel'
                                aria-labelledby='menu-tab'
                            >
                                {menuSection()}
                            </div>
                            <div
                                className='tab-pane'
                                id='category'
                                role='tabpanel'
                                aria-labelledby='category-tab'
                            >
                                {categorySection()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Drawer;
