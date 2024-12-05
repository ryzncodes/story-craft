'use client';

import { FormInput } from '@/components/ui/FormInput';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FieldError {
  path: string[];
  message: string;
}

export default function Register() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      username: formData.get('username'),
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'Email or username already exists' });
        } else if (result.details) {
          const fieldErrors: Record<string, string> = {};
          result.details.forEach((error: FieldError) => {
            fieldErrors[error.path[0]] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ submit: result.error || 'Something went wrong' });
        }
        return;
      }

      // Registration successful
      router.push('/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            id="username"
            name="username"
            type="text"
            label="Username"
            required
            error={errors.username}
            autoComplete="username"
          />
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            required
            error={errors.email}
            autoComplete="email"
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            required
            error={errors.password}
            autoComplete="new-password"
          />
          
          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Register'
            )}
          </button>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            className="font-medium text-blue-600 hover:text-blue-500"
            href="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
} 