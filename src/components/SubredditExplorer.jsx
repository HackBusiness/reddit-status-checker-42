import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '../context/AppContext';
import PostTable from './PostTable';

const SubredditExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubreddits, setSelectedSubreddits] = useState(() => {
    const saved = localStorage.getItem('selectedSubreddits');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSubreddit, setActiveSubreddit] = useState(() => {
    return localStorage.getItem('activeSubreddit') || null;
  });
  const [postType, setPostType] = useState('hot');
  const { addManagedPost, managedPosts } = useAppContext();

  useEffect(() => {
    localStorage.setItem('selectedSubreddits', JSON.stringify(selectedSubreddits));
  }, [selectedSubreddits]);

  useEffect(() => {
    if (activeSubreddit) {
      localStorage.setItem('activeSubreddit', activeSubreddit);
    }
  }, [activeSubreddit]);

  const searchSubreddits = async (term) => {
    const response = await fetch(`https://www.reddit.com/subreddits/search.json?q=${term}`);
    const data = await response.json();
    return data.data.children.map(child => child.data);
  };

  const fetchSubredditPosts = async (subreddit) => {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/${postType}.json`);
    const data = await response.json();
    return data.data.children.map(child => child.data);
  };

  const { data: subreddits, isLoading: isLoadingSubreddits, refetch: refetchSubreddits } = useQuery({
    queryKey: ['subreddits', searchTerm],
    queryFn: () => searchSubreddits(searchTerm),
    enabled: false,
  });

  const { data: posts, isLoading: isLoadingPosts, refetch: refetchPosts } = useQuery({
    queryKey: ['posts', activeSubreddit, postType],
    queryFn: () => fetchSubredditPosts(activeSubreddit),
    enabled: !!activeSubreddit,
  });

  const handlePostCheck = (post) => {
    addManagedPost(post);
  };

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

  const handlePostTypeChange = (value) => {
    setPostType(value);
    refetchPosts();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Subreddit Explorer</h1>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search subreddits"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
        {isLoadingSubreddits && <Loader2 className="animate-spin mt-2" />}
        {subreddits && searchTerm && (
          <Card className="mt-2">
            <CardContent className="p-2">
              {subreddits.map((subreddit) => (
                <div 
                  key={subreddit.id} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSubredditSelect(subreddit.display_name)}
                >
                  {subreddit.display_name}
                </div>
              ))}
            </CardContent>
          </Card>
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
            <button 
              className="text-xs"
              onClick={() => handleRemoveSubreddit(subreddit)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {activeSubreddit && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Posts in r/{activeSubreddit}</h2>
            <Select value={postType} onValueChange={handlePostTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select post type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="rising">Rising</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isLoadingPosts && <Loader2 className="animate-spin" />}
          {posts && (
            <PostTable 
              posts={posts} 
              handlePostCheck={handlePostCheck} 
              managedPosts={managedPosts}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SubredditExplorer;