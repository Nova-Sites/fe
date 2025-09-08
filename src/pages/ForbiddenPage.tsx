import { motion } from 'framer-motion';
import { FaHome, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FRONTEND_ROUTES } from '../constants/routes';
import { MetaTitleBase } from '@/components/common';
import { SEO_META } from '@/constants';

const ForbiddenPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4'>
      <MetaTitleBase
        title={SEO_META.PUBLIC.FORBIDDEN.TITLE}
        description={SEO_META.PUBLIC.FORBIDDEN.DESCRIPTION}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center'
      >
        <div className='relative mb-8'>
          <img
            src='images.unsplash.com/photo-1624969862644-791f3dc98927'
            alt='Security Shield'
            className='w-48 h-48 mx-auto object-cover rounded-full shadow-lg'
            onError={e => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23ccc' d='M12 2L2 7v10c0 5 10 10 10 10s10-5 10-10V7L12 2z'/%3E%3C/svg%3E";
              target.className = 'w-48 h-48 mx-auto';
            }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
          >
            <FaLock className='text-red-500 text-4xl' />
          </motion.div>
        </div>

        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className='text-4xl font-bold text-gray-800 mb-4'
          role='heading'
          aria-level={1}
        >
          403 Forbidden
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className='text-gray-600 mb-8'
          role='alert'
        >
          Sorry, you don't have permission to access this page. Please verify
          your credentials or contact the system administrator for assistance.
        </motion.p>

        <Link to={FRONTEND_ROUTES.PUBLIC.HOME}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center mx-auto space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer'
            aria-label='Return to homepage'
          >
            <FaHome className='text-xl' />
            <span>Back to Home</span>
          </motion.button>
        </Link>

        <div className='mt-8 text-sm text-gray-500'>
          <p>Error Code: 403 | Access Denied</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForbiddenPage;
