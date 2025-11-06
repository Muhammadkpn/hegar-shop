import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchProduct } from '../../store/action';
import { URL_IMG } from '../../store/helpers';

const MainBanner = () => {
    const [selected, setSelected] = React.useState('');
    const [searchProduct, setSearchProduct] = React.useState('');
    const { categoryChild, searchBanner } = useSelector((state) => {
        return {
            categoryChild: state.categoryProduct.categoryChild,
            searchBanner: state.products.searchBanner,
        };
    });

    const dispatch = useDispatch();

    React.useEffect(() => {
        if(searchProduct) {
            dispatch(getSearchProduct('banner-search', searchProduct, selected))
        } else {
            dispatch(getSearchProduct('banner-search'))
        }
    }, [searchProduct, selected])
    return (
        <React.Fragment>
            <div
                className='jumbotron'
                style={{
                    background: `url(${URL_IMG}/image/banner/home-banner.jpg)`,
                    backgroundSize: 'cover',
                }}
            >
                <p className='text-jumbotron text-jumbotron-lg'>
                    Menyediakan <strong>produk</strong> khusus dan <br /> berkualitas dengan{' '}
                    <strong>
                        <span className='store'>Store</span>
                    </strong>{' '}
                    <br /> <strong>TERPERCAYA !!!</strong>
                </p>
                <p className='text-jumbotron'>
                    High quality items created by our business community
                </p>
                <div className='search-container'>
                    <div className='mb-3 input-group'>
                        <div className='input-group-prepend'>
                            <div className='input-group-text'>
                                <i className='search-btn fas fa-search'></i>
                            </div>
                        </div>
                        <input
                            className='form-control'
                            placeholder='Search for products'
                            onChange={(e) => setSearchProduct(e.target.value)}
                            value={searchProduct}
                        />
                        <div className='input-group-append'>
                            <button
                                className='btn btn-outline-secondary dropdown-toggle'
                                id='input-group-dropdown-1'
                                type='button'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                {selected || 'Category'}
                            </button>
                            <div className='dropdown-menu'>
                                <a className='dropdown-item' onClick={() => setSelected('')}>
                                    Category
                                </a>
                                {categoryChild?.parent?.map((item, index) => {
                                    return (
                                        <a
                                            className='dropdown-item'
                                            key={index}
                                            onClick={() => setSelected(item.name)}
                                        >
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {searchBanner?.length > 0 ? (
                        <ul className='search-group'>
                            {searchBanner.map((item, index) => {
                                return (
                                    <li key={index} className='search-group-item'>
                                        <Link href={`/shop/${item.id}`}>
                                            <a>
                                                <div className='d-flex align-items-center'>
                                                    <img
                                                        src={`${URL_IMG}/${item.image[0]}`}
                                                        className='search-img'
                                                    />
                                                    <div className='ml-2'>
                                                        <p className='mb-0'>{item.name}</p>
                                                        <p>Rp. {item.sale_price.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : null}
                </div>
            </div>
        </React.Fragment>
    );
};

export default MainBanner;
