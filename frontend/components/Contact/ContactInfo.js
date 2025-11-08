import React, { Component } from 'react';
import Link from 'next/link';

class ContactInfo extends Component {
    render() {
        return (
            <div className="contact-info">
                <h3>Here to Help</h3>
                <p>Have a question? You may find an answer in our <Link href="/faqs">FAQs</Link>. But you can also contact us.</p>

                <ul className="contact-list">
                    <li>
                        <i className='bx bx-map'></i> 
                        Location: Soho Capital Lt.16 Unit 03 {'&'} 05, Jl. Letjen S.Parman Kav.28, Jakarta, Indonesia 11470
                    </li>
                    <li>
                        <i className='bx bx-envelope'></i> 
                        Email Us: info@longrich.co.id
                    </li>
                    <li>
                        <i className='bx bx-phone-call'></i> 
                        Call Us: +6221-278-933-17
                    </li>
                    <li>
                        <i className='bx bx-microphone'></i> 
                        Customer Service 1: +62 812-8852-9388
                    </li>
                    <li>
                        <i className='bx bx-microphone'></i> 
                        Customer Service 2: +62 812-9288-8968
                    </li>
                </ul>

                <h3>Opening Hours:</h3>
                <ul className="opening-hours">
                    <li><span>Monday - Saturday:</span> 10AM - 6PM</li>
                    <li><span>Sunday:</span> Closed</li>
                </ul>

                <h3>Follow Us:</h3>
                <ul className="social">
                    <li>
                        <Link href="#" target="_blank">
                            <i className='bx bxl-facebook'></i>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" target="_blank">
                            <i className='bx bxl-twitter'></i>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" target="_blank">
                            <i className='bx bxl-instagram'></i>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" target="_blank">
                            <i className='bx bxl-linkedin'></i>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" target="_blank">
                            <i className='bx bxl-youtube'></i>
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default ContactInfo;
