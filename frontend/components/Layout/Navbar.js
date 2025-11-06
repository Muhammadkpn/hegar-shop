import React, { Component } from 'react';
import { userLogout, getCart, getSearchProduct } from '../../store/action';
import { URL_IMG } from '../../store/helpers';
import { connect } from 'react-redux';
import Link from '../Common/ActiveLink';
import Drawer from './Drawer.js';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySearch: false,
            searchValue: '',
            drawer: false,
        };
    }

    toggleSearch = () => {
        this.setState({ displaySearch: !this.state.displaySearch });
    };

    toggleDrawer = () => {
        this.setState({ Drawer: !this.state.Drawer });
    };

    componentDidMount() {
        let elementId = document.getElementById('navbar');
        document.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                elementId.classList.add('is-sticky');
            } else {
                elementId.classList.remove('is-sticky');
            }
        });
        window.scrollTo(0, 0);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    handleLogout = () => {
        this.props.userLogout();
        this.props.getCart(id);
    };

    renderHeaderLeft = () => {
        const { categoryChild } = this.props;
        return (
            <ul className='navbar-nav'>
                <li className='nav-item'>
                    <Link href='#'>
                        <a className='nav-link'>
                            Category <i className='fas fa-chevron-down'></i>
                        </a>
                    </Link>

                    <ul className='dropdown-menu'>
                        {categoryChild?.parent?.map((item, index) => {
                            return (
                                <li className='nav-item' key={index}>
                                    <Link
                                        href={`/shop?category=${item.name}`}
                                        activeClassName='active'
                                    >
                                        <a className='nav-link'>
                                            {item.name}
                                            {categoryChild?.child1?.filter(
                                                (val) => item.id === val.parent_id
                                            ).length > 0 ? (
                                                <i className='fas fa-chevron-right'></i>
                                            ) : null}
                                        </a>
                                    </Link>
                                    <ul className='dropdown-menu'>
                                        {categoryChild?.child1?.map((value, idx) => {
                                            if (item.id === value.parent_id) {
                                                return (
                                                    <li className='nav-item' key={idx}>
                                                        <Link
                                                            href={`/shop?category=${value.name}`}
                                                            activeClassName='active'
                                                        >
                                                            <a className='nav-link'>
                                                                {value.name}
                                                                {categoryChild?.child2?.filter(
                                                                    (val) =>
                                                                        value.id === val.parent_id
                                                                ).length > 0 ? (
                                                                    <i className='fas fa-chevron-right'></i>
                                                                ) : null}
                                                            </a>
                                                        </Link>
                                                        <ul className='dropdown-menu'>
                                                            {categoryChild?.child2?.map(
                                                                (val, id) => {
                                                                    if (
                                                                        value.id === val.parent_id
                                                                    ) {
                                                                        return (
                                                                            <li
                                                                                className='nav-item'
                                                                                key={id}
                                                                            >
                                                                                <Link
                                                                                    href={`/shop?category=${val.name}`}
                                                                                    activeClassName='active'
                                                                                >
                                                                                    <a className='nav-link'>
                                                                                        {val.name}
                                                                                    </a>
                                                                                </Link>
                                                                            </li>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                        </ul>
                                                    </li>
                                                );
                                            }
                                        })}
                                    </ul>
                                </li>
                            );
                        })}
                    </ul>
                </li>
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

    renderHeaderRight = () => {
        const { id, username, image, cart, role, wishlist } = this.props;
        return (
            <div className='others-option'>
                <div className='option-item'>
                    <div
                        data-toggle='tooltip'
                        data-placement='bottom'
                        title='Search'
                        className='icon-btn-box'
                        onClick={this.toggleSearch}
                    >
                        <a className='icon-btn'>
                            <i className='fas fa-search'></i>
                        </a>
                    </div>
                </div>
                <div className='option-item'>
                    <div
                        data-toggle='tooltip'
                        data-placement='bottom'
                        title='Wishlist'
                        className='icon-btn-box'
                    >
                        <Link href='/wishlist'>
                            <a className='icon-btn'>
                                <i className='far fa-heart'></i>
                                <span>{wishlist?.products ? wishlist.products.length : 0}</span>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className='option-item'>
                    <div className='dropdown-hover'>
                        <div className='dropdown-btn icon-btn-box p-0'>
                            <a className='icon-btn'>
                                <i className='fas fa-shopping-cart'></i>
                                <span>{cart.total_qty || 0}</span>
                            </a>
                        </div>
                        <div className='dropdown-content dropdown-cart p-3'>
                            {Object.keys(cart).length !== 0 ? (
                                <div>
                                    {cart.order_detail.map((item) => {
                                        return item.products.map((value, idx) => {
                                            return (
                                                <div
                                                    key={value.id}
                                                    className='row product-cart px-3 py-2'
                                                >
                                                    <div className='col-md-2 p-0 m-0'>
                                                        <img
                                                            src={`${URL_IMG}/${value.image}`}
                                                            className='img-product'
                                                        />
                                                    </div>
                                                    <div className='col-md-10'>
                                                        <Link href={`/shop/${value.product_id}`}>
                                                            <a className='p-0'>
                                                                <h6>{value.name}</h6>
                                                            </a>
                                                        </Link>
                                                        <p>
                                                            <span>
                                                                Rp.{' '}
                                                                {value.price_each?.toLocaleString()}{' '}
                                                            </span>
                                                            x {value.qty}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        });
                                    })}
                                    <p className='py-2'>
                                        Subtotal: <span>Rp. {cart.total_price?.toLocaleString()}</span>
                                    </p>
                                    <div className='dropdown-divider'></div>
                                    <div>
                                        <Link href='/shop/cart'>
                                            <a className='px-0'>
                                                <button type='button' className='btn btn-primary'>
                                                    Go to cart
                                                </button>
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <img
                                        src={`${URL_IMG}/image/logo/empty-cart.png`}
                                        className='img-empty-cart'
                                    />
                                    <p className='text-center text-muted'>No products in the cart</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className='option-item'>
                    {id ? (
                        <div className='dropdown-hover'>
                            <div className='dropdown-btn p-0'>
                                {/* <i className='icon-btn far fa-user'></i> */}
                                <div className='d-flex align-items-center'>
                                    <img
                                        src={`${URL_IMG}/${image || 'image/users/avatar.jpg'}`}
                                        className='avatar-navbar'
                                    />
                                    <p className='mx-2'>{username}</p>
                                </div>
                            </div>
                            <div className='dropdown-content dropdown-navbar'>
                                {role === 1 ? (
                                    <>
                                        <h6 className='px-3 pt-2'>Super Admin Menu</h6>
                                        <div className='dropdown-divider'></div>
                                        <Link href='/super-admin?section=products'>
                                            <a>
                                                <i className='bx bxl-dropbox mr-2'></i>
                                                Products
                                            </a>
                                        </Link>
                                        <Link href='/super-admin?section=history-order'>
                                            <a>
                                                <i className='bx bx-shopping-bag mr-2'></i>
                                                Transaction
                                            </a>
                                        </Link>
                                        <Link href='/super-admin?section=blog'>
                                            <a>
                                                <i className='bx bx-news mr-2'></i>
                                                Blog
                                            </a>
                                        </Link>
                                        <Link href='/super-admin?section=users'>
                                            <a>
                                                <i className='bx bxs-id-card mr-2'></i>
                                                Users
                                            </a>
                                        </Link>
                                        <div className='dropdown-divider'></div>
                                        <Link href='/'>
                                            <a onClick={() => this.handleLogout()}>
                                                <i className='bx bx-log-out mr-2'></i>
                                                Log Out
                                            </a>
                                        </Link>
                                    </>
                                ) : role === 2 ? (
                                    <>
                                        <h6 className='px-3 pt-2'>Account</h6>
                                        <div className='dropdown-divider'></div>
                                        <Link href='/store/account?section=settings'>
                                            <a>
                                                <i className='bx bx-cog mr-2'></i>
                                                Settings
                                            </a>
                                        </Link>
                                        <Link href='/store/account?section=orders'>
                                            <a>
                                                <i className='bx bx-money mr-2'></i>
                                                Purchases
                                            </a>
                                        </Link>
                                        <div className='dropdown-divider'></div>
                                        <h6 className='px-3 pt-2'>Store Dashboard</h6>
                                        <div className='dropdown-divider'></div>
                                        <Link href='/store/account?section=sales'>
                                            <a>
                                                <i className='bx bx-dollar mr-2'></i>
                                                Sales
                                            </a>
                                        </Link>
                                        <Link href='/store/account?section=products'>
                                            <a>
                                                <i className='bx bx-package mr-2'></i>
                                                Products
                                            </a>
                                        </Link>
                                        <Link href='/store/account?section=shipping'>
                                            <a>
                                                <i className='bx bxs-truck mr-2'></i>
                                                Shipping
                                            </a>
                                        </Link>
                                        <Link href='/store/account?section=withdraw'>
                                            <a>
                                                <i className='bx bx-refresh mr-2'></i>
                                                Withdraw
                                            </a>
                                        </Link>
                                        <div className='dropdown-divider'></div>
                                        <Link href='/'>
                                            <a onClick={() => this.handleLogout()}>
                                                <i className='bx bx-log-out mr-2'></i>
                                                Log Out
                                            </a>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href='/account?section=Dashboard'>
                                            <a>
                                                <i className='bx bx-home mr-2'></i>
                                                Dashboard
                                            </a>
                                        </Link>
                                        <Link href='/account?section=Orders'>
                                            <a>
                                                <i className='bx bx-shopping-bag mr-2'></i>
                                                Orders
                                            </a>
                                        </Link>
                                        <Link href='/account?section=Download'>
                                            <a>
                                                <i className='bx bx-cloud-download mr-2'></i>
                                                Download
                                            </a>
                                        </Link>
                                        <Link href='/account?section=Addresses'>
                                            <a>
                                                <i className='bx bx-map mr-2'></i>
                                                Addresses
                                            </a>
                                        </Link>
                                        <Link href='/account?section=account-details'>
                                            <a>
                                                <i className='bx bx-user mr-2'></i>
                                                Account Details
                                            </a>
                                        </Link>
                                        <div className='dropdown-divider'></div>
                                        <Link href='/'>
                                            <a onClick={() => this.handleLogout()}>
                                                <i className='bx bx-log-out mr-2'></i>
                                                Log Out
                                            </a>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div
                            data-toggle='tooltip'
                            data-placement='bottom'
                            title={id ? 'account' : 'Authentication'}
                            className='icon-btn-box'
                        >
                            <Link href='/authentication'>
                                <a className='icon-btn '>
                                    <i className='far fa-user'></i>
                                </a>
                            </Link>
                        </div>
                    )}
                </div>
                <div className='option-item'>
                    <div className='burger-menu collapsed' onClick={this.toggleDrawer}>
                        <span className='top-bar'></span>
                        <span className='middle-bar'></span>
                        <span className='bottom-bar'></span>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { displaySearch, searchValue } = this.state;
        const { searchProducts } = this.props;
        return (
            <React.Fragment>
                <div id='navbar' className='navbar-area'>
                    <div className='main-nav'>
                        <div className='container'>
                            <nav className='navbar navbar-expand-md navbar-light'>
                                <div className='img-container'>
                                    <Link href='/'>
                                        <a className='navbar-brand'>
                                            <img
                                                src={`${URL_IMG}/image/logo/logo-wisela.png`}
                                                alt='logo-wisela'
                                            />
                                        </a>
                                    </Link>
                                </div>

                                <div className='burger-menu mr-3' onClick={this.toggleDrawer}>
                                    <span className='top-bar'></span>
                                    <span className='middle-bar'></span>
                                    <span className='bottom-bar'></span>
                                </div>

                                <div className='navbar-content' id='navbarSupportedContent'>
                                    {this.renderHeaderLeft()}
                                    {this.renderHeaderRight()}
                                </div>
                            </nav>
                            <div
                                className='navbar-search'
                                style={displaySearch ? {} : { display: 'none' }}
                            >
                                <div className='input-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        placeholder='Search for Products'
                                        aria-label='search-product'
                                        value={searchValue}
                                        onChange={(e) => {
                                            this.setState({ searchValue: e.target.value });
                                            this.props.getSearchProduct(
                                                'navbar-search',
                                                e.target.value
                                            );
                                            e.preventDefault();
                                        }}
                                    />
                                    <div className='input-group-append'>
                                        <button
                                            className='btn btn-outline-secondary'
                                            type='button'
                                            onClick={this.toggleSearch}
                                        >
                                            <i className='search-btn fas fa-search'></i>
                                        </button>
                                    </div>
                                </div>
                                {searchProducts?.length > 0 ? (
                                    <ul className='search-group'>
                                        {searchProducts.map((item, index) => {
                                            return (
                                                <li key={index} className='search-group-item'>
                                                    <Link href={`/shop/${item.id}`}>
                                                        <a>
                                                            <div className='d-flex align-items-center'>
                                                                <img
                                                                    src={`${URL_IMG}/${item.image[0]}`}
                                                                    className='search-img'
                                                                />
                                                                <div className='ml-2'>
                                                                    <p className='mb-0'>
                                                                        {item.name}
                                                                    </p>
                                                                    <p>
                                                                        Rp.{' '}
                                                                        {item.sale_price.toLocaleString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
                <Drawer onClick={this.toggleDrawer} active={this.state.Drawer ? 'active' : ''} />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.users.id,
        username: state.users.username,
        image: state.users.image,
        cart: state.cart.cart,
        role: state.users.role,
        wishlist: state.wishlist.wishlist,
        categoryChild: state.categoryProduct.categoryChild,
        searchProducts: state.products.searchProducts,
    };
};

export default connect(mapStateToProps, { userLogout, getCart, getSearchProduct })(Navbar);
