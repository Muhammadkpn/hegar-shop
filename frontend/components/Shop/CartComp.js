import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import { URL_IMG } from '../../store/helpers';
import { getCart, editCart, deleteCart, addToCart } from '../../store/action';
import ModalComp from '../Common/modalComp';

class CartComp extends Component {
    componentDidMount() {
        const { id } = this.props;
        this.props.getCart(id);
    }

    handleSubmit = (e) => {
        e.preventDefault();
    };

    handleEditCart = (type, cart_id, productId, qty) => {
        const { id, editCart } = this.props;
        if (type === 'plus') {
            editCart({ userId: id, productId, qty: qty + 1 }, cart_id);
        } else if (type === 'minus') {
            editCart({ userId: id, productId, qty: qty - 1 }, cart_id);
        }
    };

    render() {
        const { cart, id, error_cart } = this.props;
        if (error_cart) {
            $('#error-cart').modal();
        }
        return (
            <section className='cart-area ptb-70'>
                <div className='container'>
                    <form>
                        <div className='cart-table table-responsive'>
                            {Object.keys(cart).length !== 0 ? (
                                <div>
                                    {cart.order_detail.map((item) => {
                                        return (
                                            <table
                                                className='table table-bordered my-3'
                                                key={item.sub_order_number}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>Store Name</th>
                                                        <th colSpan='5' className='text-center'>
                                                            {item.store_name}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th scope='col'>Product</th>
                                                        <th scope='col'>Name</th>
                                                        <th scope='col'>Unit Price</th>
                                                        <th scope='col'>Quantity</th>
                                                        <th scope='col'>Total</th>
                                                        <th scope='col'>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.products.map((value, idx) => {
                                                        return (
                                                            <tr key={idx}>
                                                                <td className='product-thumbnail'>
                                                                    <a href='#'>
                                                                        <img
                                                                            src={`${URL_IMG}/${value.image}`}
                                                                            alt='item'
                                                                        />
                                                                    </a>
                                                                </td>

                                                                <td className='product-name'>
                                                                    <Link
                                                                        href={`/shop/${value.product_id}`}
                                                                    >
                                                                        {value.name}
                                                                    </Link>
                                                                </td>

                                                                <td className='product-price'>
                                                                    <span className='unit-amount'>
                                                                        Rp.{' '}
                                                                        {value.price_each.toLocaleString()}
                                                                    </span>
                                                                </td>

                                                                <td className='product-quantity'>
                                                                    <div className='input-counter'>
                                                                        <span
                                                                            className='minus-btn'
                                                                            onClick={() =>
                                                                                this.handleEditCart(
                                                                                    'minus',
                                                                                    value.id,
                                                                                    value.product_id,
                                                                                    value.qty
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className='bx bx-minus'></i>
                                                                        </span>
                                                                        <input
                                                                            type='text'
                                                                            value={value.qty}
                                                                            min='1'
                                                                            max={10}
                                                                            readOnly={true}
                                                                            onChange={(e) => e}
                                                                        />
                                                                        <span
                                                                            className='plus-btn'
                                                                            onClick={() =>
                                                                                this.handleEditCart(
                                                                                    'plus',
                                                                                    value.id,
                                                                                    value.product_id,
                                                                                    value.qty
                                                                                )
                                                                            }
                                                                        >
                                                                            <i className='bx bx-plus'></i>
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td className='product-subtotal'>
                                                                    <span className='subtotal-amount'>
                                                                        Rp.{' '}
                                                                        {(
                                                                            value.qty *
                                                                            value.price_each
                                                                        ).toLocaleString()}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <a
                                                                        className='remove'
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            this.props.deleteCart(
                                                                                value.id,
                                                                                id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <i className='bx bx-trash'></i>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        );
                                    })}
                                    <div className='cart-buttons'>
                                        <div className='row align-items-center'>
                                            <div className='col-lg-6 col-md-6'>
                                                <Link href='/shop' className='optional-btn'>
                                                    Continue Shopping
                                                </Link>
                                            </div>

                                            <div className='col-lg-6 col-md-6'>
                                                <div className='cart-totals'>
                                                    <h3>Cart Totals</h3>

                                                    <div className='input-group mb-3'>
                                                        <input
                                                            className='form-control'
                                                            placeholder='Coupon Code'
                                                        />
                                                        <button
                                                            type='button'
                                                            className='btn btn-coupon'
                                                        >
                                                            Apply Coupon
                                                        </button>
                                                    </div>
                                                    <ul>
                                                        <li>
                                                            Subtotal{' '}
                                                            <span>
                                                                Rp. {cart.total_price?.toLocaleString()}
                                                            </span>
                                                        </li>
                                                        <li>
                                                            Discount <span className='text-danger'>-Rp. 9,000.00</span>
                                                        </li>
                                                        <li>
                                                            Total{' '}
                                                            <span>
                                                                Rp.{' '}
                                                                {cart.total_price
                                                                    ? (
                                                                          cart.total_price - 9000
                                                                      ).toLocaleString()
                                                                    : 0}
                                                            </span>
                                                        </li>
                                                    </ul>

                                                    <Link href='/shop/checkout'>
                                                        <button
                                                            type='button'
                                                            className='default-btn btn-block'
                                                            disabled={
                                                                cart.length === 0 ? true : false
                                                            }
                                                        >
                                                            Proceed to Checkout
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className='alert alert-secondary text-center'>
                                    <p>
                                        Your cart is empty. Go to the shop page and enjoy shopping on
                                        our website
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
                <ModalComp
                    modal_id='error-cart'
                    size='modal-lg'
                    body={error_cart}
                    footer={
                        <button
                            type='button'
                            className='btn btn-outline-primary btn-sm'
                            data-dismiss='modal'
                        >
                            Close
                        </button>
                    }
                />
            </section>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        cart: state.cart.cart,
        id: state.users.id,
        error_cart: state.cart.error_cart,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        deleteCart: (id) => {
            dispatch(deleteCart(id));
        },
        addToCart: (id) => {
            dispatch(addToCart(id));
        },
        editCart: (id) => {
            dispatch(editCart(id));
        },
        getCart: (id) => {
            dispatch(getCart(id));
        },
    };
};

export default connect(mapStateToProps, { getCart, addToCart, deleteCart, editCart })(CartComp);
