
import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center text-center">
        <Card className="max-w-lg">
            <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                404
            </h1>
            <h2 className="mt-4 text-3xl font-bold text-white">Page Not Found</h2>
            <p className="mt-4 text-gray-300">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <Link
                to="/"
                className="mt-8 inline-block px-6 py-3 font-semibold rounded-lg shadow-lg bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 text-white transition-transform transform hover:scale-105 cursor-pointer"
            >
                Go Back Home
            </Link>
        </Card>
    </div>
  );
};

export default NotFound;