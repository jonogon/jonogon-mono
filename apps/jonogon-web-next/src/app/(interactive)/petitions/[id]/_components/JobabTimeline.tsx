'use client';

import {trpc} from '@/trpc/client';
import JobabCard from './JobabCard';

interface JobabTimelineProps {
    petitionId: number;
}

export default function JobabTimeline({petitionId}: JobabTimelineProps) {
    const {data: jobabsData, isLoading} = trpc.jobabs.list.useQuery({
        petition_id: petitionId,
        limit: 10,
        offset: 0,
    });

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

    const transformedJobabs = jobabs.map((jobab) => {
        const respondent = respondents.find(
            (r) => r.id === jobab.respondent_id,
        );

        return {
            id: Number(jobab.id),
            title: jobab.title,
            description: jobab.description,
            source_type: jobab.source_type,
            source_url: jobab.source_url,
            responded_at: jobab.responded_at,
            created_at: jobab.created_at,
            vote_count: jobab.vote_count || 0,
            user_vote: null, // Will be implemented with user authentication
            attachments: [], // Will be implemented with attachments API
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
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <h3 className="font-medium">{jobabs.length} জবাবs</h3>
            </div>

            <p className="text-neutral-600">
                Responses from official bodies and expert opinions
            </p>

            {isLoading ? (
                <div>জবাবs Loading...</div>
            ) : (
                <div className="space-y-6">
                    {transformedJobabs.map((jobab) => (
                        <JobabCard key={jobab.id} {...jobab} />
                    ))}
                </div>
            )}
        </div>
    );
}
