import { getEmailSubscribe, addEmailSubscribe } from '../../store/action';
import { useDispatch } from 'react-redux';
import React from 'react';
import ModalComp from './modalComp';

const Subscribe = () => {
    const [email, setEmail] = React.useState('');
    const regex =
        /^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/;

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getEmailSubscribe());
    }, []);

    return (
        <div className='subscribe'>
            <h4>Subscribe to newsletter</h4>
            <div className='input-group mb-3'>
                <div className='input-group-prepend'>
                    <div className='input-group-text search-form'>
                        <i className='search-btn far fa-envelope'></i>
                    </div>
                </div>
                <input
                    type='email'
                    name='email'
                    className='form-control'
                    placeholder='Your email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <button
                    type='button'
                    disabled={
                        !/^([a-z]|[0-9]|[A-Z])+([\.-]?([a-z]|[0-9]|[A-Z])+)*@([a-z]){2,}([\.]?[a-z]{2,})*(\.[a-z]{2,3})+$/.test(
                            email
                        )
                    }
                    className='btn btn-subscribe'
                    data-toggle='modal'
                    data-target='#add_email'
                    onClick={() => dispatch(addEmailSubscribe({ email }))}
                >
                    Subscribe
                </button>
            </div>
            <p>*Receive early discount offers, updates and new products info.</p>
            <ModalComp
                modal_id='add_email'
                body={<p className='text-center'>Your email has been subscribed to our website</p>}
            />
        </div>
    );
};

export default Subscribe;
