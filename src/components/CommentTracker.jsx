import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, RefreshCw, Plus } from 'lucide-react';

const CommentTracker = () => {
  const [subredditFilter, setSubredditFilter] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      date: '2023-03-15',
      subreddit: 'AskReddit',
      author: 'user123',
      url: 'https://www.reddit.com/r/AskReddit/comments/example1',
      organicTraffic: '2.3K',
      upvotes: 150,
      affiliateStatus: 'Active',
    },
    // Add more mock data as needed
  ]);

  const handleRefresh = () => {
    // Implement refresh logic here
    console.log('Refreshing data...');
  };

  const handleAddComment = () => {
    // Implement add comment logic here
    console.log('Adding new comment...');
  };

  const filteredComments = comments.filter(comment =>
    comment.subreddit.toLowerCase().includes(subredditFilter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="text"
          placeholder="Filter by subreddit"
          value={subredditFilter}
          onChange={(e) => setSubredditFilter(e.target.value)}
          className="max-w-sm"
        />
        <div className="space-x-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddComment}>
            <Plus className="mr-2 h-4 w-4" />
            Add Comment
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Subreddit</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Organic Traffic</TableHead>
            <TableHead>Upvotes</TableHead>
            <TableHead>Affiliate Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredComments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell>{comment.date}</TableCell>
              <TableCell>{comment.subreddit}</TableCell>
              <TableCell>{comment.author}</TableCell>
              <TableCell>
                <a href={comment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Link
                </a>
              </TableCell>
              <TableCell>{comment.organicTraffic} Views</TableCell>
              <TableCell className="flex items-center">
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
                {comment.upvotes}
              </TableCell>
              <TableCell>{comment.affiliateStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommentTracker;