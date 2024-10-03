import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAppContext } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ManagedPosts = () => {
  const { managedPosts, isCommentTracked, addTrackedComment } = useAppContext();

  const handleTrackComment = (post) => {
    const newComment = {
      id: `comment-${post.id}`,
      postId: post.id,
      url: `https://reddit.com${post.permalink}`,
      subreddit: post.subreddit,
      date: new Date().toISOString().split('T')[0],
      organicTraffic: '0',
      upvotes: 0,
      affiliateStatus: 'Active',
    };
    addTrackedComment(newComment);
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
              <TableHead>Tracked Comment</TableHead>
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
                  {isCommentTracked(post.id) ? (
                    <Link to="/" className="text-green-600 hover:underline">
                      View in Comment Tracker
                    </Link>
                  ) : (
                    <Button onClick={() => handleTrackComment(post)} size="sm">
                      Track Comment
                    </Button>
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