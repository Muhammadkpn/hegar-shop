import { withRouter } from 'next/router';
import React, { Component } from 'react';
import { URL_IMG } from '../../store/helpers';
import { connect } from 'react-redux';
import ProductCard from '../Common/ProductCard';

class ProductDetailsTab extends Component {
    openTabSection = (evt, tabName) => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName('tab-panea');
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].classList.remove('fadeInUp');
            tabcontent[i].style.display = 'none';
        }

        tablinks = document.getElementsByTagName('li');
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace('current', '');
        }

        document.getElementById(tabName).style.display = 'block';
        document.getElementById(tabName).className += ' fadeInUp animated';
        evt.currentTarget.className += 'current';
    };

    render() {
        const { description, store, productReview, productStore, rating, wishlist, user_id } = this.props;
        const { id } = this.props.router.query;
        let star1 = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.round(rating)) {
                star1.push('bx bxs-star');
            } else {
                star1.push('bx bx-star');
            }
        }
        return (
            <div className='tab products-details-tab'>
                <ul className='nav nav-tabs' id='myTab' role='tablist'>
                    <li
                        className='current'
                        role='presentation'
                        onClick={(e) => {
                            e.preventDefault();
                            this.openTabSection(e, 'description-tab');
                        }}
                    >
                        <a
                            className='nav-link active'
                            id='description-tab'
                            data-toggle='tab'
                            href='#description'
                            role='tab'
                            aria-controls='description'
                            aria-selected='true'
                        >
                            Description
                        </a>
                    </li>
                    <li
                        role='presentation'
                        onClick={(e) => {
                            e.preventDefault();
                            this.openTabSection(e, 'store-tab');
                        }}
                    >
                        <a
                            className='nav-link'
                            id='store-tab'
                            data-toggle='tab'
                            href='#store'
                            role='tab'
                            aria-controls='store'
                            aria-selected='false'
                        >
                            Store Info
                        </a>
                    </li>
                    <li
                        role='presentation'
                        onClick={(e) => {
                            e.preventDefault();
                            this.openTabSection(e, 'review-tab');
                        }}
                    >
                        <a
                            className='nav-link'
                            id='review-tab'
                            data-toggle='tab'
                            href='#review'
                            role='tab'
                            aria-controls='review'
                            aria-selected='false'
                        >
                            Review
                        </a>
                    </li>
                    <li
                        role='presentation'
                        onClick={(e) => {
                            e.preventDefault();
                            this.openTabSection(e, 'more-products-tab');
                        }}
                    >
                        <a
                            className='nav-link'
                            id='more-products-tab'
                            data-toggle='tab'
                            href='#more-products'
                            role='tab'
                            aria-controls='more-products'
                            aria-selected='false'
                        >
                            More Products
                        </a>
                    </li>
                </ul>
                <div className='tab-content' id='myTabContent'>
                    <div
                        className='tab-pane fade show active'
                        id='description'
                        role='tabpanel'
                        aria-labelledby='description-tab'
                    >
                        <div className='products-details-tab-content'>
                            <div
                                dangerouslySetInnerHTML={{ __html: description.description || '' }}
                            />
                        </div>
                    </div>
                    <div
                        className='tab-pane fade'
                        id='store'
                        role='tabpanel'
                        aria-labelledby='store-tab'
                    >
                        <div className='products-details-tab-content'>
                            <div className='table-responsive'>
                                <table className='table table-bordered'>
                                    <tbody>
                                        <tr>
                                            <td>Store Name</td>
                                            <td>{store.store_name}</td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td>
                                                {store.status_id === 1 ? 'Active' : 'Non-active'}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>{store.mainAddress}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div
                        className='tab-pane fade'
                        id='review'
                        role='tabpanel'
                        aria-labelledby='review-tab'
                    >
                        <div className='products-details-tab-content'>
                            {rating > 0 ?
                            <div className='products-review-form'>
                                <h3>Customer Reviews</h3>

                                <div className='review-title'>
                                    <div className='rating'>
                                        {star1.map((item, index) => {
                                            return <i key={index} className={item}></i>;
                                        })}
                                        <span> ({rating || 0}/5)</span>
                                    </div>
                                    <p>Based on {productReview.length} reviews</p>
                                </div>

                                <div className='review-comments'>
                                    {productReview.map((item, index) => {
                                        let star2 = [];
                                        for (let i = 1; i <= 5; i++) {
                                            if (i <= Math.round(item.rating)) {
                                                star2.push('bx bxs-star');
                                            } else {
                                                star2.push('bx bx-star');
                                            }
                                        }
                                        return (
                                            <div className='review-item' key={index}>
                                                <div className='rating'>
                                                    {star2.map((item, index) => {
                                                        return <i key={index} className={item}></i>;
                                                    })}
                                                </div>
                                                {/* <h3>Good</h3> */}
                                                <span>
                                                    <strong>{item.full_name}</strong> on{' '}
                                                    <strong>
                                                        {new Date(item.date).toLocaleDateString()}
                                                    </strong>
                                                </span>
                                                <p>{item.comment}</p>
                                                {(item.image || []).map((value, idx) => {
                                                    return (
                                                        <img src={`${URL_IMG}/${value}`} className='img-review' key={idx}/>
                                                    )
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            :
                            <div className='alert alert-secondary text-center'>
                                This product doesn't have a review.
                            </div>
                            }
                        </div>
                    </div>
                    <div
                        className='tab-pane fade'
                        id='more-products'
                        role='tabpanel'
                        aria-labelledby='more-products-tab'
                    >
                        <div className='products-details-tab-content'>
                            <div className='row'>
                                {productStore.map((item, index) => {
                                    return (
                                        <div key={index} className='col-sm-6 col-md-3 mb-4'>
                                            <ProductCard
                                                data={item}
                                                wishlist={
                                                    (wishlist?.products
                                                        ? wishlist.products
                                                        : []
                                                    ).filter(
                                                        (value) => value.product_id === item.id
                                                    )[0]
                                                }
                                                user_id={user_id}
                                                type='product-details-tab'
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wishlist: state.wishlist.wishlist,
        user_id: state.users.id
    }
}
export default connect(mapStateToProps, null)(withRouter(ProductDetailsTab));
