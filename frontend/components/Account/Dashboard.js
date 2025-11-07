import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

import React from 'react';
import { storeRegister } from '../../store/action';
import ModalComp from '../Common/modalComp';

const Dashboard = () => {
    const { role, user_id } = useSelector((state) => {
        return {
            role: state.users.role,
            user_id: state.users.id,
        };
    });
    const dispatch = useDispatch();

    return (
        <div>
            <div className='dashboard-container'>
                <i className='bx bx-home bx-md'></i>
                <h5 className='my-3'>From your account dashboard you can:</h5>
                <div className='my-3 row justify-content-between'>
                    <div>
                        <Link href='/account?section=orders'>
                            <button type='button' className='btn btn-primary mx-2 mb-2'>
                                View Orders
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link href='/account?section=addresses'>
                            <button type='button' className='btn btn-primary mx-2 mb-2'>
                                Manage Addresses
                            </button>
                        </Link>
                    </div>
                    <div>
                        <Link href='/account?section=account-details'>
                            <button type='button' className='btn btn-primary mx-2 mb-2'>
                                Edit Account Details
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
            {role === 2 ? (
                <Link href='/store/account'>
                    <button type='button' className='btn btn-primary m-3'>
                        Go to Vendor Dashboard
                    </button>
                </Link>
            ) : null}
            {role === 3 ? (
                <button
                    type='button'
                    className='btn btn-primary m-3'
                    data-toggle='modal'
                    data-target='#seller-register'
                    onClick={() => dispatch(storeRegister({ roleId: 2 }, user_id))}
                >
                    {role === 3 ? 'Store Register' : 'Go to Vendor'}
                </button>
            ) : null}
            <ModalComp
                modal_id='seller-register'
                body={`Congratulations! You've already registered as Seller in Wisela`}
            />
        </div>
    );
};

export default Dashboard;
