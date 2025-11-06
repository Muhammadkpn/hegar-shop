import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { checkExpiredResetPassword, editResetPassword } from '../../store/action';
import ModalComp from '../Common/modalComp';
import Link from 'next/link';

const ResetPassword = ({ type }) => {
    const [visible1, setVisible1] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
    const [editPassword, setEditPassword] = React.useState({
        password: '',
        confPassword: '',
    });
    const router = useRouter();
    const { token } = router.query;

    const { errorResetPassword, resetPassword } = useSelector((state) => {
        return {
            errorResetPassword: state.users.errorResetPassword,
            resetPassword: state.users.resetPassword,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(checkExpiredResetPassword({ token }));
    }, []);

    React.useEffect(() => {
        if (!errorResetPassword && Object.keys(resetPassword).length > 0) {
            $('#alert-reset-password').modal();
            $('#alert-reset-password').on('hidden.bs.modal', function (e) {
                router.push('/');
            });
        }
    }, [errorResetPassword]);

    const handleResetPassword = () => {
        const { password, confPassword } = editPassword;
        const { email } = resetPassword;
        const body = { email, password, confPassword };
        dispatch(editResetPassword(body));
    };

    return (
        <div className='row no-gutters justify-content-center p-3'>
            <div className='col-6'>
                <div className='card'>
                    <div className='card-body'>
                        <h3 className='card-title'>Reset Password</h3>
                        {errorResetPassword ? (
                            <div className='alert alert-danger'>{errorResetPassword}</div>
                        ) : null}
                        {resetPassword !== 500 ? (
                            <form>
                                <div className='form-group'>
                                    <label htmlFor='exampleInputEmail1'>
                                        <p>Email Address</p>
                                    </label>
                                    <div className='input-group mb-3'>
                                        <div className='input-group-prepend'>
                                            <button
                                                type='button'
                                                className='btn btn-outline-primary'
                                                id='emailHelp'
                                                disabled
                                            >
                                                <i className='fas fa-envelope'></i>
                                            </button>
                                        </div>
                                        <input
                                            type='email'
                                            className='form-control'
                                            placeholder='example@email.com'
                                            aria-describedby='emailHelp'
                                            value={resetPassword?.email || ''}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='exampleInputPassword1'>
                                        <p>Password</p>
                                    </label>
                                    <div className='input-group mb-3'>
                                        <div className='input-group-prepend'>
                                            <button
                                                type='button'
                                                className='btn btn-outline-primary'
                                                id='passwordHelp'
                                            >
                                                <i className='fas fa-lock'></i>
                                            </button>
                                        </div>
                                        <input
                                            type={visible1 ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder='Password'
                                            aria-describedby='passwordHelp'
                                            style={{ borderRight: 'none' }}
                                            onChange={(e) =>
                                                setEditPassword({
                                                    ...editPassword,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                        <div className='input-group-append'>
                                            {visible1 ? (
                                                <button
                                                    type='button'
                                                    className='btn btn-outline-primary'
                                                    onClick={() => setVisible1(false)}
                                                >
                                                    <i className='fas fa-eye'></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn btn-outline-primary'
                                                    onClick={() => setVisible1(true)}
                                                >
                                                    <i className='fas fa-eye-slash'></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <small id='passwordHelp' className='form-text text-muted'>
                                        Your password must be 8-20 characters long, contain letters,
                                        numbers, and special characters.
                                    </small>
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='exampleInputPassword1'>
                                        <p>Confirm Password</p>
                                    </label>
                                    <div className='input-group mb-3'>
                                        <div className='input-group-prepend'>
                                            <button
                                                type='button'
                                                className='btn btn-outline-primary'
                                                id='passwordHelp2'
                                            >
                                                <i className='fas fa-lock'></i>
                                            </button>
                                        </div>
                                        <input
                                            type={visible2 ? 'text' : 'password'}
                                            className='form-control'
                                            placeholder='Confirm Password'
                                            aria-label='Username'
                                            aria-describedby='passwordHelp2'
                                            style={{ borderRight: 'none' }}
                                            onChange={(e) =>
                                                setEditPassword({
                                                    ...editPassword,
                                                    confPassword: e.target.value,
                                                })
                                            }
                                        />
                                        <div className='input-group-append'>
                                            {visible2 ? (
                                                <button
                                                    type='button'
                                                    className='btn btn-outline-primary'
                                                    onClick={() => setVisible2(false)}
                                                >
                                                    <i className='fas fa-eye'></i>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn btn-outline-primary'
                                                    onClick={() => setVisible2(true)}
                                                >
                                                    <i className='fas fa-eye-slash'></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <small id='passwordHelp2' className='form-text text-muted'>
                                        Confirm your password here.
                                    </small>
                                </div>
                                {type === 'users' ? (
                                    <div className='form-group form-check align-items-center'>
                                        <input
                                            type='checkbox'
                                            className='form-check-input'
                                            id='exampleCheck2'
                                        />
                                        <label className='form-check-label' htmlFor='exampleCheck2'>
                                            <p>
                                                By signing up, you agree to our{' '}
                                                <span className=''> Terms of Use </span>
                                                and <span className=''> Privacy Policy. </span>
                                            </p>
                                        </label>
                                    </div>
                                ) : null}
                                <div className='d-flex justify-content-center'>
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        onClick={() => handleResetPassword()}
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <p className='text-center'>
                                The link is invalid. It may have been used or have expired. Please
                                ensure that the link matches the one emailed to you.
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <ModalComp
                modal_id='alert-reset-password'
                body={<p className='text-center'>Reset password has been succeeded</p>}
                footer={
                    <React.Fragment>
                        <Link href='/' data-dismiss='modal'>
                            <a onClick={() => $('#alert-reset-password').modal('hide')}>HOME</a>
                        </Link>
                        <Link href='/authentication' data-dismiss='modal'>
                            <a onClick={() => $('#alert-reset-password').modal('hide')}>LOGIN</a>
                        </Link>
                    </React.Fragment>
                }
            />
        </div>
    );
};

export default ResetPassword;
