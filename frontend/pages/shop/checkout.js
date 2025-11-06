import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import Private from '../../components/Authentication/Private'
import PageTitle from '../../components/Common/PageTitle'
import CheckoutComp from '../../components/Shop/CheckoutComp'
import Subscribe from '../../components/Common/Subscribe'
import Footer from '../../components/Layout/Footer'

const CheckoutPage = () => {
    return (
        <Private>
            <Navbar />
            <PageTitle
                pageTitle="Checkout"
                othersPage={[{url: '/', text: 'Home'}, {url: '/shop', text: 'Shop'}]}
                activePage="Checkout"
            />
            <CheckoutComp />
            <Subscribe />
            <Footer />
        </Private>
    )
}

export default CheckoutPage