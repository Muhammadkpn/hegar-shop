import React, { Component } from 'react';
import { getFullImageUrl } from '../../store/helpers'
import Slider from "react-slick";

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            className='btn prev-arrow-image'
            onClick={onClick}
        >
            <i className='bx bxs-chevron-left-circle bx-sm text-secondary'></i>
        </button>
    );
}

function NextArrow(props) {
    const { onClick } = props;
    return (
        <button
            className='btn next-arrow-image'
            onClick={onClick}
        >
            <i className='bx bxs-chevron-right-circle bx-sm text-secondary'></i>
        </button>
    );
}

class ProductImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nav1: null,
            nav2: null
        };
    }
    
    componentDidMount() {
        this.setState({
            nav1: this.slider1,
            nav2: this.slider2
        });
    }

    renderSliderMainImages = () => {
        return (this.props.image? this.props.image : []).map((item, index) => {
            return (
                <div key={index}>
                    <div className="item">
                        <img src={getFullImageUrl(item)} alt="image" />
                    </div>
                </div>
            )
        })
    }
    
    renderSliderSubImages = () => {
        return (this.props.image ? this.props.image : []).map((item, index) => {
            return (
                <div key={index}>
                    <div className="item p-1 no-gutters">
                        <img src={getFullImageUrl(item)} className={'border rounded'} alt="image" />
                    </div>
                </div>
            )
        })
    }

    render() {
        const settings = {
            infinite: true,
            speed: 500,
            prevArrow: <PrevArrow />,
            nextArrow: <NextArrow />,
        };

        return (
            <div className="products-page-gallery">
                <div className="product-page-gallery-main border rounded">
                    <div>
                        <Slider
                            asNavFor={this.state.nav2}
                            ref={slider => (this.slider1 = slider)}
                            {...settings}
                        >
                            {this.renderSliderMainImages()}
                        </Slider>
                    </div>
                </div>

                <div className="product-page-gallery-preview">
                    <div>
                        <Slider
                            asNavFor={this.state.nav1}
                            ref={slider => (this.slider2 = slider)}
                            slidesToShow={4}
                            swipeToSlide={true}
                            focusOnSelect={true}
                            arrows={false}
                            dots={false}
                        >
                            {this.renderSliderSubImages()}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductImage;
