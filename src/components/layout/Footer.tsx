'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">О компании</h3>
            <p className="text-gray-300">
              Мы предлагаем качественную мебель для вашего дома и офиса.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Контакты</h3>
            <p className="text-gray-300">Телефон: +7 (XXX) XXX-XX-XX</p>
            <p className="text-gray-300">Email: info@example.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="text-gray-300 hover:text-white">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-300 hover:text-white">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} Мебельный магазин. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 