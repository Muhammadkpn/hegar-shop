import React, { forwardRef } from 'react';
import {
    editUser,
    editPassword,
    uploadPic,
    editKtp,
} from '../../store/action';
import { getFullImageUrl } from '../../store/helpers';
import { useDispatch, useSelector } from 'react-redux';
import ModalComp from '../../components/Common/modalComp';
import DatePicker from 'react-datepicker';

const AccountDetails = () => {
    const [general, setGeneral] = React.useState({
        type: 'get',
        username: '',
        phone: '',
        email: '',
    });
    const [ktpInfo, setKtpInfo] = React.useState({
        type: 'get',
        image: '',
        full_name: '',
        ktp_number: '',
        gender: '',
        birthplace: '',
        birthdate: '',
        address: '',
    });

    const [birthdate, setBirthdate] = React.useState('');
    const [password, setPassword] = React.useState({
        type: 'get',
        old_pass: '',
        new_pass: '',
        conf_new_pass: '',
    });
    const [visible1, setVisible1] = React.useState(null);
    const [visible2, setVisible2] = React.useState(null);
    const [visible3, setVisible3] = React.useState(null);
    const regexEmail =
        /^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/;
    const regexPhone = /^0\d{10,11}$/;
    const { id, userById, ktp, alertPassword, alertKtp } = useSelector((state) => {
        return {
            id: state.users.id,
            userById: state.users.userById,
            alertPassword: state.users.alertPassword,
            ktp: state.profile.ktp,
            alertKtp: state.profile.alertKtp,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        setKtpInfo({ ...ktpInfo, ...ktp });
        setGeneral({
            ...general,
            username: userById.username,
            email: userById.email,
            phone: userById.phone,
        });
    }, [userById, ktp]);

    const handleUpload = (props) => {
        let fileProps = props.target.files[0];
        let data = new FormData();
        data.append('IMG', fileProps);
        dispatch(uploadPic('image', data));
    };

    const handleUploadKtp = (props) => {
        let fileProps = props.target.files[0];
        let data = new FormData();
        data.append('IMG', fileProps);
        dispatch(uploadPic('ktp', data));
    };

    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <label>
            <button
                type='button'
                className='btn btn-calendar'
                onClick={onClick}
                disabled={ktpInfo.type === 'get'}
                ref={ref}
            >
                <i className='fas fa-calendar-alt pr-4 mr-1'></i>
                {`${
                    ktpInfo.type === 'get'
                        ? new Date(ktp.birthdate).toLocaleDateString('gb-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                          }) || ''
                        : birthdate.toLocaleDateString('gb-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                          })
                }`}
            </button>
        </label>
    ));

    const renderViewKtp = () => {
        if (ktp.ktp_image) {
            return <img className='img' src={getFullImageUrl(ktp.ktp_image)} />;
        } else {
            return <p className='text-center'>You haven't upload ktp. Please upload your ktp!</p>;
        }
    };

    return (
        <div className='account-details-container'>
            <img
                src={
                    userById.image ? getFullImageUrl(userById.image) : getFullImageUrl('image/users/avatar.jpg')
                }
                className='img-account-details img-circle'
            />
            <div className='input-group mt-2'>
                <input
                    type='file'
                    className='d-none'
                    id='customFile'
                    accept='image/*'
                    type='file'
                    onChange={handleUpload}
                />
                <button type='button' className='btn btn-primary mx-auto'>
                    <label htmlFor='customFile' className='m-0'>
                        <i className='bx bxs-camera mr-2'></i>Upload
                    </label>
                </button>
            </div>
            <h4 className='border-bottom my-3'>General Information</h4>
            <form className='general-info'>
                <div className='form-group'>
                    <label htmlFor='usernameForm'>Username</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={general.type === 'get'}
                            >
                                <i className='fas fa-user-alt'></i>
                            </button>
                        </div>
                        <input
                            id='usernameForm'
                            type='text'
                            name='username'
                            className='form-control'
                            onChange={(e) => setGeneral({ ...general, username: e.target.value })}
                            value={general.username || ''}
                            disabled={general.type === 'get'}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                        />
                        {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='emailForm'>Email</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={general.type === 'get'}
                            >
                                <i className='fas fa-envelope'></i>
                            </button>
                        </div>
                        <input
                            id='emailForm'
                            type='text'
                            name='email'
                            className='form-control'
                            onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                            value={general.email || ''}
                            disabled={general.type === 'get'}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                        />
                        {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='phoneForm'>Phone</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={general.type === 'get'}
                            >
                                <i className='fas fa-phone'></i>
                            </button>
                        </div>
                        <input
                            id='phoneForm'
                            type='text'
                            name='phone'
                            className='form-control'
                            onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                            value={general.phone || ''}
                            disabled={general.type === 'get'}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                        />
                        {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                    </div>
                </div>
                {general.type === 'get' ? (
                    <button
                        type='button'
                        className='btn btn-primary d-block mx-auto'
                        onClick={() =>
                            setGeneral({
                                type: 'edit',
                                username: userById?.username,
                                email: userById?.email,
                                phone: userById?.phone,
                            })
                        }
                    >
                        Edit General Info
                    </button>
                ) : (
                    <div className='row justify-content-center'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            onClick={() => {
                                setGeneral({ ...general, type: 'get' });
                                dispatch(
                                    editUser(
                                        {
                                            username: general.username,
                                            email: general.email,
                                            phone: general.phone,
                                        },
                                        id,
                                        'users'
                                    )
                                );
                            }}
                            disabled={
                                general?.username.length < 6 ||
                                !regexEmail.test(general.email) ||
                                !regexPhone.test(general.phone) ||
                                (userById?.username === general.username &&
                                    userById?.email === general.email &&
                                    userById?.phone === general.phone)
                            }
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => setGeneral({ ...general, type: 'get' })}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
            <h4 className='border-bottom my-3'>KTP Information</h4>
            <form className='profile-info'>
                {Object.keys(ktp).length > 0 ? (
                    ktp.ktp_status_id === 1 ? (
                        <div className={`alert alert-success`} role='alert'>
                            Your ktp has been verified
                        </div>
                    ) : (
                        <div className={`alert alert-danger`} role='alert'>
                            Your ktp not verified
                        </div>
                    )
                ) : null}
                <div>
                    {ktpInfo.type === 'get' ? (
                        <button
                            type='button'
                            className='btn btn-primary d-block mx-auto'
                            data-toggle='modal'
                            data-target='#view-ktp-image'
                        >
                            <i className='far fa-id-card mr-2'></i>View KTP Image
                        </button>
                    ) : (
                        <div className='input-group mt-2'>
                            <input
                                type='file'
                                className='d-none'
                                id='btn-upload-ktp'
                                accept='image/*'
                                type='file'
                                onChange={handleUploadKtp}
                            />
                            <button type='button' className='btn btn-primary mx-auto'>
                                <label htmlFor='btn-upload-ktp' className='m-0'>
                                    <i className='bx bxs-camera mr-2'></i>Upload KTP
                                </label>
                            </button>
                        </div>
                    )}
                </div>
                {alertKtp ? (
                    <div className='alert alert-danger mt-2' role='alert'>
                        {alertKtp}
                    </div>
                ) : null}
                <div className='form-group'>
                    <label htmlFor='fullNameForm'>Full Name</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={ktpInfo.type === 'get'}
                            >
                                <i className='fas fa-user-alt'></i>
                            </button>
                        </div>
                        <input
                            id='fullNameForm'
                            type='text'
                            name='full_name'
                            className='form-control'
                            onChange={(e) => setKtpInfo({ ...ktpInfo, full_name: e.target.value })}
                            value={ktpInfo.type === 'get' ? (ktp.full_name || '') : ktpInfo.full_name}
                            disabled={ktpInfo.type === 'get'}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                        />
                        {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group'>
                            <label htmlFor='ktpNumberForm'>KTP Number</label>
                            <div className='input-group'>
                                <div className='input-group-prepend'>
                                    <button
                                        type='button'
                                        className='btn btn-outline-primary'
                                        disabled={ktpInfo.type === 'get'}
                                    >
                                        <i className='fas fa-id-card'></i>
                                    </button>
                                </div>
                                <input
                                    id='ktpNumberForm'
                                    type='text'
                                    name='ktp_number'
                                    className='form-control'
                                    onChange={(e) =>
                                        setKtpInfo({
                                            ...ktpInfo,
                                            ktp_number: e.target.value,
                                        })
                                    }
                                    value={
                                        ktpInfo.type === 'get' ? (ktp.ktp_number || '') : ktpInfo.ktp_number
                                    }
                                    disabled={ktpInfo.type === 'get'}
                                    // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                                />
                                {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='form-group'>
                            <label htmlFor='genderForm'>Gender</label>
                            {ktpInfo.type === 'get' ? (
                                <div className='input-group'>
                                    <div className='input-group-prepend'>
                                        <button
                                            type='button'
                                            className='btn btn-outline-primary'
                                            disabled={ktpInfo.type === 'get'}
                                        >
                                            <i className='fas fa-user-friends'></i>
                                        </button>
                                    </div>
                                    <input
                                        id='genderForm'
                                        type='text'
                                        name='gender'
                                        className='form-control'
                                        onChange={(e) =>
                                            setKtpInfo({
                                                ...ktpInfo,
                                                gender: e.target.value,
                                            })
                                        }
                                        value={ktpInfo.type === 'get' ? (ktp.gender || '') : ktpInfo.gender}
                                        disabled={ktpInfo.type === 'get'}
                                        // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                                    />
                                    {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                                </div>
                            ) : (
                                <div className='row no-gutters'>
                                    <div className='form-check mr-2'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            name='exampleRadios'
                                            id='maleRadio'
                                            value='Male'
                                            checked={ktpInfo.gender === 'Male'}
                                            onChange={(e) =>
                                                setKtpInfo({
                                                    ...ktpInfo,
                                                    gender: e.target.value,
                                                })
                                            }
                                        />
                                        <label className='form-check-label' htmlFor='maleRadio'>
                                            Male
                                        </label>
                                    </div>
                                    <div className='form-check'>
                                        <input
                                            className='form-check-input'
                                            type='radio'
                                            name='exampleRadios'
                                            id='femaleRadio'
                                            value='Female'
                                            checked={ktpInfo.gender === 'Female'}
                                            onChange={(e) =>
                                                setKtpInfo({
                                                    ...ktpInfo,
                                                    gender: e.target.value,
                                                })
                                            }
                                        />
                                        <label className='form-check-label' htmlFor='femaleRadio'>
                                            Female
                                        </label>
                                    </div>
                                </div>
                            )}
                            {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group'>
                            <label htmlFor='birthplaceForm'>Birthplace</label>
                            <div className='input-group'>
                                <div className='input-group-prepend'>
                                    <button
                                        type='button'
                                        className='btn btn-outline-primary'
                                        disabled={ktpInfo.type === 'get'}
                                    >
                                        <i className='fas fa-hospital'></i>
                                    </button>
                                </div>
                                <input
                                    id='birthplaceForm'
                                    type='text'
                                    name='birthplace'
                                    className='form-control'
                                    onChange={(e) =>
                                        setKtpInfo({
                                            ...ktpInfo,
                                            birthplace: e.target.value,
                                        })
                                    }
                                    value={
                                        ktpInfo.type === 'get' ? (ktp.birthplace || '') : ktpInfo.birthplace
                                    }
                                    disabled={ktpInfo.type === 'get'}
                                    // style={{border: `${state.birthplace.error ? '1px solid red' : ''}`}}
                                />
                                {/* {state.birthplace.error && <p style={errorStyle}>{state.birthplace.error}</p>} */}
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-12 col-md-6'>
                        <div className='form-group'>
                            <label htmlFor='birthdateForm'>Birth Date</label>
                            <div
                                className='border border-secondary rounded h-100'
                                style={
                                    ktpInfo.type === 'get'
                                        ? {
                                              backgroundColor: '#E9ECEF',
                                          }
                                        : {}
                                }
                            >
                                <DatePicker
                                    dateFormat='mm/dd/yyyy'
                                    selected={birthdate}
                                    onChange={(update) => setBirthdate(update)}
                                    maxDate={new Date()}
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode='select'
                                    customInput={<CustomInput />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='addressForm'>Address</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={ktpInfo.type === 'get'}
                            >
                                <i className='fas fa-calendar-alt'></i>
                            </button>
                        </div>
                        <input
                            id='addressForm'
                            type='text'
                            name='ktp-address'
                            className='form-control'
                            onChange={(e) =>
                                setKtpInfo({
                                    ...ktpInfo,
                                    address: e.target.value,
                                })
                            }
                            value={ktpInfo.type === 'get' ? (ktp.address || '') : ktpInfo.address}
                            disabled={ktpInfo.type === 'get'}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                        />
                        {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                    </div>
                </div>
                {ktpInfo.type === 'get' ? (
                    <button
                        type='button'
                        className='btn btn-primary d-block mx-auto'
                        onClick={() => {
                            setKtpInfo({
                                type: 'edit',
                                full_name: ktp.full_name,
                                image: ktp.image,
                                ktp_number: ktp.ktp_number,
                                gender: ktp.gender,
                                birthplace: ktp.birthplace,
                                // birthdate: new Date(ktp.birthplace).toLocaleDateString(),
                                address: ktp.address,
                            });
                            setBirthdate(new Date());
                        }}
                        disabled={Object.keys(ktp).length > 0 && ktp.ktp_status_id === 1}
                    >
                        Edit KTP Info
                    </button>
                ) : (
                    <div className='row justify-content-center'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            onClick={() => {
                                setKtpInfo({ ...ktpInfo, type: 'get' });
                                const date = new Date(birthdate).toLocaleDateString('id-ID').split('/')
                                if (date[1] < 10) {
                                    date[1] = `0${date[1]}`
                                }
                                if (date[0] < 10) {
                                    date[0] = `0${date[0]}`
                                }
                                dispatch(
                                    editKtp(
                                        {
                                            full_name: ktpInfo.full_name,
                                            ktp_number: ktpInfo.ktp_number,
                                            gender: ktpInfo.gender,
                                            birthplace: ktpInfo.birthplace,
                                            birthdate: `${date[2]}-${date[1]}-${date[0]}`,
                                            address: ktpInfo.address,
                                        },
                                        id,
                                        ktp.user_id
                                    )
                                );
                            }}
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => setKtpInfo({ ...ktpInfo, type: 'get' })}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
            <h4 className='border-bottom my-3'>Password</h4>
            {alertPassword.length > 0 ? (
                <div
                    className={`alert ${
                        alertPassword === 'Password has been changed'
                            ? 'alert-success'
                            : 'alert-danger'
                    }`}
                >
                    {alertPassword}
                </div>
            ) : null}
            <form className='user-password'>
                <div className='form-group'>
                    <label htmlFor='old_pass'>
                        <p>Old Password</p>
                    </label>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={password.type === 'get'}
                                // style={{backgroundColor: password.type === 'get' ? '#E9ECEF' : ''}}
                            >
                                <i className='fas fa-lock'></i>
                            </button>
                        </div>
                        <input
                            id='old_pass'
                            type={visible1 ? 'text' : 'password'}
                            className='form-control'
                            placeholder='Password'
                            style={{ borderRight: 'none' }}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                            onChange={(e) => setPassword({ ...password, old_pass: e.target.value })}
                            value={password.old_pass || ''}
                            disabled={password.type === 'get'}
                        />
                        <div className='input-group-append'>
                            {visible1 ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible1(false)}
                                    disabled={password.type === 'get'}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible1(true)}
                                    disabled={password.type === 'get'}
                                >
                                    <i className='fas fa-eye-slash'></i>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                </div>
                <div className='form-group'>
                    <label htmlFor='new_pass'>
                        <p>New Password</p>
                    </label>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={password.type === 'get'}
                                // style={{backgroundColor: password.type === 'get' ? '#E9ECEF' : ''}}
                            >
                                <i className='fas fa-lock'></i>
                            </button>
                        </div>
                        <input
                            id='old_password'
                            type={visible2 ? 'text' : 'password'}
                            className='form-control'
                            placeholder='New Password'
                            style={{ borderRight: 'none' }}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                            onChange={(e) => setPassword({ ...password, new_pass: e.target.value })}
                            value={password.new_pass || ''}
                            disabled={password.type === 'get'}
                        />
                        <div className='input-group-append'>
                            {visible2 ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible2(false)}
                                    disabled={password.type === 'get'}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible2(true)}
                                    disabled={password.type === 'get'}
                                >
                                    <i className='fas fa-eye-slash'></i>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                </div>
                <div className='form-group'>
                    <label htmlFor='conf_new_pass'>
                        <p>Confirm New Password</p>
                    </label>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={password.type === 'get'}
                                // style={{backgroundColor: password.type === 'get' ? '#E9ECEF' : ''}}
                            >
                                <i className='fas fa-lock'></i>
                            </button>
                        </div>
                        <input
                            id='conf_new_pass'
                            type={visible3 ? 'text' : 'password'}
                            className='form-control'
                            placeholder='Confirm New Password'
                            style={{ borderRight: 'none' }}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                            onChange={(e) =>
                                setPassword({ ...password, conf_new_pass: e.target.value })
                            }
                            value={password.conf_new_pass || ''}
                            disabled={password.type === 'get'}
                        />
                        <div className='input-group-append'>
                            {visible3 ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible3(false)}
                                    disabled={password.type === 'get'}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible3(true)}
                                    disabled={password.type === 'get'}
                                >
                                    <i className='fas fa-eye-slash'></i>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                </div>
                {password.type === 'get' ? (
                    <button
                        type='button'
                        className='btn btn-primary d-block mx-auto'
                        onClick={() => setPassword({ ...password, type: 'edit' })}
                    >
                        Edit Password
                    </button>
                ) : (
                    <div className='row justify-content-center'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            onClick={() => {
                                setPassword({
                                    type: 'get',
                                    old_pass: '',
                                    new_pass: '',
                                    conf_new_pass: '',
                                });
                                dispatch(
                                    editPassword(
                                        {
                                            password: password.old_pass,
                                            newPassword: password.new_pass,
                                            confNewPassword: password.conf_new_pass,
                                        },
                                        id
                                    )
                                );
                            }}
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() =>
                                setPassword({
                                    type: 'get',
                                    old_pass: '',
                                    new_pass: '',
                                    conf_new_pass: '',
                                })
                            }
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
            <ModalComp modal_id='view-ktp-image' title='KTP Image' body={renderViewKtp()} />
        </div>
    );
};

export default AccountDetails;
