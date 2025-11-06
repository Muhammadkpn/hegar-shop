import React from 'react';
import ModalComp from './modalComp';

const WishlistModal = ({ modal_id }) => {
    return (
        <div>
            <ModalComp
                modal_id={modal_id ? modal_id[0] : 'add-wishlist'}
                body={<p className='text-center'>This product has been added to wishlist</p>}
                footer={
                    <button
                        type='button'
                        className='btn btn-outline-primary btn-sm'
                        data-dismiss='modal'
                    >
                        Close
                    </button>
                }
            />
            <ModalComp
                modal_id={modal_id ? modal_id[1] : 'remove-wishlist'}
                body={<p className='text-center'>This product has been removed from wishlist</p>}
                footer={
                    <button
                        type='button'
                        className='btn btn-outline-primary btn-sm'
                        data-dismiss='modal'
                    >
                        Close
                    </button>
                }
            />
        </div>
    );
};

export default WishlistModal;
