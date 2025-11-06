import React from 'react'
import Navbar from '../components/Layout/Navbar'
import PageTitle from '../components/Common/PageTitle'
import ContactForm from '../components/Contact/ContactForm'
import Subscribe from '../components/Common/Subscribe'
import Footer from '../components/Layout/Footer'

const ContactPage = () => {
    return(
        <React.Fragment>
            <Navbar />
            <PageTitle 
                pageTitle="Contact"
                othersPage={[{url: '/', text: 'Home'}]}
                activePage="Contact"
            />
            <ContactForm />
            <Subscribe />
            <Footer />
        </React.Fragment>
    )
}

export default ContactPage