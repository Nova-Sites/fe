import React from 'react';
import { useGetCategoriesQuery } from '@/services';
import { UserLayout } from '@/components/layouts';
import { Card, Loading } from '@/components/common';

const CategoriesPage: React.FC = () => {
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading categories. Please try again later.
          </div>
        </div>
      </UserLayout>
    );
  }

  const categories = categoriesData?.data || [];

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Categories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="cursor-pointer"
              onClick={() => window.location.href = `/categories/${category.slug}`}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-600 mb-2">{category.description}</p>
                  )}
                  <div className="text-sm text-gray-500">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </UserLayout>
  );
};

export default CategoriesPage;
