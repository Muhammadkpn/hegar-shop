import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { getFullImageUrl } from '../../store/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { addToCart, getProductDetails, updateWishlist } from '../../store/action';
import ModalComp from './modalComp';
import LoginAlertModal from './LoginAlertModal';
import CartAlertModal from './CartAlertModal';
import WishlistModal from './WishlistModal';
import ProductQuickView from '../Shop/ProductQuickView';

const ProductCard = ({ data, user_id, wishlist, type, ...props }) => {
    const {
        image,
        name,
        category,
        store_name,
        regular_price,
        sale_price,
        id,
        weight,
        store_id: storeId,
    } = data;
    const { route } = props;
    const router = useRouter();
    const { product_id } = router.query;

    const { productDetails } = useSelector((state) => {
        return {
            productDetails: state.products.productDetails,
        };
    });
    const dispatch = useDispatch();
    const tooltipRefs = useRef([]);

    useEffect(() => {
        if (product_id) {
            dispatch(getProductDetails(product_id));
        }
    }, [product_id]);

    // Initialize Bootstrap 5 tooltips
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Dynamically import Bootstrap only on client-side
            import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
                const tooltipTriggerList = document.querySelectorAll('[data-toggle="tooltip"]');
                tooltipRefs.current = Array.from(tooltipTriggerList).map(
                    (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
                );
            });
        }

        // Cleanup tooltips on unmount
        return () => {
            tooltipRefs.current.forEach((tooltip) => {
                if (tooltip && tooltip.dispose) {
                    tooltip.dispose();
                }
            });
        };
    }, [id]);

    // Helper function to open Bootstrap 5 modals
    const openModal = (modalId) => {
        if (typeof window !== 'undefined') {
            import('bootstrap/dist/js/bootstrap.bundle.min.js').then((bootstrap) => {
                const modalElement = document.getElementById(modalId);
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                }
            });
        }
    };

    return (
        <div className='product-card'>
            <div
                className='product-img-container border rounded'
                style={type === 'new-products' ? { backgroundColor: '#fff' } : {}}
            >
                <img
                    src={getFullImageUrl(image ? image[0] : '')}
                    className='img rounded img-product'
                    style={type === 'new-products' ? { backgroundColor: '#fff' } : {}}
                />
                <div className='img-overlay'>
                    <ul>
                        <li>
                            <a>
                                <button
                                    type='button'
                                    id={
                                        wishlist
                                            ? `btn-remove-wishlist${id}`
                                            : `btn-add-wishlist${id}`
                                    }
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Wishlist'
                                    className={`btn bg-white overlay-button btn-wishlist`}
                                    onClick={() => {
                                        user_id
                                            ? dispatch(
                                                  updateWishlist({
                                                      productId: id,
                                                      userId: user_id,
                                                  })
                                              )
                                            : null;
                                        openModal(
                                            !user_id
                                                ? `login-product-card${type ? `-${type}` : ''}`
                                                : wishlist
                                                ? `remove-product-card${type ? `-${type}` : ''}`
                                                : `add-product-card${type ? `-${type}` : ''}`
                                        );
                                    }}
                                >
                                    <i
                                        className={`bx bx-sm ${
                                            wishlist ? 'bxs-heart text-danger' : 'bx-heart'
                                        }`}
                                    ></i>
                                </button>
                            </a>
                        </li>
                        <li>
                            <a>
                                <button
                                    type='button'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Add to cart'
                                    className='btn bg-white overlay-button'
                                    onClick={() => {
                                        user_id
                                            ? dispatch(
                                                  addToCart({
                                                      userId: user_id,
                                                      productId: id,
                                                      qty: 1,
                                                      weightEach: weight,
                                                      priceEach: sale_price,
                                                      storeId,
                                                  })
                                              )
                                            : null;
                                        openModal(
                                            !user_id
                                                ? `login-product-card${type ? `-${type}` : ''}`
                                                : `cart-product-card${type ? `-${type}` : ''}`
                                        );
                                    }}
                                >
                                    <i className='bx bxs-cart-add bx-sm'></i>
                                </button>
                            </a>
                        </li>
                        <li>
                            <a>
                                <button
                                    type='button'
                                    data-toggle='tooltip'
                                    data-placement='top'
                                    title='Quick view'
                                    className='btn bg-white overlay-button'
                                    onClick={() => {
                                        if (user_id) {
                                            openModal(`quick-view${type ? `-${type}` : ''}`);
                                        } else {
                                            openModal(`login-product-card${type ? `-${type}` : ''}`);
                                        }
                                        let pathname = router.pathname;
                                        if (pathname.indexOf('[') !== -1) {
                                            pathname = pathname.slice(0, pathname.indexOf('['));
                                        }
                                        let routerId = router.query.id;
                                        if (routerId) {
                                            pathname += `${routerId}`;
                                        }
                                        let routerCategory = router.query.category;
                                        router.push(
                                            `${pathname}${
                                                routerCategory
                                                    ? `?category=${routerCategory}&`
                                                    : `?`
                                            }product_id=${id}`,
                                            undefined,
                                            { shallow: true }
                                        );
                                    }}
                                >
                                    <i className='bx bx-search-alt bx-sm'></i>
                                </button>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <p className='text-truncate'>
                    by <strong>{store_name}</strong> in category
                    <strong> {category ? category[0] : ''}</strong>
                </p>
                <Link href={route ? `/` : `/shop/${id}`}>
                    <h6>{name}</h6>
                </Link>
                {sale_price !== regular_price ? (
                    <p className='price-card'>
                        Rp. {sale_price ? sale_price.toLocaleString() : null}{' '}
                        <span className='sale-price'>
                            Rp. {regular_price ? regular_price.toLocaleString() : null}
                        </span>
                    </p>
                ) : (
                    <p className='price-card'>
                        Rp. {regular_price ? regular_price.toLocaleString() : null}
                    </p>
                )}
            </div>
            <ModalComp
                modal_id={`quick-view${type ? `-${type}` : ''}`}
                size='modal-lg'
                body={
                    <ProductQuickView
                        data={productDetails}
                        wishlist={wishlist}
                        user_id={user_id}
                        type={`product-card${type}`}
                    />
                }
                footer={
                    <button
                        type='button'
                        className='btn btn-outline-primary btn-sm'
                        data-dismiss='modal'
                    >
                        Close
                    </button>
                }
            />
            <LoginAlertModal modal_id={`login-product-card${type ? `-${type}` : ''}`} />
            <CartAlertModal modal_id={`cart-product-card${type ? `-${type}` : ''}`} />
            <WishlistModal
                modal_id={[
                    `add-product-card${type ? `-${type}` : ''}`,
                    `remove-product-card${type ? `-${type}` : ''}`,
                ]}
            />
        </div>
    );
};

export default ProductCard;
