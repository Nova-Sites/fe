import React from 'react';
import { UserLayout } from '@/components/layouts';
import { CardBase, LoadingBase, MetaTitleBase } from '@/components/common';
import { SEO_META } from '@/constants';
import { useCategories } from '@/hooks/useCategories';
import { Link } from 'react-router-dom';

const CategoriesPage: React.FC = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <LoadingBase />;

  if (error) {
    return (
      <UserLayout>
        <div className='container mx-auto px-4 py-8'>
          <div className='text-center text-red-600'>
            Error loading categories. Please try again later.
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className='container mx-auto px-4 py-8'>
        <MetaTitleBase
          title={SEO_META.PUBLIC.CATEGORIES.TITLE}
          description={SEO_META.PUBLIC.CATEGORIES.DESCRIPTION}
        />
        <h1 className='text-3xl font-bold mb-8'>Categories</h1>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {categories.map(category => (
            <div key={category.id} className='cursor-pointer'>
              <Link to={`/categories/${category.slug}`}>
                <CardBase className='hover:shadow-lg transition-shadow'>
                  <div className='p-4'>
                    <h3 className='text-lg font-semibold mb-2'>
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className='text-gray-600 mb-2'>
                        {category.description}
                      </p>
                    )}
                    <div className='text-sm text-gray-500'>
                      Created:{' '}
                      {new Date(category.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardBase>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default CategoriesPage;
