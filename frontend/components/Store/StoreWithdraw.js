import React from 'react';
import {
    getUpdatedBalance,
    getHistoryBalanceByUser,
    editStatusBalance,
    updateBalance,
} from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import ModalComp from '../Common/modalComp';

const StoreWithdraw = () => {
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState(null);
    const [visible, setVisible] = React.useState(false);
    const [adjustBalance, setAdjustBalance] = React.useState({
        type: '',
        amount: 0,
        password: '',
    });
    const [confirmId, setConfirmId] = React.useState(null);
    const status = ['All', 'Approved', 'Pending', 'Rejected'];

    const { balance, historyBalance, user_id } = useSelector((state) => {
        return {
            balance: state.profile.balance,
            historyBalance: state.profile.historyBalance,
            user_id: state.users.id,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getUpdatedBalance(user_id));
        dispatch(getHistoryBalanceByUser(user_id));
    }, []);

    React.useEffect(() => {
        let start_date = new Date(startDate);
        let end_date = new Date(endDate);
        if (filterStatus && startDate && endDate) {
            dispatch(
                getHistoryBalanceByUser(
                    user_id,
                    `status=${filterStatus}&startDate='${start_date.getFullYear()}-${
                        start_date.getMonth() + 1
                    }-${start_date.getDate()}'&endDate='${end_date.getFullYear()}-${
                        end_date.getMonth() + 1
                    }-${end_date.getDate()}'`
                )
            );
        } else if (filterStatus) {
            dispatch(getHistoryBalanceByUser(user_id, `status=${filterStatus}`));
        } else if (startDate && endDate) {
            dispatch(
                getHistoryBalanceByUser(
                    user_id,
                    `startDate='${start_date.getFullYear()}-${
                        start_date.getMonth() + 1
                    }-${start_date.getDate()}'&endDate='${end_date.getFullYear()}-${
                        end_date.getMonth() + 1
                    }-${end_date.getDate()}'`
                )
            );
        } else {
            dispatch(getHistoryBalanceByUser(user_id))
        }
    }, [filterStatus, startDate, endDate]);

    const handleResetFilter = () => {
        setFilterStatus(null);
        setStartDate('');
        setEndDate('');
    };

    const submitUpdateBalance = () => {
        const { type, amount, password } = adjustBalance;
        if (type === 'withdraw') {
            dispatch(updateBalance({ amount: -amount, password }, user_id));
        } else {
            dispatch(updateBalance({ amount, password }, user_id));
        }
        setAdjustBalance({ type: '', amount: 0, password: '' });
    };

    const renderUpdateBalance = () => {
        const { amount, password } = adjustBalance;
        return (
            <div>
                <div className='form-group'>
                    <label htmlFor='requestWithdrawForm'>
                        <p>Amount</p>
                    </label>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary border-right-0'
                            >
                                <i className='bx bx-money'></i>
                            </button>
                        </div>
                        <input
                            type='text'
                            id='requestWithdrawForm'
                            className='form-control border-left-0'
                            placeholder='Rp. xxx,xxx,xxx'
                            onChange={(e) =>
                                setAdjustBalance({ ...adjustBalance, amount: e.target.value })
                            }
                            value={amount}
                        />
                    </div>
                </div>
                <div className='form-group'>
                    <label htmlFor='exampleInputPassword1'>
                        <p>Password</p>
                    </label>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend'>
                            <button
                                type='button'
                                className='btn btn-outline-primary border-right-0'
                                id='basic-addon2'
                            >
                                <i className='bx bx-lock'></i>
                            </button>
                        </div>
                        <input
                            type={visible ? 'text' : 'password'}
                            className='form-control border-left-0'
                            placeholder='Password'
                            aria-label='Username'
                            onChange={(e) =>
                                setAdjustBalance({ ...adjustBalance, password: e.target.value })
                            }
                            style={{ borderRight: 'none' }}
                        />
                        <div className='input-group-append'>
                            {visible ? (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary border-left-0'
                                    onClick={() => setVisible(false)}
                                >
                                    <i className='fas fa-eye'></i>
                                </button>
                            ) : (
                                <button
                                    type='button'
                                    className='btn btn-outline-primary border-left-0'
                                    onClick={() => setVisible(true)}
                                >
                                    <i className='fas fa-eye-slash'></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    type='button'
                    className='btn btn-primary btn-sm d-block mx-auto'
                    data-dismiss='modal'
                    onClick={() => submitUpdateBalance()}
                >
                    Submit
                </button>
            </div>
        );
    };

    const handleConfirmTrx = (id) => {
        $('#confirm_transaction').modal();
        setConfirmId(id);
    };

    const submitConfirmTrx = () => {
        dispatch(editStatusBalance({ status: 1 }, confirmId, user_id));
        setConfirmId(null);
    };

    return (
        <div className='store-withdraw-container'>
            <h3>Withdraw</h3>
            <div className='bg-light border rounded w-100 p-2 mb-2 d-flex justify-content-between'>
                <p className='p-0 m-0'>Current Balance: Rp. {balance.balance?.toLocaleString()}</p>
                <p className='p-0 m-0'>Minimum Withdraw: Rp. 10,000</p>
            </div>
            <div className='d-flex justify-content-between align-items-center'>
                <div className='d-flex'>
                    <div className='form-group mr-2'>
                        <label>Status</label>
                        <div className='dropdown'>
                            <button
                                type='button'
                                className='btn btn-outline-primary dropdown-toggle btn-sm'
                                id='statusButton'
                                data-toggle='dropdown'
                            >
                                {filterStatus ? status[filterStatus] : 'Status'}
                            </button>
                            <div className='dropdown-menu' aria-labelledby='statusButton'>
                                {status.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={index}>
                                            <button
                                                type='button'
                                                className='btn'
                                                onClick={() => setFilterStatus(index)}
                                            >
                                                {item}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='form-group'>
                        <label>Filter by Date</label>
                        <div className='input-group'>
                            <div className='border rounded-left d-flex align-items-center'>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    placeholderText='Start Date'
                                    wrapperClassName='date-picker-withdraw'
                                />
                            </div>
                            <div className='border-top border-bottom d-flex align-items-center'>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    minDate={startDate}
                                    placeholderText='End Date'
                                    wrapperClassName='date-picker-withdraw'
                                />
                            </div>
                            <div className='input-group-append'>
                                <button
                                    className='btn btn-outline-primary btn-sm'
                                    onClick={() => handleResetFilter()}
                                    disabled={!filterStatus && !startDate && !endDate}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button
                        type='button'
                        className='btn btn-primary mr-2'
                        onClick={() => {
                            $('#adjust_balance').modal();
                            setAdjustBalance({ ...adjustBalance, type: 'top-up' });
                        }}
                    >
                        Top Up Balance
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary ml-2'
                        onClick={() => {
                            $('#adjust_balance').modal();
                            setAdjustBalance({ ...adjustBalance, type: 'withdraw' });
                        }}
                    >
                        Request Withdraw
                    </button>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyBalance.length !== 0 ? (
                            historyBalance.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{new Date(item.transaction_date).toLocaleString()}</td>
                                        <td>
                                            {item.amount > 0 ? (
                                                <p className='text-success'>
                                                    Rp. {item.amount.toLocaleString()}
                                                </p>
                                            ) : (
                                                <p className='text-danger'>
                                                    - Rp. {Math.abs(item.amount).toLocaleString()}
                                                </p>
                                            )}
                                        </td>
                                        <td>
                                            {item.status_id === 2 ? (
                                                <button
                                                    type='button'
                                                    className='btn p-0 text-info'
                                                    onClick={() => handleConfirmTrx(item.id)}
                                                >
                                                    {item.status}
                                                </button>
                                            ) : (
                                                <p>{item.status}</p>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={3}>
                                    <p className='text-center'>Your transaction is empty</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id={'adjust_balance'}
                size='modal-sm'
                scrollable={true}
                title={adjustBalance.type === 'withdraw' ? 'Request Withdraw' : 'Top up balance'}
                body={renderUpdateBalance(adjustBalance.type || 'withdraw')}
            />
            <ModalComp
                modal_id={'confirm_transaction'}
                size='modal-sm'
                title='Confirmation'
                body='Are you sure to complete this transaction?'
                footer={
                    <div className='mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitConfirmTrx()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default StoreWithdraw;
