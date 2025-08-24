import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProductBySlugQuery } from '@/services';
import { UserLayout } from '@/components/layouts';
import { Loading, Button } from '@/components/common';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: productData, isLoading, error } = useGetProductBySlugQuery(slug || '');

  if (isLoading) return <Loading />;

  if (error || !productData?.success) {
    return (
      <UserLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            Product not found or error loading product.
          </div>
        </div>
      </UserLayout>
    );
  }

  const product = productData.data;

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-3xl font-bold text-blue-600 mb-4">${product.price}</p>
            
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Category:</span> {product.category?.name}
              </div>
              <div>
                <span className="font-semibold">Views:</span> {product.views}
              </div>
              <div>
                <span className="font-semibold">Created:</span> {new Date(product.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="primary" size="lg" className="mr-4">
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProductDetailPage;
