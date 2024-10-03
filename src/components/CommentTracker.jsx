import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import CommentTable from './CommentTable';
import AddCommentDialog from './AddCommentDialog';
import { toast } from 'sonner';
import { useAppContext } from '../context/AppContext';

const CommentTracker = () => {
  const [subredditFilter, setSubredditFilter] = useState('');
  const { trackedComments, removeTrackedComment } = useAppContext();
  const [selectedComments, setSelectedComments] = useState([]);

  const parseRedditUrl = (url) => {
    const match = url.match(/\/r\/([^/]+)\/comments\/([^/]+)(?:\/[^/]+\/([^/]+))?/);
    if (match) {
      return {
        subreddit: match[1],
        postId: match[2],
        commentId: match[3] || match[2],
      };
    }
    return null;
  };

  const fetchCommentStatus = useCallback(async (comment) => {
    try {
      const parsedUrl = parseRedditUrl(comment.url);
      if (!parsedUrl) throw new Error('Invalid Reddit URL');

      const apiUrl = `https://www.reddit.com/r/${parsedUrl.subreddit}/comments/${parsedUrl.postId}/_/${parsedUrl.commentId}.json`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const commentData = data[1].data.children[0].data;
      
      return {
        ...comment,
        upvotes: commentData.ups,
        organicTraffic: commentData.score,
        affiliateStatus: commentData.removed_by_category ? 'Removed' : 'Active',
      };
    } catch (error) {
      console.error('Error fetching comment status:', error);
      return {
        ...comment,
        upvotes: 0,
        organicTraffic: 0,
        affiliateStatus: 'Error',
      };
    }
  }, []);

  const { refetch } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const updatedComments = await Promise.all(trackedComments.map(fetchCommentStatus));
      return updatedComments;
    },
    enabled: false,
  });

  const handleRefresh = async () => {
    toast.promise(
      refetch(),
      {
        loading: 'Refreshing comments...',
        success: 'Comments refreshed successfully!',
        error: 'Failed to refresh comments',
      }
    );
  };

  const handleRemoveComment = (commentId) => {
    removeTrackedComment(commentId);
    setSelectedComments(prevSelected => prevSelected.filter(id => id !== commentId));
  };

  const handleRemoveSelectedComments = () => {
    selectedComments.forEach(commentId => removeTrackedComment(commentId));
    setSelectedComments([]);
  };

  const handleSelectComment = (commentId) => {
    setSelectedComments(prevSelected => 
      prevSelected.includes(commentId)
        ? prevSelected.filter(id => id !== commentId)
        : [...prevSelected, commentId]
    );
  };

  const filteredComments = trackedComments.filter(comment =>
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
          <AddCommentDialog />
          {selectedComments.length > 0 && (
            <Button onClick={handleRemoveSelectedComments} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Selected
            </Button>
          )}
        </div>
      </div>
      <CommentTable
        comments={filteredComments}
        selectedComments={selectedComments}
        onSelectComment={handleSelectComment}
        onRemoveComment={handleRemoveComment}
      />
    </div>
  );
};

export default CommentTracker;