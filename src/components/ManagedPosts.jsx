import React from 'react';
import { useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ManagedPosts = () => {
  const location = useLocation();
  const managedPosts = location.state?.managedPosts || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Managed Posts</h1>
      {managedPosts.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subreddit</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Comments</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.subreddit}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.score}</TableCell>
                <TableCell>{post.num_comments}</TableCell>
                <TableCell>{new Date(post.created_utc * 1000).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No managed posts yet.</p>
      )}
    </div>
  );
};

export default ManagedPosts;