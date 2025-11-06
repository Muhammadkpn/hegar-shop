import React from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import { useDispatch, useSelector } from 'react-redux';
import {
    getAdminBlog,
    getBlogDetails,
    getOthersBlog,
    editBlog,
    addBlog,
    getCommentsAdmin,
    getCommentsByBlog,
    getCategoryBlog,
    editBlogCategory,
    getTagBlog,
    editBlogTag,
    editBlogImage,
} from '../../store/action';
import { URL_IMG } from '../../store/helpers';
import ModalComp from '../Common/modalComp';
import CommentsLists from '../Blog/CommentsLists';
import BlogDetails from '../Blog/BlogDetails';

const SuperAdminBlog = () => {
    const [titleBlog, setTitleBlog] = React.useState('');
    const [content, setContent] = React.useState('');
    const [imageBlog, setImageBlog] = React.useState({
        image: '',
        link: '',
        type: '',
    });
    const [checkboxCategory, setCheckboxCategory] = React.useState([
        {
            id: null,
            name: '',
            isChecked: false,
        },
    ]);
    const [checkboxTag, setCheckboxTag] = React.useState([
        {
            id: null,
            name: '',
            isChecked: false,
        },
    ]);
    const [editId, setEditId] = React.useState(null);
    const [filterStatus, setFilterStatus] = React.useState({
        name: null,
        id: null,
    });
    const [searchTitle, setSearchTitle] = React.useState(null);
    const [sortBlog, setSortBlog] = React.useState({
        name: null,
        query: '_sort=b.date&_order=DESC',
    });
    const [comments, setComments] = React.useState(null);
    const sort = [
        { name: 'Newest', icon: 'bx-flag', query: '_sort=b.date&_order=DESC' },
        { name: 'A-Z', icon: 'bx-sort-a-z', query: '_sort=b.title&_order=ASC' },
        { name: 'Most Viewed', icon: 'bx-rocket', query: '_sort=b.view&_order=DESC' },
    ];

    const { user_id, blogAdmin, blogDetails, othersBlog, tagBlog, categoryBlog } = useSelector(
        (state) => {
            return {
                user_id: state.users.id,
                blogAdmin: state.blog.blogAdmin,
                blogDetails: state.blog.blogDetails,
                othersBlog: state.blog.othersBlog,
                tagBlog: state.tagBlog.tagBlog,
                categoryBlog: state.categoryBlog.categoryBlog,
            };
        }
    );
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(getAdminBlog());
        dispatch(getCategoryBlog());
        dispatch(getTagBlog());
    }, []);

    React.useEffect(() => {
        if (filterStatus.name && searchTitle) {
            dispatch(
                getAdminBlog(`titles=${searchTitle}&status=${filterStatus.id}&${sortBlog.query}`)
            );
        } else if (searchTitle) {
            dispatch(getAdminBlog(`titles=${searchTitle}&${sortBlog.query}`));
        } else if (filterStatus.name) {
            dispatch(getAdminBlog(`status=${filterStatus.id}&${sortBlog.query}`));
        } else {
            dispatch(getAdminBlog(`${sortBlog.query}`));
        }
    }, [filterStatus, searchTitle, sortBlog]);

    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('#add_blog_detail').on('hidden.bs.modal', function (e) {
            setCheckboxCategory([{ id: null, name: '', isChecked: false }]);
            setCheckboxTag([{ id: null, name: '', isChecked: false }]);
            setTitleBlog('');
            setContent('');
            setImageBlog({ image: null, link: null });
            document.getElementById('upload-blog-image').value = '';
        });
        $('#edit_blog_detail').on('hidden.bs.modal', function (e) {
            setCheckboxCategory([{ id: null, name: '', isChecked: false }]);
            setCheckboxTag([{ id: null, name: '', isChecked: false }]);
            setTitleBlog('');
            setContent('');
            setImageBlog({ image: null, link: null });
            setEditId(null);
            document.getElementById('upload-blog-image').value = '';
        });
    });

    const handleCheckboxCategory = (index) => {
        let tempArr = [...checkboxCategory];
        tempArr[index].isChecked = !tempArr[index].isChecked;
        setCheckboxCategory(tempArr);
    };

    const handleCheckboxTag = (index) => {
        let tempArr = [...checkboxTag];
        tempArr[index].isChecked = !tempArr[index].isChecked;
        setCheckboxTag(tempArr);
    };

    const renderFormBlog = (type) => {
        return (
            <div className='form-blog'>
                <div className='row no-gutters'>
                    <div className='col-sm-12'>
                        <img
                            className='img img-admin-blog d-block mx-auto'
                            src={imageBlog.type === 'get' ? `${URL_IMG}/${imageBlog.link}` : imageBlog.link}
                        />
                        <div className='form-group d-flex justify-content-center'>
                            <label htmlFor='upload-blog-image' className='custom-file-upload'>
                                {type === 'edit' ? 'Edit' : 'Add'} Image
                            </label>
                            <input
                                type='file'
                                accept='image/*'
                                id='upload-blog-image'
                                onChange={(e) =>
                                    setImageBlog({
                                        link: URL.createObjectURL(e.target.files[0]),
                                        image: e.target.files[0],
                                        type: 'edit'
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Title</label>
                            <input
                                type='text'
                                placeholder='Title of blog'
                                className='form-control'
                                onChange={(e) => setTitleBlog(e.target.value)}
                                value={titleBlog || ''}
                            />
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='form-group mb-3'>
                            <label>Content</label>
                            <ReactQuill
                                theme='snow'
                                onChange={setContent}
                                value={content}
                                placeholder='Content of blog'
                            />
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown pr-2'>
                            <button
                                type='button'
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                data-toggle='dropdown'
                                id='categoryButton'
                            >
                                Category
                            </button>
                            <div className='dropdown-menu' aria-labelledby='categoryButton'>
                                {checkboxCategory?.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={item.id}>
                                            <input
                                                type='checkbox'
                                                id='checkboxCategory'
                                                className='form-check-input category-checkbox'
                                                onChange={(e) => handleCheckboxCategory(index)}
                                                value={item.id || ''}
                                                checked={item.isChecked}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='checkboxCategory'
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div className='dropdown pl-2'>
                            <button
                                type='button'
                                className='btn btn-outline-primary dropdown-toggle btn-block'
                                data-toggle='dropdown'
                                id='tagButton'
                            >
                                Tag
                            </button>
                            <div className='dropdown-menu' aria-labelledby='tagButton'>
                                {checkboxTag?.map((item, index) => {
                                    return (
                                        <div className='dropdown-item' key={item.id}>
                                            <input
                                                type='checkbox'
                                                id='checkboxTag'
                                                className='form-check-input category-checkbox'
                                                onChange={(e) => handleCheckboxTag(index)}
                                                value={item.id || ''}
                                                checked={item.isChecked}
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor='checkboxTag'
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleAddBlog = () => {
        setTitleBlog('');
        setImageBlog({ image: null, link: null });
        setContent('');

        let tempCat = [];
        categoryBlog.forEach((item) => {
            tempCat.push({
                id: item.id,
                name: item.name,
                isChecked: false,
            });
        });
        setCheckboxCategory(tempCat);

        let tempTag = [];
        tagBlog.forEach((item) => {
            tempTag.push({
                id: item.id,
                name: item.name,
                isChecked: false,
            });
        });
        setCheckboxTag(tempTag);
    };

    const submitAddBlog = () => {
        let bodyBlog = new FormData();
        bodyBlog.append('IMG', imageBlog.image);
        bodyBlog.append('content', content);
        bodyBlog.append('title', titleBlog);
        bodyBlog.append('authorId', user_id);

        const bodyCategory = { categoryId: [] };
        checkboxCategory.forEach((item) => {
            if (item.isChecked) {
                bodyCategory.categoryId.push(item.id);
            }
        });

        const bodyTag = { tagId: [] };
        checkboxTag.forEach((item) => {
            if (item.isChecked) {
                bodyTag.tagId.push(item.id);
            }
        });
        dispatch(addBlog(bodyBlog, bodyCategory, bodyTag));
    };

    const handleEditBlog = (item) => {
        let tempCat = [];
        let tempTag = [];

        setEditId(item.id);
        setTitleBlog(item.title);
        setImageBlog({ link: item.image, type: 'get', });
        setContent(item.content);
        categoryBlog.forEach((element) => {
            tempCat.push({
                id: element.id,
                name: element.name,
                isChecked: item.category.indexOf(element.name) !== -1,
            });
        });
        setCheckboxCategory(tempCat);
        tagBlog.forEach((element) => {
            tempTag.push({
                id: element.id,
                name: element.name,
                isChecked: item.tags.indexOf(element.name) !== -1,
            });
        });
        setCheckboxTag(tempTag);
    };

    const submitEditBlog = () => {
        let bodyImage = new FormData();
        if (imageBlog.image) {
            bodyImage.append('IMG', imageBlog.image);
            dispatch(editBlogImage(bodyImage, editId));
        }
        
        const bodyBlog = { content, title: titleBlog, authorId: user_id };
        dispatch(editBlog(bodyBlog, editId));

        const bodyCategory = { categoryId: [] };
        checkboxCategory.forEach((item) => {
            if (item.isChecked) {
                bodyCategory.categoryId.push(item.id);
            }
        });
        dispatch(editBlogCategory(bodyCategory, editId));

        const bodyTag = { tagId: [] };
        checkboxTag.forEach((item) => {
            if (item.isChecked) {
                bodyTag.tagId.push(item.id);
            }
        });
        dispatch(editBlogTag(bodyTag, editId));
    };

    const handleBlogDetail = (blog_id) => {
        dispatch(getBlogDetails(blog_id));
        dispatch(getOthersBlog(blog_id));
        dispatch(getCommentsByBlog(blog_id));
    };

    const handleCommentDetail = (blog_id) => {
        dispatch(getCommentsAdmin(blog_id));
        setComments(blog_id);
    };

    return (
        <div className='SA-blog'>
            <h3 className='mb-2'>Blog</h3>
            <div className='row mb-2 no-gutters justify-content-between'>
                <div className='col-md-8 col-sm-12 d-flex align-items-center'>
                    <div className='input-group mb-3'>
                        <div className='input-group-prepend' id='button-addon3'>
                            <div className='dropdown'>
                                <button
                                    type='button'
                                    className='btn btn-outline-primary dropdown-toggle h-100 border-secondary border-right-0'
                                    id='filterStatus'
                                    data-toggle='dropdown'
                                    aria-haspopup='true'
                                    aria-expanded='false'
                                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                >
                                    {filterStatus.name || 'All Blog Status'}
                                </button>
                                <div className='dropdown-menu' aria-labelledby='filterStatus'>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() => setFilterStatus({ name: null, id: null })}
                                    >
                                        All Blog Status
                                    </button>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() => setFilterStatus({ name: 'Active', id: 1 })}
                                    >
                                        Active
                                    </button>
                                    <button
                                        type='button'
                                        className='btn dropdown-item'
                                        onClick={() => setFilterStatus({ name: 'Inactive', id: 2 })}
                                    >
                                        Inactive
                                    </button>
                                </div>
                            </div>
                            <div className='dropdown'>
                                <button
                                    type='buttton'
                                    className='btn btn-outline-primary dropdown-toggle h-100 rounded-0 border-right-0 border-secondary'
                                    id='sortBlog'
                                    data-toggle='dropdown'
                                    aria-haspopup='true'
                                    aria-expanded='false'
                                >
                                    {sortBlog.name || 'Sort Blog'}
                                </button>
                                <div className='dropdown-menu' aria-labelledby='sortBlog'>
                                    {sort.map((item, index) => {
                                        return (
                                            <button
                                                type='button'
                                                className='btn dropdown-item d-flex align-items-center'
                                                key={index}
                                                onClick={() =>
                                                    setSortBlog({
                                                        name: item.name,
                                                        query: item.query,
                                                    })
                                                }
                                            >
                                                <i className={`bx ${item.icon} mr-1`}></i>
                                                {item.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Search title of blog'
                            aria-label='Example text with two button addons'
                            aria-describedby='button-addon3'
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                        <div className='input-group-append' id='button-addon3'>
                            <button type='button' className='btn btn-primary'>
                                <i className='bx bx-search-alt'></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <button
                        type='button'
                        className='btn btn-primary'
                        style={{ minHeight: '48px' }}
                        data-toggle='modal'
                        data-target='#add_blog_detail'
                        onClick={() => handleAddBlog()}
                    >
                        Add Blog
                    </button>
                </div>
            </div>
            <div className='table-responsive'>
                <table className='table table-bordered table-sm'>
                    <thead className='thead-light'>
                        <tr>
                            <th className='text-center align-middle'>Image</th>
                            <th>Title</th>
                            <th>Released Date</th>
                            <th>Views</th>
                            <th>Status</th>
                            <th className='text-center align-middle'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogAdmin.length > 0 ? (
                            blogAdmin.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className='align-middle'>
                                            <img
                                                src={`${URL_IMG}/${item.image}`}
                                                alt={`blog-image-${item.title}`}
                                                className='img img-admin-blog'
                                            />
                                        </td>
                                        <td className='align-middle'>{item.title}</td>
                                        <td className='align-middle'>
                                            {new Date(item.date).toLocaleString()}
                                        </td>
                                        <td className='align-middle'>
                                            {item.view.toLocaleString()}
                                        </td>
                                        <td className='align-middle'>
                                            {item.status === 1 ? (
                                                <button
                                                    type='button'
                                                    className='btn text-primary'
                                                    onClick={() =>
                                                        dispatch(editBlog({ status: 2 }, item.id))
                                                    }
                                                >
                                                    <u>Active</u>
                                                </button>
                                            ) : (
                                                <button
                                                    type='button'
                                                    className='btn'
                                                    onClick={() =>
                                                        dispatch(editBlog({ status: 1 }, item.id))
                                                    }
                                                >
                                                    Inactive
                                                </button>
                                            )}
                                        </td>
                                        <td className='align-middle text-center'>
                                            <button
                                                type='button'
                                                className='btn p-0'
                                                data-toggle='modal'
                                                data-target='#edit_blog_detail'
                                                onClick={() => handleEditBlog(item)}
                                            >
                                                <div
                                                    data-toggle='tooltip'
                                                    data-placement='top'
                                                    title='Edit'
                                                >
                                                    <i className='bx bx-pencil'></i>
                                                </div>
                                            </button>
                                            <button
                                                type='button'
                                                className='btn p-0'
                                                data-toggle='modal'
                                                data-target='#view_blog_detail'
                                                onClick={() => handleBlogDetail(item.id)}
                                            >
                                                <div
                                                    data-toggle='tooltip'
                                                    data-placement='top'
                                                    title='Details'
                                                >
                                                    <i className='bx bx-detail'></i>
                                                </div>
                                            </button>
                                            <button
                                                type='button'
                                                className='btn p-0'
                                                data-toggle='modal'
                                                data-target='#view_blog_comment'
                                                onClick={() => handleCommentDetail(item.id)}
                                            >
                                                <div
                                                    data-toggle='tooltip'
                                                    data-placemenet='top'
                                                    title='Comments'
                                                >
                                                    <i className='bx bx-comment-detail'></i>
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr className='alert alert-secondary text-center'>
                                <td colSpan={6}>
                                    We can't found your keyword. Please change your keyword!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ModalComp
                modal_id={'add_blog_detail'}
                size='modal-lg'
                scrollable={true}
                title='Add Blog'
                body={renderFormBlog('add')}
                footer={
                    <div className='d-block mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            onClick={() => submitAddBlog()}
                            data-dismiss='modal'
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id={'edit_blog_detail'}
                size='modal-lg'
                scrollable={true}
                title='Edit Blog'
                body={renderFormBlog('edit')}
                footer={
                    <div className='d-block mx-auto'>
                        <button type='button' className='btn btn-primary mr-2' data-dismiss='modal'>
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary ml-2'
                            data-dismiss='modal'
                            onClick={() => submitEditBlog()}
                        >
                            Submit
                        </button>
                    </div>
                }
            />
            <ModalComp
                modal_id={'view_blog_detail'}
                size='modal-lg'
                scrollable={true}
                title='Blog Detail'
                body={
                    <BlogDetails
                        blogDetails={blogDetails}
                        othersBlog={othersBlog}
                        type='blog-details-admin'
                    />
                }
            />
            <ModalComp
                modal_id={'view_blog_comment'}
                size='modal-lg'
                scrollable={true}
                title='Blog Comment'
                body={<CommentsLists blog_id={comments} type='blog-admin' />}
            />
        </div>
    );
};

export default SuperAdminBlog;
