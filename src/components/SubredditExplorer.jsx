import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SubredditExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubreddit, setSelectedSubreddit] = useState(null);

  const searchSubreddits = async (term) => {
    const response = await fetch(`https://www.reddit.com/subreddits/search.json?q=${term}`);
    const data = await response.json();
    return data.data.children.map(child => child.data);
  };

  const fetchSubredditPosts = async (subreddit) => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json`);
    const data = await response.json();
    return data.data.children.map(child => child.data);
  };

  const { data: subreddits, isLoading: isLoadingSubreddits, refetch: refetchSubreddits } = useQuery({
    queryKey: ['subreddits', searchTerm],
    queryFn: () => searchSubreddits(searchTerm),
    enabled: false,
  });

  const { data: posts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['posts', selectedSubreddit],
    queryFn: () => fetchSubredditPosts(selectedSubreddit),
    enabled: !!selectedSubreddit,
  });

  const handleSearch = () => {
    refetchSubreddits();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subreddit Explorer</h1>
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search subreddits"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      <div className="flex space-x-4">
        <div className="w-1/3">
          {isLoadingSubreddits && <Loader2 className="animate-spin" />}
          
          {subreddits && (
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {subreddits.map((subreddit) => (
                <Card 
                  key={subreddit.id} 
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedSubreddit === subreddit.display_name ? 'border-blue-500 border-2' : ''}`}
                  onClick={() => setSelectedSubreddit(subreddit.display_name)}
                >
                  <CardHeader>
                    <CardTitle className="text-sm">{subreddit.display_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs truncate">{subreddit.public_description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="w-2/3">
          {selectedSubreddit && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Posts in r/{selectedSubreddit}</h2>
              {isLoadingPosts && <Loader2 className="animate-spin" />}
              {posts && (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{post.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{post.selftext.substring(0, 100)}...</p>
                        <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                          Read more
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubredditExplorer;