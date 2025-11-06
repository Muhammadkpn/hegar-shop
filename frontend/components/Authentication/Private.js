import React, { useEffect } from 'react';
import Router from 'next/router';
import { isAuth } from '../../store/helpers'

const Private = ({ children }) => {
    useEffect(() => {
        if (!isAuth()) {
            Router.push(`/authentication`);
        }
    }, []);
    return <React.Fragment>{children}</React.Fragment>;
};

export default Private;
