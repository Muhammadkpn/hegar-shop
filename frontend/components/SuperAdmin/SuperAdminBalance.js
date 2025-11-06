import React from 'react';
import { getHistoryBalance, editStatusBalance } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import ModalComp from '../Common/modalComp';

const SuperAdminBalance = () => {
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState(null);
    const [editStatus, setEditStatus] = React.useState({
        old_status_id: null,
        new_status_id: null,
        balance_id: null,
    });
    const status = ['All', 'Approved', 'Pending', 'Rejected'];

    const { historyBalance, user_id } = useSelector((state) => {
        return {
            historyBalance: state.profile.historyBalance,
            user_id: state.users.id,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getHistoryBalance(user_id));
    }, []);

    React.useEffect(() => {
        let start_date = new Date(startDate);
        let end_date = new Date(endDate);
        if (filterStatus && startDate && endDate) {
            dispatch(
                getHistoryBalance(
                    `status=${filterStatus}&startDate='${start_date.getFullYear()}-${
                        start_date.getMonth() + 1
                    }-${start_date.getDate()}'&endDate='${end_date.getFullYear()}-${
                        end_date.getMonth() + 1
                    }-${end_date.getDate()}'`
                )
            );
        } else if (filterStatus) {
            dispatch(getHistoryBalance(`status=${filterStatus}`));
        } else if (startDate && endDate) {
            dispatch(
                getHistoryBalance(
                    `startDate='${start_date.getFullYear()}-${
                        start_date.getMonth() + 1
                    }-${start_date.getDate()}'&endDate='${end_date.getFullYear()}-${
                        end_date.getMonth() + 1
                    }-${end_date.getDate()}'`
                )
            );
        } else {
            dispatch(getHistoryBalance());
        }
    }, [filterStatus, startDate, endDate]);

    const handleResetFilter = () => {
        setFilterStatus(null);
        setStartDate('');
        setEndDate('');
    };

    const handleChangeTrxStatus = (id) => {
        $('#change_transaction_status').modal();
        setEditStatus({
            old_status_id: 2,
            new_status_id: 2,
            balance_id: id,
        });
    };

    const renderChangeTrxStatus = () => {
        const { old_status_id, new_status_id, balance_id } = editStatus;
        return (
            <div className='d-flex justify-content-center'>
                <button type='button' className='btn btn-outline-primary' disabled>
                    {status[old_status_id]}
                </button>
                <i className='bx bxs-right-arrow-alt bx-md'></i>
                <div className='dropdown'>
                    <button
                        type='button'
                        className='btn btn-outline-primary dropdown-toggle'
                        id='new-trx-status'
                        data-toggle='dropdown'
                        aria-haspopup='true'
                        aria-expanded='false'
                    >
                        {status[new_status_id]}
                    </button>
                    <div className='dropdown-menu' aria-labelledby='new-trx-status'>
                        {status.slice(1).map((item, index) => {
                            return (
                                <button
                                    type='button'
                                    className='btn dropdown-item'
                                    onClick={() =>
                                        setEditStatus({ ...editStatus, new_status_id: index + 1 })
                                    }
                                    key={index}
                                >
                                    {item}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const submitCancelTrxStatus = () => {
        const { new_status_id, balance_id } = editStatus;
        dispatch(editStatusBalance({ status: new_status_id }, balance_id));
        setEditStatus({
            old_status_id: null,
            new_status_id: null,
            balance_id: null,
        });
    };

    return (
        <div className='store-withdraw-container'>
            <h3>Withdraw</h3>
            <div className='row align-items-center no-gutters'>
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
            <div className='table-responsive'>
                <table className='table table-bordered'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Id</th>
                            <th>User Id</th>
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
                                        <td>{item.id}</td>
                                        <td>{item.user_id}</td>
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
                                                    onClick={() => handleChangeTrxStatus(item.id)}
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
                                <td colSpan={5}>
                                    <p className='text-center'>Your transaction is empty</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id={'change_transaction_status'}
                size='modal-sm'
                title='Confirmation'
                body={renderChangeTrxStatus()}
                footer={
                    <div className='mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitCancelTrxStatus()}
                            disabled={editStatus.old_status_id === editStatus.new_status_id}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default SuperAdminBalance;
