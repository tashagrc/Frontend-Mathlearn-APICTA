"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Tab({ path: initialPath }) {
  const [path, setPath] = useState(initialPath || '/profile'); // Set default path

  const router = useRouter();

  useEffect(() => {
    setPath(initialPath);
    
  }, []); // Dependency on router.events

  return (
    <div className='text-center rounded-3xl max-md:text-sm mb-8 text-xl font-semibold text-orange-500 shadow-sm overflow-hidden' style={{ borderColor: '#E3820E', borderWidth: '4px', borderStyle: 'solid' }}>
      <div className='flex flex-row items-center justify-evenly w-full'>
        <a href="/profile" className='w-full'>
          <div className={path === '/profile' ? 'border p-4 rounded ' : ''} style={{ backgroundColor: path === '/profile' ? '#FFDD95' : 'transparent' }}>
            Profil
          </div>
        </a>
        <a href="/profile/riwayat" className='w-full'>
          <div className={path === '/profile/riwayat' ? 'border p-4 rounded' : ''} style={{ backgroundColor: path === '/profile/riwayat' ? '#FFDD95' : 'transparent' }}>
            Riwayat
          </div>
        </a>
        <a href="/profile/favorit" className='w-full'>
          <div className={path === '/profile/favorit' ? 'border p-4 rounded' : ''} style={{ backgroundColor: path === '/profile/favorit' ? '#FFDD95' : 'transparent' }}>
            Favorit
          </div>
        </a>
        <a href="/profile/pos-forum" className='w-full'>
          <div className={path === '/profile/pos-forum' ? 'border p-4 rounded' : ''} style={{ backgroundColor: path === '/profile/pos-forum' ? '#FFDD95' : 'transparent' }}>
            Pos Forum
          </div>
        </a>
      </div>
    </div>
  );
}
