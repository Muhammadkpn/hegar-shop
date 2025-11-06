import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTagProduct, addTagProduct, editTagProduct, deleteTagProduct } from '../../store/action';
import ModalComp from '../Common/modalComp';

const SuperAdminProductTag = () => {
    const [addData, setAddData] = useState('');
    const [editData, setEditData] = useState({
        id: null,
        name: '',
    });
    const [deleteData, setDeleteData] = useState(null);
    const { tagProduct } = useSelector((state) => {
        return {
            tagProduct: state.tagProduct.tagProduct,
        };
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTagProduct());
    }, []);

    $(function () {
        // $('[data-toggle="tooltip"]').tooltip();
        $('.editButton').tooltip({ title: 'Edit', placement: 'top' });
        $('.deleteButton').tooltip({ title: 'Delete', placement: 'top' });
        $('.submitButton').tooltip({ title: 'Submit', placement: 'top' });
        $('.cancelButton').tooltip({ title: 'Cancel', placement: 'top' });
    });

    const submitAddData = () => {
        dispatch(addTagProduct({ name: addData }));
        setAddData('');
    };
    const renderAddTag = () => {
        return (
            <div className='d-flex justify-content-center'>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Tag Name'
                        onChange={(e) => setAddData(e.target.value)}
                        value={addData}
                    />
                </div>
            </div>
        );
    };

    const handleDeleteData = (id) => {
        setDeleteData(id);
        $('#delete_tag').modal();
    };

    const submitDeleteData = () => {
        dispatch(deleteTagProduct(deleteData));
        setDeleteData(null);
    };

    const submitEditData = () => {
        const { id, name } = editData;

        dispatch(editTagProduct({ name }, id));
        setEditData({ id: null, name: '' });
    };

    return (
        <div className='SA-product-tag p-4'>
            <h3>Tag</h3>
            <div className='row mb-2 align-items-center justify-content-between no-gutters'>
                <div className='col-sm-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Tag Name'
                            onChange={(e) => dispatch(getTagProduct(`name=${e.target.value}`))}
                        />
                        <div className='input-group-append'>
                            <button type='button' className='btn btn-primary'>
                                <i className='bx bx-search-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className='dropdown my-2'>
                        <button
                            type='button'
                            className='btn btn-primary'
                            onClick={() => $('#add_tag').modal()}
                        >
                            Add Tag
                        </button>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='align-middle text-center'>Id</th>
                            <th className='align-middle'>Tag</th>
                            <th className='align-middle text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tagProduct.length > 0 ? (
                            tagProduct.map((item, index) => {
                                if (editData.id === item.id) {
                                    return (
                                        <tr key={index}>
                                            <td className='align-middle text-center'>{item.id}</td>
                                            <td className='align-middle'>
                                                <input
                                                    type='text'
                                                    placeholder='Tag Name'
                                                    className='form-control'
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            name: e.target.value,
                                                        })
                                                    }
                                                    value={editData.name}
                                                />
                                            </td>
                                            <td className='align-middle text-center'>
                                                <button
                                                    type='button'
                                                    className='btn cancelButton'
                                                    onClick={() =>
                                                        setEditData({
                                                            id: null,
                                                            name: '',
                                                        })
                                                    }
                                                >
                                                    <i className='bx bx-x bx-sm'></i>
                                                </button>
                                                <button
                                                    type='button'
                                                    className='btn submitButton'
                                                    onClick={() => $('#edit_tag').modal()}
                                                >
                                                    <i className='bx bx-check bx-sm'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr key={index}>
                                            <td className='align-middle text-center'>{item.id}</td>
                                            <td className='align-middle'>{item.name}</td>
                                            <td className='align-middle text-center'>
                                                <button
                                                    type='button'
                                                    className='btn editButton'
                                                    onClick={() => {
                                                        setEditData(item);
                                                    }}
                                                >
                                                    <i className='bx bxs-pencil'></i>
                                                </button>
                                                <button
                                                    type='button'
                                                    className='btn deleteButton'
                                                    onClick={() => handleDeleteData(item.id)}
                                                >
                                                    <i className='bx bxs-trash-alt'></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            })
                        ) : (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={5}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id='add_tag'
                title='Add Tag'
                body={renderAddTag()}
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setAddData('')}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitAddData()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id='edit_tag'
                title='Confirmation Edit Tag'
                body='Do you want to edit this tag?'
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setEditData({ id: null, name: '' })}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitEditData()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id='delete_tag'
                title='Confirmation Delete Tag'
                body='Do you want to delete this tag?'
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setDeleteData(null)}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitDeleteData()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default SuperAdminProductTag;
