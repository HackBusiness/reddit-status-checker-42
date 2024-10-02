import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import CommentTable from './CommentTable';
import AddCommentDialog from './AddCommentDialog';

const CommentTracker = () => {
  const [subredditFilter, setSubredditFilter] = useState('');
  const [comments, setComments] = useState([]);
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
      const updatedComments = await Promise.all(comments.map(fetchCommentStatus));
      setComments(updatedComments);
      return updatedComments;
    },
    enabled: false,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleAddComment = async (newCommentUrl) => {
    const parsedUrl = parseRedditUrl(newCommentUrl);
    if (!parsedUrl) {
      alert('Invalid Reddit URL. Please enter a valid comment URL.');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const newCommentEntry = {
      id: Date.now(),
      date: currentDate,
      subreddit: parsedUrl.subreddit,
      url: newCommentUrl,
      organicTraffic: '0',
      upvotes: 0,
      affiliateStatus: 'Checking...',
    };

    const updatedComment = await fetchCommentStatus(newCommentEntry);
    setComments(prevComments => [...prevComments, updatedComment]);
  };

  const handleRemoveComment = (commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    setSelectedComments(prevSelected => prevSelected.filter(id => id !== commentId));
  };

  const handleRemoveSelectedComments = () => {
    setComments(prevComments => prevComments.filter(comment => !selectedComments.includes(comment.id)));
    setSelectedComments([]);
  };

  const handleSelectComment = (commentId) => {
    setSelectedComments(prevSelected => 
      prevSelected.includes(commentId)
        ? prevSelected.filter(id => id !== commentId)
        : [...prevSelected, commentId]
    );
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
          <AddCommentDialog onAddComment={handleAddComment} />
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