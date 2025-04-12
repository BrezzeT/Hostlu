'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Chair {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string;
  dimensions: string;
  category: {
    id: string;
    name: string;
  };
  subCategory: {
    id: string;
    name: string;
  };
  material?: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function ChairsPage() {
  const [chairs, setChairs] = useState<Chair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState('all');
  const [activeMaterial, setActiveMaterial] = useState('all');

  const chairTypes = ['all', 'Барные', 'Обеденные'];
  const materialTypes = ['all', 'Деревянные', 'Металлические', 'Мягкие'];

  useEffect(() => {
    fetchChairs();
  }, []);

  const fetchChairs = async () => {
    try {
      console.log('Fetching chairs...');
      const response = await fetch('/api/chairs');
      if (!response.ok) {
        throw new Error('Failed to fetch chairs');
      }
      const data: Chair[] = await response.json();
      console.log('Received chairs data:', data);
      setChairs(data);
    } catch (err) {
      console.error('Error fetching chairs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imageString: string) => {
    try {
      const images = JSON.parse(imageString);
      return Array.isArray(images) && images.length > 0 
        ? images[0]
        : '';
    } catch (e) {
      console.error('Error parsing image string:', e);
      return '';
    }
  };

  // Единая логика фильтрации
  const filteredChairs = chairs.filter(chair => {
    const typeMatch = activeType === 'all' || chair.subCategory.name === activeType;
    const materialMatch = activeMaterial === 'all' || chair.material === activeMaterial;
    return typeMatch && materialMatch;
  });

  // Подсчет количества стульев в каждой категории
  const categoryCounts = chairs.reduce((acc, chair) => {
    const subCatName = chair.subCategory.name;
    acc[subCatName] = (acc[subCatName] || 0) + 1;
    return acc;
  }, {} as {[key: string]: number});

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
            Каталог стульев
          </h1>

          {/* Фильтры */}
          <div className="max-w-4xl mx-auto mb-12 bg-white rounded-2xl shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Тип стула</h3>
              <div className="flex flex-wrap gap-3">
                {chairTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeType === type
                        ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type === 'all' ? 'Все стулья' : type}
                    {type !== 'all' && (
                      <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                        {categoryCounts[type] || 0}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Материал</h3>
              <div className="flex flex-wrap gap-3">
                {materialTypes.map(material => (
                  <button
                    key={material}
                    onClick={() => setActiveMaterial(material)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      activeMaterial === material
                        ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {material === 'all' ? 'Все материалы' : material}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <div className="max-w-4xl mx-auto mb-8 bg-red-50 text-red-600 p-4 rounded-xl">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredChairs.map(chair => (
                <div
                  key={chair.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group"
                >
                  <div className="relative h-72">
                    {getImageUrl(chair.images) ? (
                      <Image
                        src={getImageUrl(chair.images)}
                        alt={chair.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-400">Нет изображения</p>
                      </div>
                    )}
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm hover:shadow transition-all duration-200">
                      <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-1">
                      {chair.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {chair.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="w-20">Тип:</span>
                        <span className="font-medium text-gray-900">{chair.subCategory.name}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="w-20">Материал:</span>
                        <span className="font-medium text-gray-900">{chair.material}</span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="w-20">Размеры:</span>
                        <span className="font-medium text-gray-900">{chair.dimensions}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        {chair.price.toLocaleString()} ₽
                      </span>
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>В корзину</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredChairs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                По вашему запросу ничего не найдено
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 