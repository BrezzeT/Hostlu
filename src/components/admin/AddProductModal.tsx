import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  subCategory: string;
  subSubCategory: string;
  dimensions: string;
  material: string;
  images: FileList | null;
}

const categories = {
  chairs: {
    name: 'Стулья',
    subcategories: {
      dining: {
        name: 'Обеденные',
        subSubCategories: {
          wooden: 'Деревянные',
          metal: 'Металлические',
          plastic: 'Пластиковые'
        }
      },
      office: {
        name: 'Офисные',
        subSubCategories: {
          ergonomic: 'Эргономичные',
          gaming: 'Игровые',
          standard: 'Стандартные'
        }
      },
      bar: {
        name: 'Барные',
        subSubCategories: {
          high: 'Высокие',
          low: 'Низкие',
          adjustable: 'Регулируемые'
        }
      }
    }
  },
  sofas: {
    name: 'Диваны и кресла',
    subcategories: {
      straight: {
        name: 'Прямые',
        subSubCategories: {
          fabric: 'Тканевые',
          leather: 'Кожаные',
          eco: 'Эко-кожа'
        }
      },
      corner: {
        name: 'Угловые',
        subSubCategories: {
          left: 'Левые',
          right: 'Правые',
          universal: 'Универсальные'
        }
      },
      modular: {
        name: 'Модульные',
        subSubCategories: {
          small: 'Малые',
          medium: 'Средние',
          large: 'Большие'
        }
      }
    }
  },
  beds: {
    name: 'Кровати',
    subcategories: {
      single: {
        name: 'Односпальные',
        subSubCategories: {
          standard: 'Стандартные',
          withStorage: 'С ящиками',
          loft: 'Чердак'
        }
      },
      double: {
        name: 'Двуспальные',
        subSubCategories: {
          standard: 'Стандартные',
          withStorage: 'С ящиками',
          withLifting: 'С подъемным механизмом'
        }
      }
    }
  },
  tables: {
    name: 'Столы',
    subcategories: {
      dining: {
        name: 'Обеденные',
        subSubCategories: {
          fixed: 'Нераскладные',
          folding: 'Раскладные',
          transformer: 'Трансформеры'
        }
      },
      coffee: {
        name: 'Журнальные',
        subSubCategories: {
          round: 'Круглые',
          square: 'Квадратные',
          rectangular: 'Прямоугольные'
        }
      },
      computer: {
        name: 'Компьютерные',
        subSubCategories: {
          standard: 'Стандартные',
          gaming: 'Игровые',
          corner: 'Угловые'
        }
      }
    }
  }
};

export default function AddProductModal({ isOpen, onClose, onSubmit }: AddProductModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    dimensions: '',
    material: '',
    images: null,
  });

  const [availableSubCategories, setAvailableSubCategories] = useState<{[key: string]: any}>({});
  const [availableSubSubCategories, setAvailableSubSubCategories] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (formData.category) {
      setAvailableSubCategories(categories[formData.category as keyof typeof categories].subcategories);
      setFormData(prev => ({ ...prev, subCategory: '', subSubCategory: '' }));
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.subCategory && formData.category) {
      setAvailableSubSubCategories(
        categories[formData.category as keyof typeof categories]
          .subcategories[formData.subCategory as keyof typeof categories[keyof typeof categories]['subcategories']]
          .subSubCategories
      );
      setFormData(prev => ({ ...prev, subSubCategory: '' }));
    }
  }, [formData.subCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      subCategory: '',
      subSubCategory: '',
      dimensions: '',
      material: '',
      images: null,
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-2xl font-semibold text-gray-900">
              Добавить новый товар
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Название товара
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Введите название товара"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Цена
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Введите цену"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Категория
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  required
                >
                  <option value="">Выберите категорию</option>
                  {Object.entries(categories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Подкатегория
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  required
                  disabled={!formData.category}
                >
                  <option value="">Выберите подкатегорию</option>
                  {Object.entries(availableSubCategories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Тип
                </label>
                <select
                  value={formData.subSubCategory}
                  onChange={(e) => setFormData({ ...formData, subSubCategory: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  required
                  disabled={!formData.subCategory}
                >
                  <option value="">Выберите тип</option>
                  {Object.entries(availableSubSubCategories).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  rows={4}
                  placeholder="Введите описание товара"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Размеры
                </label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Например: 80x60x40 см"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Материал
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Например: дерево, металл"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Изображения
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    setFormData({ ...formData, images: e.target.files });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Добавить товар
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 