import {useRouter} from 'next/router'
import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import PageTitle from '../../components/Common/PageTitle'
import ShopComp from '../../components/Shop/ShopComp'
import Subscribe from '../../components/Common/Subscribe'
import Footer from '../../components/Layout/Footer'

const ShopPage = () => {
    const router = useRouter()
    const {category} = router.query
    return(
        <React.Fragment>
            <Navbar />
            <PageTitle 
                pageTitle={category ? `${category}`[0].toUpperCase() + `${category}`.slice(1) : 'Shop'}
                othersPage={category ? [{url: '/', text: 'Home'}, {url: '/shop', text: 'Shop'}] : [{url: '/', text: 'Home'}]}
                activePage={category ? `${category}`[0].toUpperCase() + `${category}`.slice(1) : 'Shop'}
            />
            <ShopComp />
            <Subscribe />
            <Footer />
        </React.Fragment>
    )
}

export default ShopPage