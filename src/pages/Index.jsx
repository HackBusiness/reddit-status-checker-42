import React from 'react';
import Header from '../components/Header';
import ProfileSection from '../components/ProfileSection';
import CommentTracker from '../components/CommentTracker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold">Track Comments in One Place</h1>
          <ProfileSection />
        </div>
        <CommentTracker />
      </div>
    </div>
  );
};

export default Index;