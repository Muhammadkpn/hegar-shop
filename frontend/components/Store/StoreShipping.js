import {
    getStoreCourier,
    editStoreCourier,
    getAdminCourier,
} from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import ModalComp from '../Common/modalComp';

const StoreShipping = ({ type }) => {
    const [checkbox, setCheckbox] = React.useState([]);
    
    const { id, storeCourier, adminCourier } = useSelector((state) => {
        return {
            id: state.users.id,
            storeCourier: state.shipping.storeCourier,
            adminCourier: state.shipping.adminCourier,
        }
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getStoreCourier(id));
        dispatch(getAdminCourier());
    }, []);

    React.useEffect(() => {
        // dispatch(editStoreCourier({ courierId: checkbox }, id));
        // console.log(checkbox)
        const tempCourier = [];
        adminCourier.forEach((item) => {
            const checklist = storeCourier.filter((value => item.id === value.courier_id));
            if (checklist.length > 0) {
                tempCourier.push({
                    id: item.id, isChecked: true,
                });
            } else {
                tempCourier.push({
                    id: item.id, isChecked: false,
                });
            };
        });
        setCheckbox(tempCourier);
    }, [adminCourier, storeCourier]);

    const handleEditCourier = (courier_id) => {
        const tempCheckbox = [...checkbox];
        tempCheckbox.forEach((item, index) => {
            if (item.id === courier_id) {
                tempCheckbox[index].isChecked = !item.isChecked;
            }
        });
        const courierId = [];
        tempCheckbox.forEach((item) => {
            if (item.isChecked) {
                courierId.push(item.id);
            }
        });
        dispatch(editStoreCourier({ courierId }, id));
        setCheckbox(tempCheckbox);
    }

    return (
        <div className='p-3'>
            <h3 className='p-2'>Store Shipping</h3>
            <div className='row align-items-center pb-3'>
                <div className='col-md-5 col-sm-8'>
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
            </div>
            <div className='table-responsive'>
                <table className='table table-hover table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='text-center align-middle'>Main Courier</th>
                            <th className='align-middle'>Courier Code</th>
                            <th className='align-middle'>Courier Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adminCourier.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='text-center align-middle'>
                                        <input
                                            type='checkbox'
                                            name='storeCourier'
                                            checked={checkbox.filter((value) => item.id === value.id)[0]?.isChecked || false}
                                            onChange={() => handleEditCourier(item.id)}
                                        />
                                    </td>
                                    <td className='align-middle'>{item.code}</td>
                                    <td className='align-middle'>{item.name}</td>
                                </tr>
                            );
                        })}
                        {adminCourier.length === 0 ? (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={8}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreShipping;
