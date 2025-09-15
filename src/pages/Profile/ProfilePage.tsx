import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { UserLayout } from '@/components/layouts';
import { ButtonBase, CardBase, MetaTitleBase } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { SEO_META } from '@/constants';

const ProfilePage: React.FC = () => {
  const { user } = useAuthContext();
  const { logout } = useAuth();

  if (!user) {
    return (
      <UserLayout>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-red-600'>
            User not found. Please login again.
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className='container mx-auto px-4 py-8'>
        <MetaTitleBase
          title={SEO_META.PROTECTED.PROFILE.TITLE}
          description={SEO_META.PROTECTED.PROFILE.DESCRIPTION}
        />
        <div className='max-w-2xl mx-auto'>
          <h1 className='text-3xl font-bold text-center mb-8'>Profile</h1>

          <CardBase className='p-6'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-4'>
                {(user as { image?: string })?.image && (
                  <img
                    src={(user as { image?: string }).image}
                    alt='Profile'
                    className='w-20 h-20 rounded-full object-cover'
                  />
                )}
                <div>
                  <h2 className='text-xl font-semibold'>
                    {(user as { username?: string }).username}
                  </h2>
                  <p className='text-gray-600'>
                    {(user as { email?: string }).email}
                  </p>
                  <span className='inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1'>
                    {(user as { role?: string }).role}
                  </span>
                </div>
              </div>

              <div className='border-t pt-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Username
                    </label>
                    <p className='text-gray-900'>
                      {(user as { username?: string }).username}
                    </p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Email
                    </label>
                    <p className='text-gray-900'>
                      {(user as { email?: string }).email}
                    </p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Role
                    </label>
                    <p className='text-gray-900'>
                      {(user as { role?: string }).role}
                    </p>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Member Since
                    </label>
                    <p className='text-gray-900'>
                      {new Date(
                        (user as { createdAt?: string }).createdAt || ''
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-4 pt-4 border-t'>
                <ButtonBase variant='outline' size='sm'>
                  Edit Profile
                </ButtonBase>
                <ButtonBase variant='outline' size='sm' onClick={logout}>
                  Logout
                </ButtonBase>
              </div>
            </div>
          </CardBase>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
