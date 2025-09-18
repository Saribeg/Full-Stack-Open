import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import Button from '../ui/Form/Button';
import PageTitle from '../PageTitle';
import NativeLink from '../ui/NativeLink';
import LikeButton from '../ui/LikeButton';
import BlogNotFound from './BlogNotFound';
import Togglable from '../Togglable';
import Spinner from '../ui/Spinner';

import { selectAuth } from '../../store/auth/selectors';
import { selectBlogDetailsState } from '../../store/blogDetails/selectors';
import { fetchBlogById, likeBlog } from '../../store/blogDetails/thunks';
import { showModal } from '../../store/modal/slice';

const BlogDetails = () => {
  const authUser = useSelector(selectAuth);
  const { blog, loading } = useSelector(selectBlogDetailsState);
  const dispatch = useDispatch();
  const { id } = useParams();
  const commentFormRef = useRef();

  useEffect(() => {
    dispatch(fetchBlogById(id));
  }, [dispatch, id]);

  const handleBlogUpdate = () => {
    dispatch(likeBlog(blog));
  };

  const handleBlogDelete = () => {
    dispatch(showModal({ type: 'confirmBlogDelete', params: { blog } }));
  };

  if (loading) return <Spinner />;
  if (!blog) return <BlogNotFound id={id} />;

  return (
    <div className="mx-auto mt-8 max-w-4xl space-y-8 px-8">
      <div className="flex w-full flex-col gap-y-8 rounded-xl border border-cyan-800 bg-[#0b1120] p-4">
        <PageTitle>
          "{blog.title}" <span>by {blog.author}</span>
        </PageTitle>
        <div className="space-y-1 text-xl leading-relaxed text-cyan-100/80">
          <div>Author: {blog.author || 'unknown'}</div>
          <div>
            URL: <NativeLink href={blog.url}>{blog.url}</NativeLink>
          </div>
          {blog.user?.name && <div>Added by {blog.user.name}</div>}
        </div>
        <div className="align-center flex gap-12">
          <LikeButton count={blog.likes} onClick={handleBlogUpdate} />
          {authUser?.id === blog.user?.id ? (
            <Button uiType="ghostDanger" onClick={handleBlogDelete}>
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      {blog.comments?.length > 7 && (
        <Togglable buttonLabel="New Comment" ref={commentFormRef}>
          <CommentForm id={blog.id} toggleForm={() => commentFormRef.current.toggleVisibility()} />
        </Togglable>
      )}

      <div className="flex w-full flex-col">
        {blog.comments?.length > 0 && (
          <>
            <h3 className="mb-4 text-2xl">Comments</h3>
            <ul className="flex flex-col gap-2">
              {blog.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  authUser={authUser}
                  blogId={blog.id}
                />
              ))}
            </ul>
          </>
        )}
      </div>
      <CommentForm id={blog.id} />
    </div>
  );
};

export default BlogDetails;
