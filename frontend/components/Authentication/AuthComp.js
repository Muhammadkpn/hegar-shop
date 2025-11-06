import axios from 'axios';
import React from 'react';
import Login from './Login';
import Register from './Register';

const AuthComp = () => {
    return (
        <div className='row no-gutters'>
            <div className='col-sm-6 p-5'>
                <Login />
            </div>
            <div className='col-sm-6 p-5'>
                <Register type='users' />
            </div>
        </div>
    );
};

export default AuthComp;
