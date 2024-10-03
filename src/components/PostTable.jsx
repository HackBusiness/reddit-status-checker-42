import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PostTable = ({ posts, handlePostCheck }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
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
            <TableCell>{post.title}</TableCell>
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