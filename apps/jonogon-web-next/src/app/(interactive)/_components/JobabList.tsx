'use client';

import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PetitionCardSkeleton from './PetitionCardSkeleton';
import {trpc} from '@/trpc/client';
import { HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { FaRegComment } from 'react-icons/fa';
import Link from 'next/link';
import { formatDate } from '@/lib/date';

export default function JobabList() {
  const { data, isLoading } = trpc.jobabs.getAllJobabs.useQuery({
    limit: 33,
    offset: 0,
    sort: 'votes',
    order: 'desc'
  });

  if (isLoading) {
    return (
      Array(4)
        .fill(null)
        .map((_, i) => {
            return <PetitionCardSkeleton key={i} mode={'request'} />;
      })
    )
  }

  if (!data) {
    return (
      <div>
        <div className={'text-center text-lg font-semibold p-5'}>
          No জবাবs found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.data.map((jobab, index) => (
        <Link href={`/petitions/${jobab.petition_id}?jobab=${jobab.id}`} key={index}>
          <Card className="hover:shadow-md transition-shadow mb-4">
            <CardHeader className="p-4">
              <CardTitle className="flex flex-col space-y-2">
                <span className="leading-[1.1] font-bold font-serif text-xl md:text-2xl align-middle
                break-words overflow-hidden text-ellipsis">
                  {jobab.title}
                </span>
                <div className="flex items-center space-x-2 text-sm text-neutral-500">
                  <span>{jobab.respondent_name}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {jobab.source_type.replace(/_/g, ' ')}
                  </span>
                  <span>•</span>
                  <time dateTime={jobab.responded_at}>
                    {formatDate(new Date(jobab.responded_at))}
                  </time>
                </div>
                <p className="text-sm text-neutral-600 p-2 bg-slate-100 rounded-sm italic">
                  Re: {jobab.petition_title}
                </p>
              </CardTitle>
            </CardHeader>
            <CardFooter className="p-4 pt-0">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  <HandThumbUpIcon className="h-5 w-5 text-green-500" />
                  <span>{jobab.upvotes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <HandThumbDownIcon className="h-5 w-5 text-red-500" />
                  <span>{jobab.downvotes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaRegComment className="h-5 w-5 text-gray-500" />
                  <span>{jobab.comment_count} Comments</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
