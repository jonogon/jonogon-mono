import {Avatar, AvatarImage} from '@/components/ui/avatar';
import {
    HoverCard,
    HoverCardTrigger,
    HoverCardContent,
} from '@/components/ui/hover-card';
import {
    Check,
    Globe,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
} from 'lucide-react';

interface SocialAccount {
    id: string;
    platform: string;
    url: string;
    username: string;
}

interface RespondentData {
    id: string;
    name: string;
    type: 'organization' | 'expert';
    img_url: string | null;
    bio: string | null;
    website: string | null;
    social_accounts: SocialAccount[];
    created_at: string;
    img: string | null;
}

interface RespondentHoverCardProps {
    respondent: RespondentData | undefined;
    children: React.ReactNode;
}

export default function RespondentHoverCard({
    respondent,
    children,
}: RespondentHoverCardProps) {
    return (
        <HoverCard>
            <HoverCardTrigger className="cursor-pointer" asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={(
                                    respondent?.img_url ??
                                    `https://static.jonogon.org/placeholder-images/${((Number(respondent?.id ?? 0) + 1) % 11) + 1}.jpg`
                                ).replace(
                                    '$CORE_HOSTNAME',
                                    window.location.hostname,
                                )}
                                alt={respondent?.name ?? 'Respondent'}
                            />
                        </Avatar>
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold">
                                    {respondent?.name}
                                </h4>
                                <div className="bg-green-500 rounded-full p-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            </div>
                            <div className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 border border-green-200">
                                <p className="text-xs font-medium text-green-700">
                                    {respondent?.type === 'organization'
                                        ? 'Organization'
                                        : 'Individual Expert'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {respondent && respondent.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {respondent.bio}
                        </p>
                    )}

                    <div className="space-y-3 pt-1">
                        {respondent && respondent.website && (
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-muted-foreground" />
                                <a
                                    href={respondent.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-muted-foreground hover:text-primary hover:underline">
                                    {respondent.website}
                                </a>
                            </div>
                        )}

                        {respondent?.social_accounts &&
                            respondent.social_accounts.length > 0 && (
                                <div className="flex gap-2">
                                    {respondent.social_accounts.map(
                                        (account) => {
                                            const SocialIcon = {
                                                facebook: Facebook,
                                                twitter: Twitter,
                                                instagram: Instagram,
                                                linkedin: Linkedin,
                                                youtube: Youtube,
                                            }[account.platform];

                                            return SocialIcon ? (
                                                <a
                                                    key={account.platform}
                                                    href={account.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
                                                    title={`${account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}: ${account.username}`}>
                                                    <SocialIcon className="w-4 h-4 text-neutral-600" />
                                                </a>
                                            ) : null;
                                        },
                                    )}
                                </div>
                            )}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
