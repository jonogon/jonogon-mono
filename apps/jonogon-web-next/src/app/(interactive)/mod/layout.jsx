'use client';

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { trpc } from '@/trpc/client';
import { useAuthState } from '@/auth/token-manager';

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAuthenticated = useAuthState()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const { data: selfResponse } = trpc.users.getSelf.useQuery(undefined, {
    enabled: !!isAuthenticated,
  })

  const isAdmin = !!selfResponse?.meta.token.is_user_admin
  const isMod = !!selfResponse?.meta.token.is_user_moderator

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile Menu Button - only visible on small screens */}
      <div
        className={`sm:hidden fixed ${sidebarOpen ? 'top-0 left-48' : 'top-0 left-0'} z-40 p-4 mt-20`}>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-white shadow-md text-red-500">
          {sidebarOpen ? <X size={20} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - full-screen overlay on mobile when open */}
      <div
        className={`
            fixed inset-0 z-30 transition-all duration-300 md:relative
            ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}
            `}>
        <div
          className={`
            w-64 h-screen bg-white shadow-sm flex flex-col z-40
            transform transition-transform duration-300 
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            fixed left-0 top-0 mt-20
        `}>
          {/* Fixed header part */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-red-500">
              Moderation Panel
            </h1>
          </div>
          {/* Scrollable navigation part */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div
                onClick={() => {
                  router.push('/mod/dabi');
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex justify-between items-center p-2 hover:bg-red-100 hover:text-black rounded cursor-pointer ${pathname === '/mod/dabi'
                    ? 'bg-red-500 text-white hover:bg-red-500 hover:text-white'
                    : ''
                  }`}>
                <span>দাবি</span>
              </div>
              <div
                onClick={() => {
                  router.push('/mod/jobab');
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex justify-between items-center p-2 hover:bg-red-100 hover:text-black rounded cursor-pointer ${pathname === '/mod/jobab'
                    ? 'bg-red-500 text-white hover:bg-red-500 hover:text-white'
                    : ''
                  }`}>
                <span>জবাব</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* main content */}
      {isAdmin && isMod && (
        <div className="flex-1 ml-0 md:ml-64 bg-background min-h-screen mt-20">
          {children}
        </div>
      )}
    </div>
  );
}
