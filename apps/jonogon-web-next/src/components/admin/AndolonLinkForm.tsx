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
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import {trpc} from '@/trpc/client';
import { Trash2Icon } from 'lucide-react';


export default function AndolonLinkForm(
  { handleSelected, unlinkPetition }:
    { handleSelected: (andolon: { id: string, name: string }) => void, unlinkPetition: (id: number) => void }) {
  const [showAndolonList, setVisibility] = useState(false)
  const [showAndolonPopup, setPopupStatus] = useState(false)
  const [selectedAndolon, setSelectedAndolon] = useState<{ id: string, name: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [andolonList, setAndolonList] = useState<Array<{ id: string, name: string }>>([])
  const [petitionList, setPetitions] = useState<Array<{ id: string; title: string | null }>>([])

  const {data: andolons} = trpc.petitions.andolonList.useQuery(undefined, {
    enabled: true,
    onSuccess: (data) => {
      setAndolonList(data)
    }
  })

  const fetchPetitions = trpc.petitions.andolonPetitions.useQuery(
    { andolon_id: Number(selectedAndolon?.id) },
    {
      enabled: !!selectedAndolon?.id,
      onSuccess: (data) => {
        setPetitions(data.data)
      }
    }
  )

  const createAndolon = trpc.petitions.createAndolon.useMutation({
    onSuccess: async (response) => {
      setPopupStatus(false)
      if (response) {
        setAndolonList([...andolonList, { id: response.id, name: response.name }])
      }
    },
  })
  return (
    <>
      <Popover open={showAndolonList} onOpenChange={setVisibility}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={showAndolonList}
            className="w-[280px] justify-between"
          >
            {selectedAndolon?.name || 'Select Andolon'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0"> 
        <Command>
          <CommandInput placeholder="Search Andolon" />
          <CommandList>
            <CommandEmpty>No Results Found</CommandEmpty>
            {andolonList?.map((andolon) => (
              <CommandItem
                value={andolon.name}
                key={andolon.id}
                onSelect={() => {
                    setSelectedAndolon(andolon)
                    setVisibility(false)
                    handleSelected(andolon)
                  }
                }
              >
                { andolon.name }
              </CommandItem>
            ))}
          </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={showAndolonPopup} onOpenChange={setPopupStatus}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-4">+</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full" >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Andolon</h4>
          </div>
          <Input
            ref={inputRef}
            id="width"
            className="col-span-2 h-8"
          />
            <Button
              onClick={() => {
                  const val = inputRef.current?.value || ''
                  createAndolon.mutate({ name: val })
                }}
              className="w-full">Create</Button>
          </div>
        </PopoverContent>
      </Popover>

      {petitionList.length ? (
        <div className="border border-red-400 p-4 rounded-md max-h-[150px] overflow-y-scroll">
          <h4 className="font-bold text-red-400 border-b mb-2">
            Petitions under {selectedAndolon?.name}
          </h4>
          <ul className="list-decimal pl-4">
            {
              petitionList.map((petition) => (
                <li
                  key={petition.id}
                  className="text-gray-500 text-sm mb-2"
                >
                  <div className="flex justify-between">
                    <span>{petition.title}</span>
                    <Trash2Icon
                      className="cursor-pointer text-red-400"
                      onClick={() => unlinkPetition(Number(petition.id))}
                    />
                  </div>
                </li>
              )
            )}
          </ul>
      </div>) : null}
    </>
  );
}
