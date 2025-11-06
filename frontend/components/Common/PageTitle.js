import React, { Component } from 'react';
import Link from 'next/link';

class PageTitle extends Component {
    render() {
        let { pageTitle, othersPage, activePage } = this.props;
        return (
            <div className='page-title-area'>
                <div className='page-title-content'>
                    <div className='row no-gutters align-items-center'>
                        <div className='col-12 col-sm-6'>
                            <h2>{pageTitle}</h2>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <ul>
                                {othersPage.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <Link href={item.url}>
                                                <a>{item.text}</a>
                                            </Link>
                                        </li>
                                    );
                                })}
                                <li>{activePage}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PageTitle;
