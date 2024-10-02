import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchSubreddits, fetchSubredditPosts } from '../utils/redditApi';
import { useAppContext } from '../context/AppContext';
import SubredditList from './SubredditList';
import PostTable from './PostTable';

const SubredditExplorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubreddits, setSelectedSubreddits] = useState([]);
  const [activeSubreddit, setActiveSubreddit] = useState(null);
  const [postType, setPostType] = useState('hot');
  const { addManagedPost } = useAppContext();

  const { data: subreddits, isLoading: isLoadingSubreddits, refetch: refetchSubreddits } = useQuery({
    queryKey: ['subreddits', searchTerm],
    queryFn: () => searchSubreddits(searchTerm),
    enabled: false,
  });

  const { data: posts, isLoading: isLoadingPosts, refetch: refetchPosts } = useQuery({
    queryKey: ['posts', activeSubreddit, postType],
    queryFn: () => fetchSubredditPosts(activeSubreddit, postType),
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
        {isLoadingSubreddits && <p>Loading subreddits...</p>}
        {subreddits && searchTerm && (
          <SubredditList 
            subreddits={subreddits} 
            onSubredditSelect={handleSubredditSelect} 
          />
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
            <button onClick={() => handleRemoveSubreddit(subreddit)} className="text-xs">
              &times;
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
          
          {isLoadingPosts && <p>Loading posts...</p>}
          {posts && (
            <PostTable posts={posts} handlePostCheck={handlePostCheck} />
          )}
        </div>
      )}
    </div>
  );
};

export default SubredditExplorer;