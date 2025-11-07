import React from 'react';
import Link from 'next/link';
import ModalComp from './modalComp';

const LoginAlertModal = ({ modal_id }) => {
    return (
        <ModalComp
            modal_id={modal_id ? modal_id : 'login-alert'}
            body={<p className='text-center'>You not logged in. Please Log in to our website!</p>}
            footer={
                <div>
                    <Link href='/authentication'>
                        <button
                            type='button'
                            className='btn btn-outline-primary btn-sm mr-2'
                            onClick={() => $(`#${modal_id}`).modal('hide')}
                        >
                            Login
                        </button>
                    </Link>
                    <button
                        type='button'
                        className='btn btn-outline-primary btn-sm'
                        data-dismiss='modal'
                    >
                        Close
                    </button>
                </div>
            }
        />
    );
};

export default LoginAlertModal;
