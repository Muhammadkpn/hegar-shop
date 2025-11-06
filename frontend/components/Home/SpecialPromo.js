import { useDispatch, useSelector } from 'react-redux';
import { getProductDiscount } from '../../store/action';
import React from 'react';
import Slider from 'react-slick';
import ProductCard from '../Common/ProductCard';

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            className='btn btn-prev-arrow'
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
            className='btn btn-next-arrow'
            onClick={onClick}
        >
            <i className='bx bxs-chevron-right-circle bx-sm text-secondary'></i>
        </button>
    );
}

const SpecialPromo = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
              breakpoint: 992,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 2
              }
            },
          ]
    };
    const dispatch = useDispatch();
    const { productDiscount, wishlist, user_id } = useSelector((state) => {
        return {
            productDiscount: state.products.productDiscount,
            wishlist: state.wishlist.wishlist,
            user_id: state.users.id,
        };
    });
    React.useEffect(() => {
        dispatch(getProductDiscount());
    }, []);

    return (
        <div className='container-products'>
            <div className='section-title'>
                <h1 className='sub-title'>Discover Special Promo</h1>
                <p>Every week we hand-pick some of the best promo from our collection</p>
            </div>
            <div>
                <Slider {...settings}>
                    {productDiscount.slice(0, 9).map((item, index) => {
                        return (
                            <div className='p-3' key={index}>
                                <ProductCard
                                    data={item}
                                    wishlist={
                                        (wishlist?.products ? wishlist.products : []).filter(
                                            (value) => value.product_id === item.id
                                        )[0]
                                    }
                                    user_id={user_id}
                                    type='promo-slider'
                                />
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
};

export default SpecialPromo;