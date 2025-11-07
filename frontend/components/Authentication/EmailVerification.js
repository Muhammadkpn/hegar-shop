import React from 'react';
import { useRouter } from 'next/router';
import { emailVerification } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

const EmailVerification = () => {
    const router = useRouter();
    const { token } = router.query;

    const { emailConfirmation } = useSelector((state) => {
        return {
            emailConfirmation: state.users.emailConfirmation,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(emailVerification({ token }));
    }, []);

    return (
        <div className='container p-5'>
            <div className='card d-flex flex-column justify-content-center align-items-center p-5'>
                {Object.keys(emailConfirmation).length > 0 ? (
                    <React.Fragment>
                        <p className='text-center'>
                            Congratulation! You've already confirm your account. Enjoy your shopping
                            on wisela!
                        </p>
                        <Link href='/authentication' className='btn btn-primary'>
                            Login
                        </Link>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <p className='text-center'>
                            The link is invalid. It may have been used or have expired. Please
                            ensure that the link matches the one emailed to you.
                        </p>
                        <Link href='/' className='btn btn-primary'>
                            Back to Home
                        </Link>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
