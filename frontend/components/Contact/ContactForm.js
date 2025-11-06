import React, { Component } from 'react';
import ContactInfo from './ContactInfo';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ child }) => <div>{child}</div>;

class ContactForm extends Component {
    render() {
        return (
            <section className="contact-area ptb-70">
                <div className="container">
                    <div id="maps" style={{height: '70vh', width: '100%'}}>
                    <GoogleMapReact
                        //   bootstrapURLKeys={{ key: /* YOUR KEY HERE */ }}
                        defaultCenter={{
                                lat: -6.177533,
                                lng: 106.788809
                        }}
                        defaultZoom={21}
                    >
                        <AnyReactComponent
                            lat={-6.177533}
                            lng={106.788809}
                            child={<i className='bx bxs-map bx-md' style={{color: '#172C93'}}></i> }
                        />
                    </GoogleMapReact>
                    </div>
                    <div className="row mt-4">
                        <div className="col-lg-5 col-md-12">
                            <ContactInfo />
                        </div>

                        <div className="col-lg-7 col-md-12">
                            <div className="contact-form">
                                <h3>Drop Us A Line</h3>
                                <p>We're happy to answer any questions you have or provide you with an estimate. Just send us a message in the form below with any questions you may have.</p>

                                <form id="contactForm">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-6">
                                            <div className="form-group">
                                                <label>Name <span>*</span></label>
                                                <input type="text" name="name" id="name" className="form-control" required placeholder="Your name" />
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-6">
                                            <div className="form-group">
                                                <label>Email <span>*</span></label>
                                                <input type="email" name="email" id="email" className="form-control" required placeholder="Your email address" />
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <label>Phone Number <span>*</span></label>
                                                <input type="text" name="phone_number" id="phone_number" className="form-control" required  placeholder="Your phone number" />
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <label>Your Message <span>*</span></label>
                                                <textarea name="message" id="message" cols="30" rows="5" required className="form-control" placeholder="Write your message..."></textarea>
                                            </div>
                                        </div>

                                        <div className="col-lg-12 col-md-12">
                                            <button type="submit" className="default-btn">Send Message</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default ContactForm;