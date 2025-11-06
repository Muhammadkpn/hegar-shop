import React from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    editPassword,
    editUser,
    getBankAccountByUser,
    editBankAccount,
    addBankAccount,
    deleteBankAccount,
    getStore,
    getKtpById,
    editStore,
    getUserById,
} from '../../store/action';
import Addresses from '../Account/Addresses';
import ModalComp from '../Common/modalComp';

const StoreSettings = () => {
    const [visible, setVisible] = React.useState({
        visible1: null,
        visible2: null,
        visible3: null,
    });
    const [generalAccount, setGeneralAccount] = React.useState({
        type: 'get',
        store_name: '',
        email: '',
    });
    const [passwordAccount, setPasswordAccount] = React.useState({
        type: 'get',
        old_pass: '',
        new_pass: '',
        conf_new_pass: '',
    });
    const [bankAccountProfile, setBankAccountProfile] = React.useState({
        type: 'get',
        bank_id: null,
        bank_name: '',
        bank_branch: '',
        account_name: '',
        account_number: '',
        bank_image: '',
    });

    const { userById, user_id, role, stores, bankAccount } = useSelector((state) => {
        return {
            userById: state.users.userById,
            user_id: state.users.id,
            role: state.users.role,
            stores: state.profile.stores,
            bankAccount: state.profile.bankAccount,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getUserById(user_id));
        dispatch(getStore(user_id));
        dispatch(getKtpById(user_id));
        dispatch(getBankAccountByUser(user_id));
    }, []);

    const editGeneralAccount = () => {
        const { store_name, email } = generalAccount;
        dispatch(editUser({ email }, user_id, 'users'));
        dispatch(editStore({ store_name }, user_id));
        setGeneralAccount({
            type: 'get',
            username: '',
            email: '',
        });
    };

    const editPasswordAccount = () => {
        const { old_pass, new_pass, conf_new_pass } = passwordAccount;
        dispatch(
            editPassword(
                { password: old_pass, new_password: new_pass, conf_new_password: conf_new_pass },
                user_id
            )
        );
        setPasswordAccount({
            type: 'get',
            old_pass: '',
            new_pass: '',
            conf_new_pass: '',
        });
    };

    const MyAccountSection = () => {
        return (
            <form className='vendor-section'>
                <div className='form-group'>
                    <label htmlFor='fullNameForm'>Store Name</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={generalAccount.type === 'get' ? true : false}
                            >
                                <i className='fas fa-user'></i>
                            </button>
                        </div>
                        <input
                            type='text'
                            id='fullNameForm'
                            name='full_name'
                            className='form-control'
                            onChange={(e) =>
                                setGeneralAccount({ ...generalAccount, store_name: e.target.value })
                            }
                            value={
                                generalAccount.type === 'get'
                                    ? stores.store_name
                                    : generalAccount.store_name
                            }
                            disabled={generalAccount.type === 'get' ? true : false}
                        />
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='emailForm'>Email</label>
                    <div className='input-group'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={generalAccount.type === 'get' ? true : false}
                            >
                                <i className='bx bxs-envelope'></i>
                            </button>
                        </div>
                        <input
                            type='email'
                            id='emailForm'
                            name='email'
                            className='form-control'
                            value={
                                generalAccount.type === 'get' ? userById.email : generalAccount.email
                            }
                            onChange={(e) =>
                                setGeneralAccount({ ...generalAccount, email: e.target.value })
                            }
                            disabled={generalAccount.type === 'get' ? true : false}
                        />
                    </div>
                </div>
                {generalAccount.type === 'get' ? (
                    <button
                        type='button'
                        className='btn btn-primary d-block mx-auto'
                        onClick={() =>
                            setGeneralAccount({
                                ...generalAccount,
                                type: 'edit',
                                store_name: stores.store_name,
                                email: userById.email,
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
                            onClick={() => editGeneralAccount()}
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() =>
                                setGeneralAccount({
                                    type: 'get',
                                    store_name: '',
                                    email: '',
                                })
                            }
                        >
                            Cancel
                        </button>
                    </div>
                )}
                <div className='form-group'>
                    <label htmlFor='old_pass'>
                        <p>Old Password</p>
                    </label>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={passwordAccount.type === 'get' ? true : false}
                                // style={{backgroundColor: passwordAccount.type === 'get' ? '#E9ECEF' : ''}}
                            >
                                <i className='fas fa-lock'></i>
                            </button>
                        </div>
                        <input
                            id='old_pass'
                            type={visible.visible1 ? 'text' : 'password'}
                            className='form-control'
                            placeholder='Password'
                            style={{ borderRight: 'none' }}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                            onChange={(e) =>
                                setPasswordAccount({ ...passwordAccount, old_pass: e.target.value })
                            }
                            value={passwordAccount.old_pass}
                            disabled={passwordAccount.type === 'get' ? true : false}
                        />
                        <div className='input-group-append'>
                            {visible.visible1 ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible({ ...visible, visible1: false })}
                                    disabled={passwordAccount.type === 'get' ? true : false}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible({ ...visible, visible1: true })}
                                    disabled={passwordAccount.type === 'get' ? true : false}
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
                                disabled={passwordAccount.type === 'get' ? true : false}
                                // style={{backgroundColor: passwordAccount.type === 'get' ? '#E9ECEF' : ''}}
                            >
                                <i className='fas fa-lock'></i>
                            </button>
                        </div>
                        <input
                            id='old_password'
                            type={visible.visible2 ? 'text' : 'password'}
                            className='form-control'
                            placeholder='New Password'
                            style={{ borderRight: 'none' }}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                            onChange={(e) =>
                                setPasswordAccount({ ...passwordAccount, new_pass: e.target.value })
                            }
                            value={passwordAccount.new_pass}
                            disabled={passwordAccount.type === 'get' ? true : false}
                        />
                        <div className='input-group-append'>
                            {visible.visible2 ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible({ ...visible, visible2: false })}
                                    disabled={passwordAccount.type === 'get' ? true : false}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible({ ...visible, visible2: true })}
                                    disabled={passwordAccount.type === 'get' ? true : false}
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
                                disabled={passwordAccount.type === 'get' ? true : false}
                                // style={{backgroundColor: passwordAccount.type === 'get' ? '#E9ECEF' : ''}}
                            >
                                <i className='fas fa-lock'></i>
                            </button>
                        </div>
                        <input
                            id='conf_new_pass'
                            type={visible.visible3 ? 'text' : 'password'}
                            className='form-control'
                            placeholder='Confirm New Password'
                            style={{ borderRight: 'none' }}
                            // style={{border: `${state.address.error ? '1px solid red' : ''}`}}
                            onChange={(e) =>
                                setPasswordAccount({
                                    ...passwordAccount,
                                    conf_new_pass: e.target.value,
                                })
                            }
                            value={passwordAccount.conf_new_pass}
                            disabled={passwordAccount.type === 'get' ? true : false}
                        />
                        <div className='input-group-append'>
                            {visible.visible3 ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible({ ...visible, visible3: false })}
                                    disabled={passwordAccount.type === 'get' ? true : false}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    onClick={() => setVisible({ ...visible, visible3: true })}
                                    disabled={passwordAccount.type === 'get' ? true : false}
                                >
                                    <i className='fas fa-eye-slash'></i>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* {state.address.error && <p style={errorStyle}>{state.address.error}</p>} */}
                </div>
                {passwordAccount.type === 'get' ? (
                    <button
                        type='button'
                        className='btn btn-primary d-block mx-auto'
                        onClick={() =>
                            setPasswordAccount({
                                ...passwordAccount,
                                type: 'edit',
                                store_name: stores.store_name,
                                email: email,
                            })
                        }
                    >
                        Edit Password
                    </button>
                ) : (
                    <div className='row justify-content-center'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            onClick={() => editPasswordAccount()}
                        >
                            Save
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() =>
                                setPasswordAccount({
                                    type: 'get',
                                    username: '',
                                    email: '',
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
                { role === 2 ? 
                <Link href='/account'>
                    <a className='btn btn-primary'>
                        Go to Account Page
                    </a>
                </Link>
                : null}
            </form>
        );
    };

    const handleAddBank = () => {
        const { bank_name, bank_branch, account_name, account_number } = bankAccountProfile;
        dispatch(
            addBankAccount(
                {
                    userId: user_id,
                    bankName: bank_name,
                    bankBranch: bank_branch,
                    accountName: account_name,
                    accountNumber: account_number,
                    bankImage: null,
                },
                user_id
            )
        );
        setBankAccountProfile({
            type: 'get',
            bank_id: null,
            bank_name: '',
            bank_branch: '',
            account_name: '',
            account_number: '',
            bank_image: '',
        });
    };

    const handleEditBank = () => {
        const { bank_id, bank_name, bank_branch, account_name, account_number } =
            bankAccountProfile;
        dispatch(
            editBankAccount(
                { bank_name, bank_branch, account_name, account_number, bank_image: null },
                bank_id,
                user_id
            )
        );
        setBankAccountProfile({
            type: 'get',
            bank_id: null,
            bank_name: '',
            bank_branch: '',
            account_name: '',
            account_number: '',
            bank_image: '',
        });
    };

    const renderFormBank = (type) => {
        return (
            <div>
                <div className='form-group'>
                    <label htmlFor='accountNameForm'>Account Name</label>
                    <input
                        type='text'
                        id='accountNameForm'
                        name='account_name'
                        className='form-control'
                        onChange={(e) =>
                            setBankAccountProfile({
                                ...bankAccountProfile,
                                account_name: e.target.value,
                            })
                        }
                        value={bankAccountProfile.account_name}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='accountNumberForm'>Account Number</label>
                    <input
                        type='text'
                        id='accountNumberForm'
                        name='account_number'
                        className='form-control'
                        onChange={(e) =>
                            setBankAccountProfile({
                                ...bankAccountProfile,
                                account_number: e.target.value,
                            })
                        }
                        value={bankAccountProfile.account_number}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='bankNameForm'>Bank Name</label>
                    <input
                        type='text'
                        id='bankNameForm'
                        name='bank_name'
                        className='form-control'
                        onChange={(e) =>
                            setBankAccountProfile({
                                ...bankAccountProfile,
                                bank_name: e.target.value,
                            })
                        }
                        value={bankAccountProfile.bank_name}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='bankBranchForm'>Bank Branch</label>
                    <input
                        type='text'
                        id='bankBranchForm'
                        name='bank_branch'
                        className='form-control'
                        onChange={(e) =>
                            setBankAccountProfile({
                                ...bankAccountProfile,
                                bank_branch: e.target.value,
                            })
                        }
                        value={bankAccountProfile.bank_branch}
                    />
                </div>
                <button
                    type='button'
                    className='btn btn-primary d-block mx-auto'
                    // disabled={disable}
                    data-dismiss='modal'
                    onClick={() => (type === 'Add' ? handleAddBank() : handleEditBank())}
                >
                    Submit
                </button>
            </div>
        );
    };

    const BankAccountSection = () => {
        return (
            <div className='bank-account-container pr-5 py-5'>
                <div className='row justify-content-between align-items-center pb-3'>
                    <div className='col-md-5 col-sm-8'>
                        <div className='input-group'>
                            <input
                                type='text'
                                className='form-control'
                                onChange={(e) =>
                                    e.target.value.length === 0
                                        ? dispatch(getBankAccountByUser(user_id))
                                        : dispatch(
                                              getBankAccountByUser(
                                                  user_id,
                                                  `search=${e.target.value}`
                                              )
                                          )
                                }
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
                            data-target='#add_bank_account'
                            onClick={() =>
                                setBankAccountProfile({
                                    type: 'get',
                                    bank_id: null,
                                    bank_name: '',
                                    bank_branch: '',
                                    account_name: '',
                                    account_number: '',
                                    bank_image: '',
                                })
                            }
                        >
                            Add Bank Account
                        </button>
                    </div>
                </div>
                <div className='table-responsive'>
                    <table className='table table-hover'>
                        <thead>
                            <tr>
                                <th>Main Bank Account</th>
                                <th>Account Name</th>
                                <th>Account Number</th>
                                <th>Bank Name</th>
                                <th>Bank Branch</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bankAccount.length > 0 ? (
                                bankAccount.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type='radio'
                                                    name='mainBankAccount'
                                                    value={item.id}
                                                    checked={
                                                        stores.main_bank_id === item.id
                                                            ? true
                                                            : false
                                                    }
                                                    onChange={(e) =>
                                                        dispatch(
                                                            editUser(
                                                                { main_bank_id: item.id },
                                                                user_id,
                                                                'users'
                                                            )
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td>{item.account_name}</td>
                                            <td>{item.account_number}</td>
                                            <td>{item.bank_name}</td>
                                            <td>{item.bank_branch}</td>
                                            <td>
                                                <button
                                                    type='button'
                                                    className='btn'
                                                    data-toggle='tooltip'
                                                    data-placement='right'
                                                    title='Edit'
                                                    onClick={() => {
                                                        $('#edit_bank_account').modal();
                                                        setBankAccountProfile({
                                                            ...bankAccountProfile,
                                                            account_name: item.account_name,
                                                            account_number: item.account_number,
                                                            bank_name: item.bank_name,
                                                            bank_branch: item.bank_branch,
                                                            bank_id: item.id,
                                                        });
                                                    }}
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
                                                        dispatch(
                                                            deleteBankAccount(item.id, user_id)
                                                        )
                                                    }
                                                >
                                                    <i className='bx bxs-trash-alt'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className='alert alert-secondary text-center'>
                                    <td colSpan={6}>
                                        We can't found your keyword. Please change your keyword!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    return (
        <div className='store-settings-container p-3'>
            <nav>
                <div
                    className='nav nav-pills nav-fill justify-content-center'
                    id='nav-tab'
                    role='tablist'
                >
                    <a
                        className='nav-item nav-link'
                        id='nav-profile-tab'
                        data-toggle='tab'
                        href='#nav-profile'
                        role='tab'
                        aria-controls='nav-profile'
                        aria-selected='false'
                    >
                        <i className='icon-btn far fa-user mr-2'></i> My Account
                    </a>
                    <a
                        className='nav-item nav-link active'
                        id='nav-home-tab'
                        data-toggle='tab'
                        href='#nav-home'
                        role='tab'
                        aria-controls='nav-home'
                        aria-selected='true'
                    >
                        <i className='bx bx-store mr-2'></i> Store Address
                    </a>
                    <a
                        className='nav-item nav-link'
                        id='nav-contact-tab'
                        data-toggle='tab'
                        href='#nav-contact'
                        role='tab'
                        aria-controls='nav-contact'
                        aria-selected='false'
                    >
                        <i className='bx bx-credit-card-front mr-2'></i> Bank Account
                    </a>
                    <div className='dropdown-divider'></div>
                </div>
            </nav>
            <div className='tab-content' id='nav-tabContent'>
                <div
                    className='tab-pane fade p-3'
                    id='nav-profile'
                    role='tabpanel'
                    aria-labelledby='nav-profile-tab'
                >
                    {MyAccountSection()}
                </div>
                <div
                    className='tab-pane fade show active p-3'
                    id='nav-home'
                    role='tabpanel'
                    aria-labelledby='nav-home-tab'
                >
                    {<Addresses type='store-address' />}
                </div>
                <div
                    className='tab-pane fade p-3'
                    id='nav-contact'
                    role='tabpanel'
                    aria-labelledby='nav-contact-tab'
                >
                    {BankAccountSection()}
                </div>
            </div>
            <ModalComp
                modal_id='add_bank_account'
                title='Add Bank Account'
                body={renderFormBank('Add')}
            />
            <ModalComp
                modal_id='edit_bank_account'
                title='Edit Bank Account'
                body={renderFormBank('Edit')}
                data_backdrop='static'
                data_keyboard={true}
            />
        </div>
    );
};

export default StoreSettings;
