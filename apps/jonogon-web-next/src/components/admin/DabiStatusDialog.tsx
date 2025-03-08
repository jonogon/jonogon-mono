import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label"
import {Input} from '@/components/ui/input';
import {trpc} from '@/trpc/client';
import { useState, useRef, useEffect } from 'react';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AndolonLinkForm from './AndolonLinkForm';

interface DabiStatus {
  open: boolean,
  handleClose: (refetch: boolean) => void,
  updateCategoryList: (response: { id: string; name: string }) => void,
  id: string,
  status: string,
  title: string,
  petitionCategory: {id: string; name: string},
  categoryList: Array<{id: string, name: string}>
}

export default function DabiStatusDialog({
  open,
  id,
  status,
  title,
  petitionCategory,
  categoryList,
  handleClose,
  updateCategoryList
}: DabiStatus) {
  const utils = trpc.useUtils();
  const [reasonText, setReason] = useState('')
  const [showCategories, setVisibility] = useState(false)
  const [showCategoryPopup, setPopupStatus] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, name: string } | null>(null)
  const [selectedAndolon, setSelectedAndolon] = useState<{ id: string; name: string; } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    setSelectedCategory(petitionCategory)
  }, [petitionCategory])

  const approveMutation = trpc.petitions.approve.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose(true)
    },
  })

  const rejectMutation = trpc.petitions.reject.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose(true)
    },
  })

  const flagMutation = trpc.petitions.flag.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose(true)
    },
  })

  const onHold = trpc.petitions.hold.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose(true)
    },
  })

  const linkPetition = trpc.petitions.linkPetition.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
    }
  })

  const updateStatus = () => {
    const petitionId= Number(id)
    if (status === 'APPROVE') {
      approveMutation.mutate({ petition_id: petitionId, category_id: Number(selectedCategory?.id) })
    } else if (status === 'REJECT') {
      rejectMutation.mutate({ petition_id: petitionId, reason: reasonText })
    } else if (status === 'FLAG' || status === 'UNFLAG') {
      flagMutation.mutate({ petition_id: petitionId, reason: reasonText, flagged: status === 'UNFLAG' })
    } else if (status === 'ON_HOLD') {
      onHold.mutate({ petition_id: petitionId, reason: reasonText })
    }
  }
  const updateAndonlonLinkStatus = (link: boolean, petition_id: number) => {
    linkPetition.mutate(
      { petition_id, andolon_id: Number(selectedAndolon?.id), link },
      {
        onSuccess: () => {
          if (link) {
            handleClose(true)
          }
        }
      }
    )
  }
  const CategoryList = () => {
    const createCategory = trpc.petitions.createCategory.useMutation({
      onSuccess: async (response) => {
        setPopupStatus(false)
        if (response) {
          updateCategoryList({ id: response.id, name: response.name })
        }
      },
    });
    return (
      <div>
        <Popover open={showCategories} onOpenChange={setVisibility}>
          <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={showCategories}
            className="w-[200px] justify-between"
          >
            {selectedCategory?.name || 'Select Category'}
          </Button>
        </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0"> 
          <Command>
            <CommandInput placeholder="Search Category" />
            <CommandList>
                <CommandEmpty>No Results Found</CommandEmpty>
                {categoryList?.map((category) => (
                  <CommandItem
                    value={category.name}
                    key={category.id}
                    onSelect={() => {
                        setSelectedCategory(category)
                        setVisibility(false)
                      }
                    }
                  >
                    { category.name }
                  </CommandItem>
                ))}
            </CommandList>
          </Command>
          </PopoverContent>
        </Popover>
        <Popover open={showCategoryPopup} onOpenChange={setPopupStatus}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="ml-4">+</Button>
          </PopoverTrigger>
          <PopoverContent className="w-full" >
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Add New Category</h4>
              </div>
              <Input
                ref={inputRef}
                id="width"
                className="col-span-2 h-8"
              />
              <Button
                onClick={() => {
                  const val = inputRef.current?.value || ''
                  createCategory.mutate({ name: val })
                }}
                className="w-full">Create</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
  )}
  return (
    <Dialog open={open} onOpenChange={() => handleClose(false)}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {status === 'LINK' ? 'Link Dabi': 'Update Dabi Status'}
          </DialogTitle>
          <Separator />
        </DialogHeader>
        {status !== 'LINK' && 
          <h4 className="font-bold text-red-500 text-center">Are you sure you want to set this to { status } ?</h4>
        }
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          {status !== 'LINK' && 
            <span className="text-red-500">New Status: { status }</span>
          }
          {status !== 'APPROVE' && status !== 'LINK' && (
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                rows={4}
                className="bg-card text-card-foreground focus-visible:ring-transparent focus-visible:shadow-none border-red-400"
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          )}
          {status === 'APPROVE' && (
            <div>
              <CategoryList />
            </div>
          )}
          {status === 'LINK' && (
            <AndolonLinkForm
              handleSelected={(andolon) => setSelectedAndolon(andolon)}
              unlinkPetition={(petition_id) => updateAndonlonLinkStatus(false, petition_id)}
            />
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => status === 'LINK'
            ? updateAndonlonLinkStatus(true, Number(id)) : updateStatus()
          }
        >
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  )
}
