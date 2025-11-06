import { useRouter } from 'next/router';
import { getWishlist, deleteWishlist, addToCart } from '../../store/action';
import { URL_IMG } from '../../store/helpers';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import CartAlertModal from '../Common/CartAlertModal';
import Link from 'next/link';
import ModalComp from '../Common/modalComp';

const WishlistComp = () => {
    const router = useRouter();
    const { wishlist, id } = useSelector((state) => {
        return {
            wishlist: state.wishlist.wishlist,
            id: state.users.id,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getWishlist('type=user-id', id));
    }, []);
    return (
        <div className='wishlist-container p-5'>
            <div className='table-responsive'>
                <table className='table table-hover'>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Image</th>
                            <th scope='col'>Product Name</th>
                            <th scope='col'>Price</th>
                            <th scope='col'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(wishlist?.products || []).map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td className='align-middle'>
                                        <button
                                            type='button'
                                            className='btn'
                                            onClick={() =>{
                                                dispatch(deleteWishlist(id, item.product_id));
                                                $('#delete-wishlist').modal();
                                            }}
                                        >
                                            <i className='bx bx-x bx-md'></i>
                                        </button>
                                    </td>
                                    <td className='align-middle'>
                                        <Link href={`/shop/${item.product_id}`}>
                                            <a>
                                                <img src={`${URL_IMG}/${item.image[0]}`} className='img' />
                                            </a>
                                        </Link>
                                    </td>
                                    <td className='align-middle'>
                                        <Link href={`/shop/${item.product_id}`}>
                                            <a>
                                                {item.name}
                                            </a>
                                        </Link>
                                    </td>
                                    <td className='align-middle'>
                                        Rp. {item.sale_price.toLocaleString()}
                                    </td>
                                    <td className='align-middle'>
                                        <button
                                            type='button'
                                            className='btn btn-primary'
                                            onClick={() =>
                                                dispatch(
                                                    addToCart({
                                                        userId: id,
                                                        productId: item.product_id,
                                                        qty: 1,
                                                        weightEach: item.weight,
                                                        priceEach: item.sale_price,
                                                        storeId: item.store_id,
                                                    })
                                                )
                                            }
                                            data-toggle='modal'
                                            data-target='#cart-wishlist'
                                        >
                                            Add to cart
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <CartAlertModal modal_id='cart-wishlist' />
            <ModalComp 
                modal_id='delete-wishlist' 
                body={<p className='text-center'>You have been deleted this product from the wishlist.</p>}
            />
        </div>
    );
};

export default WishlistComp;
