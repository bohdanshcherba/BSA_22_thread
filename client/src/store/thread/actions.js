import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActionType } from './common';

const loadPosts = createAsyncThunk(
  ActionType.SET_ALL_POSTS,
  async (filters, { extra: { services } }) => {
    const posts = await services.post.getAllPosts(filters);
    return { posts };
  }
);

const loadMorePosts = createAsyncThunk(
  ActionType.LOAD_MORE_POSTS,
  async (filters, { getState, extra: { services } }) => {
    const {
      posts: { posts }
    } = getState();
    const loadedPosts = await services.post.getAllPosts(filters);
    const filteredPosts = loadedPosts.filter(
      post => !(posts && posts.some(loadedPost => post.id === loadedPost.id))
    );

    return { posts: filteredPosts };
  }
);

const applyPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (postId, { extra: { services } }) => {
    const post = await services.post.getPost(postId);
    return { post };
  }
);

const createPost = createAsyncThunk(
  ActionType.ADD_POST,
  async (post, { extra: { services } }) => {
    const { id } = await services.post.addPost(post);
    const newPost = await services.post.getPost(id);

    return { post: newPost };
  }
);

const toggleExpandedPost = createAsyncThunk(
  ActionType.SET_EXPANDED_POST,
  async (postId, { extra: { services } }) => {
    const post = postId ? await services.post.getPost(postId) : undefined;
    return { post };
  }
);

const likePost = createAsyncThunk(
  ActionType.REACT,
  async (postId, { getState, extra: { services } }) => {
    const beforeAction = await services.post.getPostReaction(postId);

    const { id } = await services.post.likePost(postId, true);


    const diff = id ? 1 : -1; // if ID exists then the post was liked, otherwise - like was removed

    const mapLikes = post => ({
      ...post,
      likeCount: Number(post.likeCount) + diff, // diff is taken from the current closure
      dislikeCount: Number(post.dislikeCount) - beforeAction?.isLike===false ? 1 : 0
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== postId ? post : mapLikes(post)
    ));
    const updatedExpandedPost = expandedPost?.id === postId
      ? mapLikes(expandedPost)
      : undefined;


    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

// eslint-disable-next-line no-unused-vars
const dislikePost = createAsyncThunk(
  'thread/react', async function(postId, { getState, extra: { services } }) {

    const beforeAction = await services.post.getPostReaction(postId);
    const afterAction = await services.post.likePost(postId, false);

    const diff = afterAction.id ? 1 : -1;

    const {
      posts: { posts, expandedPost }
    } = getState();

    const mapLikes = post => ({
      ...post,
      dislikeCount: Number(post.dislikeCount) + diff,
      likeCount: Number(post.likeCount) - beforeAction?.isLike ? 1 : 0
    });

    const updated = posts.map(post => (

      post.id !== postId ? post : mapLikes(post)
    ));


    return { posts: updated, expandedPost: expandedPost };
  }
);

const addComment = createAsyncThunk(
  ActionType.COMMENT,
  async (request, { getState, extra: { services } }) => {
    const { id } = await services.comment.addComment(request);
    const comment = await services.comment.getComment(id);

    const mapComments = post => ({
      ...post,
      commentCount: Number(post.commentCount) + 1,
      comments: [...(post.comments || []), comment] // comment is taken from the current closure
    });

    const {
      posts: { posts, expandedPost }
    } = getState();
    const updated = posts.map(post => (
      post.id !== comment.postId ? post : mapComments(post)
    ));

    const updatedExpandedPost = expandedPost?.id === comment.postId
      ? mapComments(expandedPost)
      : undefined;

    return { posts: updated, expandedPost: updatedExpandedPost };
  }
);

export {
  loadPosts,
  loadMorePosts,
  applyPost,
  createPost,
  toggleExpandedPost,
  likePost,
  dislikePost,
  addComment
};
