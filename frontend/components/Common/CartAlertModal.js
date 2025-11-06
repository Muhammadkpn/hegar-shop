import React from 'react'
import ModalComp from './modalComp'

const CartAlertModal = ({modal_id}) => {
    return(
        <ModalComp 
            modal_id={modal_id ? modal_id : "add-to-cart"}
            body={<p className="text-center">You have added this product to the cart</p>}
            footer={<button type="button" className="btn btn-outline-primary btn-sm" data-dismiss="modal">Close</button>}
        />
    )
}

export default CartAlertModal