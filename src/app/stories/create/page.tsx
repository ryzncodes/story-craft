'use client';

import { useAuth } from '@/contexts/AuthContext';
import { CreateStoryInput } from '@/types/story';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateStoryPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, router, isLoading]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading spinner component
  }

  if (!user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data: CreateStoryInput = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      genre: formData.get('genre') as string,
      tags: formData.get('tags') as string
        ? (formData.get('tags') as string).split(',').map(tag => tag.trim())
        : [],
    };

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create story');
      }

      const story = await response.json();
      router.push(`/stories/${story.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Story</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium mb-1">
            Genre
          </label>
          <select
            id="genre"
            name="genre"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a genre</option>
            <option value="fantasy">Fantasy</option>
            <option value="mystery">Mystery</option>
            <option value="romance">Romance</option>
            <option value="scifi">Science Fiction</option>
            <option value="thriller">Thriller</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            placeholder="adventure, magic, mystery"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Story'}
        </button>
      </form>
    </div>
  );
} 