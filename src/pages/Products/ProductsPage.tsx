import React, { useState } from 'react';
import { useGetProductsQuery } from '@/services';
import { UserLayout } from '@/components/layouts';
import { Card, Loading, Button } from '@/components/common';
import type { ProductFilters } from '@/types';

const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
    search: '',
    categoryId: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { data: productsData, isLoading, error } = useGetProductsQuery(filters);

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

  const products = productsData?.data?.products || [];
  const totalPages = productsData?.data?.pagination?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Products</h1>
          
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-xl font-bold text-blue-600">${product.price}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => window.location.href = `/products/${product.slug}`}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === filters.page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default ProductsPage;
