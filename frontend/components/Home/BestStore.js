import { getUser } from '../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import StoreCard from '../Common/StoreCard';

const BestStore = () => {
    const { users } = useSelector((state) => {
        return {
            users: state.users.users,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getUser('type=store'));
    }, []);

    return (
        <div className='container-best-store'>
            <h1 className='section-title'>Store of the Month</h1>
            <div className='row no-gutters'>
                {users.slice(0, 4).map((item, index) => {
                    return (
                        <div key={index} className='col-lg-3 col-md-6 col-sm-12 p-2'>
                            <StoreCard data={item} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BestStore;
