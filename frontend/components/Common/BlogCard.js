import React from 'react';
import Link from 'next/link';
import { URL_IMG } from '../../store/helpers';

const BlogCard = (props) => {
    const { id, image, title, category, date } = props.data;
    return (
        <div className='single-blog-post'>
            <div className='post-image'>
                <Link href={`/blog/${id}`}>
                    <a>
                        <img src={`${URL_IMG}/${image}`} alt='image' />
                    </a>
                </Link>

                <div className='date'>
                    <span>{new Date(date).toLocaleString()}</span>
                </div>
            </div>

            <div className='post-content'>
                <span className='category'>{category? category[0] : 'category'}</span>
                <h3>
                    <Link href={`/blog/${id}`}>
                        <a>{title}</a>
                    </Link>
                </h3>

                <Link href={`/blog/${id}`}>
                    <a className='details-btn'>Read Story</a>
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
