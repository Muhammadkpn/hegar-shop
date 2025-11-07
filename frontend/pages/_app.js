import React from 'react';
import '../styles/scss/styles.scss';
import Layout from '../components/Layout/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { userKeepLogin, getCart, getWishlist, getCategoryChildProduct } from '../store/action';
import { wrapper } from '../store/store';

function MyApp({ Component, pageProps }) {
    const id = useSelector((state) => state.users.id);
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(userKeepLogin());
        dispatch(getCategoryChildProduct())
    }, []);
    
    React.useEffect(() => {
        dispatch(userKeepLogin());
        dispatch(getCategoryChildProduct())
        if (id) {
            dispatch(getCart(id));
            dispatch(getWishlist('type=user-id', id));
        }
    }, [id]);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default wrapper.withRedux(MyApp);
