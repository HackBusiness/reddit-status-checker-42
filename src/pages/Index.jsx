import React from 'react';
import CommentTracker from '../components/CommentTracker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Track Comments in One Place</h1>
        <CommentTracker />
      </div>
    </div>
  );
};

export default Index;