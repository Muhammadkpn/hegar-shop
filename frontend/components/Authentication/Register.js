import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userRegister } from '../../store/action';

const Register = ({ type }) => {
    const [visible1, setVisible1] = React.useState(false);
    const [visible2, setVisible2] = React.useState(false);
    const [register, setRegister] = React.useState({
        username: '',
        email: '',
        password: '',
        confPassword: '',
    });
    const { errorReg, loadingRegister } = useSelector((state) => {
        return {
            errorReg: state.users.errorReg,
            loadingRegister: state.users.loadingRegister,
        };
    });
    const dispatch = useDispatch();
    const handleRegister = () => {
        const { username, email, password, confPassword } = register;
        let role_id;
        if (type === 'admin') {
            role_id = 1;
        } else {
            role_id = 3;
        }
        const body = { username, email, password, confPassword, roleId: role_id };
        dispatch(userRegister(body));
    };

    return (
        <div className='card'>
            <div className='card-body'>
                <h3 className='card-title'>{type === 'users' ? 'Register' : 'Register Admin'}</h3>
                {errorReg ? <div className='alert alert-danger'>{errorReg}</div> : null}
                <form>
                    <div className='form-group'>
                        <label htmlFor='exampleInputEmail1'>
                            <p>Username</p>
                        </label>
                        <div className='input-group mb-3'>
                            <div className='input-group-prepend'>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    id='basic-addon1'
                                >
                                    <i className='fas fa-user'></i>
                                </button>
                            </div>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='username'
                                aria-describedby='basic-addon1'
                                onChange={(e) =>
                                    setRegister({ ...register, username: e.target.value })
                                }
                            />
                        </div>
                    </div>
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
                                >
                                    <i className='fas fa-envelope'></i>
                                </button>
                            </div>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='example@email.com'
                                aria-describedby='emailHelp'
                                onChange={(e) =>
                                    setRegister({ ...register, email: e.target.value })
                                }
                            />
                        </div>
                        <small id='emailHelp' className='form-text text-muted'>
                            We'll never share your email with anyone else.
                        </small>
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
                                    setRegister({ ...register, password: e.target.value })
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
                                    setRegister({ ...register, confPassword: e.target.value })
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
                            onClick={() => handleRegister()}
                            disabled={loadingRegister}
                        >
                            {loadingRegister ? (
                                <div>
                                    <span
                                        className='spinner-border spinner-border-sm'
                                        role='status'
                                        aria-hidden='true'
                                    ></span>
                                    Loading...
                                </div>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
