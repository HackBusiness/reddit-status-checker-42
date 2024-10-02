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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Subreddit Explorer</h1>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Search subreddits"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      
      {isLoadingSubreddits && <Loader2 className="animate-spin" />}
      
      {subreddits && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subreddits.map((subreddit) => (
            <Card key={subreddit.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedSubreddit(subreddit.display_name)}>
              <CardHeader>
                <CardTitle>{subreddit.display_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{subreddit.public_description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedSubreddit && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Posts in r/{selectedSubreddit}</h2>
          {isLoadingPosts && <Loader2 className="animate-spin" />}
          {posts && (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <CardTitle>{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{post.selftext.substring(0, 200)}...</p>
                    <a href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
  );
};

export default SubredditExplorer;