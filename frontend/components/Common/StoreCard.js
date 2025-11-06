import Link from 'next/link'
import React from 'react'
import {URL_IMG} from '../../store/helpers'

const StoreCard = (props) => {
    const {id, full_name, status_store_id, city, province, phone, image} = props.data
    return (
        <div>
            <div className="card store-card">
                <div className="card bg-light text-white">
                    <img src='https://images.unsplash.com/photo-1483794344563-d27a8d18014e?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTZ8fHNpbXBsZSUyMGJhY2tncm91bmR8ZW58MHwwfDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60' className="card-img" alt="store-img"/>
                    <div className="card-img-overlay">
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="card-title text-truncate">{full_name}</h3>
                            <p className="status-store">{status_store_id ? `Open` : `Close`}</p>
                        </div>
                        <p>{`${city}, ${province}`}</p>
                        <p><i className="fas fa-phone"></i>&nbsp;{phone}</p>
                    </div>
                </div>
                <div className="card-footer">
                    <Link href={`/store/${id}`}>
                        <a className="btn btn-outline-primary">Visit store<i className='bx bx-chevron-right'></i></a>
                    </Link>
                    <img src={`${URL_IMG}/${image}`} className="img-store"/>
                </div>
            </div>
        </div>
    )
}

export default StoreCard;