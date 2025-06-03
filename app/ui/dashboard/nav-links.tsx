'use client';

import {
  HomeIcon,
  Cog6ToothIcon,
  PowerIcon,
  DocumentTextIcon,
  Squares2X2Icon, } from '@heroicons/react/24/outline';
  
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { inter } from '@/app/ui/fonts';
import ProfileSummary from './profile';

const links = [
  { name: 'Home', href: '/dashboard2', icon: HomeIcon },
  { name: 'Products', href: '/dashboard/products', icon: Squares2X2Icon },
  { name: 'Reports', href: '/dashboard/report', icon: DocumentTextIcon },
];

const settingsLinks = [
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
  { name: 'Logout', href: '/', icon: PowerIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className={`fixed inset-y-0 left-0 w-64 flex flex-col bg-[#D3628B] text-white rounded-r-[50px] ${inter.className}`}>
      <div className='flex items-center px-12 pb-0'>
        <img src='/icons/fs.png' alt='FlowerScotch Logo' className='w-32 h-auto mt-7' />
      </div>

      <nav className="space-y-2 px-4 mt-10">
        {links.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex items-center gap-1 p-3 rounded-r-full text-white relative group transition-all',
                {
                  'opacity-50': !isActive,
                  'hover:opacity-100': !isActive,
                }
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full" />
              )}
              <LinkIcon className="ml-2 w-6 h-6" />
              <span className='px-3'>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings
       */}
      <div className="mt-auto space-y-2 px-4 pb-4">
        {settingsLinks.map((link) => {
          const LinkIcon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                'flex items-center gap-1 p-3 rounded-r-full text-white relative group transition-all',
                {
                  'opacity-50': !isActive,
                  'hover:opacity-100': !isActive,
                }
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full" />
              )}
              <LinkIcon className="ml-2 w-6 h-6" />
              <span className="px-3">{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
