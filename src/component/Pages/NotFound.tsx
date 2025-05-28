import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      <h1 className="text-6xl font-bold text-yellow-400 mb-4">404</h1>
      <p className="text-2xl text-yellow-300 mb-8">Page Not Found</p>
      <a
        href="/"
        className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition"
      >
        Back to Home
      </a>
    </div>
  );
};

export default NotFound;