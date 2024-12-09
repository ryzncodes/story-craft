'use client';

import { Story } from '@/types/story';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StoriesResponse {
  stories: Story[];
  total: number;
  page: number;
  totalPages: number;
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch(`/api/stories?page=${page}`);
        const data: StoriesResponse = await response.json();
        setStories(data.stories);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching stories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [page]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Stories</h1>
        <Link
          href="/stories/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Story
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/stories/${story.id}`} className="hover:text-blue-500">
                {story.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {story.description || 'No description available'}
            </p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>By {story.author.username}</span>
              <span>{new Date(story.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {stories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No stories found. Be the first to create one!
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 