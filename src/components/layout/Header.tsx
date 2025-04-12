'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            Мебельный магазин
          </Link>
          
          <div className="flex space-x-6">
            <Link 
              href="/catalog" 
              className={`${pathname === '/catalog' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              Каталог
            </Link>
            <Link 
              href="/about" 
              className={`${pathname === '/about' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              О нас
            </Link>
            <Link 
              href="/contacts" 
              className={`${pathname === '/contacts' ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-600`}
            >
              Контакты
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 