import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, editUser } from '../../store/action';
import ModalComp from '../Common/modalComp';

const SuperAdminUsers = () => {
    const [emailStatus, setEmailStatus] = React.useState({
        email: null,
        id: null,
    });
    const [userStatus, setUserStatus] = React.useState({
        username: null,
        id: null,
    });
    const [search, setSearch] = React.useState('');
    const [editData, setEditData] = React.useState({
        user_id: null,
        username: '',
        email: '',
        status: null,
    });

    const { users } = useSelector((state) => {
        return {
            users: state.users.users,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getUser('type=admin'));
    }, []);

    React.useEffect(() => {
        if (emailStatus.email && userStatus.username && search) {
            dispatch(
                getUser(
                    `type=admin&emailStatus=${emailStatus.id}&userStatus=${userStatus.id}&name=${search}`
                )
            );
        } else if (emailStatus.email && userStatus.username) {
            dispatch(
                getUser(`type=admin&emailStatus=${emailStatus.id}&userStatus=${userStatus.id}`)
            );
        } else if (emailStatus.email && search) {
            dispatch(getUser(`type=admin&emailStatus=${emailStatus.id}&name=${search}`));
        } else if (userStatus.username && search) {
            dispatch(getUser(`type=admin&userStatus=${userStatus.id}&name=${search}`));
        } else if (emailStatus.email) {
            dispatch(getUser(`type=admin&emailStatus=${emailStatus.id}`));
        } else if (userStatus.username) {
            dispatch(getUser(`type=admin&userStatus=${userStatus.id}`));
        } else if (search) {
            dispatch(getUser(`type=admin&name=${search}`));
        } else {
            dispatch(getUser('type=admin'));
        }
    }, [userStatus, emailStatus, search]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    const handleEditEmailStatus = (status, user_id, email) => {
        setEditData({ ...editData, user_id, email, status });
        $('#edit_email_status').modal();
    };

    const submitEditEmailStatus = () => {
        const { user_id, status } = editData;

        dispatch(editUser({ email_status_id: status }, user_id, 'admin'));
        setEditData({ user_id: null, username: '', email: '' });
    };

    const handleEditUserStatus = (status, user_id, username) => {
        setEditData({ ...editData, user_id, username, status });
        $('#edit_user_status').modal();
    };

    const submitEditUserStatus = () => {
        const { user_id, status } = editData;

        dispatch(editUser({ user_status_id: status }, user_id, 'admin'));
        setEditData({ user_id: null, username: '', email: '' });
    };

    return (
        <div className='SA-users p-4'>
            <h3>Users</h3>
            <div className='row mb-2 align-items-center'>
                <div className='col-md-10 col-sm-12'>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend' id='button-addon3'>
                            <div className='dropdown'>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary dropdown-toggle h-100 border-secondary border-right-0'
                                    id='userStatus'
                                    data-toggle='dropdown'
                                    aria-haspopup='true'
                                    aria-expanded='false'
                                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                >
                                    {userStatus.username || 'All User Status'}
                                </button>
                                <div className='dropdown-menu' aria-labelledby='userStatus'>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() => setUserStatus({ username: null, id: null })}
                                    >
                                        All User Status
                                    </button>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() =>
                                            setUserStatus({ username: 'User Active', id: 1 })
                                        }
                                    >
                                        User Active
                                    </button>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() =>
                                            setUserStatus({ username: 'User Inactive', id: 2 })
                                        }
                                    >
                                        User Inactive
                                    </button>
                                </div>
                            </div>
                            <div className='dropdown'>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary dropdown-toggle h-100 border-secondary border-right-0 rounded-0'
                                    id='emailStatus'
                                    data-toggle='dropdown'
                                    aria-haspopup='true'
                                    aria-expanded='false'
                                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                >
                                    {emailStatus.email || 'All Email Status'}
                                </button>
                                <div className='dropdown-menu' aria-labelledby='emailStatus'>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() => setEmailStatus({ email: null, id: null })}
                                    >
                                        All Email Status
                                    </button>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() =>
                                            setEmailStatus({ email: 'Email Active', id: 1 })
                                        }
                                    >
                                        Email Active
                                    </button>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() =>
                                            setEmailStatus({ email: 'Email Inactive', id: 2 })
                                        }
                                    >
                                        Email Inactive
                                    </button>
                                </div>
                            </div>
                        </div>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search username or email'
                            aria-label='Example text with two button addons'
                            aria-describedby='button-addon3'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <div className='input-group-append' id='button-addon3'>
                            <button type='button' className='btn btn-primary border-left-0'>
                                <i className='bx bx-search-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='align-middle text-center'>Id</th>
                            <th className='align-middle'>Username</th>
                            <th className='align-middle text-center'>User Status</th>
                            <th className='align-middle text-center'>Email</th>
                            <th className='align-middle text-center'>Email Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='align-middle text-center'>{item.id}</td>
                                        <td className='align-middle'>{item.username}</td>
                                        <td className='align-middle text-center'>
                                            {item.user_status_id === 1 ? (
                                                <button
                                                    type='button'
                                                    className='btn text-primary'
                                                    onClick={() =>
                                                        handleEditUserStatus(
                                                            2,
                                                            item.id,
                                                            item.username
                                                        )
                                                    }
                                                >
                                                    <u>Active</u>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn'
                                                    onClick={() =>
                                                        handleEditUserStatus(
                                                            1,
                                                            item.id,
                                                            item.username
                                                        )
                                                    }
                                                >
                                                    Inactive
                                                </button>
                                            )}
                                        </td>
                                        <td className='align-middle text-center'>{item.email}</td>
                                        <td className='align-middle text-center'>
                                            {item.email_status_id === 1 ? (
                                                <button
                                                    type='button'
                                                    className='btn text-primary'
                                                    onClick={() =>
                                                        handleEditEmailStatus(
                                                            2,
                                                            item.id,
                                                            item.email
                                                        )
                                                    }
                                                >
                                                    <u>Active</u>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn'
                                                    onClick={() =>
                                                        handleEditEmailStatus(
                                                            1,
                                                            item.id,
                                                            item.email
                                                        )
                                                    }
                                                >
                                                    Inactive
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
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
                modal_id='edit_email_status'
                title='Confirmation edit email status'
                body={`Do you want to edit email status of ${editData.email}?`}
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setEditData({ id: null, name: '', email: '' })}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitEditEmailStatus()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id='edit_user_status'
                title='Confirmation edit user status'
                body={`Do you want to edit user status of ${editData.username}?`}
                footer={
                    <div className='mx-auto'>
                        <button
                            type='button'
                            className='btn btn-primary mr-2'
                            data-dismiss='modal'
                            onClick={() => setEditData({ id: null, name: '', email: '' })}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitEditUserStatus()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
        </div>
    );
};

export default SuperAdminUsers;
