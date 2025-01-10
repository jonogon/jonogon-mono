'use client';

import {trpc} from '@/trpc/client';
import JobabCard from './jobabs/JobabCard';
import {JobabSourceType, JobabsResponse} from './jobabs/types';
import {Separator} from '@/components/ui/separator';

interface JobabTimelineProps {
    jobabsData: JobabsResponse | undefined;
    isLoading: boolean;
}

export default function JobabTimeline({
    jobabsData,
    isLoading,
}: JobabTimelineProps) {
    const {data: respondentsData} = trpc.respondents.list.useQuery(
        {
            type: undefined,
        },
        {
            enabled: true,
        },
    );

    const jobabs = jobabsData?.data || [];
    const respondents = respondentsData?.data || [];

    // If there are no jobabs and not loading, don't render anything
    if (!isLoading && jobabs.length === 0) {
        return null;
    }

    const transformedJobabs = jobabs.map((jobab: any) => {
        const respondent = respondents.find(
            (r: any) => r.id === jobab.respondent_id,
        );

        // Transform attachments data with correct type assertion
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
                            {jobabs.length
                                .toString()
                                .replace(
                                    /[0-9]/g,
                                    (d: any) => '০১২৩৪৫৬৭৮৯'[parseInt(d)],
                                )}{' '}
                            জবাবs
                        </h3>
                    </div>
                    <p className="text-neutral-600 text-sm font-serif">
                        Responses from official bodies and expert opinions
                    </p>
                </div>

                {isLoading ? (
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
                    </div>
                )}
            </div>
            <Separator />
        </>
    );
}
