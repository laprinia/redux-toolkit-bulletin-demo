import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";
import { Post } from "../../types";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

interface InitialPost {
  title: string;
  body: string;
  userId: string;
}
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);

  return response.data as Post[];
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost: InitialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  },
);
interface PostsState {
  posts: Post[];
  status: string;
  error: null | string;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded(state, action) {
      state.posts.push(action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        let min = 1;
        const loadedPosts = action.payload.map((post: Post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          return post;
        });
        state.posts = state.posts.concat(loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Error Message";
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        action.payload.userId = Number(action.payload.userId);
        action.payload.date = new Date().toISOString();
        console.log(action.payload);
        state.posts.push(action.payload);
      });
  },
});

export const selectAllPosts = (state: any) => state.posts.posts;
export const getPostsStatus = (state: any) => state.posts.status;
export const getPostsError = (state: any) => state.posts.error;

export const { postAdded } = postsSlice.actions;
export default postsSlice.reducer;
