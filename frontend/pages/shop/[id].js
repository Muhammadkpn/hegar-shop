import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProductDetails,
    getProductReview,
    getMainAddress,
    getProductStore,
} from '../../store/action';
import Navbar from '../../components/Layout/Navbar';
import PageTitle from '../../components/Common/PageTitle';
import ProductDetails from '../../components/Shop/ProductDetails';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';
import { wrapper } from '../../store/store';
import Axios from 'axios';
import { URL } from '../../store/helpers';

const ProductDetailsPage = ({ productDetails, productReview }) => {
    const router = useRouter();
    const { id } = router.query;

    const { productStore, mainAddress, user_id, wishlist } =
        useSelector((state) => {
            return {
                productDetails: state.products.productDetails,
                productStore: state.products.productStore,
                mainAddress: state.address.mainAddress,
                productReview: state.productReview.productReview,
                user_id: state.users.id,
                wishlist: state.wishlist.wishlist,
            };
        });

    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getProductStore(productDetails?.store_id));
        dispatch(getMainAddress(productDetails?.store_id));
    }, [productDetails?.store_id !== undefined]);

    React.useEffect(() => {
        dispatch(getProductDetails(id));
        dispatch(getProductReview(id, 'type=product-id'));
    }, [id]);

    return (
        <React.Fragment>
            <Navbar />
            <PageTitle
                pageTitle={productDetails?.name || 'Product Details'}
                othersPage={[
                    { url: '/', text: 'Home' },
                    { url: '/shop', text: 'Shop' },
                    { url: '#', text: 'Product Details' },
                ]}
                activePage={productDetails?.name || 'Product Details'}
            />
            <ProductDetails
                mainAddress={mainAddress}
                productStore={productStore}
                productReview={productReview}
                user_id={user_id}
                wishlist={
                    (wishlist?.products ? wishlist.products : []).filter(
                        (value) => value.product_id === parseInt(id)
                    )[0]
                }
            />
            <Subscribe />
            <Footer />
        </React.Fragment>
    );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
    const { id } = params;
    await store.dispatch(getProductDetails(id));
    const { productDetails } = store.getState().products;

    await store.dispatch(getProductReview(id, 'type=product-id'));
    const { productReview } = store.getState().productReview;
    return {
        props: {
            productDetails,
            productReview,
        },
        revalidate: 60*60,
    };
});

export async function getStaticPaths() {
    const products = await Axios.get(`${URL}/products`);
    const paths = products.data.data.map((item) => {
        return {
            params: {
                id: `${item.id}`
            }
        }
    });
    return {
        paths,
        fallback: false,
    }
}

export default ProductDetailsPage;
