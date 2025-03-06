import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, FlagOff, Clock, Link2, Check, X } from "lucide-react";
import Link from 'next/link';

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
  const setStatus = (status: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const dabi = {
      id,
      status,
      title
    }
    event.preventDefault();
    event.stopPropagation();
    handleStatus(dabi)
  }
  return (
    <Link href={`/petitions/${id}`} target='_blank'>  
      <Card className="mb-4">
        <CardContent className="md:p-6 p-4 pt-6">
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openJobabForm()
                }}
                variant="outline"
              >
                <span className="text-red-500">Add Official Jobab</span>
              </Button>
            }
            <div className="flex space-x-2">
              {status !== 'FLAGGED' &&
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => setStatus('APPROVE', e)}>
                  <Check className="w-4 h-4 text-green-500" />
                </Button>
              }
              {status === 'APPROVED' && 
                <Button variant="ghost" size="icon" onClick={(e) => setStatus('LINK', e)}>
                  <Link2 className="w-4 h-4 text-blue-500"/>
                </Button>
              }
              {(status !== 'APPROVED' && status !== 'FLAGGED') && (
                <>
                  <Button variant="ghost" size="icon" onClick={(e) => setStatus('ON_HOLD', e)}>
                    <Clock className="w-4 h-4 text-orange-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => setStatus('REJECT', e)}>
                    <X className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => setStatus(status === 'FLAGGED' ? 'UNFLAG' : 'FLAG', e)}
              >
                {status === 'FLAGGED' ? (
                  <FlagOff className="w-4 h-4 text-orange-500" />
                ): <Flag className="w-4 h-4 text-orange-500" />}
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
    </Link>
  )
}
