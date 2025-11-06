import { addComments, deleteComments, editComments } from '../../store/action';
import { URL_IMG } from '../../store/helpers';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import LoginAlertModal from '../Common/LoginAlertModal';

class CommentsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            form_id: null,
            comment_id: null,
            comment: '',
            comment_type: '',
        };
    }

    handleCommentForm = () => {
        const { comment_id, comment, comment_type } = this.state;
        const { id } = this.props.blogDetails;
        if (this.props.id) {
            if (comment_type === 'edit') {
                const body = { comment };
                this.props.editComments(body, comment_id, id);
            } else {
                const body = {
                    userId: this.props.id,
                    comment: comment,
                    replyId: comment_id,
                    blogId: id,
                    status: 1,
                };
                this.props.addComments(body, id);
            }
        } else {
            $('#login-blog-comments').modal();
        }
        this.setState({ form_id: null, comment_id: null, comment: '', comment_type: '' });
    };

    renderCommentForm = () => {
        const { comment_type } = this.state;
        return (
            <div className='comment-respond mb-3'>
                <h3 className='comment-reply-title'>Leave a Reply</h3>

                <form className='comment-form'>
                    <p className='comment-form-comment'>
                        <label>Comment</label>
                        <textarea
                            cols='45'
                            placeholder='Your Comment...'
                            rows='5'
                            required='required'
                            onChange={(e) => {
                                e.preventDefault();
                                this.setState({ comment: e.target.value });
                            }}
                            value={this.state.comment}
                        ></textarea>
                    </p>
                    <p className='form-submit'>
                        <button
                            type='button'
                            className={`submit btn-cancel ${comment_type === 'edit' ? 'd-inline mr-2' : 'd-none'}`}
                            onClick={() =>                                                             
                                this.setState({
                                    comment_id: null,
                                    comment_type: '',
                                    form_id: null,
                            })}
                        >
                            Cancel
                        </button>
                        <button
                            type='button'
                            className='submit'
                            onClick={() => this.handleCommentForm()}
                        >
                            {comment_type === '' ? 'Post A ' : comment_type} Comment
                        </button>
                    </p>
                </form>
            </div>
        );
    };

    render() {
        const { comments, commentsAdmin, id, blogDetails, type, blog_id } = this.props;
        const { comment_id, form_id } = this.state;
        const commentsLength = (type === 'blog-user' ? comments : commentsAdmin).length;
        return (
            <div className='comments-area'>
                {commentsLength !== 0 ? (
                    <h3 className='comments-title'>{commentsLength} Comments:</h3>
                ) : (
                    <div className='alert alert-secondary' role='alert'>
                        This article has not comments!
                    </div>
                )}

                <ol className='comment-list'>
                    {(type === 'blog-user' ? comments : commentsAdmin).map((item, index) => {
                        return (
                            <li key={index} className='comment'>
                                <article className='comment-body'>
                                    <footer className='comment-meta'>
                                        <div className='comment-author vcard'>
                                            <img
                                                src={`${URL_IMG}/${
                                                    item.image
                                                        ? item.image
                                                        : 'image/users/avatar.jpg'
                                                }`}
                                                className='avatar'
                                                alt='image'
                                            />
                                            <b className='fn'>{item.full_name}</b>
                                            <span className='says'>says:</span>
                                        </div>

                                        <div className='comment-metadata'>
                                            <span>{new Date(item.date).toLocaleString()}</span>
                                        </div>
                                    </footer>

                                    <div className='comment-content'>
                                        <p>{item.comment}</p>
                                    </div>

                                    {type === 'blog-user' ? (
                                        <div className='reply'>
                                            {id === item.user_id ? (
                                                <div>
                                                    <button
                                                        type='button'
                                                        className='comment-reply-link mr-2'
                                                        onClick={() =>
                                                            this.setState({
                                                                comment_id: item.id,
                                                                comment_type: 'edit',
                                                                form_id: item.id,
                                                            })
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className='comment-reply-link'
                                                        onClick={() =>
                                                            this.props.deleteComments(
                                                                item.id,
                                                                blogDetails.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ) : comment_id === item.id ? null : (
                                                <button
                                                    type='button'
                                                    className='comment-reply-link'
                                                    onClick={() =>
                                                        this.setState({
                                                            comment_id: item.id,
                                                            comment_type: 'add',
                                                        })
                                                    }
                                                >
                                                    Reply
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='reply'>
                                            <button
                                                type='button'
                                                className='comment-reply-link'
                                                onClick={() =>
                                                    this.props.editComments(
                                                        { status: item.status === 1 ? 2 : 1 },
                                                        item.id,
                                                        blog_id,
                                                        'type=admin'
                                                    )
                                                }
                                            >
                                                {item.status === 1 ? 'Active' : 'Inactive'}
                                            </button>
                                        </div>
                                    )}
                                </article>

                                {item.reply !== null ? (
                                    <ol className='children'>
                                        {item.reply.map((value, idx) => {
                                            return (
                                                <li key={idx} className='comment'>
                                                    <article className='comment-body'>
                                                        <footer className='comment-meta'>
                                                            <div className='comment-author vcard'>
                                                                <img
                                                                    src={`${URL_IMG}/${
                                                                        value.image
                                                                            ? value.image
                                                                            : 'image/users/avatar.jpg'
                                                                    }`}
                                                                    className='avatar'
                                                                    alt='image'
                                                                />
                                                                <b className='fn'>
                                                                    {value.full_name}
                                                                </b>
                                                                <span className='says'>says:</span>
                                                            </div>

                                                            <div className='comment-metadata'>
                                                                <span>
                                                                    {new Date(
                                                                        value.date
                                                                    ).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </footer>

                                                        <div className='comment-content'>
                                                            <p>{value.comment}</p>
                                                        </div>

                                                        {type === 'blog-user' ? (
                                                            <div className='reply'>
                                                                {id === value.user_id ? (
                                                                    <div>
                                                                        <button
                                                                            type='button'
                                                                            className='comment-reply-link mr-2'
                                                                            onClick={() =>
                                                                                this.setState({
                                                                                    comment_id:
                                                                                        value.id,
                                                                                    comment_type:
                                                                                        'edit',
                                                                                    form_id:
                                                                                        item.id,
                                                                                })
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            type='button'
                                                                            className='comment-reply-link'
                                                                            onClick={() =>
                                                                                this.props.deleteComments(
                                                                                    value.id,
                                                                                    blogDetails.id
                                                                                )
                                                                            }
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                ) : comment_id ===
                                                                  item.id ? null : (
                                                                    <button
                                                                        type='button'
                                                                        className='comment-reply-link'
                                                                        onClick={() =>
                                                                            this.setState({
                                                                                comment_id: item.id,
                                                                                comment_type: 'add',
                                                                            })
                                                                        }
                                                                    >
                                                                        Reply
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className='reply'>
                                                                <button
                                                                    type='button'
                                                                    className='comment-reply-link'
                                                                    onClick={() =>
                                                                        this.props.editComments(
                                                                            {
                                                                                status:
                                                                                    value.status ===
                                                                                    1
                                                                                        ? 2
                                                                                        : 1,
                                                                            },
                                                                            item.id,
                                                                            blog_id,
                                                                            'type=admin'
                                                                        )
                                                                    }
                                                                >
                                                                    {value.status === 1
                                                                        ? 'Active'
                                                                        : 'Inactive'}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </article>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                ) : null}
                                {comment_id === item.id ||
                                (form_id === item.id && type === 'blog-admin')
                                    ? this.renderCommentForm()
                                    : null}
                            </li>
                        );
                    })}
                </ol>

                {/* Comment Form */}
                {comment_id || (form_id === comment_id && type === 'blog-admin') ? null : this.renderCommentForm()}
                <LoginAlertModal modal_id='login-blog-comments' />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        blogDetails: state.blog.blogDetails,
        comments: state.blogComments.comments,
        commentsAdmin: state.blogComments.commentsAdmin,
        id: state.users.id,
    };
};

export default connect(mapStateToProps, {
    addComments,
    editComments,
    deleteComments,
})(CommentsList);
