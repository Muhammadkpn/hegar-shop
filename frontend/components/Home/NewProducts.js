import { useDispatch, useSelector } from 'react-redux';
import { getNewProduct, getProduct } from '../../store/action';
import React from 'react';
import ProductCard from '../Common/ProductCard';
import Link from 'next/link';

const NewProducts = () => {
    const dispatch = useDispatch();
    const { newProducts, wishlist, user_id } = useSelector((state) => {
        return {
            newProducts: state.products.newProducts,
            wishlist: state.wishlist.wishlist,
            user_id: state.users.id,
        };
    });
    React.useEffect(() => {
        dispatch(getNewProduct());
    }, []);

    return (
        <div className='container-new-products'>
            <div className='title-new-products'>
                <h3>The Most Recent Releases</h3>
                <button type='button' className='btn btn-outline-primary'>
                    All Categories <i className='bx bx-chevron-right'></i>
                </button>
            </div>
            <div className='row'>
                {newProducts.slice(0, 4).map((item, index) => {
                    return (
                        <div key={index} className='col-xs-10 col-md-6 col-lg-3'>
                            <ProductCard
                                data={item}
                                wishlist={
                                    (wishlist?.products ? wishlist.products : []).filter(
                                        (value) => value.product_id === item.id
                                    )[0]
                                }
                                user_id={user_id}
                                type='new-products'
                            />
                        </div>
                    );
                })}
            </div>
            <div className='container d-flex justify-content-center'>
                <Link href='/shop'>
                    <button type='button' className='btn btn-outline-primary mt-3'>
                        View more products <i className='bx bx-chevron-right'></i>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default NewProducts;
