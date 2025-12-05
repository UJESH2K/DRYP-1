'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// Temporary token - a login flow would be needed for a real app
const TEMP_AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWRmZDI1ZDkxNjQwMjA1MjRlZmIyMyIsImlhdCI6MTc2NDkxOTc3OSwiZXhwIjoxNzY1NTI0NTc5fQ.51B8r9QENghclMb5ovXMLg3NzsxRSf7kMgZ-fmWxKZw";

// A reusable input component for styling consistency
const Input = ({ label, name, value, onChange, type = 'text', placeholder, disabled = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <div className="mt-1">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-100"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  </div>
);

const TextArea = ({ label, name, value, onChange, placeholder }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder}
        />
      </div>
    </div>
  );

export default function ProductForm() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    tags: '',
    basePrice: '',
  });
  const [variants, setVariants] = useState([{ color: '', sizes: '', price: '', stock: {}, images: [] }]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    console.log(`handleVariantChange: index=${index}, name=${name}, value=${value}`);
    const newVariants = [...variants];
    newVariants[index][name] = value;

    if (name === 'sizes') {
        const sizesArray = value.split(',').map(s => s.trim()).filter(Boolean);
        const newStock = {};
        sizesArray.forEach(size => {
            newStock[size] = newVariants[index].stock[size] || '0';
        });
        newVariants[index].stock = newStock;
    }
    setVariants(newVariants);
  };

  const handleStockChange = (variantIndex, size, value) => {
    const newVariants = [...variants];
    newVariants[variantIndex].stock[size] = value;
    setVariants(newVariants);
  }

  const handleImageSelect = async (variantIndex, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
          headers: { 
            'Authorization': `Bearer ${TEMP_AUTH_TOKEN}`,
          },
        });
        
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        } else {
          throw new Error(data.message || 'Image upload failed');
        }
      } catch (error) {
        alert(`Error uploading image: ${error.message}`);
        setIsUploading(false);
        return;
      }
    }
    
    const newVariants = [...variants];
    newVariants[variantIndex].images.push(...uploadedUrls);
    setVariants(newVariants);
    setIsUploading(false);
  };

  const handleRemoveImage = (variantIndex, imageIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].images.splice(imageIndex, 1);
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', sizes: '', price: '', stock: {}, images: [] }]);
  };

  const removeVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const allVariantImages = variants.flatMap(v => v.images);
    
    let productData = {
      ...product,
      basePrice: parseFloat(product.basePrice),
      tags: product.tags.split(',').map(t => t.trim()),
      images: allVariantImages,
      options: [],
      variants: [],
    };
    
    const allColors = variants.map(v => v.color).filter(Boolean);
    const allSizes = [...new Set(variants.flatMap(v => v.sizes.split(',').map(s => s.trim()).filter(Boolean)))];
    
    if (allColors.length > 0) {
      productData.options.push({ name: 'Color', values: allColors });
    }
    if (allSizes.length > 0) {
      productData.options.push({ name: 'Size', values: allSizes });
    }

    variants.forEach(variant => {
      const sizes = variant.sizes.split(',').map(s => s.trim()).filter(Boolean);
      sizes.forEach(size => {
        const newVariantPayload = {
          options: { Color: variant.color, Size: size },
          stock: parseInt(variant.stock[size] || '0', 10),
          price: parseFloat(variant.price || product.basePrice),
          images: variant.images,
        };
        productData.variants.push(newVariantPayload);
      });
    });

    try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TEMP_AUTH_TOKEN}`,
            },
            body: JSON.stringify(productData),
        });

        const result = await res.json();
        if (res.ok) {
            alert('Product created successfully!');
            // Optionally reset form
        } else {
            throw new Error(result.message || 'Failed to create product');
        }
    } catch (error) {
        alert(`Error: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Product Details Section */}
      <div className="bg-white p-8 shadow sm:rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Product Details</h2>
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <Input label="Product Name" name="name" value={product.name} onChange={handleProductChange} placeholder="e.g., Classic Denim Jacket" />
          </div>
          <div className="sm:col-span-6"><TextArea label="Description" name="description" value={product.description} onChange={handleProductChange} placeholder="A brief description of the product." /></div>
          <div className="sm:col-span-3"><Input label="Brand" name="brand" value={product.brand} onChange={handleProductChange} placeholder="e.g., Urban Threads" /></div>
          <div className="sm:col-span-3"><Input label="Category" name="category" value={product.category} onChange={handleProductChange} placeholder="e.g., Jackets" /></div>
          <div className="sm:col-span-4"><Input label="Tags (comma-separated)" name="tags" value={product.tags} onChange={handleProductChange} placeholder="e.g., Outerwear, Casual, Denim" /></div>
          <div className="sm:col-span-2"><Input label="Base Price" name="basePrice" type="number" value={product.basePrice} onChange={handleProductChange} placeholder="e.g., 99.99" /></div>
        </div>
      </div>

      {/* Variants Section */}
      <div className="bg-white p-8 shadow sm:rounded-lg">
        <h2 className="text-xl font-semibold mb-6">Product Variants</h2>
        <div className="space-y-8">
          {variants.map((variant, index) => (
            <div key={index} className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Variant {index + 1}</h3>
                {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="text-red-600 hover:text-red-800">Remove</button>}
              </div>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2"><Input label="Color" name="color" value={variant.color} onChange={(e) => handleVariantChange(index, e)} placeholder="e.g., Classic Blue" /></div>
                <div className="sm:col-span-2"><Input label="Sizes (comma-separated)" name="sizes" value={variant.sizes} onChange={(e) => handleVariantChange(index, e)} placeholder="e.g., S, M, L" /></div>
                <div className="sm:col-span-2"><Input label="Variant Price" name="price" type="number" value={variant.price} onChange={(e) => handleVariantChange(index, e)} placeholder="Overrides base price" /></div>
                
                <div className="sm:col-span-6">
  <h4 className="text-sm font-medium text-gray-600 mb-2">Stock per Size</h4>
  {variant.sizes ? (
    <div className="grid grid-cols-3 gap-4">
      {Object.keys(variant.stock).map(size => (
        <Input
          key={size}
          label={`Stock for ${size}`}
          name={size}
          type="number"
          value={variant.stock[size]}
          onChange={(e) => handleStockChange(index, size, e.target.value)}
          placeholder="0"
        />
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">Enter sizes to add stock.</p>
  )}
</div>

                <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Variant Images</label>
                    <div className="mt-2 flex items-center gap-4">
                        <input type="file" multiple onChange={(e) => handleImageSelect(index, e)} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                        {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                        {variant.images.map((imgUrl, imgIndex) => (
                            <div key={imgIndex} className="relative">
                                <Image src={`${API_BASE_URL}${imgUrl}`} alt="product preview" width={80} height={80} className="rounded-lg object-cover" />
                                <button type="button" onClick={() => handleRemoveImage(index, imgIndex)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">&times;</button>
                            </div>
                        ))}
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addVariant} className="mt-6 rounded-md border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Add Another Variant</button>
      </div>

      <div className="flex justify-end">
        <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
            {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
