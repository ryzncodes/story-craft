# Story Craft

Story Craft is an engaging, interactive storytelling platform where readers can explore stories with branching paths and decision-making points, and writers can easily create and share interactive stories using an intuitive editor.

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Getting Started](#getting-started)
-   [Development](#development)
-   [Contributing](#contributing)
-   [License](#license)

## Features

### Reader Features

-   **Explore Stories**: Discover featured, trending, and new stories.
-   **Interactive Reading**: Make choices at key decision points to shape the story.
-   **Save Progress**: Save and revisit stories.
-   **Categories and Search**: Find stories by genre, tags, or author name.

### Writer Features

-   **Interactive Story Builder**: Write and edit stories with branching paths.
-   **Publish Stories**: Add metadata and publish stories.
-   **Analytics Dashboard**: Track story performance.

### Community Features

-   **Comments and Feedback**: Comment on stories and provide feedback.
-   **Story Ratings**: Rate stories with a 5-star system.
-   **Follow Authors**: Follow favorite authors for updates.

## Tech Stack

-   **Frontend**: Next.js, TypeScript, TailwindCSS
-   **Backend**: Node.js, Next.js API routes
-   **Database**: PostgreSQL, Prisma
-   **Authentication**: JWT
-   **Hosting**: Vercel

## Getting Started

### Prerequisites

-   Node.js and npm
-   PostgreSQL

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/storycraft.git
    cd storycraft
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the database:

    - Ensure PostgreSQL is running.
    - Create a database named `story_craft`.
    - Update the `.env` file with your database credentials.

4. Run Prisma migrations:

    ```bash
    npx prisma db push
    ```

5. Start the development server:

    ```bash
    npm run dev
    ```

6. Open your browser and visit `http://localhost:3000`.

## Development

### Scripts

-   `npm run dev`: Start the development server.
-   `npm run build`: Build the application for production.
-   `npm run start`: Start the production server.
-   `npm run lint`: Run ESLint to check for code issues.

### Folder Structure

-   `src/app`: Contains Next.js pages and API routes.
-   `src/components`: Reusable UI components.
-   `src/contexts`: Context providers for global state management.
-   `src/lib`: Utility functions and configurations.
-   `prisma`: Prisma schema and migrations.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
