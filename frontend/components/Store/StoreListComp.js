import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../store/action';
import React from 'react';
import StoreCard from '../../components/Common/StoreCard';

const StoreListComp = (props) => {
    const [pages, setPages] = React.useState(1);
    const [search, setSearch] = React.useState('');
    const [sort, setSort] = React.useState({ icon: '', name: '', query: '', });
    const { users } = useSelector((state) => {
        return {
            users: state.users.users,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getUser('type=store'));
    }, []);

    React.useEffect(() => {
        if (search && sort.query) {
            dispatch(getUser(`type=store&name=${search}&${sort.query}`))
        } else if (search) {
            dispatch(getUser(`type=store&name=${search}`))
        } else if (sort.query) {
            dispatch(getUser(`type=store&${sort.query}`))
        } else {
            dispatch(getUser(`type=store`))
        }
    }, [sort.query, search])

    return (
        <div>
            <div className='filter-container'>
                <div className='row no-gutters align-items-center'>
                    <div className='col-md-6'>
                        <div className='input-group'>
                            <div className='input-group-prepend'>
                                <button className='btn btn-outline-secondary' type='button'>
                                    <i className='fas fa-search'></i>
                                </button>
                            </div>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Search for Name of Store'
                                aria-describedby='basic-addon2'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='dropdown d-flex justify-content-center'>
                            <button
                                className='btn btn-secondary dropdown-toggle'
                                type='button'
                                id='dropdownMenuButton'
                                data-toggle='dropdown'
                                aria-haspopup='true'
                                aria-expanded='false'
                            >
                                <i className={`bx ${sort.icon || 'bx-flag'}`}></i>&nbsp;
                                {sort.name || 'Newest'}
                            </button>

                            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                                <a
                                    className='dropdown-item'
                                    onClick={() => setSort({ icon: 'bx-flag', name: 'Newest', query: '', })}
                                >
                                    <i className='bx bx-flag'></i>&nbsp;Newest
                                </a>
                                <a
                                    className='dropdown-item'
                                    onClick={() => setSort({ icon: 'bx-chevron-up', name: 'A-Z', query: '_sort=uk.full_name&_order=ASC', })}
                                >
                                    <i className='bx bx-chevron-up'></i>&nbsp;A-Z
                                </a>
                                <a
                                    className='dropdown-item'
                                    onClick={() => setSort({ icon: 'bx-chevron-down', name: 'Z-A', query: '_sort=uk.full_name&_order=DESC', })}
                                >
                                    <i className='bx bx-chevron-down'></i>&nbsp;Z-A
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-3'>
                        <div className='pagination'>
                            <div className='mr-1'>
                                <p>
                                    Pages {pages}/{Math.ceil(users.length / 12)}
                                </p>
                            </div>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={pages === 1 ? true : false}
                                onClick={() => setPages((prev) => prev - 1)}
                            >
                                <i className='bx bx-chevron-left bx-md'></i>
                            </button>
                            <button
                                type='button'
                                className='btn btn-outline-primary'
                                disabled={pages === Math.ceil(users.length / 12) ? true : false}
                                onClick={() => setPages((prev) => prev + 1)}
                            >
                                <i className='bx bx-chevron-right bx-md'></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row p-2 m-0 mx-auto'>
                {users?.map((item, index) => {
                    return (
                        <div key={index} className='col-sm-6 col-md-3 p-2'>
                            <StoreCard data={item} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StoreListComp;
