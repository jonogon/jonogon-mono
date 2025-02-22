import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowUp, Clock, Link2, Check, X } from "lucide-react";

interface DabiProps {
  title: string;
  author: string;
  date: string;
  description: string;
  target: string;
  status: string;
}

export default function DabiCard({
  title,
  author,
  date,
  description,
  target,
  status
}: DabiProps) {
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
        <div className="flex items-center justify-end">
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Check className="w-4 h-4 text-green-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <X className="w-4 h-4 text-red-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Clock className="w-4 h-4 text-orange-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Link2 className="w-4 h-4 text-blue-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
