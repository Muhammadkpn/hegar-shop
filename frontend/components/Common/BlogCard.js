import React from 'react';
import Link from 'next/link';
import { URL_IMG } from '../../store/helpers';

const BlogCard = (props) => {
    const { id, image, title, category, date } = props.data;
    return (
        <div className='single-blog-post'>
            <div className='post-image'>
                <Link href={`/blog/${id}`}>
                    <img src={`${URL_IMG}/${image}`} alt='image' />
                </Link>

                <div className='date'>
                    <span>{new Date(date).toLocaleString()}</span>
                </div>
            </div>

            <div className='post-content'>
                <span className='category'>{category? category[0] : 'category'}</span>
                <h3>
                    <Link href={`/blog/${id}`}>
                        {title}
                    </Link>
                </h3>

                <Link href={`/blog/${id}`} className='details-btn'>
                    Read Story
                </Link>
            </div>
        </div>
    );
};

export default BlogCard;
