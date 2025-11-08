import { withRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';

const ActiveLink = ({ router, children, className = '', activeClassName = '', ...props }) => {
    const isActive = router?.pathname === props.href;
    const combinedClassName = [className, isActive ? activeClassName : '']
        .filter(Boolean)
        .join(' ');

    return (
        <Link legacyBehavior {...props}>
            <a className={combinedClassName}>{children}</a>
        </Link>
    );
};

export default withRouter(ActiveLink);
