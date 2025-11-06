import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getProductAdmin,
    getProductDetails,
    getProductReview,
    editProduct,
    editProductReview,
} from '../../store/action';
import { URL_IMG } from '../../store/helpers';
import ModalComp from '../Common/modalComp';

const SuperAdminProducts = () => {
    const [productStatus, setProductStatus] = React.useState({
        old_status_id: null,
        new_status_id: null,
        product_id: null,
        store_id: null,
    });
    const [filterProduct, setFilterProduct] = React.useState({
        search: '',
        status: null,
    });
    const { productAdmin, productDetails, productReview } = useSelector((state) => {
        return {
            productAdmin: state.products.productAdmin,
            productDetails: state.products.productDetails,
            productReview: state.productReview.productReview,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getProductAdmin());
    }, []);

    React.useEffect(() => {
        const { search, status } = filterProduct;
        if (search && status) {
            dispatch(getProductAdmin(`search=${search}&status=${status}`));
        } else if (search) {
            dispatch(getProductAdmin(`search=${search}`));
        } else if (status) {
            dispatch(getProductAdmin(`status=${status}`));
        } else {
            dispatch(getProductAdmin());
        }
    }, [filterProduct]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('.carousel').carousel();
    });

    const renderProductStatus = () => {
        const { old_status_id, new_status_id, product_id, store_id } = productStatus;
        return (
            <div>
                <p className='text-center mb-0'>Are you sure to change the product status?</p>
                <div className='d-flex justify-content-center align-items-center p-2 mb-2'>
                    <div className='dropdown'>
                        <button
                            className='btn btn-outline-primary dropdown-toggle btn-block'
                            type='button'
                            id='oldStatusButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                            disabled
                        >
                            {old_status_id === 1
                                ? 'Show'
                                : old_status_id === 2
                                ? 'Hide'
                                : 'Inactive'}
                        </button>
                    </div>
                    <i className='bx bxs-right-arrow-alt bx-md'></i>
                    <div className='dropdown'>
                        <button
                            className='btn btn-outline-primary dropdown-toggle btn-block'
                            type='button'
                            id='oldStatusButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {new_status_id === 1
                                ? 'Show'
                                : new_status_id === 2
                                ? 'Hide'
                                : new_status_id === 3
                                ? 'Inactive'
                                : 'Product Status'}
                        </button>
                        <div className='dropdown-menu'>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() =>
                                    setProductStatus({ ...productStatus, new_status_id: 1 })
                                }
                            >
                                Show
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() =>
                                    setProductStatus({ ...productStatus, new_status_id: 2 })
                                }
                            >
                                Hide
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() =>
                                    setProductStatus({ ...productStatus, new_status_id: 3 })
                                }
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center'>
                    <button
                        type='button'
                        className='btn btn-primary mr-2'
                        data-dismiss='modal'
                        onClick={() =>
                            setProductStatus({
                                old_status_id: null,
                                new_status_id: null,
                                product_id: null,
                                store_id: null,
                            })
                        }
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary ml-2'
                        data-dismiss='modal'
                        disabled={old_status_id === new_status_id}
                        onClick={() =>
                            dispatch(
                                editProduct({ status_id: new_status_id }, product_id, store_id)
                            )
                        }
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    const handleViewProductDetail = (id) => {
        dispatch(getProductDetails(id));
        $('#view_product_detail').modal();
    };

    const renderProductDetail = () => {
        const {
            name,
            stock,
            weight,
            regular_price,
            sale_price,
            released_date,
            updated_date,
            category,
            tags,
            image,
            description,
        } = productDetails;

        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-sm-12 col-md-6'>
                        <div
                            id='carousel_product_detail'
                            className='carousel slide'
                            data-ride='carousel'
                        >
                            <div className='carousel-inner'>
                                {image?.map((item, index) => {
                                    return (
                                        <div
                                            className={`carousel-item ${
                                                index === 0 ? 'active' : ''
                                            }`}
                                            key={index}
                                        >
                                            <img
                                                src={`${URL_IMG}/${item}`}
                                                className='img-product-detail'
                                                alt='img-product'
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <a
                                className='carousel-control-prev'
                                href='#carousel_product_detail'
                                role='button'
                                data-slide='prev'
                            >
                                <span
                                    className='carousel-control-prev-icon'
                                    aria-hidden='true'
                                ></span>
                                <span className='sr-only'>Previous</span>
                            </a>
                            <a
                                className='carousel-control-next'
                                href='#carousel_product_detail'
                                role='button'
                                data-slide='next'
                            >
                                <span
                                    className='carousel-control-next-icon'
                                    aria-hidden='true'
                                ></span>
                                <span className='sr-only'>Next</span>
                            </a>
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group mb-3'>
                            <label>Product Name</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Product Name'
                                value={name || ''}
                                disabled
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Regular Price</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Regular Price'
                                value={parseInt(regular_price) || 0}
                                disabled
                            />
                        </div>
                        <div className='form-group mb-3'>
                            <label>Sale Price</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Sale Price'
                                value={parseInt(sale_price) || 0}
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Weight</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Weight'
                                value={weight || 0}
                                disabled
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Stock</label>
                            <input
                                type='number'
                                className='form-control'
                                placeholder='Stock'
                                value={stock || 0}
                                disabled
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Released Date</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={
                                    new Date(released_date).toLocaleString() || 'Released Date'
                                }
                                disabled
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Updated Date</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder={
                                    updated_date
                                        ? new Date(updated_date).toLocaleString()
                                        : 'Updated Date'
                                }
                                disabled
                            />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Description</label>
                            <div dangerouslySetInnerHTML={{ __html: description || '' }} />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown'>
                            <button
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                type='button'
                                id='categoryButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                Category
                            </button>
                            <div className='dropdown-menu' aria-labelledby='categoryButton'>
                                {category?.map((item, index) => {
                                    return (
                                        <a className='dropdown-item' key={index}>
                                            {item}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown'>
                            <button
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                type='button'
                                id='tagButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                Tag
                            </button>
                            <div className='dropdown-menu' aria-labelledby='tagButton'>
                                {tags?.map((item, index) => {
                                    return (
                                        <a className='dropdown-item' key={index}>
                                            {item}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleViewProductReview = (product_id) => {
        $('#view_product_review').modal();
        dispatch(getProductReview(product_id, 'type=product-id'));
        dispatch(getProductDetails(product_id));
    };

    const renderProductReview = () => {
        let star1 = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(productDetails.rating)) {
                star1.push('bx bxs-star');
            } else {
                star1.push('bx bx-star');
            }
        }

        return (
            <div>
                {productReview.length > 0 ? (
                    <div className='products-review-form'>
                        <div className='review-title'>
                            <div className='rating'>
                                {star1.map((item, index) => {
                                    return <i key={index} className={item}></i>;
                                })}
                                <span> ({productDetails.rating || 0}/5)</span>
                            </div>
                            <p>Based on {productReview.length} reviews</p>
                        </div>

                        <div className='review-comments'>
                            {productReview.map((item, index) => {
                                let star2 = [];
                                for (let i = 1; i <= 5; i++) {
                                    if (i <= Math.round(item.rating)) {
                                        star2.push('bx bxs-star');
                                    } else {
                                        star2.push('bx bx-star');
                                    }
                                }
                                return (
                                    <div className='review-item' key={index}>
                                        <div className='d-flex justify-content-between'>
                                            <div>
                                                <div className='rating'>
                                                    {star2.map((item, index) => {
                                                        return <i key={index} className={item}></i>;
                                                    })}
                                                </div>
                                                <span>
                                                    <strong>{item.full_name}</strong> on{' '}
                                                    <strong>
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </strong>
                                                </span>
                                                {(item.image || []).map((value, idx) => {
                                                    return (
                                                        <img
                                                            src={`${URL_IMG}/${value}`}
                                                            className='img-review'
                                                            key={idx}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <button
                                                type='button'
                                                className='btn'
                                                onClick={() =>
                                                    dispatch(
                                                        editProductReview(
                                                            item.status === 1
                                                                ? { status: 2 }
                                                                : { status: 1 },
                                                            item.id,
                                                            productDetails.id
                                                        )
                                                    )
                                                }
                                            >
                                                {item.status === 1 ? 'Show' : 'Hide'}
                                            </button>
                                        </div>
                                        <p>{item.comment}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className='alert alert-secondary'>
                        This product doesn't have a review
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='SA-products'>
            <h3>Products</h3>
            <div className='row mb-2 align-items-center justify-content-between no-gutters'>
                <div className='col-sm-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Products or Store Name'
                            onChange={(e) =>
                                setFilterProduct({ ...filterProduct, search: e.target.value })
                            }
                        />
                        <div className='input-group-append'>
                            <button type='button' className='btn btn-primary'>
                                <i className='bx bx-search-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className='dropdown my-2'>
                        <button
                            className='btn btn-primary dropdown-toggle'
                            type='button'
                            id='filterActive'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {filterProduct.status === 1
                                ? 'Show'
                                : filterProduct.status === 2
                                ? 'Hide'
                                : filterProduct.status === 3
                                ? 'Inactive'
                                : 'All Product Status'}
                        </button>

                        <div className='dropdown-menu' aria-labelledby='filterActive'>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterProduct({ ...filterProduct, status: null })}
                            >
                                All Product Status
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterProduct({ ...filterProduct, status: 1 })}
                            >
                                Show
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterProduct({ ...filterProduct, status: 2 })}
                            >
                                Hide
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterProduct({ ...filterProduct, status: 3 })}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Store Name</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productAdmin.length > 0 ? (
                            productAdmin.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='align-middle'>
                                            <img
                                                src={`${URL_IMG}/${item.image[0]}`}
                                                className='img-product-admin'
                                            />
                                        </td>
                                        <td className='align-middle'>{item.name}</td>
                                        <td className='align-middle'>{item.username}</td>
                                        <td className='align-middle'>
                                            <button
                                                type='button'
                                                className='btn text-info'
                                                data-toggle='modal'
                                                data-target='#product_status'
                                                onClick={() =>
                                                    setProductStatus({
                                                        ...productStatus,
                                                        old_status_id: item.status_id,
                                                        product_id: item.id,
                                                        store_id: item.store_id,
                                                    })
                                                }
                                            >
                                                <u>
                                                    {item.status_id === 1
                                                        ? 'Show'
                                                        : item.status_id === 2
                                                        ? 'Hide'
                                                        : 'Inactive'}
                                                </u>
                                            </button>
                                        </td>
                                        <td className='align-middle'>
                                            <div className='d-flex justify-content-center'>
                                                <button type='button' className='btn p-0'>
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='top'
                                                        title='Details'
                                                        onClick={() =>
                                                            handleViewProductDetail(item.id)
                                                        }
                                                    >
                                                        <i className='bx bx-detail'></i>
                                                    </div>
                                                </button>
                                                <button type='button' className='btn p-0'>
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='top'
                                                        title='Product Review'
                                                        onClick={() =>
                                                            handleViewProductReview(item.id)
                                                        }
                                                    >
                                                        <i className='bx bx-comment-detail'></i>
                                                    </div>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={5}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id='product_status'
                title='Product Status'
                body={renderProductStatus()}
            />
            <ModalComp
                modal_id={'view_product_detail'}
                size='modal-lg'
                scrollable={true}
                title='Product Detail'
                body={renderProductDetail()}
            />
            <ModalComp
                modal_id={'view_product_review'}
                size='modal-lg'
                scrollable={true}
                title='Product Review'
                body={renderProductReview()}
            />
        </div>
    );
};

export default SuperAdminProducts;
