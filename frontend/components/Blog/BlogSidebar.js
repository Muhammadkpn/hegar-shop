import { useSelector, useDispatch } from 'react-redux';
import {
    getAllBlog,
    getPopularBlog,
    getCountCategoryBlog,
    getCountTagBlog,
} from '../../store/action';
import React from 'react';
import Link from 'next/link';
import { URL_IMG } from '../../store/helpers';
import { useRouter } from 'next/router';

const BlogSidebar = () => {
    const router = useRouter();
    const { search, category, tag } = router.query;

    const { popular, countCategory, countTagBlog } = useSelector((state) => {
        return {
            popular: state.blog.popular,
            countCategory: state.blogCategory.countCategory,
            countTagBlog: state.blogTag.countTagBlog,
        };
    });

    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getPopularBlog());
        dispatch(getCountCategoryBlog());
        dispatch(getCountTagBlog());
    }, []);

    return (
        <div className='widget-area'>
            <div className='widget widget_search'>
                <form className='search-form'>
                    <label>
                        <span className='screen-reader-text'>Search for:</span>
                        <input
                            type='search'
                            className='search-field'
                            placeholder='Search...'
                            onChange={(e) => 
                                router.push(`/blog?${e.target.value ? `search=${e.target.value}` : ''}${category ? `&category=${category}` : ''}${tag ? `&tag=${tag}` : ''}`,
                                undefined, {
                                shallow: true,
                            })}
                        />
                    </label>
                    <button type='submit'>
                        <i className='bx bx-search-alt'></i>
                    </button>
                </form>
            </div>

            <div className='widget widget_posts_thumb'>
                <h3 className='widget-title'>Popular Posts</h3>
                {popular.map((item, index) => {
                    return (
                        <article key={index} className='item'>
                            <Link href={`/blog/${item.id}`}>
                                <a className='thumb'>
                                    <span
                                        className='fullimage cover'
                                        role='img'
                                        style={{
                                            backgroundImage: `url(${URL_IMG}/${item.image})`,
                                        }}
                                    ></span>
                                </a>
                            </Link>

                            <div className='info'>
                                <span>{item.date}</span>
                                <h4 className='title usmall'>
                                    <Link href={`/blog/${item.id}`}>
                                        <a>{item.title}</a>
                                    </Link>
                                </h4>
                            </div>

                            <div className='clear'></div>
                        </article>
                    );
                })}
            </div>

            <div className='widget widget_categories'>
                <h3 className='widget-title'>Blog Category</h3>

                <ul>
                    {countCategory.map((item, index) => {
                        return (
                            <li key={index}>
                                <Link href={`/blog?category=${item.category}${search ? `&search=${search}` : ''}${tag ? `&tag=${tag}` : ''}`}>
                                    <a 
                                        style={
                                                category === item.category ? 
                                                { backgroundColor: '#172C93', color: '#fff', }
                                                : {}
                                        }
                                    >
                                        {item.category}{' '}
                                        <span
                                            className='post-count'                                                     
                                            style={
                                                    category === item.category ? 
                                                    { color: '#fff', }
                                                    : {}
                                            }
                                        >
                                            ({item.count})
                                        </span>
                                    </a>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className='widget widget_tag_cloud'>
                <h3 className='widget-title'>Blog Tag</h3>

                <div className='tagcloud'>
                    {countTagBlog.map((item, index) => {
                        return (
                            <Link key={index} href={`/blog?${search ? `search=${search}` : ''}${category ? `&category=${category}` : ''}&tag=${item.tags}`}>
                                <a
                                    style={
                                        tag === item.tags ? 
                                        { backgroundColor: '#172C93', color: '#fff', }
                                        : {}
                                    }
                                >
                                    {item.tags}{' '}
                                    <span 
                                        className='tag-link-count'                                             
                                        style={
                                                tag === item.tags ? 
                                                { color: '#fff', }
                                                : {}
                                        }
                                    >
                                        ({item.count})
                                    </span>
                                </a>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className='widget widget_instagram'>
                <h3 className='widget-title'>Instagram</h3>

                <ul>
                    <li>
                        <Link href='#'>
                            <a className='d-block'>
                                <img src={`${URL_IMG}/image/blog/blog1.jpg`} alt='image' />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='#'>
                            <a className='d-block'>
                                <img src={`${URL_IMG}/image/blog/blog2.jpg`} alt='image' />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='#'>
                            <a className='d-block'>
                                <img src={`${URL_IMG}/image/blog/blog3.jpg`} alt='image' />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='#'>
                            <a className='d-block'>
                                <img src={`${URL_IMG}/image/blog/blog4.jpg`} alt='image' />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='#'>
                            <a className='d-block'>
                                <img src={`${URL_IMG}/image/blog/blog5.jpg`} alt='image' />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href='#'>
                            <a className='d-block'>
                                <img src={`${URL_IMG}/image/blog/blog6.jpg`} alt='image' />
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default BlogSidebar;
