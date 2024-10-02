import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const RedditLinkChecker = () => {
  const [redditLink, setRedditLink] = useState('');
  const [checkTriggered, setCheckTriggered] = useState(false);

  const checkRedditLink = async () => {
    // Extract post ID or comment ID from the link
    const match = redditLink.match(/\/comments\/([a-z0-9]+)(?:\/[^/]+\/([a-z0-9]+))?/i);
    if (!match) {
      throw new Error('Invalid Reddit link format');
    }

    const postId = match[1];
    const commentId = match[2];

    let apiUrl = `https://www.reddit.com/comments/${postId}.json`;
    if (commentId) {
      apiUrl += `?comment=${commentId}`;
    }

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data from Reddit API');
    }

    const data = await response.json();

    if (commentId) {
      // Check if the comment exists and is not deleted
      const comments = data[1].data.children;
      const comment = comments.find(c => c.data.id === commentId);
      return comment && !comment.data.body.includes('[deleted]');
    } else {
      // Check if the post exists and is not removed
      return data[0].data.children.length > 0 && !data[0].data.children[0].data.removed;
    }
  };

  const { data: isActive, isLoading, isError, error } = useQuery({
    queryKey: ['redditLink', redditLink],
    queryFn: checkRedditLink,
    enabled: checkTriggered,
  });

  const handleCheck = () => {
    setCheckTriggered(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Enter Reddit post or comment link"
          value={redditLink}
          onChange={(e) => setRedditLink(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleCheck} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Check'}
        </Button>
      </div>
      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {!isLoading && !isError && checkTriggered && (
        <Alert variant={isActive ? "default" : "destructive"}>
          <AlertTitle>{isActive ? "Active" : "Inactive"}</AlertTitle>
          <AlertDescription>
            {isActive
              ? "The Reddit post or comment is active."
              : "The Reddit post or comment is not active, has been removed, or doesn't exist."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RedditLinkChecker;