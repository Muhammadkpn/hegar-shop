import React from 'react'
import Navbar from '../../components/Layout/Navbar'
import PageTitle from '../../components/Common/PageTitle'
import StoreListComp from '../../components/Store/StoreListComp'
import Subscribe from '../../components/Common/Subscribe'
import Footer from '../../components/Layout/Footer'

const StoreListPage = () => {   
    return(
        <React.Fragment>
            <Navbar />
            <PageTitle 
                pageTitle="Store List"
                othersPage={[{url: '/', text: 'Home'}]}
                activePage="Store List"
            />
            <StoreListComp />
            <Subscribe />
            <Footer />
        </React.Fragment>
    )
}

export default StoreListPage;