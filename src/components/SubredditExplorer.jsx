import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';

const SubredditExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [activeSubreddit, setActiveSubreddit] = useState(null);

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
    queryKey: ['posts', activeSubreddit],
    queryFn: () => fetchSubredditPosts(activeSubreddit),
    enabled: !!activeSubreddit,
  });

  const handleSearch = () => {
    refetchSubreddits();
  };

  const handleSubredditSelect = (subreddit) => {
    if (!selectedSubreddits.includes(subreddit)) {
      setSelectedSubreddits([...selectedSubreddits, subreddit]);
    }
    setActiveSubreddit(subreddit);
    setSearchTerm('');
  };

  const handleRemoveSubreddit = (subreddit) => {
    setSelectedSubreddits(selectedSubreddits.filter(s => s !== subreddit));
    if (activeSubreddit === subreddit) {
      setActiveSubreddit(selectedSubreddits[0] || null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subreddit Explorer</h1>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search subreddits"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-20"
        />
        <Button 
          onClick={handleSearch} 
          className="absolute right-0 top-0 rounded-l-none"
        >
          Search
        </Button>
        {isLoadingSubreddits && <Loader2 className="animate-spin absolute right-24 top-2" />}
        {subreddits && searchTerm && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {subreddits.map((subreddit) => (
              <div 
                key={subreddit.id} 
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSubredditSelect(subreddit.display_name)}
              >
                {subreddit.display_name}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedSubreddits.map((subreddit) => (
          <div 
            key={subreddit} 
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${
              activeSubreddit === subreddit ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            <span onClick={() => setActiveSubreddit(subreddit)} className="cursor-pointer">
              {subreddit}
            </span>
            <X 
              className="h-4 w-4 cursor-pointer" 
              onClick={() => handleRemoveSubreddit(subreddit)}
            />
          </div>
        ))}
      </div>
      
      {activeSubreddit && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Posts in r/{activeSubreddit}</h2>
          {isLoadingPosts && <Loader2 className="animate-spin" />}
          {posts && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm line-clamp-3">{post.selftext}</p>
                    <a 
                      href={`https://reddit.com${post.permalink}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:underline text-sm mt-2 block"
                    >
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