import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { getFullImageUrl } from '../../store/helpers';
import {
    getHistory,
    confirmDone,
    uploadPayment,
    cancelOrder,
    rejectPayment,
    sendOrder,
    getProductReview,
    addProductReview,
    uploadReview,
} from '../../store/action';
import React, { forwardRef, useState } from 'react';
import ModalComp from '../Common/modalComp';
import DatePicker from 'react-datepicker';

const Orders = ({ type }) => {
    const [statusId, setStatusId] = React.useState(null);
    const [upload, setUpload] = React.useState('');
    const [orderDetail, setOrderDetail] = React.useState({
        order_number: null,
        checkout_date: '',
        order_status_id: null,
        status: '',
        products: '',
        total_price: null,
        recipient_address: '',
        order_detail: [],
        total_ongkir: null,
    });
    const [addImage, setAddImage] = useState([])
    const [addReview, setAddReview] = useState({
        rating: 0, comment: '', review_id: null,
    })
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const status = [
        'Semua',
        'Waiting for payment',
        'Payment success',
        'On delivery',
        'Done',
        'Cancelled',
        'Rejected',
    ];
    const [reviewId, setReviewId] = useState(null);
    const { history, id, role_id, productReview } = useSelector((state) => {
        return {
            history: state.transaction.history,
            id: state.users.id,
            role_id: state.users.role,
            productReview: state.productReview.productReview,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(
            getHistory(
                id,
                type === 'store' ? 'type=store' : type === 'admin' ? 'type=admin' : 'type=users'
            )
        );
    }, []);

    React.useEffect(() => {
        if (statusId && startDate && endDate) {
            dispatch(
                getHistory(
                    id,
                    `${
                        type === 'store'
                            ? 'type=store'
                            : type === 'admin'
                            ? 'type=admin'
                            : 'type=users'
                    }${statusId !== 1 ? `&orderStatus=${statusId}` : ''}&startDate=${startDate
                        .toISOString()
                        .slice(0, 10)}&endDate=${endDate.toISOString().slice(0, 10)}`
                )
            );
        } else if (statusId) {
            dispatch(
                getHistory(
                    id,
                    `${
                        type === 'store'
                            ? 'type=store'
                            : type === 'admin'
                            ? 'type=admin'
                            : 'type=users'
                    }${statusId !== 1 ? `&orderStatus=${statusId}` : ''}`
                )
            );
        } else if (startDate && endDate) {
            dispatch(
                getHistory(
                    id,
                    `${
                        type === 'store'
                            ? 'type=store'
                            : type === 'admin'
                            ? 'type=admin'
                            : 'type=users'
                    }&startDate=${startDate.toISOString().slice(0, 10)}&endDate=${endDate
                        .toISOString()
                        .slice(0, 10)}`
                )
            );
        } else {
            dispatch(
                getHistory(
                    id,
                    `${
                        type === 'store'
                            ? 'type=store'
                            : type === 'admin'
                            ? 'type=admin'
                            : 'type=users'
                    }`
                )
            );
        }
    }, [statusId, dateRange]);

    React.useEffect(() => {
        if (reviewId) {
            dispatch(getProductReview(reviewId, 'type=review-id'));
        }
    }, [reviewId]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <button type='button' className='btn btn-outline-primary' onClick={onClick} ref={ref}>
            {startDate
                ? `${startDate.toLocaleDateString()} - ${(
                      endDate || new Date()
                  ).toLocaleDateString()}`
                : 'Select Date'}
        </button>
    ));

    const handleResetFilter = () => {
        setStatusId(null);
        setDateRange([null, null]);
    };

    const handleUpload = (e) => {
        let fileProps = e.target.files[0];
        let data = new FormData();
        data.append('IMG', fileProps);
        setUpload(data);
    };

    const handleSubmitUpload = () => {
        dispatch(uploadPayment(orderDetail.order_number, upload, id));
    };

    const renderOrderDetail = () => {
        const {
            checkout_date,
            receipt_image,
            order_status_id,
            status,
            order_detail,
            total_price,
            total_ongkir,
            recipient_address,
        } = orderDetail;

        return (
            <div className='order-detail'>
                <div className='top-container mb-3'>
                    <div className='row justify-content-between'>
                        <div className='col-md-6'>
                            <p className='title-order'>Date</p>
                            <p className='content-title'>{`${new Date(checkout_date).toLocaleString(
                                'id-ID',
                                { day: 'numeric', month: 'short', year: 'numeric' }
                            )}, ${new Date(checkout_date)
                                .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                .replace(/AM|PM/g, 'WIB')}`}</p>
                        </div>
                        <div className='right col-md-6'>
                            <p className='title-order'>Status</p>
                            <p className='content-title'>{status}</p>
                        </div>
                    </div>
                </div>
                {order_detail?.map((item, index) => {
                    return (
                        <React.Fragment key={index}>
                            <div className='top-container mb-3'>
                                <div className='row justify-content-between'>
                                    <div className='col-md-6'>
                                        <p className='title-order'>Order Number</p>
                                        <p className='content-title'>{item.sub_order_number}</p>
                                    </div>
                                    <div className='right col-md-6'>
                                        <p className='title-order'>Store Name</p>
                                        <p className='content-title'>{item.store_name}</p>
                                    </div>
                                </div>
                            </div>
                            <div className='table-responsive'>
                                <table className='table table-bordered'>
                                    <thead className='thead-light'>
                                        <tr>
                                            <th className='text-center align-middle'>Image</th>
                                            <th className='text-center align-middle'>
                                                Product Name
                                            </th>
                                            <th className='text-center align-middle'>Quantity</th>
                                            <th className='text-center align-middle'>Price</th>
                                            <th className='text-center align-middle'>Total</th>
                                            {role_id === 3 ? (
                                                <th className='text-center align-middle'>Action</th>
                                            ) : null}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.products.map((value, idx) => {
                                            return (
                                                <tr key={value?.id}>
                                                    <td className='align-middle'>
                                                        <img src={getFullImageUrl(value?.image)} />
                                                    </td>
                                                    <td className='align-middle'>{value?.name}</td>
                                                    <td className='align-middle'>{value?.qty}</td>
                                                    <td className='align-middle'>
                                                        Rp.{' '}
                                                        {value?.price_each
                                                            ? value?.price_each.toLocaleString()
                                                            : 0}
                                                    </td>
                                                    <td className='align-middle'>
                                                        Rp.{' '}
                                                        {(
                                                            value?.qty * value?.price_each
                                                        ).toLocaleString()}
                                                    </td>
                                                    {role_id === 3 ? (
                                                        <td className='align-middle'>
                                                            <Link
                                                                href={`/shop/${value.product_id}`}
                                                            >
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-primary btn-sm m-2'
                                                                >
                                                                    Buy Again
                                                                </button>
                                                            </Link>
                                                            {order_status_id === 5 && value.rating ? (
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-primary btn-sm m-2'
                                                                    onClick={() => {
                                                                        dispatch(getProductReview(value.review_id, 'type=review-id'));
                                                                        $('#see-review').modal();
                                                                    }}
                                                                >
                                                                    See Review
                                                                </button>
                                                            ) : null}
                                                            {order_status_id === 5 && !value.rating ? (
                                                                <button
                                                                    type='button'
                                                                    className='btn btn-primary btn-sm m-2'
                                                                    onClick={() => {
                                                                        $('#give-review').modal();
                                                                        setAddReview({ ...addReview, review_id: value.review_id });
                                                                    }}
                                                                >
                                                                    Give a Review
                                                                </button>
                                                            ) : null}
                                                        </td>
                                                    ) : null}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div>
                    <h6 className='mt-3'>Shipping Address</h6>
                    <p className='mb-0'>
                        Sent to{' '}
                        <span className='font-weight-bold'>{recipient_address?.recipient_name}</span>
                    </p>
                    <p className='mb-0'>{recipient_address?.address}</p>
                    <p className='mb-0'>{recipient_address?.destination_details}</p>
                    <p className='mb-0'>Phone: {recipient_address?.recipient_phone}</p>
                </div>
                <div>
                    <h6 className='mt-3'>Payment</h6>
                    <div className='row'>
                        <div className='col-md-3'>
                            <p>Total Price</p>
                        </div>
                        <div className='col-md-3'>
                            <p>Rp. {total_price ? total_price.toLocaleString() : null}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <p>Delivery fee</p>
                        </div>
                        <div className='col-md-3'>
                            <p>Rp. {total_ongkir ? total_ongkir.toLocaleString() : null}</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <p>Grand total</p>
                        </div>
                        <div className='col-md-3'>
                            <p>
                                Rp.{' '}
                                {total_ongkir && total_price
                                    ? (total_ongkir + total_price).toLocaleString()
                                    : null}
                            </p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <p>Payment Method</p>
                        </div>
                        <div className='col-md-3'>
                            <p>Direct Transfer</p>
                        </div>
                    </div>
                </div>
                <div className='mt-3'>
                    {order_status_id === 2 ? (
                        <h6>
                            {receipt_image
                                ? "We have received your payment, but we haven't confirmed it."
                                : "We haven't received your payment. Please upload your payment!"}{' '}
                            &nbsp;
                            <span>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    data-toggle='modal'
                                    data-target='#upload_payment'
                                    data-dismiss='modal'
                                >
                                    {receipt_image ? 'See Your Payment' : 'Upload Payment'}
                                </button>
                            </span>
                        </h6>
                    ) : null}
                    {order_status_id === 2 || order_status_id === 3 ? (
                        <h6>
                            Do you want to {type === 'store' ? 'reject' : 'cancel'} this order?
                            &nbsp;
                            <span>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    data-toggle='modal'
                                    data-target={
                                        type === 'store' ? '#reject_order' : '#cancel_order'
                                    }
                                    data-dismiss='modal'
                                >
                                    {type === 'store' ? 'Reject' : 'Cancel'} Order
                                </button>
                            </span>
                        </h6>
                    ) : null}
                    {order_status_id === 3 && type === 'store' ? (
                        <h6>
                            Do you want to send this order? &nbsp;
                            <span>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    data-toggle='modal'
                                    data-target='#send_order'
                                    data-dismiss='modal'
                                >
                                    Send Order
                                </button>
                            </span>
                        </h6>
                    ) : null}
                    {role_id === 3 && order_status_id === 4 ? (
                        <h6>
                            Have you received this order? &nbsp;
                            <span>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    data-toggle='modal'
                                    data-target='#done_order'
                                    data-dismiss='modal'
                                >
                                    Done
                                </button>
                            </span>
                        </h6>
                    ) : null}
                </div>
            </div>
        );
    };

    const renderProductReview = () => {
        let star1 = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(productReview?.rating)) {
                star1.push('bx bxs-star');
            } else {
                star1.push('bx bx-star');
            }
        }

        return (
            <div className='products-review-form'>
                <div className='review-comments'>
                    <div className='review-item'>
                        <div className='rating'>
                            {star1.map((item, index) => {
                                return <i key={index} className={item}></i>;
                            })}
                        </div>
                        <span>
                            <strong>{productReview?.full_name}</strong> on{' '}
                            <strong>{new Date(productReview?.date).toLocaleDateString()}</strong>
                        </span>
                        <p>{productReview?.comment}</p>
                        
                        {(productReview?.image || []).map((value, idx) => {
                            return (
                                <img
                                    src={getFullImageUrl(value)}
                                    className='img-review'
                                    key={idx}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const submitAddReview = () => {
        const { rating, comment, review_id } = addReview;
        const body = {
            rating, comment,
        }
        dispatch(addProductReview(id, review_id, body));

        // upload image
        if (addImage.length > 0) {
            const formData = new FormData();
            addImage.forEach((item) => {
                formData.append('IMG', item.files);
            });
            dispatch(uploadReview(formData, review_id))
        }

    }

    const renderAddProductReview = () => {
        const rate = [1, 2, 3, 4, 5];
        return (
            <div className='d-flex flex-column justify-content-center'>
                {addImage.length !== 0 ? (
                    <div id='carousel_image_add' className='carousel slide' data-ride='carousel'>
                        <div className='carousel-inner'>
                            {addImage?.map((item, index) => {
                                return (
                                    <div
                                        className={`carousel-item ${index === 0 ? 'active' : ''}`}
                                        key={index}
                                    >
                                        <img
                                            src={item.image}
                                            className='img-edit-product'
                                            alt='img-product'
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <a
                            className='carousel-control-prev'
                            href='#carousel_image_add'
                            role='button'
                            data-slide='prev'
                        >
                            <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Previous</span>
                        </a>
                        <a
                            className='carousel-control-next'
                            href='#carousel_image_add'
                            role='button'
                            data-slide='next'
                        >
                            <span className='carousel-control-next-icon' aria-hidden='true'></span>
                            <span className='sr-only'>Next</span>
                        </a>
                    </div>
                ) : null}
                <div className='form-group d-flex justify-content-center'>
                    <label htmlFor='upload-add-image' className='custom-file-upload'>
                        Upload Image
                    </label>
                    <input
                        type='file'
                        accept='image/*'
                        id='upload-add-image'
                        className='d-none'
                        onChange={(e) => {
                            let files = [];
                            for (let i = 0; i < e.target.files.length; i++) {
                                files.push({
                                    image: URL.createObjectURL(e.target.files[i]),
                                    files: e.target.files[i],
                                });
                            }
                            setAddImage([...files]);
                        }}
                        multiple
                    />
                </div>
                <p className='mb-0'>Give a review to this product?</p>
                <div className='rating'>
                    {rate.map((item, index) => {
                        return (
                            <i key={index} className={`bx ${addReview.rating >= item ? 'bxs-star' : 'bx-star'}`} onClick={() => setAddReview({ ...addReview, rating: index + 1})}></i>
                            )
                        })}
                </div>
                <p className='mb-0'>Give a comment to this product?</p>
                <textarea
                    cols='45'
                    placeholder='Your Comment...'
                    rows='5'
                    required='required'
                    onChange={(e) => {
                        e.preventDefault();
                        setAddReview({ ...addReview, comment: e.target.value });
                    }}
                    value={addReview.comment}
                ></textarea>
                <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => submitAddReview()}
                    disabled={addReview.rating === 0 || !addReview.comment}
                    data-dismiss="modal"
                >
                    Submit Review
                </button>
            </div>
        )
    }

    return (
        <div className='order-container'>
            <h3 className='p-2'>Orders</h3>
            <div className='row no-gutters mb-4 align-items-center'>
                <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    maxDate={new Date()}
                    customInput={<CustomInput />}
                />
                <div className='dropdown my-2'>
                    <button
                        type='button'
                        className='btn btn-outline-primary dropdown-toggle mx-2 '
                        data-toggle='dropdown'
                    >
                        {status[statusId ? statusId - 1 : 0]}
                    </button>
                    <div className='dropdown-menu'>
                        {status.map((item, index) => {
                            return (
                                <button
                                    className='btn dropdown-item'
                                    key={index}
                                    onClick={() => setStatusId(index + 1)}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <button
                    type='button'
                    className='btn btn-outline-primary btn-sm'
                    onClick={() => handleResetFilter()}
                    disabled={statusId || startDate || endDate ? false : true}
                >
                    Reset Filter
                </button>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-hover table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='align-middle'>Order</th>
                            <th className='align-middle'>Date</th>
                            <th className='align-middle'>Status</th>
                            <th className='align-middle'>Total</th>
                            <th className='align-middle'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? (
                            history.map((item, index) => {
                                if (item.order_status_id !== 1) {
                                    return (
                                        <tr key={index}>
                                            <td className='align-middle'>#{item.order_number}</td>
                                            <td className='align-middle'>
                                                {item.checkout_date
                                                    ? `${new Date(
                                                          item.checkout_date
                                                      ).toLocaleString('id-ID', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })}, ${new Date(item.checkout_date)
                                                          .toLocaleTimeString([], {
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                          })
                                                          .replace(/AM|PM/g, 'WIB')}`
                                                    : null}
                                            </td>
                                            <td className='align-middle'>{item.status}</td>
                                            <td className='align-middle'>
                                                Rp.{' '}
                                                {item.total_price
                                                    ? item.total_price.toLocaleString()
                                                    : 0}
                                            </td>
                                            <td className='align-middle'>
                                                <button
                                                    type='button'
                                                    className='btn'
                                                    onClick={() => {
                                                        setOrderDetail({ ...item });
                                                        $('#order_detail').modal();
                                                    }}
                                                >
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='right'
                                                        title='View'
                                                    >
                                                        <i className='bx bx-detail'></i>
                                                    </div>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            })
                        ) : (
                            <tr className='alert alert-info' role='alert'>
                                <td colSpan={5} className='align-middle'>
                                    <p className='text-center'>No order has been made yet.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id='order_detail'
                title='Order Detail'
                body={renderOrderDetail()}
                size='modal-lg'
            />
            <ModalComp
                modal_id='upload_payment'
                title='Upload Payment'
                body={
                    <div>
                        <h6 className='mt-3'>Payment</h6>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Total Price</p>
                            </div>
                            <div className='col-md-3'>
                                <p>
                                    Rp.{' '}
                                    {orderDetail.total_price
                                        ? orderDetail.total_price.toLocaleString()
                                        : null}
                                </p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Total Price</p>
                            </div>
                            <div className='col-md-3'>
                                <p>
                                    Rp.{' '}
                                    {orderDetail.total_price
                                        ? orderDetail.total_price.toLocaleString()
                                        : null}
                                </p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Total Price</p>
                            </div>
                            <div className='col-md-3'>
                                <p>
                                    Rp.{' '}
                                    {orderDetail.total_price
                                        ? orderDetail.total_price.toLocaleString()
                                        : null}
                                </p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Total Price</p>
                            </div>
                            <div className='col-md-3'>
                                <p>
                                    Rp.{' '}
                                    {orderDetail.total_price
                                        ? orderDetail.total_price.toLocaleString()
                                        : null}
                                </p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Delivery fee</p>
                            </div>
                            <div className='col-md-3'>
                                <p>
                                    Rp.{' '}
                                    {orderDetail.total_ongkir
                                        ? orderDetail.total_ongkir.toLocaleString()
                                        : null}
                                </p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Grand total</p>
                            </div>
                            <div className='col-md-3'>
                                <p>
                                    Rp.{' '}
                                    {orderDetail.total_ongkir && orderDetail.total_price
                                        ? (
                                              orderDetail.total_ongkir + orderDetail.total_price
                                          ).toLocaleString()
                                        : null}
                                </p>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-3'>
                                <p>Payment Method</p>
                            </div>
                            <div className='col-md-3'>
                                <p>Direct Transfer</p>
                            </div>
                        </div>
                        {orderDetail.receipt_image ? (
                            <div>
                                <h6 className='mt-3'>Receipt Image</h6>
                                <img
                                    src={getFullImageUrl(orderDetail.receipt_image)}
                                    style={{ width: '100px', height: '100px' }}
                                />
                                <p className='mt-2'>
                                    We have received your payment, but we haven't verified it. Do
                                    you want to re-upload your payment?
                                </p>
                            </div>
                        ) : (
                            <p>
                                We haven't received your payment. Do you want to upload your
                                payment?
                            </p>
                        )}
                        <form>
                            <input type='file' accept='image/*' onChange={handleUpload} />
                            <button
                                type='button'
                                className='btn btn-primary btn-sm'
                                onClick={() => handleSubmitUpload()}
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                }
                size='modal-lg'
            />
            <ModalComp
                modal_id={type === 'store' ? 'reject_order' : 'cancel_order'}
                body={<p>Are you sure to {type === 'store' ? 'reject' : 'cancel'} this order?</p>}
                size='modal-sm'
                footer={
                    <div>
                        <button type='button' className='btn mr-2' data-dismiss='modal'>
                            No
                        </button>
                        <button
                            type='button'
                            className='btn'
                            data-dismiss='modal'
                            onClick={() =>
                                type === 'store'
                                    ? dispatch(rejectPayment(orderDetail.order_number, id))
                                    : dispatch(cancelOrder(orderDetail.order_number, id))
                            }
                        >
                            Yes
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id={type === 'store' ? 'send_order' : 'done_order'}
                body={<p>Are you sure to {type === 'store' ? 'send' : 'confirm'} this order?</p>}
                size='modal-sm'
                footer={
                    <div>
                        <button type='button' className='btn mr-2' data-dismiss='modal'>
                            No
                        </button>
                        <button
                            type='button'
                            className='btn'
                            data-dismiss='modal'
                            onClick={() =>
                                type === 'store'
                                    ? dispatch(sendOrder(orderDetail.order_number, id))
                                    : dispatch(confirmDone(orderDetail.order_number, id))
                            }
                        >
                            Yes
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id='see-review'
                title='Your Review'
                body={renderProductReview()}
                size='modal-md'
            />
            <ModalComp
                modal_id='give-review'
                title='Add Review'
                body={renderAddProductReview()}
                size='modal-md'
            />
        </div>
    );
};

export default Orders;
