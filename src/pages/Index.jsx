import React from 'react';
import RedditLinkChecker from '../components/RedditLinkChecker';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Reddit Link Checker</h1>
        <RedditLinkChecker />
      </div>
    </div>
  );
};

export default Index;