import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, sendEmailResetPassword } from '../../store/action';
import ModalComp from '../Common/modalComp';

const Login = () => {
    const [visible, setVisible] = React.useState(false);
    const [login, setLogin] = React.useState({
        username: '',
        password: '',
    });
    const [reset, setReset] = React.useState('');
    const [sentEmail, setSentEmail] = React.useState(false);
    const { errorLogin, loadingLogin, errorResetPassword } = useSelector((state) => {
        return {
            errorLogin: state.users.errorLogin,
            loadingLogin: state.users.loadingLogin,
            errorResetPassword: state.users.errorResetPassword,
        };
    });
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (errorResetPassword) {
            setSentEmail(false);
        } else {
            setSentEmail(true);
        }
    }, [errorResetPassword])

    $(function () {
        $('#reset-password').on('hidden.bs.modal', function (e) {
            setSentEmail(false);
        });
    });

    const handleLogin = () => {
        const { username, password } = login;

        const body = { password };
        if (/^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/.test(username)) {
            body.email = username;
        } else {
            body.username = username;
        }
        dispatch(userLogin(body));
    };

    const submitEmail = () => {
        dispatch(sendEmailResetPassword({ email: reset }))
    }
    
    const renderResetPassword = () => {
        if (sentEmail) {
            return (
                <div className='p-5'>
                    <p className='text-center text-lg mb-3'>Email Sent! Please check your email.</p>
                    <p className='text-center text-muted'>Follow the instructions to complete the process.</p>
                </div>
            );
        } else {
            return (
                <div>
                    <p className='text-center'>
                        Don't worry! Type your email below and we'll help you reset it.
                    </p>
                    {errorResetPassword ? (
                        <p className='alert alert-danger'>{errorResetPassword}</p>
                    ) : null}
                    <div className='form-group'>
                        <div className='input-group mb-3'>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Email Address'
                                onChange={(e) => setReset(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className='card'>
            <div className='card-body'>
                <h3 className='card-title'>Login</h3>
                {errorLogin ? <div className='alert alert-danger'>{errorLogin}</div> : null}
                <form>
                    <div className='form-group'>
                        <label htmlFor='exampleInputEmail1'>
                            <p>Username or Email Address</p>
                        </label>
                        <div className='input-group mb-3'>
                            <div className='input-group-prepend'>
                                <button type='button' className='btn btn-outline-primary'>
                                    <i className='fas fa-user'></i>
                                </button>
                            </div>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='username or example@email.com'
                                aria-label='Username'
                                onChange={(e) => setLogin({ ...login, username: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='exampleInputPassword1'>
                            <p>Password</p>
                        </label>
                        <div className='input-group mb-3'>
                            <div className='input-group-prepend'>
                                <button type='button' className='btn btn-outline-primary'>
                                    <i className='fas fa-lock'></i>
                                </button>
                            </div>
                            <input
                                type={visible ? 'text' : 'password'}
                                className='form-control'
                                placeholder='Password'
                                aria-label='Username'
                                onChange={(e) => setLogin({ ...login, password: e.target.value })}
                                style={{ borderRight: 'none' }}
                            />
                            <div className='input-group-append'>
                                {visible ? (
                                    <button
                                        type='button'
                                        className='btn btn-outline-primary'
                                        onClick={() => setVisible(false)}
                                    >
                                        <i className='fas fa-eye'></i>
                                    </button>
                                ) : (
                                    <button
                                        type='button'
                                        className='btn btn-outline-primary'
                                        onClick={() => setVisible(true)}
                                    >
                                        <i className='fas fa-eye-slash'></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className='d-flex justify-content-between'>
                        <div className='form-group form-check'>
                            <input
                                type='checkbox'
                                className='form-check-input'
                                id='exampleCheck1'
                            />
                            <label className='form-check-label' htmlFor='exampleCheck1'>
                                <p>Remember me</p>
                            </label>
                        </div>
                        <button
                            type='button'
                            className='btn btn-reset-password'
                            data-target='#reset-password'
                            data-toggle='modal'
                            onClick={() => setSentEmail(false)}
                        >
                            Lost your password?
                        </button>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => handleLogin()}
                            disabled={loadingLogin}
                        >
                            {loadingLogin ? (
                                <div>
                                    <span
                                        className='spinner-border spinner-border-sm'
                                        role='status'
                                        aria-hidden='true'
                                    ></span>
                                    Loading...
                                </div>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </div>
                </form>
                <ModalComp
                    modal_id='reset-password'
                    title='Lost your password?'
                    body={renderResetPassword()}
                    footer={
                        sentEmail ?
                        <button
                            type='button'
                            className='btn btn-primary'
                            data-dismiss='modal'
                        >
                            Close
                        </button>
                        :
                        <button
                            type='button'
                            className='btn btn-primary btn-block'
                            onClick={() => submitEmail()}
                        >
                            Reset My Password
                        </button>
                    }
                />
            </div>
        </div>
    );
};

export default Login;
