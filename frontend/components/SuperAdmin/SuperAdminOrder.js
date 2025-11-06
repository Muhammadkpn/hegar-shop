import React from 'react';
import Orders from '../Account/Orders';

const SuperAdminOrders = () => {
    return (
        <div className='pl-2 pr-5 pb-5 pt-3'>
            <Orders type='admin' />
        </div>
    );
};

export default SuperAdminOrders;
