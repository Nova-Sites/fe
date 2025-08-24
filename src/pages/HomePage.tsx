import React from 'react';
import { useGetPopularProductsQuery } from '@/services';
import { UserLayout } from '@/components/layouts';
import { Card, Loading } from '@/components/common';

const HomePage: React.FC = () => {
  const { data: productsData, isLoading, error } = useGetPopularProductsQuery();

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Error loading products. Please try again later.
          </div>
        </div>
      </UserLayout>
    );
  }

  const products = productsData?.data || [];

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Store</h1>
        
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Popular Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-xl font-bold text-blue-600">${product.price}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </UserLayout>
  );
};

export default HomePage;
