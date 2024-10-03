import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [managedPosts, setManagedPosts] = useState(() => {
    const storedPosts = localStorage.getItem('managedPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  });

  useEffect(() => {
    localStorage.setItem('managedPosts', JSON.stringify(managedPosts));
  }, [managedPosts]);

  const addManagedPost = (post) => {
    setManagedPosts((prevPosts) => {
      if (!prevPosts.some(p => p.id === post.id)) {
        return [...prevPosts, post];
      }
      return prevPosts;
    });
  };

  return (
    <AppContext.Provider value={{ 
      managedPosts, 
      addManagedPost,
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