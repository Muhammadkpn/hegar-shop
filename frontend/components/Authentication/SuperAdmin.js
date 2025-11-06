import React, { useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../store/helpers'

const SuperAdmin = ({ children }) => {
    useEffect(() => {
        if (!isAuth()) {
            Router.push(`/authentication`);
        } else if (parseInt(isAuth().role_id) !== 1) {
            Router.push(`/`);
        }
    }, []);
    return <React.Fragment>{children}</React.Fragment>;
};

export default SuperAdmin;
