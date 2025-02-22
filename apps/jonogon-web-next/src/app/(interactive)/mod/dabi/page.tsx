"use client"

import React, {useState} from 'react';
import {trpc} from '@/trpc/client';
import DabiCard from '@/components/admin/DabiCard';
import { Input } from "@/components/ui/input";
import {useAuthState} from '@/auth/token-manager';

export default function DabiAdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [petitions, setPetitions] = useState<any[]>([]);
  const itemsPerPage = 20;
  const isAuthenticated = useAuthState();
  
  const { data: results } = trpc.petitions.getPetitions.useQuery(
    { 
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage
    },
    { 
      enabled: !!isAuthenticated,
      onSuccess: (data) => {
        setPetitions(data.data);
      }
    }
  );

  const totalPages = results?.pagination?.total 
    ? Math.ceil(results.pagination.total / itemsPerPage) 
    : 0;

  const getStatus = (petition: any) => {
    if (petition.approved_at) {
      return 'APPROVED'
    }
    if (petition.flagged_at) {
      return 'FLAGGED'
    }
    if (petition.rejected_at) {
      return 'REJECTED'
    }
    return 'PENDING'
  }

  return (
    <div className="p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            Dabi Moderation
          </h1>
          <div className="flex items-center space-x-4">
            <Input 
              className="w-64 bg-card border-stone-200" 
              placeholder="Search Dabi" 
            />
          </div>
        </div>
        
        <div className="space-y-4">
          {petitions.map((petition) => (
            <DabiCard 
              key={`${petition.id}-${petition.title}`}
              title={petition.title}
              author={petition.user_name}
              date={new Date(petition.created_at).toDateString()}
              description={petition.description}
              target={petition.target}
              status={getStatus(petition)}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-4 py-2 rounded ${
                    currentPage === pageNumber 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            {totalPages > 5 && (
              <>
                <span className="px-2 self-center">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-4 py-2 rounded ${
                    currentPage === totalPages 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
