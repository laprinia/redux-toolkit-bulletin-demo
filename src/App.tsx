import React from "react";
import PostsList from "./features/posts/PostsList";
import AddPostForm from "./features/posts/AddPostForm";
import "./App.css";
function App() {
  return (
    <>
      <AddPostForm />
      <PostsList />
    </>
  );
}

export default App;
