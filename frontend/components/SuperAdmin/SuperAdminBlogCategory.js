import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getCategoryBlog,
    addCategoryBlog,
    editCategoryBlog,
    deleteCategoryBlog,
} from '../../store/action';
import ModalComp from '../Common/modalComp';

const SuperAdminBlogCategory = () => {
    const [addData, setAddData] = React.useState('');
    const [editData, setEditData] = React.useState({
        id: null,
        name: '',
    });
    const [deleteData, setDeleteData] = React.useState(null);

    const { categoryBlog } = useSelector((state) => {
        return {
            categoryBlog: state.categoryBlog.categoryBlog,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getCategoryBlog());
    }, []);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    const submitAddData = () => {
        dispatch(addCategoryBlog({ name: addData }));
        setAddData('');
    };

    const renderAddCategory = () => {
        return (
            <div className='d-flex justify-content-center'>
                <div className='form-group'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Category Name'
                        onChange={(e) => setAddData(e.target.value)}
                        value={addData}
                    />
                </div>
            </div>
        );
    };

    const handleDeleteData = (id) => {
        setDeleteData(id);
        $('#delete_category').modal();
    };

    const submitDeleteData = () => {
        dispatch(deleteCategoryBlog(deleteData));
        setDeleteData(null);
    };

    const submitEditData = () => {
        const { id, name } = editData;

        dispatch(editCategoryBlog({ name }, id));
        setEditData({ id: null, name: '' });
    };

    return (
        <div className='SA-blog-category p-4'>
            <h3>Blog Category</h3>
            <div className='row mb-2 align-items-center justify-content-between no-gutters'>
                <div className='col-md-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Category Name'
                            onChange={(e) => dispatch(getCategoryBlog(`name=${e.target.value}`))}
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
                            <th className='align-middle text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryBlog.length > 0 ? (
                            categoryBlog.map((item, index) => {
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
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='top'
                                                        title='Cancel'
                                                    >
                                                        <i className='bx bx-x bx-sm'></i>
                                                    </div>
                                                </button>
                                                <button
                                                    type='button'
                                                    className='btn submitButton'
                                                    onClick={() => $('#edit_category').modal()}
                                                >
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='top'
                                                        title='Submit'
                                                    >
                                                        <i className='bx bx-check bx-sm'></i>
                                                    </div>
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
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='top'
                                                        title='Edit'
                                                    >
                                                        <i className='bx bxs-pencil'></i>
                                                    </div>
                                                </button>
                                                <button
                                                    type='button'
                                                    className='btn deleteButton'
                                                    onClick={() => handleDeleteData(item.id)}
                                                >
                                                    <div
                                                        data-toggle='tooltip'
                                                        data-placement='top'
                                                        title='Delete'
                                                    >
                                                        <i className='bx bxs-trash-alt'></i>
                                                    </div>
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
                title='Add Blog Category'
                body={renderAddCategory()}
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
                modal_id='edit_category'
                title='Confirmation edit Category'
                body='Do you want to edit this category?'
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

export default SuperAdminBlogCategory;
