import React from 'react';
import { useSelector } from 'react-redux'
import ProductDetailsTab from './ProductDetailsTab';
import ProductQuickView from './ProductQuickView';
import LoginAlertModal from '../Common/LoginAlertModal';
import CartAlertModal from '../Common/CartAlertModal';
import WishlistModal from '../Common/WishlistModal';

const ProductDetails = ({
    productReview,
    productStore,
    mainAddress,
    user_id,
    wishlist,
}) => {
    const { productDetails, error_cart } = useSelector((state) => {
        return {
            productDetails: state.products.productDetails,
            error_cart: state.cart.error_cart,
        }
    })

    let star = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.round(productDetails?.rating)) {
            star.push('bx bxs-star');
        } else {
            star.push('bx bx-star');
        }
    }
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    return (
        <section className='product-details-area py-5'>
            <div className='container'>
                <ProductQuickView wishlist={wishlist} data={productDetails} user_id={user_id} type='product-details'/>

                {/* Product Details Tab */}
                <ProductDetailsTab
                    description={{ description: productDetails?.description }}
                    store={{
                        status_id: productDetails?.status_id,
                        store_id: productDetails?.store_id,
                        store_name: productDetails?.store_name,
                        mainAddress: mainAddress
                            ? `${mainAddress.city}, ${mainAddress.province} ${mainAddress.postcode}`
                            : 'Jakarta, Indonesia',
                    }}
                    productReview={productReview}
                    rating={productDetails?.rating}
                    productStore={productStore}
                />
            </div>
            <LoginAlertModal modal_id='login-product-details' />
            <CartAlertModal modal_id='cart-product-details' />
            <WishlistModal modal_id={['add-product-details', 'remove-product-details']} />
        </section>
    );
};

export default ProductDetails;
