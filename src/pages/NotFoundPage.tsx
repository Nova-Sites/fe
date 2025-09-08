import { MetaTitleBase } from '@/components/common';
import { FRONTEND_ROUTES, SEO_META } from '@/constants';
import { motion } from 'framer-motion';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100'>
      <MetaTitleBase
        title={SEO_META.PUBLIC.NOT_FOUND.TITLE}
        description={SEO_META.PUBLIC.NOT_FOUND.DESCRIPTION}
      />
      <div className='text-center animate-fadeIn'>
        <motion.img
          src='https://yemca-services.net/404.png'
          alt='404 Illustration'
          className='mx-auto w-80 shadow-xl rounded-lg'
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <h1 className='text-4xl md:text-7xl font-extrabold text-blue-700 mt-6'>
          Looks Like You're Lost!
        </h1>
        <p className='text-lg md:text-xl text-gray-700 mt-2'>
          We can't seem to find the page you're looking for.
        </p>
        <Link to={FRONTEND_ROUTES.PUBLIC.HOME}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer'
            aria-label='Return to homepage'
          >
            <FaHome className='text-xl' />
            <span>Back to Home</span>
          </motion.button>
        </Link>
        <div className='mt-8 text-sm text-gray-500'>
          <p>Error Code: 404 | Page Not Found</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
