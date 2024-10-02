// This is a mock implementation. In a real application, you would make actual API calls to Reddit.

export const searchSubreddits = async (searchTerm) => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: '1', display_name: 'AskReddit' },
    { id: '2', display_name: 'funny' },
    { id: '3', display_name: 'gaming' },
    { id: '4', display_name: 'aww' },
    { id: '5', display_name: 'pics' },
  ].filter(subreddit => subreddit.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
};

export const fetchSubredditPosts = async (subreddit, postType) => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: '1', title: 'First post', author: 'user1', score: 100, num_comments: 50, created_utc: Date.now() / 1000 },
    { id: '2', title: 'Second post', author: 'user2', score: 75, num_comments: 30, created_utc: Date.now() / 1000 },
    { id: '3', title: 'Third post', author: 'user3', score: 50, num_comments: 20, created_utc: Date.now() / 1000 },
  ];
};