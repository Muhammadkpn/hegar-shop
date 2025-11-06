import React from 'react'
const Features = () => {
    return (
        <div className="container-features">
            <h3 className="title-features">Why our marketplace?</h3>
            <div className="row">
                <div className="col-10 col-md-6 col-lg-3">
                    <div className="features-details">
                        <img src="https://demo2.madrasthemes.com/cartzilla/marketplace/wp-content/uploads/sites/3/2020/04/quality.png" className="img-features"/>
                        <div>
                            <h6>Quality Guarantee</h6>
                            <p>Quality checked by our team</p>
                        </div>
                    </div>
                </div>
                <div className="col-10 col-md-6 col-lg-3">
                    <div className="features-details">
                        <img src="https://demo2.madrasthemes.com/cartzilla/marketplace/wp-content/uploads/sites/3/2020/04/support.png" className="img-features"/>
                        <div>
                            <h6>Customer Support</h6>
                            <p>Friendly 24/7 customer support</p>
                        </div>
                    </div>
                </div>
                <div className="col-10 col-md-6 col-lg-3">
                    <div className="features-details">
                        <img src="https://demo2.madrasthemes.com/cartzilla/marketplace/wp-content/uploads/sites/3/2020/04/updates.png" className="img-features"/>
                        <div>
                            <h6>Lifetime Free Updates</h6>
                            <p>Never pay for an update</p>
                        </div>
                    </div>
                </div>
                <div className="col-10 col-md-6 col-lg-3">
                    <div className="features-details">
                        <img src="https://demo2.madrasthemes.com/cartzilla/marketplace/wp-content/uploads/sites/3/2020/04/secure.png" className="img-features"/>
                        <div>
                            <h6>Secure Payments</h6>
                            <p>we posess SSL / Secure сertificate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Features;