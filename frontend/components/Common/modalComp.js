import React from 'react';

const ModalComp = (props) => {
    const { modal_id, title, body, footer, data_backdrop, data_keyboard, size, scrollable } = props;

    return (
        <div
            className='modal fade'
            id={modal_id}
            data-backdrop={data_backdrop ? data_backdrop : null}
            data-keyboard={data_keyboard ? false : true}
            tabIndex='-1'
            aria-labelledby='exampleModalLabel'
            aria-hidden='true'
            role='dialog'
        >
            <div
                className={`modal-dialog modal-dialog-centered ${size ? size : ''} ${scrollable ? 'modal-dialog-scrollable' : ''}`}
                role='document'
            >
                <div className='modal-content'>
                    {title ? (
                        <div className='modal-header'>
                            <h5 className='modal-title' id='exampleModalLabel'>
                                {title}
                            </h5>
                            <button
                                type='button'
                                className='close'
                                data-dismiss='modal'
                                aria-label='Close'
                            >
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                    ) : null}
                    <div className='modal-body'>{body}</div>
                    <div className='modal-footer'>
                        {footer ? (
                            footer
                        ) : (
                            <React.Fragment>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary'
                                    data-dismiss='modal'
                                >
                                    Close
                                </button>
                            </React.Fragment>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalComp;
