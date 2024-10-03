import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const ManagedPosts = () => {
  const { managedPosts, trackedComments } = useAppContext();

  const getAssociatedComments = (postId) => {
    return trackedComments.filter(comment => comment.url.includes(postId));
  };

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
              <TableHead>Associated Tracked Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managedPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  <a
                    href={`https://reddit.com${post.permalink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {post.title}
                  </a>
                </TableCell>
                <TableCell>{post.subreddit}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.score}</TableCell>
                <TableCell>{post.num_comments}</TableCell>
                <TableCell>{new Date(post.created_utc * 1000).toLocaleString()}</TableCell>
                <TableCell>
                  {getAssociatedComments(post.id).length > 0 ? (
                    <Link to="/" className="text-blue-600 hover:underline">
                      {getAssociatedComments(post.id).length} tracked comment(s)
                    </Link>
                  ) : (
                    'No tracked comments'
                  )}
                </TableCell>
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