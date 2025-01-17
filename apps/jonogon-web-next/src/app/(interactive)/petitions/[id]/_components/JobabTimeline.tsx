'use client';

import {trpc} from '@/trpc/client';
import JobabCard from './jobabs/JobabCard';
import {
    JobabInterface,
    JobabSourceType,
    JobabAttachment,
    JobabListItem,
} from './jobabs/types';
import {Separator} from '@/components/ui/separator';
import {Button} from '@/components/ui/button';
import {useEffect, useState} from 'react';
import {toBengaliNumber} from '@/lib/numberConverter';
import {JobabForm} from '@/components/admin/JobabForm';

interface JobabTimelineProps {
    petitionId: number;
}

const ITEMS_PER_PAGE = 5;

interface JobabResponse {
    id: number;
    petition_id: number;
    respondent_id: number;
    title: string | null;
    description: string | null;
    source_type: JobabSourceType;
    source_url: string | null;
    responded_at: string;
    created_at: string;
    vote_count: number;
    user_vote: number | null;
    attachments: JobabAttachment[];
    created_by: string;
}

export default function JobabTimeline({petitionId}: JobabTimelineProps) {
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [allJobabs, setAllJobabs] = useState<JobabResponse[]>([]);
    const [editJobabData, setEditJobabData] = useState<{
        id: number;
        title: string | null;
        description: string | null;
        respondent_id: number;
        source_type: JobabSourceType;
        source_url: string | null;
        responded_at: string;
        attachments: JobabAttachment[];
    } | null>(null);

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
            const transformedData = jobabsData.data.map((jobab: any) => ({
                ...jobab,
                id: Number(jobab.id),
                petition_id: Number(jobab.petition_id),
                respondent_id: Number(jobab.respondent_id),
                attachments: jobab.attachments.map((attachment: any) => ({
                    ...attachment,
                    id: Number(attachment.id),
                    type: attachment.filename.match(/\.(jpg|jpeg|png|gif)$/i)
                        ? ('image' as const)
                        : ('file' as const),
                })),
            })) as JobabResponse[];

            if (jobabsData.total <= offset) {
                setOffset(0);
                setAllJobabs(transformedData);
            } else if (offset === 0) {
                setAllJobabs(transformedData);
            } else {
                setAllJobabs((prev) => [...prev, ...transformedData]);
            }
            setHasMore(jobabsData.data.length === ITEMS_PER_PAGE);
        }
    }, [jobabsData?.data, offset, jobabsData?.total]);

    const jobabs = allJobabs || [];

    if (!isLoading && jobabs.length === 0) {
        return null;
    }

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
                    <p className="text-neutral-500 text-sm font-serif">
                        Responses from official bodies and expert opinions
                    </p>
                </div>

                {isLoading && offset === 0 ? (
                    <div>জবাবs Loading...</div>
                ) : (
                    <div className="space-y-6">
                        {jobabs.map((jobab) => (
                            <JobabCard
                                key={jobab.id}
                                {...jobab}
                                onEdit={setEditJobabData}
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
                                        Showing {jobabs.length} out of{' '}
                                        {jobabsData?.total} জবাবs
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <Separator />

            {editJobabData && (
                <JobabForm
                    isOpen={!!editJobabData}
                    onClose={() => setEditJobabData(null)}
                    petitionId={petitionId}
                    mode="edit"
                    jobabId={editJobabData.id}
                    initialData={{
                        title: editJobabData.title || '',
                        description: editJobabData.description || '',
                        respondentId: editJobabData.respondent_id.toString(),
                        sourceType: editJobabData.source_type,
                        sourceUrl: editJobabData.source_url || '',
                        respondedAt: new Date(editJobabData.responded_at),
                        attachments: editJobabData.attachments,
                    }}
                />
            )}
        </>
    );
}
