import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
      <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-500">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mt-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/jobs/jobsList"
        className="mt-8 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      >
        &larr; Go Back to All Jobs
      </Link>
    </div>
  );
};

export default NotFoundPage;