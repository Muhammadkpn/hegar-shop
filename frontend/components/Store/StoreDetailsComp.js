import Link from 'next/link';
import React from 'react';
import ProductCard from '../Common/ProductCard';
import {
    getProductStore,
    getCountTagProduct,
    getSalesSummary,
    getCountCategoryProductByStore,
    getCountTagProductByStore,
} from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { URL_IMG } from '../../store/helpers';

const StoreDetailsComp = () => {
    const [pages, setPages] = React.useState(1);
    const [filterCategory, setFilterCategory] = React.useState('');
    const [filterTag, setFilterTag] = React.useState('');

    const router = useRouter();
    const dispatch = useDispatch();
    const { category, tag, id } = router.query;

    const { productStore, countCategoryProduct, countTagProduct, salesSummary, wishlist, user_id } =
        useSelector((state) => {
            return {
                productStore: state.products.productStore,
                countCategoryProduct: state.productCategory.countCategoryProduct,
                countTagProduct: state.productTag.countTagProduct,
                salesSummary: state.store.salesSummary,
                wishlist: state.wishlist.wishlist,
                user_id: state.users.id,
            };
        });

    React.useEffect(() => {
        if (category && tag) {
            dispatch(getProductStore(id, `categories=${category}&tags=${tag}`));
        } else if (category) {
            dispatch(getProductStore(id, `categories=${category}`));
        } else if (tag) {
            dispatch(getProductStore(id, `tags=${tag}`));
        } else {
            dispatch(getProductStore(id));
        }
    }, [category, tag]);

    let total_pages = [];
    for (let i = 1; i <= Math.ceil(productStore.length / 6); i++) {
        total_pages.push(i);
    }

    return (
        <div className='bg-white'>
            <div className='store-name'>
                <div className='row store-title justify-content-between'>
                    <div className='col-10 col-md-6 row'>
                        <div className='col-md-2'>
                            <img
                                src={`${URL_IMG}/${salesSummary.image || 'image/users/avatar.jpg'}`}
                                alt='store-profile-img'
                                className='store-img img-circle border rounded-circle'
                            />
                        </div>
                        <div className='col-md-9 p-0'>
                            <h5>{salesSummary.username}</h5>
                            <p className='text-light'>
                                Member since{' '}
                                {
                                    new Date(salesSummary.user_reg_date)
                                        .toLocaleDateString()
                                        .split('/')[2]
                                }
                            </p>
                        </div>
                    </div>
                    <div className='col-10 col-md-6'>
                        <h5 className='text-right'>Total Quantity Orders</h5>
                        <p className='text-right text-light'>{salesSummary.qty_per_status} Items</p>
                    </div>
                </div>
            </div>
            <div className='store-details shadow p-3 mb-5 bg-white rounded'>
                <div className='row p-4'>
                    <div className='col-lg-4 col-md-12'>
                        <div className='widget_categories'>
                            <h2 className='sub-section-title'>Product Category</h2>
                            <ul>
                                {(countCategoryProduct?.countCategory || []).map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <a
                                                onClick={() => 
                                                    router.push(`/store/${id}?category=${item.category}${tag ? `&tag=${tag}` : ''}`, undefined, {
                                                        shallow: true,
                                                    })
                                                }
                                                style={
                                                    category === item.category
                                                        ? {
                                                              backgroundColor: '#172C93',
                                                              color: '#fff',
                                                          }
                                                        : {}
                                                }
                                            >
                                                {item.category}{' '}
                                                <span
                                                    className='post-count'
                                                    style={
                                                        category === item.category
                                                            ? {
                                                                  backgroundColor: '#172C93',
                                                                  color: '#fff',
                                                              }
                                                            : {}
                                                    }
                                                >
                                                    ({item.count})
                                                </span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className='widget_tags mt-5'>
                            <h2 className='sub-section-title'>Product Tag</h2>
                            <div className='tagcloud'>
                                {(countTagProduct?.countTag || []).map((item, index) => {
                                    return (
                                        <a
                                            onClick={() => 
                                                router.push(`/store/${id}?tag=${item.tags}${category ? `&category=${category}` : ''}`, undefined, {
                                                    shallow: true,
                                                })
                                            }
                                            key={index}
                                            style={
                                                tag === item.tags
                                                    ? {
                                                          backgroundColor: '#172C93',
                                                          color: '#fff',
                                                      }
                                                    : {}
                                            }
                                        >
                                            {item.tags}{' '}
                                            <span
                                                className='tag-link-count'
                                                style={
                                                    tag === item.tags
                                                        ? {
                                                              backgroundColor: '#172C93',
                                                              color: '#fff',
                                                          }
                                                        : {}
                                                }
                                            >
                                                {' '}
                                                ({item.count})
                                            </span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-8 col-md-12'>
                        <h2 className='section-title text-left pl-2'>Products</h2>
                        <div className={category || tag ? 'd-flex' : 'd-none'}>
                            {category ? (
                                <button
                                    type='button'
                                    className='btn chip-btn border border-secondary rounded-pill'
                                >
                                    <i className='bx bx-collection'></i>
                                    <span className='mx-2'>{category}</span>
                                    <i
                                        className='bx bx-x bg-light'
                                        onClick={() =>
                                            router.push(
                                                `/store/${id}?${tag ? `tag=${tag}` : ''}`,
                                                undefined,
                                                {
                                                    shallow: true,
                                                }
                                            )
                                        }
                                    ></i>
                                </button>
                            ) : null}
                            {tag ? (
                                <button
                                    type='button'
                                    className={`btn chip-btn border border-secondary rounded-pill ${
                                        category ? 'ml-2' : ''
                                    }`}
                                >
                                    <i className='bx bxs-purchase-tag'></i>
                                    <span className='mx-2'>{tag}</span>
                                    <i
                                        className='bx bx-x bg-light'
                                        onClick={() =>
                                            router.push(
                                                `/store/${id}?${category ? `category=${category}` : ''}`,
                                                undefined,
                                                {
                                                    shallow: true,
                                                }
                                            )
                                        }
                                    ></i>
                                </button>
                            ) : null}
                        </div>
                        <div className='row'>
                            {productStore.slice(
                                pages === 1 ? 0 : 6 * (pages - 1),
                                pages === 1 ? 6 : 6 * pages
                            ).length > 0 ? (
                                productStore
                                    .slice(
                                        pages === 1 ? 0 : 6 * (pages - 1),
                                        pages === 1 ? 6 : 6 * pages
                                    )
                                    .map((item, index) => {
                                        return (
                                            <div key={index} className='col-sm-6 col-md-4 p-4 mb-4'>
                                                <ProductCard
                                                    data={item}
                                                    wishlist={
                                                        (wishlist?.products
                                                            ? wishlist.products
                                                            : []
                                                        ).filter(
                                                            (value) => value.product_id === item.id
                                                        )[0]
                                                    }
                                                    user_id={user_id}
                                                    type='store'
                                                />
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className='col-md-12'>
                                    <div className='alert alert-secondary' role='alert'>
                                        We can't found your request. Please change your request!
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='col-lg-12 col-md-12 col-sm-12'>
                            <div className='pagination-area text-center'>
                                <button
                                    type='button'
                                    className={`prev page-numbers ${pages === 1 ? 'disabled' : ''}`}
                                    disabled={pages === 1 ? true : false}
                                    onClick={() => setPages((prev) => prev - 1)}
                                >
                                    <i className='bx bx-chevron-left'></i>
                                </button>
                                {total_pages.map((item, index) => {
                                    return (
                                        <button
                                            key={index}
                                            type='button'
                                            className={`page-numbers ${
                                                pages === item ? 'current' : ''
                                            }`}
                                            onClick={() => setPages(item)}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                                <button
                                    type='button'
                                    className={`next page-numbers ${
                                        pages === Math.ceil(productStore.length / 6)
                                            ? 'disabled'
                                            : ''
                                    }`}
                                    onClick={() => setPages((prev) => prev + 1)}
                                >
                                    <i className='bx bx-chevron-right'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreDetailsComp;
