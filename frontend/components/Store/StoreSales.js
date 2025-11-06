import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    getSalesEarnings,
    getSalesSummary,
    getUpdatedBalance,
    getSalesCharts,
} from '../../store/action';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import DatePicker from 'react-datepicker';

const StoreSales = ({ type }) => {
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [filterStatus, setFilterStatus] = React.useState(null);
    const orderStatus = [
        { status: 'Total', order_status_id: 1 },
        { status: 'Done', order_status_id: 5 },
        { status: 'On Delivery', order_status_id: 4 },
        { status: 'Payment Success', order_status_id: 3 },
        { status: 'Waiting for Payment', order_status_id: 2 },
        { status: 'Cancelled', order_status_id: 6 },
        { status: 'Rejected', order_status_id: 7 },
    ];

    const { user_id, salesEarnings, salesSummary, balance, salesCharts } = useSelector((state) => {
        return {
            user_id: state.users.id,
            salesEarnings: state.store.salesEarnings,
            salesSummary: state.store.salesSummary,
            balance: state.profile.balance,
            salesCharts: state.store.salesCharts,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        setFilterStatus(1);
        if (type === 'store-sales') {
            dispatch(getSalesEarnings('type=lifetime', user_id));
            dispatch(getSalesSummary('type=by-store', user_id));
            dispatch(getUpdatedBalance(user_id));
            dispatch(getSalesCharts(user_id, `startDate='2020-01-01'`));
        } else {
            dispatch(getSalesCharts('All', `startDate='2020-01-01'`));
        }
    }, []);

    const handleFilterDate = () => {
        if (startDate && endDate) {
            let start_date = new Date(startDate);
            let end_date = new Date(endDate);
            dispatch(
                getSalesCharts(
                    type === 'store-sales' ? user_id : 'All',
                    `startDate='${start_date.getFullYear()}-${
                        start_date.getMonth() + 1
                    }-${start_date.getDate()}'&endDate='${end_date.getFullYear()}-${
                        end_date.getMonth() + 1
                    }-${end_date.getDate()}'${
                        filterStatus !== 1 ? `&orderStatusId=${filterStatus}` : ''
                    }`
                )
            );
        } else {
            dispatch(
                getSalesCharts(
                    type === 'store-sales' ? user_id : 'All',
                    `${filterStatus !== 1 ? `&orderStatusId=${filterStatus}` : ''}`
                )
            );
        }
    };

    const handleResetDate = () => {
        setStartDate(null);
        setEndDate(null);
        dispatch(
            getSalesCharts(
                type === 'store-sales' ? user_id : 'All',
                `${filterStatus !== 1 ? `&orderStatusId=${filterStatus}` : ''}`
            )
        );
    };

    const handleFilterStatus = (order_status_id) => {
        setFilterStatus(order_status_id);
        if (startDate && endDate) {
            let start_date = new Date(startDate);
            let end_date = new Date(endDate);
            dispatch(
                getSalesCharts(
                    type === 'store-sales' ? user_id : 'All',
                    `startDate='${start_date.getFullYear()}-${
                        start_date.getMonth() + 1
                    }-${start_date.getDate()}'&endDate='${end_date.getFullYear()}-${
                        end_date.getMonth() + 1
                    }-${end_date.getDate()}'${
                        order_status_id !== 1 ? `&orderStatusId=${order_status_id}` : ''
                    }`
                )
            );
        } else {
            dispatch(
                getSalesCharts(
                    type === 'store-sales' ? user_id : 'All',
                    `${order_status_id !== 1 ? `orderStatusId=${order_status_id}` : ''}`
                )
            );
        }
    };
    return (
        <div className='store-sales-container'>
            <h3 className={`p-2 ${type === 'store-sales' ? '' : 'pb-0 mb-0'}`}>
                {type === 'store-sales' ? 'Your sales / earnings' : 'Sales'}
            </h3>
            <div className='top-dashboard'>
                {type === 'store-sales' ? (
                    <React.Fragment>
                        <div className='row mx-auto'>
                            <div className='col-md-4 col-sm-6'>
                                <div className='dashboard-content rounded'>
                                    <h5 className='text-center text-secondary'>
                                        Earning (this month)
                                    </h5>
                                    <p className='text-center text-dark font-weight-bold'>
                                        Rp.{' '}
                                        {salesEarnings.total_sales
                                            ? salesEarnings.total_sales.toLocaleString()
                                            : 0}
                                    </p>
                                    <p className='text-center'>
                                        Sales{' '}
                                        {salesEarnings.start_date && salesEarnings.end_date
                                            ? `${new Date(
                                                  salesEarnings.start_date
                                              ).toLocaleDateString()} - ${new Date(
                                                  salesEarnings.end_date
                                              ).toLocaleDateString()}`
                                            : ''}
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6'>
                                <div className='dashboard-content rounded'>
                                    <h5 className='text-center text-secondary'>Your Balance</h5>
                                    <p className='text-center  text-dark font-weight-bold'>
                                        Rp.{' '}
                                        {balance.balance ? balance.balance.toLocaleString() : 0}
                                    </p>
                                    <p className='text-center'>
                                        Balance until {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6'>
                                <div className='dashboard-content rounded'>
                                    <h5 className='text-center text-secondary'>
                                        Lifetime Earnings
                                    </h5>
                                    <p className='text-center  text-dark font-weight-bold'>
                                        Rp.{' '}
                                        {salesSummary.sales_per_status
                                            ? salesSummary.sales_per_status.toLocaleString()
                                            : 0}
                                    </p>
                                    <p className='text-center'>Based on price list</p>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                ) : null}
                <div className='row p-3 no-gutters'>
                    <div className='col-lg-8'>
                        <div className='filter-charts p-0 my-3 d-flex align-items-center'>
                            <div className='input-group'>
                                <div className='border rounded-left d-flex align-items-center'>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        placeholderText='Start Date'
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
                                        maxDate={Date.now()}
                                        placeholderText='End Date'
                                    />
                                </div>
                                <div className='input-group-append'>
                                    <button
                                        className='btn btn-outline-primary btn-sm'
                                        onClick={() => handleFilterDate()}
                                    >
                                        Submit
                                    </button>
                                    <button
                                        className='btn btn-outline-primary btn-sm'
                                        onClick={() => handleResetDate()}
                                        disabled={!startDate && !endDate}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <LineChart
                                width={580}
                                height={290}
                                data={salesCharts}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='checkout_date' />
                                <YAxis />
                                <Tooltip />
                                <Legend verticalAlign='top' align='center' height={36} />
                                <Line
                                    type='monotone'
                                    dataKey='total_sales'
                                    name='Total Sales'
                                    stroke='#8884d8'
                                />
                            </LineChart>
                        </div>
                    </div>
                    <div className='col-lg-4'>
                        <div className='dashboard-widget border rounded p-3'>
                            <h5 className='text-secondary p-2'>Orders</h5>
                            {orderStatus.map((item, index) => {
                                return (
                                    <div key={index} className='pl-2'>
                                        <div className='dropdown-divider p-0 m-0'></div>
                                        <p
                                            className='d-block pl-0 my-1'
                                            style={
                                                filterStatus === item.order_status_id
                                                    ? { fontWeight: 'bold', color: '#172C93' }
                                                    : {}
                                            }
                                            onClick={() => handleFilterStatus(item.order_status_id)}
                                        >
                                            {item.status}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSales;
