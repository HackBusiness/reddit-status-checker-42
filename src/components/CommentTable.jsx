import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUp, Trash2 } from 'lucide-react';

const CommentTable = ({ comments, selectedComments, onSelectComment, onRemoveComment }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">Select</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Organic Traffic</TableHead>
          <TableHead>Upvotes</TableHead>
          <TableHead>Affiliate Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {comments.map((comment) => (
          <TableRow key={comment.id}>
            <TableCell>
              <Checkbox
                checked={selectedComments.includes(comment.id)}
                onCheckedChange={() => onSelectComment(comment.id)}
              />
            </TableCell>
            <TableCell>{comment.date}</TableCell>
            <TableCell>{comment.subreddit}</TableCell>
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
            <TableCell>
              <Button onClick={() => onRemoveComment(comment.id)} variant="destructive" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CommentTable;