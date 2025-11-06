import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCategoryProduct,
    deleteCategoryProduct,
    addCategoryProduct,
    editCategoryProduct,
} from '../../store/action';
import ModalComp from '../Common/modalComp';

const SuperAdminProductCategory = () => {
    const [addData, setAddData] = useState({
        name: '',
        parent_id: null,
    });
    const [editData, setEditData] = useState({
        id: null,
        name: '',
        parent_id: null,
    });
    const [deleteData, setDeleteData] = useState(null);
    const { categoryProduct } = useSelector((state) => {
        return {
            categoryProduct: state.categoryProduct.categoryProduct,
        };
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCategoryProduct());
    }, []);

    $(function () {
        // $('[data-toggle="tooltip"]').tooltip();
        $('.editButton').tooltip({ title: 'Edit', placement: 'top' });
        $('.deleteButton').tooltip({ title: 'Delete', placement: 'top' });
        $('.submitButton').tooltip({ title: 'Submit', placement: 'top' });
        $('.cancelButton').tooltip({ title: 'Cancel', placement: 'top' });
    });

    const submitAddData = () => {
        const { name, parent_id: parentId } = addData;
        dispatch(addCategoryProduct({ name, parentId }));
        setAddData({ name: '', parent_id: null });
    };

    const renderAddCategory = () => {
        return (
            <div className='row'>
                <div className='col-md-6 col-sm-12'>
                    <div className='form-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Category Name'
                            onChange={(e) =>
                                setAddData({
                                    ...addData,
                                    name: e.target.value,
                                })
                            }
                            value={addData.name}
                        />
                    </div>
                </div>
                <div className='col-md-6 col-sm-12'>
                    <select
                        className='form-control custom-select'
                        aria-label='Example select with button addon'
                        onChange={(e) =>
                            setAddData({
                                ...addData,
                                parent_id: e.target.value,
                            })
                        }
                    >
                        <option value={'null'}>Choose Parent Category...</option>
                        {categoryProduct.map((val, index) => (
                            <option value={val.id} key={index}>
                                {val.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    const handleDeleteData = (id) => {
        setDeleteData(id);
        $('#delete_category').modal();
    };

    const submitDeleteData = () => {
        dispatch(deleteCategoryProduct(deleteData));
        setDeleteData(null);
    };

    const submitEditData = () => {
        const { id, name, parent_id: parentId } = editData;

        if (parentId !== 'null') {
            dispatch(editCategoryProduct({ name, parentId }, id));
        } else {
            dispatch(editCategoryProduct({ name, parentId: null }, id));
        }
        setEditData({ id: null, name: '', parent_id: null });
    };

    return (
        <div className='SA-product-category p-4'>
            <h3>Category</h3>
            <div className='row mb-2 align-items-center justify-content-between no-gutters'>
                <div className='col-sm-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Category Name'
                            onChange={(e) => dispatch(getCategoryProduct(`name=${e.target.value}`))}
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
                            onClick={() => $('#add_category').modal()}
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='align-middle text-center'>Id</th>
                            <th className='align-middle'>Category</th>
                            <th className='align-middle'>Parent Id</th>
                            <th className='align-middle text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryProduct.length > 0 ? (
                            categoryProduct.map((item, index) => {
                                if (editData.id === item.id) {
                                    return (
                                        <tr key={index}>
                                            <td className='align-middle text-center'>{item.id}</td>
                                            <td className='align-middle'>
                                                <input
                                                    type='text'
                                                    placeholder='Category Name'
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
                                            <td className='align-middle'>
                                                <select
                                                    className='form-control custom-select'
                                                    aria-label='Example select with button addon'
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            parent_id: e.target.value,
                                                        })
                                                    }
                                                    value={editData.parent_id}
                                                >
                                                    <option value={'null'}>
                                                        Choose Parent Category...
                                                    </option>
                                                    {categoryProduct.map((val, index) => {
                                                        if (val.id !== item.id) {
                                                            return (
                                                                <option value={val.id} key={index}>
                                                                    {val.name}
                                                                </option>
                                                            );
                                                        }
                                                    })}
                                                </select>
                                            </td>
                                            <td className='align-middle text-center'>
                                                <button
                                                    type='button'
                                                    className='btn cancelButton'
                                                    onClick={() =>
                                                        setEditData({
                                                            id: null,
                                                            name: '',
                                                            parent_id: null,
                                                        })
                                                    }
                                                >
                                                    <i className='bx bx-x bx-sm'></i>
                                                </button>
                                                <button
                                                    type='button'
                                                    className='btn submitButton'
                                                    onClick={() => $('#edit_category').modal()}
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
                                            <td className='align-middle'>
                                                {
                                                    categoryProduct.filter(
                                                        (val) => item.parent_id === val.id
                                                    )[0]?.name
                                                }
                                            </td>
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
                modal_id='add_category'
                title='Add Category'
                body={renderAddCategory()}
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setAddData({ id: null, name: '', parent_id: null })}
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
                modal_id='edit_category'
                title='Confirmation Edit Category'
                body='Do you want to edit this category?'
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setEditData({ id: null, name: '', parent_id: null })}
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
                modal_id='delete_category'
                title='Confirmation Delete Category'
                body='Do you want to delete this category?'
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

export default SuperAdminProductCategory;
