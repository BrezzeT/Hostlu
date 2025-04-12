import Layout from '@/components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Каталог мебели</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Стулья */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Стулья</h2>
            <p className="text-gray-600 mb-4">
              Широкий выбор стульев для дома и офиса
            </p>
            <a href="/catalog/chairs" className="text-blue-600 hover:text-blue-800">
              Смотреть все →
            </a>
          </div>

          {/* Диваны и кресла */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Диваны и кресла</h2>
            <p className="text-gray-600 mb-4">
              Удобные диваны и кресла для вашего комфорта
            </p>
            <a href="/catalog/sofas" className="text-blue-600 hover:text-blue-800">
              Смотреть все →
            </a>
          </div>

          {/* Кровати */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Кровати</h2>
            <p className="text-gray-600 mb-4">
              Качественные кровати для здорового сна
            </p>
            <a href="/catalog/beds" className="text-blue-600 hover:text-blue-800">
              Смотреть все →
            </a>
          </div>

          {/* Пуфики */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Пуфики</h2>
            <p className="text-gray-600 mb-4">
              Стильные пуфики для вашего интерьера
            </p>
            <a href="/catalog/ottomans" className="text-blue-600 hover:text-blue-800">
              Смотреть все →
            </a>
          </div>

          {/* Столы */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Столы</h2>
            <p className="text-gray-600 mb-4">
              Разнообразные столы для любого помещения
            </p>
            <a href="/catalog/tables" className="text-blue-600 hover:text-blue-800">
              Смотреть все →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
