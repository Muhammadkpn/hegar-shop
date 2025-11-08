import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editKtpStatus, getKtp } from '../../store/action';
import { getFullImageUrl } from '../../store/helpers';
import ModalComp from '../Common/modalComp';

const SuperAdminKtp = () => {
    const [editStatus, setEditStatus] = React.useState({
        old_status_id: null,
        new_status_id: null,
        user_id: null,
        ktp_image: '',
    });
    const [filterKtp, setFilterKtp] = React.useState({
        search: '',
        status: null,
    });
    const { ktp } = useSelector((state) => {
        return {
            ktp: state.profile.ktp,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getKtp());
    }, []);

    React.useEffect(() => {
        const { search, status } = filterKtp;
        if (status === 'Active') {
            dispatch(getKtp(`status=1&search=${search}`));
        } else if (status === 'Inactive') {
            dispatch(getKtp(`status=2&search=${search}`));
        } else {
            dispatch(getKtp(`search=${search}`));
        }
    }, [filterKtp]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('.carousel').carousel();
    });

    const renderChangeStatus = () => {
        const { old_status_id, new_status_id, user_id, ktp_image } = editStatus;
        return (
            <div>
                <p className='text-center mb-0'>Are you sure to change the status of this KTP?</p>
                <div>
                    <img className='img' src={getFullImageUrl(ktp_image)} />
                    <div className='dropdown my-2'>
                        <button
                            className='btn btn-outline-primary dropdown-toggle btn-block'
                            type='button'
                            id='oldStatusButton'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {new_status_id === 1
                                ? 'Active'
                                : new_status_id === 2
                                ? 'Inactive'
                                : 'Status KTP'}
                        </button>
                        <div className='dropdown-menu'>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setEditStatus({ ...editStatus, new_status_id: 1 })}
                            >
                                Active
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setEditStatus({ ...editStatus, new_status_id: 2 })}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-center'>
                    <button
                        type='button'
                        className='btn btn-primary mr-2'
                        data-dismiss='modal'
                        onClick={() =>
                            setEditStatus({
                                user_id: null,
                                new_status_id: null,
                                old_status_id: null,
                                ktp_image: '',
                            })
                        }
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary ml-2'
                        data-dismiss='modal'
                        disabled={old_status_id === new_status_id}
                        onClick={() => dispatch(editKtpStatus({ ktpStatusId: new_status_id }, user_id))}
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className='SA-products'>
            <h3>KTP</h3>
            <div className='row mb-2 align-items-center justify-content-between no-gutters'>
                <div className='col-md-6'>
                    <div className='input-group'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search Full Name or Ktp Number'
                            onChange={(e) => setFilterKtp({ ...filterKtp, search: e.target.value })}
                            value={filterKtp.search}
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
                            className='btn btn-primary dropdown-toggle'
                            type='button'
                            id='filterKtp'
                            data-toggle='dropdown'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {filterKtp.status || 'All Ktp Status'}
                        </button>

                        <div className='dropdown-menu' aria-labelledby='filterKtp'>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() =>
                                    setFilterKtp({ ...filterKtp, status: 'All Ktp Status' })
                                }
                            >
                                All Ktp Status
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterKtp({ ...filterKtp, status: 'Active' })}
                            >
                                Active
                            </button>
                            <button
                                type='button'
                                className='btn dropdown-item'
                                onClick={() => setFilterKtp({ ...filterKtp, status: 'Inactive' })}
                            >
                                Inactive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th>Name</th>
                            <th>Ktp Number</th>
                            <th>Date of Birth</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ktp.length > 0 ? (
                            ktp.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='align-middle'>{item.full_name}</td>
                                        <td className='align-middle'>{item.ktp_number}</td>
                                        <td className='align-middle'>{`${
                                            item.birthplace
                                        }, ${new Date(item.birthdate).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}`}</td>
                                        <td className='align-middle'>{item.gender}</td>
                                        <td className='align-middle'>{item.address}</td>
                                        <td className='align-middle'>
                                            {item.ktp_status_id === 1 ? (
                                                <p className='text-success text-center'>Active</p>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn'
                                                    data-target='#change_ktp_status'
                                                    data-toggle='modal'
                                                    onClick={() =>
                                                        setEditStatus({
                                                            user_id: item.user_id,
                                                            old_status_id: item.ktp_status_id,
                                                            new_status_id: item.ktp_status_id,
                                                            ktp_image: item.ktp_image,
                                                        })
                                                    }
                                                >
                                                    <u className='text-danger'>Inactive</u>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={6}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id='change_ktp_status'
                title='Activation of User KTP'
                body={renderChangeStatus()}
            />
        </div>
    );
};

export default SuperAdminKtp;
