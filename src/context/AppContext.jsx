import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [managedPosts, setManagedPosts] = useState(() => {
    const storedPosts = localStorage.getItem('managedPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  });
  const [subredditPosts, setSubredditPosts] = useState(() => {
    const storedPosts = localStorage.getItem('subredditPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  });
  const [pageViews, setPageViews] = useState(() => {
    const storedViews = localStorage.getItem('pageViews');
    return storedViews ? JSON.parse(storedViews) : {};
  });

  useEffect(() => {
    localStorage.setItem('managedPosts', JSON.stringify(managedPosts));
  }, [managedPosts]);

  useEffect(() => {
    localStorage.setItem('subredditPosts', JSON.stringify(subredditPosts));
  }, [subredditPosts]);

  useEffect(() => {
    localStorage.setItem('pageViews', JSON.stringify(pageViews));
  }, [pageViews]);

  const addManagedPost = (post) => {
    setManagedPosts((prevPosts) => [...prevPosts, post]);
  };

  const incrementPageView = (page) => {
    setPageViews((prevViews) => ({
      ...prevViews,
      [page]: (prevViews[page] || 0) + 1,
    }));
  };

  return (
    <AppContext.Provider value={{ 
      managedPosts, 
      addManagedPost, 
      subredditPosts, 
      setSubredditPosts,
      pageViews,
      incrementPageView
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);