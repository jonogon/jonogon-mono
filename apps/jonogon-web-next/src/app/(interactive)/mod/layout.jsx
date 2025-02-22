"use client";
import {useRouter, usePathname} from 'next/navigation';

export default function AdminLayout({children}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className="w-64 h-screen flex-none fixed left-0 top-0 mt-20">
        <div className="h-full bg-white shadow-sm flex flex-col">
          {/* Fixed header part */}
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold text-red-500">Moderation Panel</h1>
          </div>
          {/* Scrollable navigation part */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <div
                onClick={() =>
                  router.push('/mod/dabi')
                }
                className={`flex justify-between items-center p-2 hover:bg-red-100 hover:text-black rounded cursor-pointer ${pathname === '/mod/dabi'
                    ? 'bg-red-500 text-white'
                    : ''
                }`}>
                <span>দাবি</span>
              </div>
              <div
                onClick={() =>
                  router.push('/mod/jobab')
                }
                className={`flex justify-between items-center p-2 hover:bg-red-100 hover:text-black rounded cursor-pointer ${
                  pathname === '/mod/jobab'
                      ? 'bg-red-500 text-white'
                      : ''
                }`}>
                <span>জবাব</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* main content */}
      <div className="flex-1 ml-64 bg-background">
        {children}
      </div>
    </div>
  );
}
