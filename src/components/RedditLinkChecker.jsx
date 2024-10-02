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
    const response = await fetch(`https://www.reddit.com/api/info.json?url=${redditLink}`);
    const data = await response.json();
    return data.data.children.length > 0;
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
          placeholder="Enter Reddit post link"
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
              ? "The Reddit post is active."
              : "The Reddit post is not active or doesn't exist."}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default RedditLinkChecker;