import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAddress, getMainAddress, addAddress, editAddress, editUser } from '../../store/action';
import React from 'react';
import useForm from '../Common/useForm';
import OrderSummary from './OrderSummary';
import ModalComp from '../Common/modalComp';

const CheckoutComp = () => {
    const [formAddress, setFormAddress] = React.useState({ value: false, id: null });
    const [viewData, setViewData] = React.useState({
        recipient_name: '',
        recipient_phone: '',
        address: '',
        city: '',
        province: '',
        postcode: '',
    });
    const stateSchema1 = {
        recipient_name: { value: '', error: '' },
        recipient_phone: { value: '', error: '' },
        address: { value: '', error: '' },
        city: { value: '', error: '' },
        province: { value: '', error: '' },
        postcode: { value: '', error: '' },
    };
    const stateSchema2 = { ...stateSchema1 };
    const validationStateSchema1 = {
        recipient_name: {
            required: true,
            validator: {
                regEx: /^[a-zA-Z ]{8}/,
                error: 'Invalid name format. Minimal 8 characters',
            },
        },
        recipient_phone: {
            required: true,
            validator: {
                regEx: /^0\d{10,11}$/,
                error: 'Invalid phone number format use like 08787424249.',
            },
        },
        address: {
            required: true,
            validator: {
                regEx: /^[a-zA-Z]/,
                error: 'Invalid address format.',
            },
        },
        city: {
            required: true,
            validator: {
                error: 'Invalid city format.',
            },
        },
        province: {
            required: true,
            validator: {
                error: 'Invalid province format.',
            },
        },
        postcode: {
            required: true,
            validator: {
                regEx: /^\d{5}$|^\d{5}-\d{4}$/,
                error: 'Invalid zip format, use like 12345.',
            },
        },
    };
    const validationStateSchema2 = { ...validationStateSchema1 };

    const errorStyle = {
        color: 'red',
        fontSize: '13px',
    };

    const { cart, id, address, mainAddress } = useSelector((state) => {
        return {
            cart: state.cart.cart,
            id: state.users.id,
            address: state.address.address,
            mainAddress: state.address.mainAddress,
        };
    });

    const dispatch = useDispatch();
    const router = useRouter();
    React.useEffect(() => {
        dispatch(getMainAddress(id));
        dispatch(getAddress('type=user-id', id));
    }, []);

    React.useEffect(() => {
        state1.recipient_name = { value: '', error: '' };
        state1.recipient_phone = { value: '', error: '' };
        state1.address = { value: '', error: '' };
        state1.city = { value: '', error: '' };
        state1.province = { value: '', error: '' };
        state1.postcode = { value: '', error: '' };
    }, [formAddress.value]);

    const {
        state: state1,
        handleOnChange: handleOnChange1,
        handleOnSubmit: handleOnSubmit1,
        disable: disable1,
    } = useForm(stateSchema1, validationStateSchema1, handleSubmit);
    const {
        state: state2,
        handleOnChange: handleOnChange2,
        handleOnSubmit: handleOnSubmit2,
        disable: disable2,
    } = useForm(stateSchema2, validationStateSchema2, handleSubmit);

    const renderFormInput = (type) => {
        return (
            <>
                <div className='row'>
                    <div className='col-lg-6 col-md-6'>
                        <div className='form-group'>
                            <label>
                                Recipient's Name <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                name='recipient_name'
                                className='form-control'
                                onChange={type === 'add' ? handleOnChange1 : handleOnChange2}
                                value={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? mainAddress?.recipient_name || ''
                                            : state1.recipient_name.value
                                        : state2.recipient_name.value
                                }
                                disabled={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? true
                                            : false
                                        : false
                                }
                                style={
                                    type === 'add'
                                        ? {
                                              border: `${
                                                  state1.recipient_name.error ? '1px solid red' : ''
                                              }`,
                                          }
                                        : {
                                              border: `${
                                                  state2.recipient_name.error ? '1px solid red' : ''
                                              }`,
                                          }
                                }
                            />
                            {type === 'add'
                                ? state1.recipient_name.error && (
                                      <p style={errorStyle}>{state1.recipient_name.error}</p>
                                  )
                                : state2.recipient_name.error && (
                                      <p style={errorStyle}>{state2.recipient_name.error}</p>
                                  )}
                        </div>
                    </div>

                    <div className='col-lg-6 col-md-6'>
                        <div className='form-group'>
                            <label>
                                Recipient's Phone <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                name='recipient_phone'
                                className='form-control'
                                onChange={type === 'add' ? handleOnChange1 : handleOnChange2}
                                value={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? mainAddress?.recipient_phone || ''
                                            : state1.recipient_phone.value
                                        : state2.recipient_phone.value
                                }
                                disabled={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? true
                                            : false
                                        : false
                                }
                                style={
                                    type === 'add'
                                        ? {
                                              border: `${
                                                  state1.recipient_phone.error
                                                      ? '1px solid red'
                                                      : ''
                                              }`,
                                          }
                                        : {
                                              border: `${
                                                  state2.recipient_phone.error
                                                      ? '1px solid red'
                                                      : ''
                                              }`,
                                          }
                                }
                            />
                            {type === 'add'
                                ? state1.recipient_phone.error && (
                                      <p style={errorStyle}>{state1.recipient_phone.error}</p>
                                  )
                                : state2.recipient_phone.error && (
                                      <p style={errorStyle}>{state2.recipient_phone.error}</p>
                                  )}
                        </div>
                    </div>

                    <div className='col-lg-12'>
                        <div className='form-group'>
                            <label>
                                Address <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                name='address'
                                className='form-control'
                                onChange={type === 'add' ? handleOnChange1 : handleOnChange2}
                                value={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? mainAddress?.address || ''
                                            : state1.address.value
                                        : state2.address.value
                                }
                                disabled={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? true
                                            : false
                                        : false
                                }
                                style={
                                    type === 'add'
                                        ? {
                                              border: `${
                                                  state1.address.error ? '1px solid red' : ''
                                              }`,
                                          }
                                        : {
                                              border: `${
                                                  state2.address.error ? '1px solid red' : ''
                                              }`,
                                          }
                                }
                            />
                            {type === 'add'
                                ? state1.address.error && (
                                      <p style={errorStyle}>{state1.address.error}</p>
                                  )
                                : state2.address.error && (
                                      <p style={errorStyle}>{state2.address.error}</p>
                                  )}
                        </div>
                    </div>

                    <div className='col-lg-4 col-md-4 col-sm-12'>
                        <div className='form-group'>
                            <label>
                                City <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                name='city'
                                className='form-control'
                                onChange={type === 'add' ? handleOnChange1 : handleOnChange2}
                                value={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? mainAddress?.city || ''
                                            : state1.city.value
                                        : state2.city.value
                                }
                                disabled={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? true
                                            : false
                                        : false
                                }
                                style={
                                    type === 'add'
                                        ? { border: `${state1.city.error ? '1px solid red' : ''}` }
                                        : { border: `${state2.city.error ? '1px solid red' : ''}` }
                                }
                            />
                            {type === 'add'
                                ? state1.city.error && <p style={errorStyle}>{state1.city.error}</p>
                                : state2.city.error && (
                                      <p style={errorStyle}>{state2.city.error}</p>
                                  )}
                        </div>
                    </div>

                    <div className='col-lg-4 col-md-4 col-sm-12'>
                        <div className='form-group'>
                            <label>
                                Province <span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                name='province'
                                className='form-control'
                                onChange={type === 'add' ? handleOnChange1 : handleOnChange2}
                                value={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? mainAddress?.province || ''
                                            : state1.province.value
                                        : state2.province.value
                                }
                                disabled={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? true
                                            : false
                                        : false
                                }
                                style={
                                    type === 'add'
                                        ? {
                                              border: `${
                                                  state1.province.error ? '1px solid red' : ''
                                              }`,
                                          }
                                        : {
                                              border: `${
                                                  state2.province.error ? '1px solid red' : ''
                                              }`,
                                          }
                                }
                            />
                            {type === 'add'
                                ? state1.province.error && (
                                      <p style={errorStyle}>{state1.province.error}</p>
                                  )
                                : state2.province.error && (
                                      <p style={errorStyle}>{state2.province.error}</p>
                                  )}
                        </div>
                    </div>

                    <div className='col-lg-4 col-md-4 col-sm-12'>
                        <div className='form-group'>
                            <label>
                                Postcode<span className='required'>*</span>
                            </label>
                            <input
                                type='text'
                                name='postcode'
                                className='form-control'
                                onChange={type === 'add' ? handleOnChange1 : handleOnChange2}
                                value={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? mainAddress?.postcode || ''
                                            : state1.postcode.value
                                        : state2.postcode.value
                                }
                                disabled={
                                    type === 'add'
                                        ? !formAddress.value || formAddress.id
                                            ? true
                                            : false
                                        : false
                                }
                                style={
                                    type === 'add'
                                        ? {
                                              border: `${
                                                  state1.postcode.error ? '1px solid red' : ''
                                              }`,
                                          }
                                        : {
                                              border: `${
                                                  state2.postcode.error ? '1px solid red' : ''
                                              }`,
                                          }
                                }
                            />
                            {type === 'add'
                                ? state1.postcode.error && (
                                      <p style={errorStyle}>{state1.postcode.error}</p>
                                  )
                                : state2.postcode.error && (
                                      <p style={errorStyle}>{state2.postcode.error}</p>
                                  )}
                        </div>
                    </div>

                    {type === 'add' ? (
                        !formAddress.id && formAddress.value ? null : (
                            <div className='col-lg-12 col-md-12'>
                                <div className='form-group'>
                                    <textarea
                                        name='notes'
                                        cols='30'
                                        rows='4'
                                        placeholder='Order Notes'
                                        className='form-control'
                                    ></textarea>
                                </div>
                            </div>
                        )
                    ) : null}
                </div>
                <div className='row justify-content-center mb-3'>
                    {type === 'add' ? (
                        !formAddress.id && formAddress.value ? (
                            <>
                                <button
                                    type='button'
                                    className='btn btn-primary mt-3 mr-3'
                                    onClick={() => setFormAddress({ ...formAddress, value: false })}
                                >
                                    Cancel
                                </button>
                                <button
                                    type='button'
                                    className='btn btn-primary mt-3'
                                    disabled={disable1}
                                    onClick={() => handleFormAddress('add')}
                                >
                                    Submit New Address
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type='button'
                                    className='btn btn-primary mt-3 mr-3'
                                    onClick={() => {
                                        setFormAddress({ ...formAddress, value: true });
                                    }}
                                >
                                    Add New Address
                                </button>
                                {Object.keys(address || {}).length === 0 ? null : (
                                    <button
                                        type='button'
                                        className='btn btn-primary mt-3'
                                        data-toggle='modal'
                                        data-target='#choose_address'
                                    >
                                        Choose Another Address
                                    </button>
                                )}
                            </>
                        )
                    ) : null}
                </div>
            </>
        );
    };

    const handleFormAddress = (type) => {
        const { recipient_name, recipient_phone, city, province, address, postcode } =
            type === 'add' ? state1 : state2;
        if (type === 'add') {
            setFormAddress({ ...formAddress, value: false });
            const body = {
                recipientName: `${recipient_name.value}`,
                recipientPhone: recipient_phone.value,
                city: city.value,
                province: province.value,
                address: address.value,
                postcode: postcode.value,
                userId: id,
            };
            dispatch(addAddress(body));
        } else {
            const body = {
                recipient_name: `${recipient_name.value}`,
                recipient_phone: recipient_phone.value,
                city: city.value,
                province: province.value,
                address: address.value,
                postcode: postcode.value,
                user_id: id,
            };
            dispatch(editAddress(body, body.user_id, formAddress.id));
        }
    };

    const handleSubmit = () => {
        console.log('Form submitted.');
    };

    const handleEditAddress = (id, item) => {
        setFormAddress({ id, value: true });
        const { recipient_name, recipient_phone, address, city, province, phone, postcode } = item;
        state2.recipient_name = { ...state2.recipient_name, value: recipient_name };
        state2.recipient_phone = { ...state2.recipient_phone, value: recipient_phone };
        state2.address = { ...state2.address, value: address };
        state2.city = { ...state2.city, value: city };
        state2.province = { ...state2.province, value: province };
        state2.phone = { ...state2.phone, value: phone };
        state2.postcode = { ...state2.postcode, value: postcode };
    };

    return (
        <section className='checkout-area p-5'>
            <div className='container'>
                {cart !== 'Your cart is empty' ? (
                    <div>
                        <div className='billing-details'>
                            <h3 className='title'>Billing Details</h3>
                            {renderFormInput('add')}
                        </div>
                        <OrderSummary
                            disabled={Object.keys(mainAddress || {}).length === 0 ? true : false}
                            stateData={state1}
                            user_id={id}
                        />
                        <ModalComp
                            modal_id='choose_address'
                            title='Choose Address'
                            body={address.map((item, index) => {
                                return (
                                    <div key={index} className='card mb-3'>
                                        <div className='card-body'>
                                            <div className='row justify-content-between mx-0'>
                                                <h4>{item.recipient_name}</h4>
                                                <p>{item.recipient_phone}</p>
                                            </div>
                                            <p>
                                                {item.address}, {item.city}, {item.province}{' '}
                                                {item.postcode}
                                            </p>
                                            <button
                                                type='button'
                                                className='btn btn-primary'
                                                data-dismiss='modal'
                                                onClick={() =>
                                                    dispatch(
                                                        editUser(
                                                            { main_address_id: item.id },
                                                            id,
                                                            'users'
                                                        )
                                                    )
                                                }
                                            >
                                                Choose Address
                                            </button>
                                            <button
                                                type='button'
                                                className='btn btn-primary ml-3'
                                                data-toggle='modal'
                                                data-dismiss='modal'
                                                data-target='#edit_address'
                                                onClick={() => handleEditAddress(item.id, item)}
                                            >
                                                Edit Address
                                            </button>
                                        </div>
                                        <div className='card-footer'></div>
                                    </div>
                                );
                            })}
                        />
                        <ModalComp
                            modal_id='edit_address'
                            title='Edit Address'
                            body={renderFormInput('edit')}
                            data_backdrop='static'
                            data_keyboard={true}
                            footer={
                                <div>
                                    <button
                                        type='button'
                                        className='btn btn-primary mr-3'
                                        data-dismiss='modal'
                                        onClick={() => setFormAddress({ value: false, id: null })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        disabled={disable2}
                                        data-dismiss='modal'
                                        onClick={() => handleFormAddress('edit')}
                                    >
                                        Submit
                                    </button>
                                </div>
                            }
                        />
                    </div>
                ) : (
                    <div className='alert alert-danger text-center'>
                        You doesn't have item in the cart. You can't checkout anything. Please try
                        again!
                    </div>
                )}
            </div>
        </section>
    );
};
export default CheckoutComp;
