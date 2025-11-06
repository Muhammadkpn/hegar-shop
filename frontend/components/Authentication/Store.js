import React, { useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../store/helpers'
import { useSelector } from 'react-redux';

const Store = ({ children }) => {
    const { role } = useSelector((state) => {
        return {
            role: state.users.role,
        }
    })
    useEffect(() => {
        if (!isAuth()) {
            Router.push(`/authentication`);
        } else if (role === 3) {
            Router.push(`/`);
        }
    }, []);
    return <React.Fragment>{children}</React.Fragment>;
};

export default Store;
