import React from 'react';
import PostTable from './PostTable';

const ManagedPosts = ({ managedPosts = [] }) => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Managed Posts</h1>
      {managedPosts.length > 0 ? (
        <PostTable posts={managedPosts} />
      ) : (
        <p>No managed posts yet.</p>
      )}
    </div>
  );
};

export default ManagedPosts;