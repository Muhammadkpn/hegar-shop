import React from 'react';
import Navbar from '../../components/Layout/Navbar';
import StoreDetailsComp from '../../components/Store/StoreDetailsComp';
import Subscribe from '../../components/Common/Subscribe';
import Footer from '../../components/Layout/Footer';
import { wrapper } from '../../store/store';
import {
    getCountCategoryProductByStore,
    getCountTagProductByStore,
    getProductStore,
    getSalesSummary,
} from '../../store/action';
import Axios from 'axios';
import { URL } from '../../store/helpers';

const StoreDetailsPage = () => {
    return (
        <React.Fragment>
            <Navbar />
            <StoreDetailsComp />
            <Subscribe />
            <Footer />
        </React.Fragment>
    );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
    const { id } = params;
    await store.dispatch(getProductStore(id));
    await store.dispatch(getCountCategoryProductByStore(id));
    await store.dispatch(getCountTagProductByStore(id));
    await store.dispatch(getSalesSummary('type=by-store', id));
});

export async function getStaticPaths() {
    try {
        const store = await Axios.get(`${URL}/users?type=store`);
        const paths = store.data.data.map((item) => {
            return {
                params: {
                    id: `${item.id}`,
                },
            };
        });
        return {
            paths,
            fallback: 'blocking',
        };
    } catch (error) {
        // If backend is not available during build, return empty paths
        // Pages will be generated on-demand
        return {
            paths: [],
            fallback: 'blocking',
        };
    }
}

export default StoreDetailsPage;
