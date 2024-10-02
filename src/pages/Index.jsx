import React, { useEffect } from 'react';
import CommentTracker from '../components/CommentTracker';
import { useAppContext } from '../context/AppContext';

const Index = () => {
  const { pageViews, incrementPageView } = useAppContext();

  useEffect(() => {
    incrementPageView('index');
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Comments in One Place</h1>
        <CommentTracker />
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Page Views</h2>
          <ul>
            <li>Index: {pageViews.index || 0}</li>
            <li>Subreddit Explorer: {pageViews.subredditExplorer || 0}</li>
            <li>Managed Posts: {pageViews.managedPosts || 0}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Index;