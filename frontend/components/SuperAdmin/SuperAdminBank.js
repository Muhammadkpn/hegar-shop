import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editBankAccount, getBankAccount } from '../../store/action';
import { URL_IMG } from '../../store/helpers';
import ModalComp from '../Common/modalComp';

const SuperAdminBank = () => {
    const [editStatus, setEditStatus] = React.useState({
        old_status_id: null,
        new_status_id: null,
        id: null,
        bank_image: '',
    });
    const [filterBank, setFilterBank] = React.useState({
        search: '',
        status: null,
    });
    const { bankAccount } = useSelector((state) => {
        return {
            bankAccount: state.profile.bankAccount,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getBankAccount());
    }, []);

    React.useEffect(() => {
        const { search, status } = filterBank;
        if (status === 'Active') {
            dispatch(getBankAccount(`status=1&search=${search}`));
        } else if (status === 'Inactive') {
            dispatch(getBankAccount(`status=2&search=${search}`));
        } else {
            dispatch(getBankAccount(`search=${search}`));
        }
    }, [filterBank]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('.carousel').carousel();
    });

    const renderChangeStatus = () => {
        const { old_status_id, new_status_id, id, bank_image } = editStatus;
        return (
            <div>
                <p className='text-center mb-0'>Are you sure to change the status of this Bank?</p>
                <div>
                    <img className='img d-block mx-auto' src={`${URL_IMG}/${bank_image}`} />
                    <div className='dropdown my-2'>
                        <button
                            className='btn btn-outline-primary dropdown-toggle btn-block'
                            type='button'
                            id='oldStatusButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {new_status_id === 1
                                ? 'Active'
                                : new_status_id === 2
                                ? 'Inactive'
                                : 'Status Bank'}
                        </button>
                        <div className='dropdown-menu'>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setEditStatus({ ...editStatus, new_status_id: 1 })}
                            >
                                Active
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setEditStatus({ ...editStatus, new_status_id: 2 })}
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
                            setEditStatus({
                                user_id: null,
                                new_status_id: null,
                                old_status_id: null,
                                bank_image: '',
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
                            dispatch(editBankAccount({ bank_status_id: new_status_id }, id))
                        }
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='SA-products'>
            <h3>Bank Account</h3>
            <div className='row mb-2 align-items-centern justify-content-between no-gutters'>
                <div className='col-md-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Account Name or Account Number or Bank'
                            onChange={(e) =>
                                setFilterBank({ ...filterBank, search: e.target.value })
                            }
                            value={filterBank.search}
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
                            id='filterBank'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {filterBank.status || 'All Bank Status'}
                        </button>

                        <div className='dropdown-menu' aria-labelledby='filterBank'>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() =>
                                    setFilterBank({ ...filterBank, status: 'All Bank Status' })
                                }
                            >
                                All Bank Status
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterBank({ ...filterBank, status: 'Active' })}
                            >
                                Active
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterBank({ ...filterBank, status: 'Inactive' })}
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
                            <th>No</th>
                            <th>User Id</th>
                            <th>Account Name</th>
                            <th>Account Number</th>
                            <th>Bank</th>
                            <th>Branch</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bankAccount.length > 0 ? (
                            bankAccount.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='align-middle'>{item.id}</td>
                                        <td className='align-middle'>{item.user_id}</td>
                                        <td className='align-middle'>{item.account_name}</td>
                                        <td className='align-middle'>{item.account_number}</td>
                                        <td className='align-middle'>{item.bank_name}</td>
                                        <td className='align-middle'>{item.bank_branch}</td>
                                        <td className='align-middle'>
                                            {item.bank_status_id === 1 ? (
                                                <p className='text-success text-center'>Active</p>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn d-block mx-auto'
                                                    data-target='#change_bank_status'
                                                    data-toggle='modal'
                                                    onClick={() =>
                                                        setEditStatus({
                                                            id: item.id,
                                                            old_status_id: item.bank_status_id,
                                                            new_status_id: item.bank_status_id,
                                                            bank_image: item.bank_image,
                                                        })
                                                    }
                                                >
                                                    <u className='text-danger'>Inactive</u>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={7}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id='change_bank_status'
                title='Activation of Bank Account'
                body={renderChangeStatus()}
            />
        </div>
    );
};

export default SuperAdminBank;
