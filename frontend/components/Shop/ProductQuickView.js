import React from 'react';
import Link from 'next/link';
import ProductImage from './ProductImage';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router'
import { addToCart, updateWishlist } from '../../store/action';
import ModalComp from '../Common/modalComp';

const ProductQuickView = ({ data, wishlist, user_id, type }) => {
    const [qty, setQty] = React.useState(0);
    const [alert, setAlert] = React.useState(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const { error_cart, cart } = useSelector((state) => {
        return {
            error_cart: state.cart.error_cart,
            cart: state.cart.cart,
        }
    });
    
    const {
        image,
        name,
        category,
        username,
        regular_price,
        sale_price,
        id,
        rating,
        total_review,
        stock,
        store_id,
        weight,
    } = data;

    let star = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(rating)) {
            star.push('bx bxs-star');
        } else {
            star.push('bx bx-star');
        }
    }

    const handleAddToCart = () => {
        const body = { userId: user_id, productId: id, qty, priceEach: sale_price, weightEach: weight, storeId: store_id };
        dispatch(addToCart(body));
        if (type === 'product-details') {
            !user_id ? $(`#login-product-details`).modal() : null;
        } else {
            !user_id ? $(`#login-${type}`).modal() : null;
        }
        setAlert(false);
    };

    return (
        <div className='quick-view-container'>
            <div className='row'>
                <div className='col-lg-4 col-md-12'>
                    <ProductImage image={image} />
                </div>

                <div className='col-lg-7 col-md-12'>
                    <div className='products-details-desc'>
                        <h3>{name}</h3>

                        <div className='price'>
                            {regular_price !== sale_price ? (
                                <React.Fragment>
                                    <span className='old-price'>
                                        Rp. {regular_price ? regular_price.toLocaleString() : 0}
                                    </span>
                                    <span className='new-price'>
                                        Rp. {sale_price ? sale_price.toLocaleString() : 0}
                                    </span>
                                </React.Fragment>
                            ) : (
                                <span className='new-price'>
                                    Rp. {regular_price ? regular_price.toLocaleString() : 0}
                                </span>
                            )}
                        </div>

                        <div className={`products-review ${rating === 0 ? 'd-none' : ''}`}>
                            <div className='rating'>
                                {star.map((item, index) => {
                                    return <i key={index} className={item}></i>;
                                })}
                                <span> ({rating || 0}/5)</span>
                            </div>

                            <Link href='#' onClick={(e) => e.preventDefault()} className='rating-count'>
                                {total_review} reviews
                            </Link>
                        </div>

                        <ul className='products-info'>
                            <li>
                                <span>Vendor:</span>
                                <Link href='#' onClick={(e) => e.preventDefault()}>
                                    {username}
                                </Link>
                            </li>
                            <li>
                                <span>Availability:</span>
                                <Link href='#' onClick={(e) => e.preventDefault()}>
                                    In stock ({stock} items)
                                </Link>
                            </li>
                            <li>
                                <span>Category:</span>
                                <Link href='#' onClick={(e) => e.preventDefault()}>
                                    {category ? category.join(', ') : ''}
                                </Link>
                            </li>
                        </ul>

                        <div className='products-add-to-cart'>
                            <div className='input-counter'>
                                <button
                                    className='minus-btn'
                                    onClick={() => setQty((prev) => prev - 1)}
                                    disabled={qty <= 0}
                                >
                                    <i className='bx bx-minus'></i>
                                </button>

                                <input
                                    type='text'
                                    value={qty >= stock ? stock : qty <= 0 ? 0 : qty}
                                    onChange={(e) => setQty(e.target.value)}
                                />

                                <button
                                    className='plus-btn'
                                    onClick={() => setQty((prev) => prev + 1)}
                                    disabled={qty >= stock}
                                >
                                    <i className='bx bx-plus'></i>
                                </button>
                            </div>

                            <button className='default-btn' onClick={() => handleAddToCart()} disabled={qty === 0}>
                                <i className='fas fa-cart-plus'></i>
                                Add to Cart
                            </button>
                            <button
                                data-toggle='tooltip'
                                data-placement='top'
                                title='wishlist'
                                // onClick={e => e.preventDefault()}
                                onClick={() => {
                                    user_id
                                        ? dispatch(
                                              updateWishlist({ productId: id, userId: user_id })
                                          )
                                        : null;
                                    $(
                                        `#${
                                            !user_id
                                                ? 'login-product-details'
                                                : wishlist
                                                ? 'remove-product-details'
                                                : 'add-product-details'
                                        }`
                                    ).modal();
                                }}
                                className='btn'
                            >
                                <i
                                    className={`bx bx-sm ${
                                        wishlist ? 'bxs-heart text-danger' : 'bx-heart'
                                    }`}
                                ></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductQuickView;
