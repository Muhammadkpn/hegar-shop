import React, { Component } from 'react';
import Navbar from '../components/Layout/Navbar';
import PageTitle from '../components/Common/PageTitle';
import Footer from '../components/Layout/Footer';
import Link from 'next/link';

class NotFound extends Component {
    render() {
        return (
            <React.Fragment>
                <Navbar />
                <PageTitle 
                    pageTitle="404 Not Found" 
                    othersPage = {[{url: '/', text: 'Home'}]} 
                    activePage="404 Not Found" 
                /> 

                <section className="error-area ptb-100">
                    <div className="container">
                        <div className="error-content d-flex flex-column align-items-center justify-content-center">
                            <img src={"../image/error-404.png"} alt="error" />
                            <h3>Page Not Found</h3>
                            <p>The page you are looking for might have been removed had its name changed or is temporarily unavailable.</p>
                            <Link href="/" className="default-btn">
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </section>

                <Footer />
            </React.Fragment>
        );
    }
}

export default NotFound;