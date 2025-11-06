import {useDispatch, useSelector} from 'react-redux'
import {getAllBlog} from '../../store/action'
import React from 'react';
import BlogCard from '../Common/BlogCard'

const RecentBlog = () => {
    const {blog} = useSelector(state => {
        return {
            blog: state.blog.blog
        }
    })
    const dispatch = useDispatch()
    React.useEffect(() => {
        dispatch(getAllBlog())
    }, [])
    return (
        <section className="blog-area pt-70">
            <div className="container">
                <div className="section-title">
                    <h1>From The Blog</h1>
                    <p className="sub-title">Latest marketplace news, success stories and tutorials</p>
                </div>

                <div className="row justify-content-center">
                    {blog.slice(0,3).map((item, index) =>{
                        return(
                            <div key={index} className="col-lg-4 col-md-6">
                                <BlogCard data={item}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
}

export default RecentBlog;