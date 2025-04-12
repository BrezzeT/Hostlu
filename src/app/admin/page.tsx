'use client';

import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  material?: string;
  dimensions?: string;
  category: {
    name: string;
  };
  subCategory: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subCategories: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface FormDataType {
  name: string;
  description: string;
  price: string;
  dimensions: {
    height: string;
    width: string;
    length: string;
  };
  material: string;
  categoryId: string;
  subCategoryId: string;
  tempImagePaths: string[];
  images: string[];
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [materialTypes] = useState([
    'Деревянные',
    'Металлические',
    'Мягкие',
    'С подлокотниками'
  ]);
  const [chairTypes] = useState([
    'Барные',
    'Обеденные'
  ]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState<FormDataType>({
    name: '',
    description: '',
    price: '',
    dimensions: {
      height: '',
      width: '',
      length: ''
    },
    material: '',
    categoryId: '',
    subCategoryId: '',
    tempImagePaths: [],
    images: []
  });
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Опции для материалов
  const materialOptions = [
    { value: 'Деревянные', label: 'Деревянные' },
    { value: 'Металлические', label: 'Металлические' },
    { value: 'Мягкие', label: 'Мягкие' }
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Submitting product with data:', formData);

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          dimensions: `${formData.dimensions.height}x${formData.dimensions.width}x${formData.dimensions.length}`,
          material: formData.material,
          categoryId: formData.categoryId,
          subCategoryId: formData.subCategoryId,
          images: formData.images,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-')
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }

      if (data.success) {
        // Очищаем форму только при успешном создании
        setFormData({
          name: '',
          description: '',
          price: '',
          dimensions: {
            height: '',
            width: '',
            length: ''
          },
          material: '',
          categoryId: '',
          subCategoryId: '',
          tempImagePaths: [],
          images: []
        });
        setError('');
        // Обновляем список товаров
        fetchProducts();
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err instanceof Error ? err.message : 'Произошла ошибка при создании товара');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      setCategoryName('');
      fetchCategories();
    } catch (err) {
      setError('Failed to create category');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setUploadingImage(true);
    setError('');

    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка загрузки изображения');
      }

      const data = await response.json();
      console.log('Uploaded image data:', data);

      if (!data.path) {
        throw new Error('Не получен путь к загруженному файлу');
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.path],
        tempImagePaths: [...prev.tempImagePaths, data.path]
      }));

    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки изображения');
    } finally {
      setUploadingImage(false);
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== indexToRemove),
      tempImagePaths: prev.tempImagePaths.filter((_, i) => i !== indexToRemove)
    }));
  };

  const getAvailableSubCategories = () => {
    if (formData.categoryId === 'Стулья') {
      return chairTypes;
    }
    return [];
  };

  // Добавляем функцию для очистки временных файлов при размонтировании компонента
  useEffect(() => {
    return () => {
      // Очищаем временные файлы при уходе со страницы
      if (formData.images.length > 0) {
        fetch('/api/upload/cleanup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paths: formData.images }),
        }).catch(console.error);
      }
    };
  }, []);

  // Обновляем форму при выборе категории
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(category || null);
    setFormData(prev => ({
      ...prev,
      categoryId,
      subCategoryId: '', // Сбрасываем подкатегорию при смене категории
    }));
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Управление товарами</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Товары
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'categories'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Категории
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Форма добавления */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {activeTab === 'products' ? 'Добавить товар' : 'Добавить категорию'}
            </h2>

            {activeTab === 'products' ? (
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название товара
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Введите название товара"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категория
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                    required
                  >
                    <option value="">Выберите категорию</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && selectedCategory.subCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Подкатегория
                    </label>
                    <select
                      value={formData.subCategoryId}
                      onChange={(e) => setFormData({ ...formData, subCategoryId: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                    >
                      <option value="">Выберите подкатегорию</option>
                      {selectedCategory.subCategories.map((subCategory) => (
                        <option key={subCategory.id} value={subCategory.id}>
                          {subCategory.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCategory?.name === 'Стулья' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Материал
                    </label>
                    <select
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      required
                    >
                      <option value="">Выберите материал</option>
                      <option value="Деревянные">Деревянные</option>
                      <option value="Металлические">Металлические</option>
                      <option value="Мягкие">Мягкие</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    rows={4}
                    placeholder="Введите описание товара"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Цена
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="0"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Высота (см)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: {
                            ...formData.dimensions,
                            height: e.target.value
                          }
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ширина (см)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: {
                            ...formData.dimensions,
                            width: e.target.value
                          }
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Длина (см)
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.length}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dimensions: {
                            ...formData.dimensions,
                            length: e.target.value
                          }
                        })
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Изображения
                  </label>
                  <div className="space-y-4">
                    {/* Preview uploaded images */}
                    {formData.images.length > 0 && (
                      <div className="flex flex-wrap gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                              <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fill
                                sizes="(max-width: 96px) 96px"
                                className="object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload button */}
                    <div className="flex items-center justify-center w-full">
                      <label
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer
                          ${uploadingImage 
                            ? 'border-gray-300 bg-gray-50' 
                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className={`w-8 h-8 mb-4 ${uploadingImage ? 'text-gray-400' : 'text-gray-500'}`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            {uploadingImage ? (
                              <span>Загрузка...</span>
                            ) : (
                              <span>
                                <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP (до 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-sm font-medium"
                >
                  {loading ? 'Добавление...' : 'Добавить товар'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название категории
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Введите название категории"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-sm font-medium"
                >
                  {loading ? 'Добавление...' : 'Добавить категорию'}
                </button>
              </form>
            )}
          </div>

          {/* Список */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              {activeTab === 'products' ? 'Список товаров' : 'Список категорий'}
            </h2>

            {activeTab === 'products' ? (
              loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Загрузка товаров...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {product.name}
                          </h3>
                          <span className="text-lg font-medium text-blue-600">
                            {product.price.toLocaleString()} ₽
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{product.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-600">Категория: <span className="text-gray-900">{product.category.name}</span></span>
                          <span className="text-gray-600">Подкатегория: <span className="text-gray-900">{product.subCategory.name}</span></span>
                          {product.dimensions && (
                            <span className="text-gray-600">Размеры: <span className="text-gray-900">{product.dimensions}</span></span>
                          )}
                          {product.material && (
                            <span className="text-gray-600">Материал: <span className="text-gray-900">{product.material}</span></span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить товар"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    {category.subCategories.length > 0 && (
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">
                          Подкатегории:
                        </h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {category.subCategories.map((sub) => (
                            <li key={sub.id}>{sub.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 