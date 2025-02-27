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
import {trpc} from '@/trpc/client';
import { useState } from 'react';

interface DabiStatus {
  open: boolean,
  handleClose: () => void,
  id: string,
  status: string,
  title: string,
}

export default function DabiStatusDialog({
  open,
  id,
  status,
  title,
  handleClose,
}: DabiStatus) {
  const utils = trpc.useUtils();
  const approveMutation = trpc.petitions.approve.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose()
    },
  })

  const rejectMutation = trpc.petitions.reject.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose()
    },
  })

  const flagMutation = trpc.petitions.flag.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose()
    },
  })

  const onHold = trpc.petitions.hold.useMutation({
    onSuccess: async () => {
      await utils.petitions.get.invalidate({ id })
      handleClose()
    },
  })

  const updateStatus = () => {
    const petitionId= Number(id)
    if (status === 'APPROVE') {
      approveMutation.mutate({ petition_id: petitionId })
    } else if (status === 'REJECT') {
      rejectMutation.mutate({ petition_id: petitionId, reason: reasonText })
    } else if (status === 'FLAG' || status === 'UNFLAG') {
      flagMutation.mutate({ petition_id: petitionId, reason: reasonText, flagged: status === 'UNFLAG' })
    } else if (status === 'ON_HOLD') {
      onHold.mutate({ petition_id: petitionId, reason: reasonText })
    }
  }
  const [reasonText, setReason] = useState('')
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            Update Dabi Status
          </DialogTitle>
          <Separator />
        </DialogHeader>
        <h4 className="font-bold text-red-500 text-center">Are you sure you want to set this to { status } ?</h4>
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <span className="text-red-500">New Status: { status }</span>
          {status !== 'APPROVE' && (
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
        </div>
        <Button
          variant="outline"
          onClick={() => updateStatus()}
        >
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  )
}
