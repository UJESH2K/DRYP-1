'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; // Import Image component
import ProductForm from '@/components/ProductForm';
import { useAuth } from '@/contexts/AuthContext';

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/products?vendor=${user._id}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Products</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Add a New Product</h2>
        <ProductForm />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-6 rounded-lg shadow-md">
                {product.images && product.images.length > 0 && (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">Brand: {product.brand}</p>
                <p className="text-gray-600">Category: {product.category}</p>
                <p className="text-gray-800 font-bold mt-2">Base Price: ${product.basePrice.toFixed(2)}</p>

                {product.variants && product.variants.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-medium mb-2">Variants:</h4>
                    <ul className="space-y-2">
                      {product.variants.map((variant, index) => (
                        <li key={index} className="bg-gray-50 p-3 rounded-md">
                          <p>
                            {Object.entries(variant.options).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: {value}
                              </span>
                            ))}
                          </p>
                          <p className="text-sm">Stock: {variant.stock}</p>
                          <p className="text-sm">Price: ${variant.price.toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>You have not added any products yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
