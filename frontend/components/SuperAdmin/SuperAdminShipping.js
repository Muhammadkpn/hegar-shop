import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAdminCourier,
    editAdminCourier,
    addAdminCourier,
    deleteAdminCourier,
} from '../../store/action';
import ModalComp from '../Common/modalComp';

const SuperAdminShipping = () => {
    const [addData, setAddData] = React.useState({
        code: '',
        name: '',
    });
    const [editData, setEditData] = React.useState({
        id: null,
        code: '',
        name: '',
    });
    const [deleteData, setDeleteData] = React.useState(null);

    const { adminCourier } = useSelector((state) => {
        return {
            adminCourier: state.shipping.adminCourier,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getAdminCourier());
    }, []);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    const submitAddData = () => {
        dispatch(addAdminCourier({ ...addData }));
        setAddData({ code: '', name: '', });
    };

    const renderAddCourier = () => {
        return (
            <div className='row'>
                <div className='col-lg-6 col-sm-12'>
                    <div className='form-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Courier Code'
                            onChange={(e) => setAddData({... addData, code: e.target.value })}
                            value={addData.code}
                        />
                    </div>
                </div>
                <div className='col-lg-6 col-sm-12'>
                    <div className='form-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Courier Name'
                            onChange={(e) => setAddData({ ...addData, name: e.target.value })}
                            value={addData.name}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const handleDeleteData = (id) => {
        setDeleteData(id);
        $('#delete_courier').modal();
    };

    const submitDeleteData = () => {
        dispatch(deleteAdminCourier(deleteData));
        setDeleteData(null);
    };

    const submitEditData = () => {
        const { id, name, code } = editData;

        dispatch(editAdminCourier({ name, code }, id));
        setEditData({ id: null, name: '', code: '', });
    };

    return (
        <div className='SA-shipping p-4'>
            <h3>Shipping</h3>
            <div className='row mb-2 align-items-center justify-content-between no-gutters'>
                <div className='col-md-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search code or name of courier'
                            onChange={(e) => dispatch(getAdminCourier(`search=${e.target.value}`))}
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
                            onClick={() => $('#add_courier').modal()}
                        >
                            Add Courier
                        </button>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='align-middle text-center'>Id</th>
                            <th className='align-middle'>Courier Code</th>
                            <th className='align-middle'>Courier Name</th>
                            <th className='align-middle text-center'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminCourier.length > 0 ? (
                            adminCourier.map((item, index) => {
                                if (editData.id === item.id) {
                                    return (
                                        <tr key={index}>
                                            <td className='align-middle text-center'>{item.id}</td>
                                            <td className='align-middle'>
                                                <input
                                                    type='text'
                                                    placeholder='Courier Code'
                                                    className='form-control'
                                                    onChange={(e) =>
                                                        setEditData({
                                                            ...editData,
                                                            code: e.target.value,
                                                        })
                                                    }
                                                    value={editData.code}
                                                />
                                            </td>
                                            <td className='align-middle'>
                                                <input
                                                    type='text'
                                                    placeholder='Courier Name'
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
                                                            code: '',
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
                                                    onClick={() => $('#edit_courier').modal()}
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
                                            <td className='align-middle'>{item.code}</td>
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
                modal_id='add_courier'
                title='Add Blog Category'
                body={renderAddCourier()}
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setAddData({ code: '', name: ''})}
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
                modal_id='edit_courier'
                title='Confirmation edit Courier'
                body='Do you want to edit this courier?'
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
                modal_id='delete_courier'
                title='Confirmation Delete Courier'
                body='Do you want to delete this courier?'
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

export default SuperAdminShipping;
