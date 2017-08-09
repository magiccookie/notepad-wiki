import { createSelector } from 'reselect';

const selectPostsState = (state) => state.get('posts');

export const makeSelectPosts = createSelector(
  selectPostsState,
  (posts) => posts.get('posts')
);
