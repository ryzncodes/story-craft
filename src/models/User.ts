interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  profile: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
  };
  // References to other collections
  savedStories: string[];  // Story IDs
  followedAuthors: string[];  // User IDs
  readingHistory: {
    storyId: string;
    lastReadAt: Date;
    progress: number;  // Percentage or chapter number
  }[];
} 