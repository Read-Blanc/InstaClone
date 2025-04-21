import { createContext, useContext } from "react";
// for you to use the createContext and useContext, we need to set it up, which is what we are doing


// we create the store
export const AuthContext = createContext({});
export const PostContext = createContext({});

// we are using the useContext

// we give the store a name we call in order to use it.
// we are creating context store for auth particularly (amd the "authContext" is the store that we have created)
export const useAuth = () => {
  const authStore = useContext(AuthContext);
  if (authStore === undefined) {
    throw new Error("useAuth must be defined within an AuthProvider");
  }
  return authStore;
};

export const usePosts = () => {
  const postStore = useContext(PostContext);
  if (postStore === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return postStore;
};