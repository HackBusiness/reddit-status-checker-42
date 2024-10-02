import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const SubredditList = ({ subreddits, onSubredditSelect }) => {
  return (
    <Card className="mt-2">
      <CardContent className="p-2">
        {subreddits.map((subreddit) => (
          <div 
            key={subreddit.id} 
            className="p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSubredditSelect(subreddit.display_name)}
          >
            {subreddit.display_name}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SubredditList;