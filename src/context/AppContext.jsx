import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [managedPosts, setManagedPosts] = useState(() => {
    const storedPosts = localStorage.getItem('managedPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  });

  const [trackedComments, setTrackedComments] = useState(() => {
    const storedComments = localStorage.getItem('trackedComments');
    return storedComments ? JSON.parse(storedComments) : [];
  });

  useEffect(() => {
    localStorage.setItem('managedPosts', JSON.stringify(managedPosts));
  }, [managedPosts]);

  useEffect(() => {
    localStorage.setItem('trackedComments', JSON.stringify(trackedComments));
  }, [trackedComments]);

  const addManagedPost = (post) => {
    setManagedPosts((prevPosts) => {
      if (!prevPosts.some(p => p.id === post.id)) {
        return [...prevPosts, post];
      }
      return prevPosts;
    });
  };

  const addCommentToTracker = (comment) => {
    setTrackedComments((prevComments) => {
      if (!prevComments.some(c => c.url === comment.url)) {
        return [...prevComments, comment];
      }
      return prevComments;
    });
  };

  return (
    <AppContext.Provider value={{ 
      managedPosts, 
      addManagedPost,
      trackedComments,
      addCommentToTracker,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};