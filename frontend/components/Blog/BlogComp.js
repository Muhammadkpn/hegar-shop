import { useDispatch, useSelector } from 'react-redux';
import { getAllBlog } from '../../store/action';
import React from 'react';
import BlogCard from '../Common/BlogCard';
import BlogSidebar from './BlogSidebar';
import { useRouter } from 'next/router';

const BlogComp = () => {
    const [pages, setPages] = React.useState(1);
    const router = useRouter();
    const { search, category, tag } = router.query;

    const { blog } = useSelector((state) => {
        return {
            blog: state.blog.blog,
        };
    });
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(getAllBlog());
    }, []);

    React.useEffect(() => {
        if (search && category && tag) {
            dispatch(getAllBlog(`search=${search}&categories=${category}&tags=${tag}`));
        } else if (search && category) {
            dispatch(getAllBlog(`search=${search}&categories=${category}`));
        } else if (search && tag) {
            dispatch(getAllBlog(`search=${search}&tags=${tag}`));
        } else if (category && tag) {
            dispatch(getAllBlog(`categories=${category}&tags=${tag}`));
        } else if (search) {
            dispatch(getAllBlog(`search=${search}`));
        } else if (category) {
            dispatch(getAllBlog(`categories=${category}`));
        } else if (tag) {
            dispatch(getAllBlog(`tags=${tag}`));
        } else {
            dispatch(getAllBlog());
            router.push(`/blog`, undefined, {
                shallow: true,
            });
        }
    }, [search, category, tag]);

    let total_pages = [];
    for (let i = 1; i <= Math.ceil(blog.length / 8); i++) {
        total_pages.push(i);
    }

    return (
        <section className='blog-area ptb-100'>
            <div className='container'>
                <div className='widget widget_search pb-3'>
                    <form className='search-form'>
                        <label>
                            <span className='screen-reader-text'>Search for:</span>
                            <input
                                type='search'
                                className='search-field'
                                placeholder='Search...'
                                onChange={(e) =>
                                    router.push(
                                        `/blog?search=${e.target.value}${
                                            category ? `&category=${category}` : ''
                                        }${tag ? `&tag=${tag}` : ''}`,
                                        undefined,
                                        {
                                            shallow: true,
                                        }
                                    )
                                }
                            />
                        </label>
                        <button type='submit'>
                            <i className='bx bx-search-alt'></i>
                        </button>
                    </form>
                </div>
                <div className='row'>
                    <div className='col-lg-8 col-md-12 my-2'>
                        <div className={category || tag ? 'd-flex' : 'd-none'}>
                            {category ? (
                                <button
                                    type='button'
                                    className='btn chip-btn border border-secondary rounded-pill'
                                >
                                    <i className='bx bx-collection'></i>
                                    <span className='mx-2'>{category}</span>
                                    <i
                                        className='bx bx-x bg-light'
                                        onClick={() =>
                                            router.push(
                                                `/blog?${tag ? `tag=${tag}` : ''}`,
                                                undefined,
                                                {
                                                    shallow: true,
                                                }
                                            )
                                        }
                                    ></i>
                                </button>
                            ) : null}
                            {tag ? (
                                <button
                                    type='button'
                                    className={`btn chip-btn border border-secondary rounded-pill ${
                                        category ? 'ml-2' : ''
                                    }`}
                                >
                                    <i className='bx bxs-purchase-tag'></i>
                                    <span className='mx-2'>{tag}</span>
                                    <i
                                        className='bx bx-x bg-light'
                                        onClick={() =>
                                            router.push(
                                                `/blog?${category ? `category=${category}` : ''}`,
                                                undefined,
                                                {
                                                    shallow: true,
                                                }
                                            )
                                        }
                                    ></i>
                                </button>
                            ) : null}
                        </div>
                        <div className='row'>
                            {blog.slice(
                                pages === 1 ? 0 : 8 * (pages - 1),
                                pages === 1 ? 8 : 8 * pages
                            ).length > 0 ? (
                                blog
                                    .slice(
                                        pages === 1 ? 0 : 8 * (pages - 1),
                                        pages === 1 ? 8 : 8 * pages
                                    )
                                    .map((item, index) => {
                                        return (
                                            <div key={index} className='col-lg-6 col-md-6'>
                                                <BlogCard data={item} />
                                            </div>
                                        );
                                    })
                            ) : (
                                <div className='col-md-12'>
                                    <div className='alert alert-secondary' role='alert'>
                                        We can't found your keyword. Please change your keyword!
                                    </div>
                                </div>
                            )}
                            <div className='col-lg-12 col-md-12 col-sm-12'>
                                <div className='pagination-area text-center'>
                                    <button
                                        type='button'
                                        className={`prev page-numbers ${
                                            pages === 1 ? 'disabled' : ''
                                        }`}
                                        disabled={pages === 1 ? true : false}
                                        onClick={() => setPages((prev) => prev - 1)}
                                    >
                                        <i className='bx bx-chevron-left'></i>
                                    </button>
                                    {total_pages.map((item, index) => {
                                        return (
                                            <button
                                                key={index}
                                                type='button'
                                                className={`page-numbers ${
                                                    pages === item ? 'current' : ''
                                                }`}
                                                onClick={() => setPages(item)}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })}
                                    <button
                                        type='button'
                                        className={`next page-numbers ${
                                            pages === Math.ceil(blog.length / 8) ? 'disabled' : ''
                                        }`}
                                        disabled={
                                            pages === Math.ceil(blog.length / 8) ? true : false
                                        }
                                        onClick={() => setPages((prev) => prev + 1)}
                                    >
                                        <i className='bx bx-chevron-right'></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-4 col-md-12 my-2'>
                        {/* Blog Sidebar */}
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BlogComp;
