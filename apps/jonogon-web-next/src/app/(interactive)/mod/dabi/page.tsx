"use client"

import React, {useState} from 'react';
import {trpc} from '@/trpc/client';
import DabiCard from '@/components/admin/DabiCard';
import { Input } from "@/components/ui/input";
import {useAuthState} from '@/auth/token-manager';
import DabiStatusDialog from '@/components/admin/DabiStatusDialog';
import { JobabForm } from '@/components/admin/JobabForm';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function DabiAdminPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [petitions, setPetitions] = useState<any[]>([]);
  const [showDialog, setDialogVisibility] = useState(false);
  const [selectedDabi, setSelectedDabi] = useState<{id?: string; title?: string; status?: string; category?: {id: string; name: string}}>({})
  const [categoryList, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [showJobabForm, setJobabFormVisibility] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD' | 'ALL'>('ALL')
  const [flagged, setFlagged] = useState<boolean | null>(null)
  const itemsPerPage = 30;
  const isAuthenticated = useAuthState();
  
  const { data: results, refetch } = trpc.petitions.getPetitions.useQuery(
    { 
      offset: (currentPage - 1) * itemsPerPage,
      limit: itemsPerPage,
      search: searchQuery,
      status: filterQuery === 'ALL' ? undefined : filterQuery,
      flagged: flagged
    },
    { 
      enabled: !!isAuthenticated,
      onSuccess: (data) => {
        setPetitions(data.data);
      }
    }
  );
  const { data: categories } = trpc.petitions.adminCategoryList.useQuery(undefined, {
    enabled: !!isAuthenticated,
    onSuccess: (data) => {
      setCategories(data.map(category => ({
        id: category.id,
        name: category.name
      })))
    }
  })

  const totalPages = results?.pagination?.total 
    ? Math.ceil(results.pagination.total / itemsPerPage) 
    : 0;

  const getStatus = (petition: any) => {
    if (petition.flagged_at) {
      return 'FLAGGED'
    }
    if (petition.hold_at) {
      return 'ON HOLD'
    }
    if (petition.rejected_at) {
      return 'REJECTED'
    }
    if (petition.approved_at) {
      return 'APPROVED'
    }
    return 'PENDING'
  }

  const getSelectedDabi = (petition: any, category: Object) => {
    const petitionData = {
      ...petition,
      category
    }
    setSelectedDabi(petitionData)
    setDialogVisibility(true)
  }

  type PetitionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD' | 'ALL' | 'FLAGGED';

  const handleStatusChange = (status: PetitionStatus): void => {
    setCurrentPage(1)
    if (status === 'FLAGGED') {
      setFlagged(true)
      setFilterQuery('ALL')
    } else if (status !== 'ALL') {
      setFilterQuery(status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD')
      setFlagged(null)
    } else {
      setFilterQuery('ALL')
      setFlagged(null)
    }
  }

  const getSelectedDabiForJobabForm = (petition: any) => {
    setSelectedDabi(petition)
    setJobabFormVisibility(true)
  }

  const closeStatusDialog = (fetchList: boolean) => {
    setDialogVisibility(false)
    if (fetchList) {
      refetch()
    }
  }

  const reasonText = (petition: any) => {
    return (petition.rejection_reason || petition.hold_reason || petition.flagged_reason)
  }

  return (
    <div className="md:p-8 p-4 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between flex-wrap items-center mb-6">
          <h1 className="text-2xl font-bold">
            Dabi Moderation
          </h1>
          <div className="flex flex-col md:flex-row md:items-center items-start gap-4 md:space-x-4">
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-card border-stone-200 w-[180px] ring-0 focus:ring-0">
                <SelectValue placeholder={filterQuery} />
              </SelectTrigger>
              <SelectContent>
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD', 'FLAGGED'].map((status) => (
                  <SelectItem
                    key={status}
                    value={status}
                  >
                    {status.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              className="w-64 bg-card border-stone-200"
              placeholder="Search Dabi"
              onChange={(e) => {
                const timeoutId = setTimeout(() => {
                  setSearchQuery(e.target.value)
                }, 500);
                return () => clearTimeout(timeoutId);
              }}
            />
          </div>
        </div>
        <h4 className="text-red-500 mb-4 text-lg font-bold">
         {results?.pagination?.total  || 0} Dabis Available
        </h4>
        <div className="space-y-4">
          {petitions.map((petition) => (
            <DabiCard 
              key={`${petition.id}-${petition.title}`}
              id={petition.id}
              title={petition.title}
              author={petition.user_name}
              date={new Date(petition.created_at).toDateString()}
              description={petition.description}
              target={petition.target}
              status={getStatus(petition)}
              reason={reasonText(petition)}
              categoryName={petition.category?.name}
              andolonName={petition.andolon?.name}
              handleStatus={(dabi: any) => getSelectedDabi(dabi, petition.category)}
              openJobabForm={() => getSelectedDabiForJobabForm(petition)}
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
                      ? 'bg-red-500 text-primary-foreground' 
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
                      ? 'bg-red-500 text-primary-foreground' 
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
      <DabiStatusDialog
        open={showDialog}
        id={selectedDabi.id ?? ''}
        title={selectedDabi.title ?? ''}
        status={selectedDabi.status ?? ''}
        petitionCategory={selectedDabi.category || { id: '', name: '' }}
        categoryList={categoryList}
        handleClose={(fetchList) => closeStatusDialog(fetchList)}
        updateCategoryList={(category: { id: string; name: string }) => setCategories([...categoryList, category])}
      />
      <JobabForm
        isOpen={showJobabForm}
        onClose={() => setJobabFormVisibility(false)}
        petitionId={Number(selectedDabi?.id)}
      />
    </div>
  );
}
