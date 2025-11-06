import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { URL_IMG } from '../../store/helpers';
import {
    getHistory,
    confirmPayment,
    rejectPayment,
} from '../../store/action';
import React, { forwardRef, useState } from 'react';
import ModalComp from '../Common/modalComp';
import DatePicker from 'react-datepicker';

const SuperAdminPayment = () => {
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
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const { history, id } = useSelector((state) => {
        return {
            history: state.transaction.history,
            id: state.users.id,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getHistory(id, 'type=admin&orderStatus=2'));
    }, []);

    React.useEffect(() => {
        if (startDate && endDate) {
            dispatch(
                getHistory(
                    id,
                    `type=admin&orderStatus=2&startDate=${startDate
                        .toISOString()
                        .slice(0, 10)}&endDate=${endDate.toISOString().slice(0, 10)}`
                )
            );
        } else {
            dispatch(getHistory(id, 'type=admin&orderStatus=2'));
        }
    }, [dateRange]);
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
        setDateRange([null, null]);
    };

    const renderOrderDetail = () => {
        const {
            order_number,
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
                {order_detail.map((item, index) => {
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {item.products.map((value, idx) => {
                                            return (
                                                <tr key={value.id}>
                                                    <td className='align-middle'>
                                                        <img src={`${URL_IMG}/${value.image}`} />
                                                    </td>
                                                    <td className='align-middle'>{value.name}</td>
                                                    <td className='align-middle'>{value.qty}</td>
                                                    <td className='align-middle'>
                                                        Rp.{' '}
                                                        {value.price_each
                                                            ? value.price_each.toLocaleString()
                                                            : 0}
                                                    </td>
                                                    <td className='align-middle'>
                                                        Rp.{' '}
                                                        {(
                                                            value.qty * value.price_each
                                                        ).toLocaleString()}
                                                    </td>
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
                        <span className='font-weight-bold'>{recipient_address.recipient_name}</span>
                    </p>
                    <p className='mb-0'>
                        {recipient_address.address}
                    </p>
                    <p className='mb-0'>
                        {recipient_address.destination_details}
                    </p>
                    <p className='mb-0'>Phone: {recipient_address.recipient_phone}</p>
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
                    <h6>
                        Do you want to see receipt image? &nbsp;
                        <span>
                            <button
                                type='button'
                                className='btn btn-primary btn-sm'
                                data-toggle='modal'
                                data-target='#upload_payment'
                                data-dismiss='modal'
                            >
                                See Receipt Image
                            </button>
                        </span>
                    </h6>
                    <h6>
                        Do you want to reject this order? &nbsp;
                        <span>
                            <button
                                type='button'
                                className='btn btn-primary btn-sm'
                                data-toggle='modal'
                                data-target={'#reject_order'}
                                data-dismiss='modal'
                            >
                                Reject Order
                            </button>
                        </span>
                    </h6>
                </div>
            </div>
        );
    };

    return (
        <div className='order-container pl-5 pr-5 pb-5 pt-3'>
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
                <button
                    type='button'
                    className='btn btn-outline-primary btn-sm ml-2'
                    onClick={() => handleResetFilter()}
                    disabled={startDate || endDate ? false : true}
                >
                    Reset Filter
                </button>
            </div>
            <div className='table-responsive'>
                {Array.isArray(history) ? (
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
                            {history.map((item, index) => {
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
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className='alert alert-info' role='alert'>
                        No order has been made yet.
                    </div>
                )}
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
                                    src={`${URL_IMG}/${orderDetail.receipt_image}`}
                                    style={{ width: '100px', height: '100px' }}
                                    alt='receipt-image'
                                />
                                <p className='mt-2'>
                                    You haven't verified this order. Do you want to accept this
                                    payment?
                                </p>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm mr-2'
                                    data-toggle='modal'
                                    data-target={'#reject_order'}
                                    data-dismiss='modal'
                                >
                                    Reject Order
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    data-toggle='modal'
                                    data-target={'#confirm_payment'}
                                    data-dismiss='modal'
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        ) : (
                            <div>
                                <p className='mt-2'>Receipt image is not found</p>
                                <button
                                    type='button'
                                    className='btn btn-primary btn-sm'
                                    data-toggle='modal'
                                    data-target={'#reject_order'}
                                    data-dismiss='modal'
                                >
                                    Reject Order
                                </button>
                            </div>
                        )}
                    </div>
                }
                size='modal-lg'
            />
            <ModalComp
                modal_id={'reject_order'}
                body={<p>Are you sure to reject this order?</p>}
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
                            onClick={() => dispatch(rejectPayment(orderDetail.order_number))}
                        >
                            Yes
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id={'confirm_payment'}
                body={<p>Are you sure to confirm this payment?</p>}
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
                            onClick={() => dispatch(confirmPayment(orderDetail.order_number))}
                        >
                            Yes
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default SuperAdminPayment;
