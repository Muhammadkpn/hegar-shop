import {
    getAddress,
    getMainAddress,
    addAddress,
    editAddress,
    deleteAddress,
    editUser,
    getStore,
    editStore,
    getStoreAddress,
    addStoreAddress,
    editStoreAddress,
    deleteStoreAddress,
    getSubdistrict,
    getCity,
    getProvince,
} from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import ModalComp from '../Common/modalComp';
import useForm from '../Common/useForm';

const Addresses = ({ type }) => {
    const [addModal, setAddModal] = React.useState(null);
    const [edit, setEdit] = React.useState(null);
    const [dataSubdistrict, setDataSubdistrict] = React.useState({});
    const [dataCity, setDataCity] = React.useState({});
    const [dataProvince, setDataProvince] = React.useState({});

    const stateSchema = {
        recipient_name: { value: '', error: '' },
        recipient_phone: { value: '', error: '' },
        address: { value: '', error: '' },
        postcode: { value: '', error: '' },
    };
    const validationStateSchema = {
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
        postcode: {
            required: true,
            validator: {
                regEx: /^\d{5}$|^\d{5}-\d{4}$/,
                error: 'Invalid zip format, use like 12345.',
            },
        },
    };
    const errorStyle = {
        color: 'red',
        fontSize: '13px',
    };
    const { id, address, mainAddress, storeAddress, stores, province, city, subdistrict } =
        useSelector((state) => {
            return {
                id: state.users.id,
                address: state.address.address,
                mainAddress: state.address.mainAddress,
                storeAddress: state.address.storeAddress,
                stores: state.profile.stores,
                province: state.shipping.province,
                city: state.shipping.city,
                subdistrict: state.shipping.subdistrict,
            };
        });
    const dispatch = useDispatch();
    React.useEffect(() => {
        if (type === 'store-address') {
            dispatch(getStoreAddress(id));
            dispatch(getStore(id));
        } else if ('user-address') {
            dispatch(getAddress('type=user-id', id));
            dispatch(getMainAddress(id));
        }
        dispatch(getProvince());
    }, []);

    React.useEffect(() => {
        state.recipient_name = { value: '', error: '' };
        state.recipient_phone = { value: '', error: '' };
        state.address = { value: '', error: '' };
        state.postcode = { value: '', error: '' };
    }, [addModal]);

    React.useEffect(() => {
        const { province_id } = dataProvince;
        if (province_id) {
            dispatch(getCity(`provinceId=${province_id}`));
        }

        const { city_id } = dataCity;
        if (province_id && city_id) {
            dispatch(getSubdistrict(`cityId=${city_id}`));
        }
        dispatch(getProvince());
    }, [dataProvince, dataCity, dataSubdistrict]);

    $(function () {
        $('[data-toggle=tooltip]').tooltip();
    });

    const { state, handleOnChange, handleOnSubmit, disable } = useForm(
        stateSchema,
        validationStateSchema,
        handleSubmit
    );

    const handleSubmit = () => {
        console.log('Form submitted.');
    };

    const handleSearch = (e) => {
        if (type === 'store-address') {
            e.target.value.length === 0
                ? dispatch(getStoreAddress(id))
                : dispatch(getStoreAddress(id, `search=${e.target.value}`));
        } else if (type === 'user-address') {
            e.target.value.length === 0
                ? dispatch(getAddress('type=user-id', id))
                : dispatch(getAddress('type=filter-address', id, `filter=${e.target.value}`));
        }
    };

    const handleAddAddress = () => {
        const { recipient_name, recipient_phone, address, postcode } = state;
        const { province, province_id } = dataProvince;
        const { city, city_id } = dataCity;
        const { subdistrict, subdistrict_id } = dataSubdistrict;
        
        const body = {
            recipientName: `${recipient_name.value}`,
            recipientPhone: recipient_phone.value,
            subdistrict: subdistrict,
            subdistrictId: subdistrict_id,
            city: city,
            cityId: city_id,
            province: province,
            provinceId: province_id,
            address: address.value,
            postcode: postcode.value,
            userId: id,
        };
        setAddModal(false);
        if (type === 'store-address') {
            dispatch(addStoreAddress(body, id));
        } else if (type === 'user-address') {
            dispatch(addAddress(body));
        }
    };

    const handleEditAddress = () => {
        const { recipient_name, recipient_phone, address, postcode } = state;
        const { province, province_id } = dataProvince;
        const { city, city_id } = dataCity;
        const { subdistrict, subdistrict_id } = dataSubdistrict;

        const body = {
            recipient_name: `${recipient_name.value}`,
            recipient_phone: recipient_phone.value,
            subdistrict,
            subdistrict_id,
            city,
            city_id,
            province,
            province_id,
            address: address.value,
            postcode: postcode.value,
            user_id: id,
        };
        if (type === 'store-address') {
            dispatch(editStoreAddress(body, body.user_id, edit));
        } else if (type === 'user-address') {
            dispatch(editAddress(body, body.user_id, edit));
        }
    };

    const handleFormEdit = (item) => {
        setEdit(item.id);
        const {
            recipient_name,
            recipient_phone,
            address,
            subdistrict,
            subdistrict_id,
            city,
            city_id,
            province,
            province_id,
            phone,
            postcode,
        } = item;
        state.recipient_name = { ...state.recipient_name, value: recipient_name };
        state.recipient_phone = { ...state.recipient_phone, value: recipient_phone };
        state.address = { ...state.address, value: address };
        state.phone = { ...state.phone, value: phone };
        state.postcode = { ...state.postcode, value: postcode };

        setDataProvince({ province, province_id });
        setDataCity({ city, city_id });
        setDataSubdistrict({ subdistrict, subdistrict_id });
        $('#edit_address').modal();
    };

    const renderFormAddress = (type) => {
        return (
            <div className='row'>
                <div className='col-sm-12 col-lg-6'>
                    <div className='form-group'>
                        <label>
                            Recipient's Name <span className='required'>*</span>
                        </label>
                        <input
                            type='text'
                            name='recipient_name'
                            className='form-control'
                            onChange={handleOnChange}
                            value={state.recipient_name.value}
                            style={{
                                border: `${state.recipient_name.error ? '1px solid red' : ''}`,
                            }}
                        />
                        {state.recipient_name.error && (
                            <p style={errorStyle}>{state.recipient_name.error}</p>
                        )}
                    </div>
                </div>

                <div className='col-sm-12 col-lg-6'>
                    <div className='form-group'>
                        <label>
                            Recipient's Phone <span className='required'>*</span>
                        </label>
                        <input
                            type='text'
                            name='recipient_phone'
                            className='form-control'
                            onChange={handleOnChange}
                            value={state.recipient_phone.value}
                            style={{
                                border: `${state.recipient_phone.error ? '1px solid red' : ''}`,
                            }}
                        />
                        {state.recipient_phone.error && (
                            <p style={errorStyle}>{state.recipient_phone.error}</p>
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
                            onChange={handleOnChange}
                            value={state.address.value}
                            style={{ border: `${state.address.error ? '1px solid red' : ''}` }}
                        />
                        {state.address.error && <p style={errorStyle}>{state.address.error}</p>}
                    </div>
                </div>

                <div className='col-lg-6 col-sm-12'>
                    <div className='form-group'>
                        <label>
                            Province <span className='required'>*</span>
                        </label>
                        <div className='dropdown'>
                            <button
                                className='form-control d-flex justify-content-between align-items-center px-3 overflow-auto dropdown-toggle'
                                type='button'
                                id='dropdownProvince'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                {dataProvince?.province || 'Select Province'}
                            </button>
                            <div className='dropdown-menu' aria-labelledby='dropdownProvince'>
                                {province.map((item, index) => {
                                    return (
                                        <button
                                            className='btn dropdown-item'
                                            onClick={() => {
                                                setDataProvince({
                                                    province_id: item.province_id,
                                                    province: item.province,
                                                });
                                                setDataCity({
                                                    city_id: null,
                                                    city: '',
                                                });
                                                setDataSubdistrict({
                                                    subdistrict_id: null,
                                                    subdistrict: '',
                                                });
                                            }}
                                            key={index}
                                        >
                                            {item.province}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 col-sm-12'>
                    <div className='form-group'>
                        <label>
                            City <span className='required'>*</span>
                        </label>
                        <div className='dropdown'>
                            <button
                                className='form-control d-flex justify-content-between align-items-center px-3 overflow-auto dropdown-toggle'
                                type='button'
                                id='dropdownCity'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                                disabled={!dataProvince?.province_id}
                            >
                                {dataCity?.city || 'Select City'}
                            </button>
                            <div className='dropdown-menu' aria-labelledby='dropdownCity'>
                                {(city || []).map((item, index) => {
                                    return (
                                        <button
                                            className='btn dropdown-item'
                                            onClick={() => {
                                                setDataCity({
                                                    city_id: item.city_id,
                                                    city: item.city_name,
                                                });
                                                setDataSubdistrict({
                                                    subdistrict_id: null,
                                                    subdistrict: '',
                                                });
                                            }}
                                            key={index}
                                        >
                                            {item.city_name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 col-sm-12'>
                    <div className='form-group'>
                        <label>
                            Subdistrict <span className='required'>*</span>
                        </label>
                        <div className='dropdown'>
                            <button
                                className='form-control d-flex justify-content-between align-items-center px-3 overflow-auto dropdown-toggle'
                                type='button'
                                id='dropdownSubdistrict'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                                disabled={!dataCity?.city_id}
                            >
                                {dataSubdistrict?.subdistrict || 'Select Subdistrict'}
                            </button>
                            <div className='dropdown-menu' aria-labelledby='dropdownSubdistrict'>
                                {(subdistrict || []).map((item, index) => {
                                    return (
                                        <button
                                            className='btn dropdown-item'
                                            onClick={() => {
                                                setDataSubdistrict({
                                                    subdistrict_id: item.subdistrict_id,
                                                    subdistrict: item.subdistrict_name,
                                                });
                                            }}
                                            key={index}
                                        >
                                            {item.subdistrict_name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='col-lg-6 col-sm-12'>
                    <div className='form-group'>
                        <label>
                            Postcode<span className='required'>*</span>
                        </label>
                        <input
                            type='text'
                            name='postcode'
                            className='form-control'
                            onChange={handleOnChange}
                            value={state.postcode.value}
                            style={{ border: `${state.postcode.error ? '1px solid red' : ''}` }}
                        />
                        {state.postcode.error && <p style={errorStyle}>{state.postcode.error}</p>}
                    </div>
                </div>

                <div className='col-lg-12 col-md-6'>
                    <button
                        type='button'
                        className='btn btn-primary d-block mx-auto'
                        // disabled={disable || !dataProvince?.province_id || !dataCity?.city_id || !dataSubdistrict?.subdistrict_id}
                        // disabled={disable}
                        data-dismiss='modal'
                        onClick={() => (type === 'Add' ? handleAddAddress() : handleEditAddress())}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='addresses-container'>
            {type === 'user-address' ? <h3 className='p-2'>Addresses</h3> : null}
            <div className='row justify-content-between align-items-center pb-3'>
                <div className='col-md-5 col-sm-8'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search name or phone'
                            onChange={(e) => handleSearch(e)}
                        />
                        <div className='input-group-append'>
                            <button type='button' className='btn btn-primary'>
                                <i className='bx bx-search-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='col-md-5 col-sm-8 d-flex justify-content-end'>
                    <button
                        type='button'
                        className='btn btn-primary'
                        data-toggle='modal'
                        data-target='#add_address'
                        onClick={() => setAddModal(true)}
                    >
                        Add Address
                    </button>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-hover table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='text-center align-middle'>Main Address</th>
                            <th className='align-middle'>Recipient Name</th>
                            <th className='align-middle'>Recipient Phone</th>
                            <th className='align-middle'>Address</th>
                            <th className='align-middle'>Subdistrict</th>
                            <th className='align-middle'>City</th>
                            <th className='align-middle'>Province</th>
                            <th className='align-middle'>Postcode</th>
                            <th className='text-center align-middle'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(type === 'user-address' ? address : storeAddress).map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='text-center align-middle'>
                                        <input
                                            type='radio'
                                            name='mainAddress'
                                            value={item.id}
                                            checked={
                                                type === 'store-address'
                                                    ? stores.main_address_id === item.id
                                                    : mainAddress?.id === item.id
                                            }
                                            onChange={(e) =>
                                                type === 'store-address'
                                                    ? dispatch(
                                                          editStore(
                                                              { main_address_id: item.id },
                                                              id
                                                          )
                                                      )
                                                    : dispatch(
                                                          editUser(
                                                              { main_address_id: item.id },
                                                              id,
                                                              'users'
                                                          )
                                                      )
                                            }
                                        />
                                    </td>
                                    <td className='align-middle'>{item.recipient_name}</td>
                                    <td className='align-middle'>{item.recipient_phone}</td>
                                    <td className='align-middle'>{item.address}</td>
                                    <td className='align-middle'>{item.subdistrict}</td>
                                    <td className='align-middle'>{item.city}</td>
                                    <td className='align-middle'>{item.province}</td>
                                    <td className='align-middle'>{item.postcode}</td>
                                    <td className='text-center align-middle'>
                                        <button
                                            type='button'
                                            className='btn'
                                            data-toggle='tooltip'
                                            data-placement='right'
                                            title='Edit'
                                            onClick={() => handleFormEdit(item)}
                                        >
                                            <i className='bx bxs-pencil'></i>
                                        </button>
                                        <button
                                            type='button'
                                            className='btn'
                                            data-toggle='tooltip'
                                            data-placement='right'
                                            title='Delete'
                                            onClick={() =>
                                                type === 'store-address'
                                                    ? dispatch(deleteStoreAddress(id, item.id))
                                                    : dispatch(deleteAddress(id, item.id))
                                            }
                                        >
                                            <i className='bx bxs-trash-alt'></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {type === 'user-address' && address.length === 0 ? (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={8}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        ) : null}
                        {type === 'store-address' && storeAddress.length === 0 ? (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={8}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
            <ModalComp modal_id='add_address' title='Add Address' body={renderFormAddress('Add')} />
            <ModalComp
                modal_id='edit_address'
                title='Edit Address'
                body={renderFormAddress('Edit')}
                data_backdrop='static'
                data_keyboard={true}
            />
        </div>
    );
};

export default Addresses;
