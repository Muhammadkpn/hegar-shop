import React from 'react';
import Link from 'next/link';
import { URL_IMG } from '../../store/helpers';
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
    React.useEffect(() => {
        if (product_id) {
            dispatch(getProductDetails(product_id));
        }
    }, [product_id]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $(`#btn-remove-wishlist${id}`).tooltip();
        $(`#btn-add-wishlist${id}`).tooltip();
    });

    return (
        <div className='product-card'>
            <div
                className='product-img-container border rounded'
                style={type === 'new-products' ? { backgroundColor: '#fff' } : {}}
            >
                <img
                    src={`${URL_IMG}/${image ? image[0] : ''}`}
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
                                        $(
                                            `#${
                                                !user_id
                                                    ? `login-product-card${type ? `-${type}` : ''}`
                                                    : wishlist
                                                    ? `remove-product-card${type ? `-${type}` : ''}`
                                                    : `add-product-card${type ? `-${type}` : ''}`
                                            }`
                                        ).modal();
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
                                        $(
                                            `#${
                                                !user_id
                                                    ? `login-product-card${type ? `-${type}` : ''}`
                                                    : `cart-product-card${type ? `-${type}` : ''}`
                                            }`
                                        ).modal();
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
                                        user_id
                                            ? $(`#quick-view${type ? `-${type}` : ''}`).modal()
                                            : $(
                                                  `#login-product-card${type ? `-${type}` : ''}`
                                              ).modal();
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
