import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, FlagOff, Clock, Link2, Check, X } from "lucide-react";

interface DabiProps {
  id: string;
  title: string;
  author: string;
  date: string;
  description: string;
  target: string;
  status: string;
  reason: string;
  handleStatus: Function;
  openJobabForm: Function;
}

export default function DabiCard({
  id,
  title,
  author,
  date,
  description,
  target,
  status,
  reason,
  handleStatus,
  openJobabForm
}: DabiProps) {
  const setStatus = (status: string) => {
    const dabi = {
      id,
      status,
      title
    }
    handleStatus(dabi)
  }
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold mb-2 truncate">{title}</h2>
          <span>{status}</span>
        </div>
        <div className="text-sm text-gray-500 mb-2">By {author} • {date}</div>
        <p className="text-red-400 mb-2">{target}</p>
        <p className="text-gray-700 mb-4 truncate italic">{description || 'No description'}</p>
        <div className={`flex items-center ${status === 'APPROVED' ? 'justify-between' : 'justify-end'}`}>
          {status === 'APPROVED' &&
            <Button
              onClick={() => openJobabForm()}
              variant="outline"
            >
              <span className="text-red-500">Add Official Jobab</span>
            </Button>
          }
          <div className="flex space-x-2">
            {status !== 'FLAGGED' &&
              <Button variant="ghost" size="icon" onClick={() => setStatus('APPROVE')}>
                <Check className="w-4 h-4 text-green-500" />
              </Button>
            }
            {status === 'APPROVED' && 
              <Button variant="ghost" size="icon">
                <Link2 className="w-4 h-4 text-blue-500" onClick={() => setStatus('LINK')}/>
              </Button>
            }
            {(status !== 'APPROVED' && status !== 'FLAGGED') && (
              <>
                <Button variant="ghost" size="icon">
                  <Clock className="w-4 h-4 text-orange-500" onClick={() => setStatus('ON_HOLD')} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setStatus('REJECT')}>
                  <X className="w-4 h-4 text-red-500" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon">
              {status === 'FLAGGED' ? (
                <FlagOff className="w-4 h-4 text-orange-500" onClick={() => setStatus('UNFLAG')} />
              ): <Flag className="w-4 h-4 text-orange-500" onClick={() => setStatus('FLAG')} />}
            </Button>
          </div>
        </div>
        {reason &&
          <>
            <hr />
            <p className="p-2 bg-red-50 text-red-400 mt-4 rounded-md text-sm">
              Reason: {reason}
            </p>
          </>
        }
      </CardContent>
    </Card>
  )
}
