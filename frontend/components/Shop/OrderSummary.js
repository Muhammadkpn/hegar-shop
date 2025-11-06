import { checkoutConfirmation, checkDeliveryFee } from '../../store/action';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import Link from 'next/link';
import ModalComp from '../Common/modalComp';

const OrderSummary = ({ disabled, user_id }) => {
    const [arrow, setArrow] = React.useState(false);
    const [arrowId, setArrowId] = React.useState(null);
    const [payment, setPayment] = React.useState('');
    const [shippingOrder, setShippingOrder] = React.useState([]);
    const [services, setServices] = React.useState([]);
    const [selectCourier, setSelectCourier] = React.useState([]);
    const [selectServices, setSelectServices] = React.useState([]);
    
    // total shipping
    let total_shipping = 0;
    selectServices.forEach((item) => total_shipping += item.fee);

    // disable button place order
    const booleanOrder = [];
    shippingOrder.forEach((item, index) => {
        if (item.order_number && item.sub_order_number && item.recipient_name && item.recipient_phone && item.origin_subdistrict_id
            && item.origin_details && item.destination_subdistrict_id && item.destination_details && item.address && item.courier_id
            && item.courier_service && item.courier_description && item.total_weight && item.delivery_fee
        ) {
            booleanOrder.push(true);
        } else {
            booleanOrder.pop();
        }
    });

    const { checkout, errorCheckout, deliveryFee, cart, mainAddress } = useSelector((state) => {
        return {
            errorCheckout: state.transaction.errorCheckout,
            checkout: state.transaction.checkout,
            deliveryFee: state.shipping.deliveryFee,
            mainAddress: state.address.mainAddress,
            cart: state.cart.cart,
        };
    });

    const dispatch = useDispatch();
    
    React.useEffect(() => {
        if (cart && mainAddress) {
            const tempOrigin = [];
            const tempShipping = [];
            const tempCourier = [];
            const tempServices = [];
            const tempSelectServices = [];
            (cart?.order_detail || []).forEach((item, index) => {
                tempOrigin.push({
                    storeId: item.store_id, originId: item.origin_subdistrict_id, weight: item.total_weight_per_store, sub_order_number: item.sub_order_number,
                });
                tempShipping.push({
                    order_number: cart?.order_number, sub_order_number: item.sub_order_number, recipient_name: mainAddress?.recipient_name,
                    recipient_phone: mainAddress?.recipient_phone, origin_subdistrict_id: null, origin_details: '',
                    destination_subdistrict_id: mainAddress?.subdistrict_id, destination_details: mainAddress ? `${mainAddress.subdistrict}, ${mainAddress.city}, ${mainAddress.province}, ${mainAddress.postcode}`: '',
                    address: mainAddress?.address, courier_id: null, courier_service: '', courier_description: '', total_weight: item.total_weight_per_store, delivery_fee: 0,
                });
                tempCourier.push({
                    sub_order_number: item.sub_order_number, courier_name: '',
                });
                tempServices.push({
                    sub_order_number: item.sub_order_number, courier_service: [],
                });
                tempSelectServices.push({
                    sub_order_number: item.sub_order_number, service_name: '', fee: 0, estimated: '',
                });
            });
            setShippingOrder(tempShipping);
            setSelectCourier(tempCourier);
            setServices(tempServices);
            setSelectServices(tempSelectServices);
            const body = {
                destination: mainAddress?.subdistrict_id, store: tempOrigin, destinationType: 'subdistrict', storeOriginType: 'subdistrict',
            };
            dispatch(checkDeliveryFee(body));
        }
    }, [cart, mainAddress])

    const changeCourier = (sub_order_number, courier_id, courier_name) => {
        const tempShipping = [... shippingOrder];
        tempShipping.forEach((item, index) => {
            if (item.sub_order_number === sub_order_number) {
                tempShipping[index].courier_id = courier_id;
                tempShipping[index].courier_description = '';
                tempShipping[index].courier_service = '';
                tempShipping[index].delivery_fee = 0;
            }
        });
        setShippingOrder(tempShipping);

        const tempCourier = [...selectCourier];
        tempCourier.forEach((item, index) => {
            if (item.sub_order_number === sub_order_number) {
                tempCourier[index].courier_name = courier_name
            }
        });
        setSelectCourier(tempCourier);

        const tempServices = [...services];
        tempServices.forEach((item, index) => {
            if (item.sub_order_number === sub_order_number) {
                deliveryFee.forEach((item) => {
                    item.courier.forEach((value) => {
                        if (value.courier_id === courier_id) {
                            tempServices[index].courier_service = value.costs;
                        }
                    })
                })   
            }
        });
        setServices(tempServices);

        const tempSelectServices = [...selectServices];
        tempSelectServices.forEach((item, index) => {
            if (item.sub_order_number === sub_order_number) {
                tempSelectServices[index].service_name = '';
                tempSelectServices[index].fee = 0;
                tempSelectServices[index].estimated = '';
            }
        });
        setSelectServices(tempSelectServices);
    }

    const changeService = (sub_order_number, selectedService, selectedDesc, selectedCost) => {
        const tempShipping = [...shippingOrder];
        tempShipping.forEach((item, index) => {
            if (item.sub_order_number === sub_order_number) {
                tempShipping[index].courier_service = selectedService;
                tempShipping[index].courier_description = selectedDesc;
                tempShipping[index].delivery_fee = selectedCost?.value;
                deliveryFee.forEach((value) => {
                    tempShipping[index].origin_subdistrict_id = value.origin_details.subdistrict_id;
                    tempShipping[index].origin_details = `${value.origin_details.subdistrict_name}, ${value.origin_details.city}, ${value.origin_details.province}, ${value.origin_details.postcode}`;
                })
            }
        });
        setShippingOrder(tempShipping);
        
        const tempSelectServices = [...selectServices];
        tempSelectServices.forEach((item, index) => {
            if (item.sub_order_number === sub_order_number) {
                tempSelectServices[index].service_name = selectedDesc;
                tempSelectServices[index].fee = selectedCost?.value;
                tempSelectServices[index].estimated = selectedCost?.etd;
            }
        });
        setSelectServices(tempSelectServices);
    }

    return (
        <div className='order-details'>
            <h3 className='title'>Your Order</h3>
            <div className='order-table table-responsive'>
                <div className='tableFixHead'>
                    <table className='table'>
                        <thead>
                            <tr className='row no-gutters'>
                                <th scope='col' className='col-sm-2'></th>
                                <th scope='col' className='col-sm-5'>
                                    Store Name
                                </th>
                                <th scope='col' className='col-sm-5'>
                                    Subtotal
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {(cart.order_detail || []).map((item, index) => (
                                <tr className='row no-gutters' key={index} id='table-accordion'>
                                    <td
                                        scope='row'
                                        className='col-sm-1 align-middle d-flex justify-content-center'
                                        id={`collapse-${index}`}
                                    >
                                        <button
                                            className='btn p-0'
                                            type='button'
                                            data-toggle='collapse'
                                            data-target={`#row-${item.store_id}`}
                                            aria-expanded='false'
                                            aria-controls={`row-${index}`}
                                            onClick={() => {
                                                setArrow(index);
                                                setArrowId(!arrow);
                                            }}
                                        >
                                            <i
                                                className={`bx bxs-chevron-${
                                                    arrowId === index && arrow ? 'down' : 'up'
                                                }`}
                                            ></i>
                                        </button>
                                    </td>
                                    <td className='col-sm-5'>{item.store_name}</td>
                                    <td className='col-sm-6'>
                                        {selectServices.map((value, index) => {
                                            if (item.sub_order_number === value.sub_order_number) {
                                                return (
                                                    <span key={index}>
                                                        Rp. {(item.total_price_per_store + value.fee).toLocaleString()}
                                                    </span>
                                                )
                                            }
                                        })}
                                    </td>
                                    <td
                                        id={`row-${item.store_id}`}
                                        className='collapse col-sm-12 pr-3 pl-3 py-1'
                                        data-parent='#table-accordion'
                                        aria-labelledby={`collapse-${index}`}
                                    >
                                        <table className='table table-bordered'>
                                            <tbody>
                                                <tr>
                                                    <td className='font-weight-bold'>
                                                        Product Name
                                                    </td>
                                                    <td className='font-weight-bold'>Total Qty</td>
                                                    <td className='font-weight-bold'>
                                                        Total Weight (gr)
                                                    </td>
                                                    <td className='font-weight-bold'>
                                                        Total Price
                                                    </td>
                                                </tr>
                                                {item.products.map((value, idx) => {
                                                    return (
                                                        <tr key={idx}>
                                                            <td>{value.name}</td>
                                                            <td>{value.qty}</td>
                                                            <td>{value.total_weight.toLocaleString()}</td>
                                                            <td>
                                                                Rp.{' '}
                                                                {value.total_price.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td className='font-weight-bold'>Subtotal</td>
                                                    <td className='font-weight-bold'>{item.total_qty_per_store}</td>
                                                    <td className='font-weight-bold'>{item.total_weight_per_store.toLocaleString()}</td>
                                                    <td className='font-weight-bold'>Rp.&nbsp;{item.total_price_per_store.toLocaleString()}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                            <div className='row no-gutters'>
                                                <div className='mr-3'>
                                                    <h6 className='mt-3 mb-0'>Choose Courier</h6>
                                                    <div className='dropdown'>
                                                        <button
                                                            className='btn btn-primary btn-sm dropdown-toggle w-100'
                                                            type='button'
                                                            id='dropdownMenuButton'
                                                            data-toggle='dropdown'
                                                            aria-haspopup='true'
                                                            aria-expanded='false'
                                                        >
                                                            {selectCourier?.length > 0 ? selectCourier.map((val, idx) => {
                                                                if (item.sub_order_number === val.sub_order_number) {
                                                                    return (
                                                                        <span key={idx}>{val.courier_name || 'Courier'}</span>
                                                                    )
                                                                }
                                                            }) : 'Choose Courier'}
                                                        </button>
                                                        <div
                                                            className='dropdown-menu'
                                                            aria-labelledby='dropdownMenuButton'
                                                        >
                                                            {(deliveryFee || []).map((val) => {
                                                                if (item.sub_order_number === val.sub_order_number) {
                                                                    return (
                                                                        val.courier.map((val2, idx) => {
                                                                            return (
                                                                                <button
                                                                                    type='button'
                                                                                    className='btn dropdown-item'
                                                                                    onClick={() => changeCourier(val.sub_order_number, val2.courier_id, val2.name)}
                                                                                    key={idx}
                                                                                >
                                                                                    {val2.name}
                                                                                </button>
                                                                            )                                                                    
                                                                        })
                                                                    )
                                                                }
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6 className='mt-3 mb-0'>Service Options</h6>
                                                    <div className='d-flex'>
                                                        {(selectServices || []).map((val, indx) => {
                                                            if (item.sub_order_number === val.sub_order_number) {
                                                                return (
                                                                    <p className={`mb-0 ${val.service_name ? 'mr-3' : ''}`} key={indx}>
                                                                        {val.service_name}&nbsp;{val.fee? `(Rp. ${val.fee?.toLocaleString()})` : ''}
                                                                    </p>
                                                                )
                                                            }
                                                        })}
                                                        <div className='dropdown'>
                                                            <button
                                                                className='btn btn-sm p-0'
                                                                type='button'
                                                                id='dropdownMenuButton'
                                                                data-toggle='dropdown'
                                                                aria-haspopup='true'
                                                                aria-expanded='false'
                                                            >
                                                                Change Services
                                                            </button>
                                                            <div
                                                                className='dropdown-menu'
                                                                aria-labelledby='dropdownMenuButton'
                                                            >
                                                                {(services.length > 0 ? services : []).map((val2) => {
                                                                    if(item.sub_order_number === val2.sub_order_number) {
                                                                        return (
                                                                            (val2.courier_service || []).map((val3, idx) => {
                                                                                return (
                                                                                    <button
                                                                                        type='button'
                                                                                        className='btn dropdown-item'
                                                                                        onClick={() => changeService(item.sub_order_number, val3.service, val3.description, val3.cost[0])}
                                                                                        key={idx}
                                                                                    >
                                                                                        {val3.description} (Rp.&nbsp;{val3.cost[0].value?.toLocaleString()})
                                                                                    </button>
                                                                                )
                                                                            })
                                                                        )
                                                                    }
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className='row no-gutters'>
                                <td className='order-subtotal col-sm-6' colSpan='2'>
                                    <span>Total Price ({cart.total_qty}&nbsp;Products)</span>
                                </td>

                                <td className='order-subtotal-price col-sm-6'>
                                    <span className='order-subtotal-amount'>
                                        Rp. {(cart.total_price || 0).toLocaleString()}
                                    </span>
                                </td>
                            </tr>

                            {total_shipping > 0 ? 
                                <tr className='row no-gutters'>
                                    <td className='order-shipping col-sm-6' colSpan='2'>
                                        <span>Total Shipping Fee</span>
                                    </td>

                                    <td className='shipping-price col-sm-6'>
                                        <span>Rp. {(total_shipping || 0).toLocaleString()}</span>
                                    </td>
                                </tr>
                            : null}
                            <tr className='row no-gutters'>
                                <td className='order-shipping col-sm-6' colSpan='2'>
                                    <span>Discount</span>
                                </td>

                                <td className='shipping-price col-sm-6'>
                                    <span className='text-danger'>Rp. 0</span>
                                </td>
                            </tr>
                            <tr className='row no-gutters'>
                                <td className='total-price col-sm-6' colSpan='2'>
                                    <span>Order Total</span>
                                </td>

                                <td className='product-subtotal col-sm-6'>
                                    <span className='subtotal-amount'>
                                        Rp.{' '}
                                        {(
                                            (cart.total_price || 0) + (total_shipping || 0)
                                        ).toLocaleString()}
                                    </span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className='payment-box'>
                <div className='payment-method'>
                    <div className='row pl-3'>
                        <div className='form-check mr-2'>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='exampleRadios'
                                id='radio-group-1'
                                // value='Direct transfer'
                                onChange={() => setPayment('Direct Transfer')}
                            />
                            <label className='form-check-label' htmlFor='radio-group-1'>
                                Direct Transfer
                            </label>
                        </div>
                        <div className='form-check'>
                            <input
                                className='form-check-input'
                                type='radio'
                                name='exampleRadios'
                                id='radio-group-2'
                                // value='Virtual Account'
                                onChange={() => setPayment('Virtual Account')}
                            />
                            <label className='form-check-label' htmlFor='radio-group-2'>
                                Virtual Account
                            </label>
                        </div>
                    </div>
                    <p>
                        Make your payment directly into our bank account. Please use your Order ID
                        as the payment reference. Your order will not be shipped until the funds
                        have cleared in our account.
                    </p>
                </div>

                <Link href='#'>
                    <a>
                        <button
                            type='button'
                            className='default-btn'
                            data-toggle='modal'
                            data-target='#checkout_done'
                            onClick={(e) => {
                                e.preventDefault();
                                dispatch(
                                    checkoutConfirmation(
                                        {
                                            shippingOrder,
                                        },
                                        cart.order_number,
                                        user_id
                                    )
                                );
                            }}
                            disabled={disabled || (shippingOrder.length !== booleanOrder.length)}
                        >
                            Place Order
                        </button>
                    </a>
                </Link>
            </div>
            <ModalComp
                modal_id='checkout_done'
                body={
                    <p>Checkout is successful. Please pay your bills to finish your transaction!</p>
                }
                footer={
                    <div className='justify-content-between'>
                        <Link href='/shop'>
                            <a className='mr-3' data-dismiss='modal'>
                                Buy Again
                            </a>
                        </Link>
                        <Link href='/account?section=orders' data-dismiss='modal'>
                            <a>Upload Payment</a>
                        </Link>
                    </div>
                }
            />
        </div>
    );
};

export default OrderSummary;
