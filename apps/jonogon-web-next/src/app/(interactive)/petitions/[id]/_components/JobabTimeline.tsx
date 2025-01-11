'use client';

import {trpc} from '@/trpc/client';
import JobabCard from './jobabs/JobabCard';
import {JobabSourceType, JobabsResponse} from './jobabs/types';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import {toBengaliNumber} from '@/lib/numberConverter';

interface JobabTimelineProps {
    petitionId: number;
}

const ITEMS_PER_PAGE = 5;

export default function JobabTimeline({petitionId}: JobabTimelineProps) {
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [allJobabs, setAllJobabs] = useState<any[]>([]);

    const {data: respondentsData} = trpc.respondents.list.useQuery(
        {
            type: undefined,
        },
        {
            enabled: true,
        },
    );

    const {data: jobabsData, isLoading} = trpc.jobabs.list.useQuery(
        {
            petition_id: petitionId,
            limit: ITEMS_PER_PAGE,
            offset: offset,
        },
        {
            enabled: !!petitionId,
        },
    );

    useEffect(() => {
        if (jobabsData?.data) {
            if (offset === 0) {
                setAllJobabs(jobabsData.data);
            } else {
                setAllJobabs((prev) => [...prev, ...jobabsData.data]);
            }
            setHasMore(jobabsData.data.length === ITEMS_PER_PAGE);
        }
    }, [jobabsData?.data, offset]);

    const respondents = respondentsData?.data || [];
    const jobabs = allJobabs || [];

    if (!isLoading && jobabs.length === 0) {
        return null;
    }

    const transformedJobabs = jobabs.map((jobab: any) => {
        const respondent = respondents.find(
            (r: any) => r.id === jobab.respondent_id,
        );

        const transformedAttachments =
            jobab.attachments?.map((attachment: any) => ({
                id: Number(attachment.id),
                filename: attachment.filename,
                type: attachment.filename.match(/\.(jpg|jpeg|png|gif)$/i)
                    ? ('image' as const)
                    : ('file' as const),
                url: attachment.url,
            })) || [];

        return {
            id: Number(jobab.id),
            title: jobab.title,
            description: jobab.description,
            source_type: jobab.source_type,
            source_url: jobab.source_url,
            responded_at: jobab.responded_at,
            created_at: jobab.created_at,
            vote_count: jobab.vote_count || 0,
            user_vote: jobab.user_vote,
            attachments: transformedAttachments,
            respondent: respondent
                ? {
                      id: Number(respondent.id),
                      name: respondent.name,
                      type: respondent.type as 'organization' | 'expert',
                      img_url: respondent.img_url,
                  }
                : null,
        };
    });

    return (
        <>
            <Separator />
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">
                            {`${toBengaliNumber(jobabsData?.total || 0)} জবাবs`}
                        </h3>
                    </div>
                    <p className="text-neutral-600 text-sm font-serif">
                        Responses from official bodies and expert opinions
                    </p>
                </div>

                {isLoading && offset === 0 ? (
                    <div>জবাবs Loading...</div>
                ) : (
                    <div className="space-y-6">
                        {transformedJobabs.map((jobab: any) => (
                            <JobabCard
                                key={jobab.id}
                                id={jobab.id}
                                title={jobab.title}
                                description={jobab.description}
                                source_type={jobab.source_type}
                                source_url={jobab.source_url}
                                responded_at={jobab.responded_at}
                                created_at={jobab.created_at}
                                vote_count={jobab.vote_count}
                                user_vote={jobab.user_vote}
                                attachments={jobab.attachments}
                                respondent={jobab.respondent}
                            />
                        ))}
                        {hasMore && (
                            <>
                                <div className="flex flex-col items-center gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setOffset(offset + ITEMS_PER_PAGE)
                                        }
                                        disabled={isLoading}>
                                        {isLoading
                                            ? 'Loading...'
                                            : 'Load More জবাবs'}
                                    </Button>
                                    <p className="text-xs text-neutral-600">
                                        Showing {transformedJobabs.length} out
                                        of {jobabsData?.total} জবাবs
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <Separator />
        </>
    );
}
