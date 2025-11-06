import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import Private from '../../components/Authentication/Private'
import PageTitle from '../../components/Common/PageTitle'
import CartComp from '../../components/Shop/CartComp'
import Subscribe from '../../components/Common/Subscribe'
import Footer from '../../components/Layout/Footer'

const ContactPage = () => {
    return(
        <Private>
            <Navbar />
            <PageTitle 
                pageTitle="Cart"
                othersPage={[{url: '/', text: 'Home'}, {url: '/shop', text: 'Shop'}]}
                activePage="Cart"
            />
            <CartComp /> 
            <Subscribe />
            <Footer />
        </Private>
    )
}

export default ContactPage