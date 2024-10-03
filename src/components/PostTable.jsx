import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PostTable = ({ posts, handlePostCheck }) => {
  const shortenTitle = (title, maxLength = 30) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength - 3) + '...';
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Comments</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={`https://reddit.com${post.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {shortenTitle(post.title)}
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{post.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell>{post.subreddit}</TableCell>
            <TableCell>{post.author}</TableCell>
            <TableCell>{post.score}</TableCell>
            <TableCell>{post.num_comments}</TableCell>
            <TableCell>{new Date(post.created_utc * 1000).toLocaleString()}</TableCell>
            <TableCell>
              <Button
                onClick={() => handlePostCheck(post)}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Check className="mr-2 h-4 w-4" />
                Mark as Checked
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PostTable;