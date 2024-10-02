import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [managedPosts, setManagedPosts] = useState([]);
  const [subredditPosts, setSubredditPosts] = useState([]);

  const addManagedPost = (post) => {
    setManagedPosts((prevPosts) => [...prevPosts, post]);
  };

  return (
    <AppContext.Provider value={{ managedPosts, addManagedPost, subredditPosts, setSubredditPosts }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);