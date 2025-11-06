import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../store/action';
import ProductCard from '../Common/ProductCard';

const ShopComp = () => {
    const [pages, setPages] = React.useState(1);
    const [sort, setSort] = React.useState({ icon: '', query: '', name: '', });
    const [search, setSearch] = React.useState('');
    const router = useRouter();
    const { category } = router.query;
    const { products, wishlist, user_id } = useSelector((state) => {
        return {
            products: state.products.products,
            wishlist: state.wishlist.wishlist,
            user_id: state.users.id,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getProduct(category ? `category=${category}` : ''));
    }, []);

    React.useEffect(() => {
        if (sort.query && search && category) {
            dispatch(getProduct(`search=${search}&${sort.query}&category=${category}`));
        } else if (sort.query && search) {
            dispatch(getProduct(`search=${search}&${sort.query}`));
        } else if (sort.query && category) {
            dispatch(getProduct(`${sort.query}&category=${category}`));
        } else if (search && category) {
            dispatch(getProduct(`search=${search}&category=${category}`));
        } else if (sort.query) {
            dispatch(getProduct(`${sort.query}`));
        } else if (search) {
            dispatch(getProduct(`search=${search}`));
        } else if (category) {
            dispatch(getProduct(`category=${category}`));
        } else {
            dispatch(getProduct());
        }
        setPages(1);
    }, [search, sort, category]);

    return (
        <div className='container-shop mb-5 px-2'>
            <div className='filter-container'>
                <div className='row no-gutters align-items-center justify-content-center'>
                    <div className='col-8 col-sm-6 col-md-4'>
                        <div className='input-group'>
                            <div className='input-group-prepend'>
                                <button className='btn btn-outline-secondary' type='button'>
                                    <i className='fas fa-search'></i>
                                </button>
                            </div>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={`Search products ${
                                    category ? 'in this category' : ''
                                }`}
                                aria-describedby='basic-addon2'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='col-4 col-sm-3 col-md-4'>
                        <div className='dropdown d-flex justify-content-end'>
                            <button
                                className='btn btn-secondary dropdown-toggle'
                                type='button'
                                id='dropdownMenuButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                <i className={`bx ${sort.icon || 'bx-flag'}`}></i>&nbsp;
                                {sort.name || 'Newest'}
                            </button>

                            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                                <a
                                    className='dropdown-item'
                                    onClick={() =>
                                        setSort({
                                            icon: 'bx-flag',
                                            query: '_sort=p.released_date&_order=ASC',
                                            name: 'Newest',
                                        })
                                    }
                                >
                                    <i className='bx bx-flag'></i>&nbsp;Newest
                                </a>
                                <a
                                    className='dropdown-item'
                                    onClick={() =>
                                        setSort({
                                            icon: 'bx-star',
                                            query: '_sort=tb2.rating&_order=DESC',
                                            name: 'Beststores',
                                        })
                                    }
                                >
                                    <i className='bx bx-star'></i>&nbsp;Beststores
                                </a>
                                <a
                                    className='dropdown-item'
                                    onClick={() =>
                                        setSort({
                                            icon: 'bx-rocket',
                                            query: '_sort=tb5.total_sales_qty&_order',
                                            name: 'Popular',
                                        })
                                    }
                                >
                                    <i className='bx bx-rocket'></i>&nbsp;Popular
                                </a>
                                <a
                                    className='dropdown-item'
                                    onClick={() =>
                                        setSort({
                                            icon: 'bx-chevron-up',
                                            query: '_sort=p.sale_price&_order=DESC',
                                            name: 'High Price',
                                        })
                                    }
                                >
                                    <i className='bx bx-chevron-up'></i>&nbsp;High Price
                                </a>
                                <a
                                    className='dropdown-item'
                                    onClick={() =>
                                        setSort({
                                            icon: 'bx-chevron-down',
                                            query: '_sort=p.sale_price&_order=ASC',
                                            name: 'Low Price',
                                        })
                                    }
                                >
                                    <i className='bx bx-chevron-down'></i>&nbsp;Low Price
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='col-10 col-sm-3 col-md-4'>
                        <div className='pagination'>
                            <div className='mr-1'>
                                <p>
                                    Pages {pages}/{Math.ceil(products.length / 12)}
                                </p>
                            </div>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={pages === 1 ? true : false}
                                onClick={() => setPages((prev) => prev - 1)}
                            >
                                <i className='bx bx-chevron-left bx-md'></i>
                            </button>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={pages >= Math.ceil(products.length / 12) ? true : false}
                                onClick={() => setPages((prev) => prev + 1)}
                            >
                                <i className='bx bx-chevron-right bx-md'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row no-gutters'>
                {products.slice(pages === 1 ? 0 : 12 * (pages - 1), pages === 1 ? 12 : 12 * pages)
                    .length > 0 ? (
                    products
                        .slice(pages === 1 ? 0 : 12 * (pages - 1), pages === 1 ? 12 : 12 * pages)
                        .map((item, index) => {
                            return (
                                <div key={index} className='col-lg-3 col-md-4 col-sm-6 mb-3 px-4'>
                                    <ProductCard
                                        data={item}
                                        index={item.id}
                                        wishlist={
                                            (wishlist?.products ? wishlist.products : []).filter(
                                                (value) => value.product_id === item.id
                                            )[0]
                                        }
                                        user_id={user_id}
                                        type='shop'
                                    />
                                </div>
                            );
                        })
                ) : (
                    <div className='col-md-12'>
                        <div className='alert alert-secondary' role='alert'>
                            We can't found your keyword. Please change your keyword!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShopComp;
