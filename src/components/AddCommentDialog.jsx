import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

const AddCommentDialog = ({ onAddComment }) => {
  const [newCommentUrl, setNewCommentUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleAddComment = () => {
    onAddComment(newCommentUrl);
    setNewCommentUrl('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Comment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Comment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Comment URL"
            value={newCommentUrl}
            onChange={(e) => setNewCommentUrl(e.target.value)}
          />
          <Button onClick={handleAddComment}>Add Comment</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommentDialog;