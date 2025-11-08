import { getFullImageUrl } from '../../store/helpers';
import React, { Component } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import Link from 'next/link';
import CommentsList from './CommentsLists';
import BlogSidebar from './BlogSidebar';

class BlogDetails extends Component {
    render() {
        const { blogDetails, othersBlog, type } = this.props;
        return (
            <section className='blog-details-area py-5 bg-white'>
                <div className='container'>
                    <div className='row'>
                        <div
                            className={
                                type !== 'blog-details-admin' ? 'col-lg-8 col-md-12' : 'col-md-12'
                            }
                        >
                            <div className='blog-details-desc'>
                                <div className='article-image'>
                                    <img
                                        src={blogDetails ? getFullImageUrl(blogDetails.image) : ''}
                                        alt='image'
                                    />
                                </div>

                                <div className='article-content'>
                                    <div className='entry-meta'>
                                        <ul>
                                            <li>
                                                <i className='bx bx-folder-open'></i>
                                                <span>Category</span>
                                                <Link
                                                    href={
                                                        blogDetails.category
                                                            ? `/blog?category=${blogDetails.category[0]}`
                                                            : '#'
                                                    }
                                                >
                                                    <a>
                                                        {blogDetails.category
                                                            ? blogDetails.category[0]
                                                            : 'Category'}
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <i className='bx bx-group'></i>
                                                <span>View</span>
                                                <Link href='#'>
                                                    <a>
                                                        {blogDetails.view
                                                            ? blogDetails.view.toLocaleString()
                                                            : '813,454'}
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <i className='bx bx-calendar'></i>
                                                <span>Last Updated</span>
                                                <Link href='#'>
                                                    <a>
                                                        {blogDetails.date
                                                            ? new Date(
                                                                  blogDetails.date
                                                              ).toLocaleDateString()
                                                            : '11/04/1996'}
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <i className='bx bx-pencil'></i>
                                                <span>Author</span>
                                                <Link href='#'>
                                                    <a>
                                                        {blogDetails.author_name
                                                            ? blogDetails.author_name
                                                            : 'Wiselaadmin'}
                                                    </a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>

                                    <h3>{blogDetails ? blogDetails.title : ''}</h3>

                                    <div>
                                        <ReactQuill
                                            value={blogDetails.content || ''}
                                            readOnly={true}
                                            theme={'bubble'}
                                            className=''
                                        />
                                    </div>
                                </div>

                                <div className='article-footer'>
                                    <div className='article-tags'>
                                        <span>
                                            <i className='bx bx-purchase-tag'></i>
                                        </span>

                                        {(blogDetails.tags ? blogDetails.tags : []).map(
                                            (item, index) => {
                                                return (
                                                    <Link href='#' key={index}>
                                                        <a>{item}</a>
                                                    </Link>
                                                );
                                            }
                                        )}
                                    </div>

                                    <div className='article-share'>
                                        <ul className='social'>
                                            <li>
                                                <span>Share:</span>
                                            </li>
                                            <li>
                                                <Link href='#'>
                                                    <a className='facebook' target='_blank'>
                                                        <i className='bx bxl-facebook'></i>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href='#'>
                                                    <a className='twitter' target='_blank'>
                                                        <i className='bx bxl-twitter'></i>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href='#'>
                                                    <a className='linkedin' target='_blank'>
                                                        <i className='bx bxl-linkedin'></i>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href='#'>
                                                    <a className='instagram' target='_blank'>
                                                        <i className='bx bxl-instagram'></i>
                                                    </a>
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className='xton-post-navigation'>
                                    <div className='prev-link-wrapper'>
                                        <div className='info-prev-link-wrapper'>
                                            {othersBlog[1] ? (
                                                othersBlog[1].id !== blogDetails.id ? (
                                                    <Link
                                                        href={
                                                            othersBlog[1]
                                                                ? `/blog/${othersBlog[1].id}`
                                                                : '#'
                                                        }
                                                    >
                                                        <a>
                                                            <span className='image-prev'>
                                                                <img
                                                                    src={
                                                                        othersBlog[1]
                                                                            ? getFullImageUrl(othersBlog[1].image)
                                                                            : ''
                                                                    }
                                                                    alt='image'
                                                                />
                                                                <span className='post-nav-title'>
                                                                    Prev
                                                                </span>
                                                            </span>

                                                            <span className='prev-link-info-wrapper'>
                                                                <span className='prev-title'>
                                                                    {othersBlog[1]
                                                                        ? othersBlog[1].title
                                                                        : ''}
                                                                </span>
                                                                <span className='meta-wrapper'>
                                                                    <span className='date-post'>
                                                                        {othersBlog[1]
                                                                            ? new Date(
                                                                                  othersBlog[1].date
                                                                              ).toLocaleDateString()
                                                                            : '10/10/2010'}
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </a>
                                                    </Link>
                                                ) : null
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className='next-link-wrapper'>
                                        <div className='info-next-link-wrapper'>
                                            {othersBlog[0] ? (
                                                othersBlog[0].id !== blogDetails.id ? (
                                                    <Link
                                                        href={
                                                            othersBlog[0]
                                                                ? `/blog/${othersBlog[0].id}`
                                                                : '#'
                                                        }
                                                    >
                                                        <a>
                                                            <span className='next-link-info-wrapper'>
                                                                <span className='next-title'>
                                                                    {othersBlog[0]
                                                                        ? othersBlog[0].title
                                                                        : ''}
                                                                </span>
                                                                <span className='meta-wrapper'>
                                                                    <span className='date-post'>
                                                                        {othersBlog[0]
                                                                            ? new Date(
                                                                                  othersBlog[0].date
                                                                              ).toLocaleDateString()
                                                                            : '10/10/2010'}
                                                                    </span>
                                                                </span>
                                                            </span>

                                                            <span className='image-next'>
                                                                <img
                                                                    src={
                                                                        othersBlog[0]
                                                                            ? getFullImageUrl(othersBlog[0].image)
                                                                            : ''
                                                                    }
                                                                    alt='image'
                                                                />
                                                                <span className='post-nav-title'>
                                                                    Next
                                                                </span>
                                                            </span>
                                                        </a>
                                                    </Link>
                                                ) : null
                                            ) : null}
                                        </div>
                                    </div>
                                </div>

                                {/* Comments List */}
                                {type !== 'blog-details-admin' ? (
                                    <CommentsList blog_id={blogDetails.id} type='blog-user' />
                                ) : null}
                            </div>
                        </div>

                        <div className='col-lg-4 col-md-12'>
                            {/* Blog Sidebar */}
                            {type !== 'blog-details-admin' ? <BlogSidebar /> : null}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default BlogDetails;
