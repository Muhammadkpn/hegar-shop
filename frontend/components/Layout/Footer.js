import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Footer = () => {
    const { categoryChild } = useSelector((state) => {
        return {
            categoryChild: state.categoryProduct.categoryChild,
        };
    });
    return (
        <React.Fragment>
            <div className='container-fluid footer'>
                <div className='row justify-content-center'>
                    <div className='col-10 col-sm-8 col-md-6'>
                        <h2 className='footer-title ft-1 mb-lg-0'>Wiselashop</h2>
                        <h4 className='footer-title ft-1 mb-lg-1'>
                            Trusted Shopping and Business Partner
                        </h4>
                        <p className='footer-text ft-1 mb-lg-5'>
                            High quality items created by our community.
                        </p>
                        <ul className='social'>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-facebook'></i>
                                </Link>
                            </li>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-twitter'></i>
                                </Link>
                            </li>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-instagram'></i>
                                </Link>
                            </li>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-linkedin'></i>
                                </Link>
                            </li>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-skype'></i>
                                </Link>
                            </li>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-pinterest-alt'></i>
                                </Link>
                            </li>
                            <li>
                                <Link href='#' target='_blank'>
                                    <i className='bx bxl-youtube'></i>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className='col-10 col-sm-6 col-md-3'>
                        <h5 className='footer-title ft-1'>Categories</h5>
                        {categoryChild?.parent?.map((item, index) => {
                            return (
                                <Link href={`/shop?category=${item.name}`} key={index}>
                                    <p className='footer-text ft-1' key={index}>
                                        {item.name}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                    <div className='col-10 col-sm-6 col-md-3'>
                        <h5 className='footer-title ft-1'>For members</h5>
                        <p className='footer-text ft-1'>Licenses</p>
                        <p className='footer-text ft-1'>Return Policy</p>
                        <p className='footer-text ft-1'>Payment Methods</p>
                        <p className='footer-text ft-1'>Become a store</p>
                        <p className='footer-text ft-1'>Become a affiliate</p>
                        <p className='footer-text ft-1'>Marketplace benefits</p>
                    </div>
                </div>
                <div className='footer-line'></div>
                <div className='row justify-content-center no-gutters'>
                    <div className='col-8 col-md-6'>
                        <p className='copyright'>
                            Copyright © - 2021. All rights reserved. Made by WiselaShop
                        </p>
                    </div>
                    <div className='col-8 col-md-6'>
                        <ul>
                            <li>
                                <p className='footer-text'>Help Center</p>
                            </li>
                            <li>
                                <p className='footer-text'>Affiliates</p>
                            </li>
                            <li>
                                <p className='footer-text'>Support</p>
                            </li>
                            <li>
                                <p className='footer-text'>Terms {'&'} Conditions</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Footer;
