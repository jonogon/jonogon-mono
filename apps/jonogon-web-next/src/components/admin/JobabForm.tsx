import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import {Textarea} from '@/components/ui/textarea';
import {Separator} from '@/components/ui/separator';
import {trpc} from '@/trpc/client';
import {
    CalendarIcon,
    MinusIcon,
    PlusIcon,
    TrashIcon,
    Building2,
    UserCog,
    X,
    ImageIcon,
    UploadIcon,
    FileIcon,
} from 'lucide-react';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {Drawer, DrawerContent, DrawerTrigger} from '@/components/ui/drawer';
import {useMediaQuery} from 'react-responsive';
import {Tabs, TabsList, TabsContent, TabsTrigger} from '@/components/ui/tabs';
import {z} from 'zod';
import {useAuthState} from '@/auth/token-manager';
import {firebaseAuth} from '@/firebase';
import {toast} from '@/components/ui/use-toast';
import {useMutation} from '@tanstack/react-query';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import {
    SOCIAL_NETWORKS,
    SocialNetwork,
    SocialAccount,
    JobabSourceType,
    JobabAttachment,
} from '@/app/(interactive)/petitions/[id]/_components/jobabs/types';

interface JobabFormProps {
    isOpen: boolean;
    onClose: () => void;
    petitionId: number;
    mode?: 'create' | 'edit';
    jobabId?: number;
    initialData?: {
        title: string;
        description: string;
        respondentId: string;
        sourceType: JobabSourceType;
        sourceUrl: string;
        respondedAt: string;
        attachments: JobabAttachment[];
    };
}

const respondentLabels = {
    organization: {
        title: 'Organization',
        description: 'Official response from government bodies',
        selectLabel: 'Select Organization',
        icon: Building2,
    },
    expert: {
        title: 'Individual Expert',
        description: 'Expert opinion from qualified individuals',
        selectLabel: 'Select Expert',
        icon: UserCog,
    },
} as const;

const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

const socialAccountSchema = z.object({
    platform: z.string().min(1, 'Platform is required'),
    username: z.string().min(1, 'Username is required'),
    url: z.string().url('Please enter a valid URL'),
});

const respondentSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    bio: z.string().optional(),
    website: z.string().url('Please enter a valid URL').optional(),
    social_accounts: z.array(socialAccountSchema).optional(),
});

const jobabSchema = z.object({
    respondentId: z.string().min(1, 'Please select a respondent'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    sourceType: z.enum(
        [
            'jonogon_direct',
            'news_article',
            'official_document',
            'social_media',
            'press_release',
        ],
        {
            required_error: 'Please select a source platform',
        },
    ),
    sourceUrl: z
        .string()
        .url('Please enter a valid URL')
        .optional()
        .or(z.literal('')),
    respondedAt: z.date().optional(),
});

export function JobabForm({
    isOpen,
    onClose,
    petitionId,
    mode = 'create',
    jobabId,
    initialData,
}: JobabFormProps) {
    const isAuthenticated = useAuthState();
    const {data: selfDataResponse} = trpc.users.getSelf.useQuery(undefined, {
        enabled: !!isAuthenticated,
    });
    const [respondentType, setRespondentType] = useState<
        'organization' | 'expert'
    >('organization');
    const [showNewRespondent, setShowNewRespondent] = useState(false);
    const [date, setDate] = useState<Date | undefined>(
        initialData?.respondedAt ? new Date(initialData.respondedAt) : undefined
    );
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        respondentId: initialData?.respondentId || '',
        sourceType: initialData?.sourceType || ('jonogon_direct' as const),
        sourceUrl: initialData?.sourceUrl || '',
        newRespondentName: '',
        newRespondentBio: '',
        newRespondentWebsite: '',
        socialAccounts: [] as SocialAccount[],
    });

    const [errors, setErrors] = useState({
        website: '',
        socialAccounts: [] as string[],
        respondentId: '',
        title: '',
        description: '',
        sourceType: '',
        sourceUrl: '',
        respondedAt: '',
    });

    const [comboboxOpen, setComboboxOpen] = useState(false);
    const isDesktop = useMediaQuery({minWidth: 768});

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isImageLoading, setIsImageLoading] = useState(false);

    const {data: respondents} = trpc.respondents.list.useQuery(
        {
            type: respondentType,
        },
        {
            enabled: !!respondentType,
        },
    );

    const {mutate: createRespondent} = trpc.respondents.create.useMutation({
        onSuccess: (data) => {
            setFormData((prev) => ({
                ...prev,
                respondentId: String(data.data.id),
                newRespondentName: '',
                newRespondentBio: '',
                newRespondentWebsite: '',
                socialAccounts: [],
            }));
            setShowNewRespondent(false);
            setImageFile(null);
            setPreviewUrl(null);
            utils.respondents.list.invalidate();
        },
    });

    const [attachmentQueue, setAttachmentQueue] = useState<File[]>([]);
    const [attachmentsToRemove, setAttachmentsToRemove] = useState<number[]>(
        [],
    );

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            respondentId: '',
            sourceType: 'jonogon_direct' as const,
            sourceUrl: '',
            newRespondentName: '',
            newRespondentBio: '',
            newRespondentWebsite: '',
            socialAccounts: [],
        });
        setDate(undefined);
        setAttachmentQueue([]);
        setAttachmentsToRemove([]);
        setShowNewRespondent(false);
        setImageFile(null);
        setPreviewUrl(null);
        setErrors({
            website: '',
            socialAccounts: [],
            respondentId: '',
            title: '',
            description: '',
            sourceType: '',
            sourceUrl: '',
            respondedAt: '',
        });
    };

    const utils = trpc.useUtils();

    const {mutate: createJobab, isLoading: isCreating} =
        trpc.jobabs.create.useMutation({
            onSuccess: async (response) => {
                // Upload attachments after jobab is created
                if (attachmentQueue.length > 0 && response.data?.id) {
                    for (const file of attachmentQueue) {
                        await uploadAttachment({
                            jobabId: Number(response.data.id),
                            file,
                        });
                    }
                }

                // Invalidate all jobabs list queries
                utils.jobabs.list.invalidate();

                toast({
                    title: 'Success',
                    description: `জবাব has been successfully added${attachmentQueue.length > 0 ? ' with attachments' : ''}`,
                });
                resetForm();
                onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to create জবাব',
                    variant: 'destructive',
                });
            },
        });

    const {mutate: updateJobab, isLoading: isUpdating} =
        trpc.jobabs.update.useMutation({
            onSuccess: async () => {
                // Invalidate all jobabs list queries
                utils.jobabs.list.invalidate();

                // Also invalidate the specific jobab
                if (jobabId) {
                    utils.jobabs.get.invalidate({id: jobabId});
                }

                toast({
                    title: 'Success',
                    description: `জবাব has been successfully updated${attachmentQueue.length > 0 ? ' with attachments' : ''}`,
                });
                resetForm();
                onClose();
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to update জবাব',
                    variant: 'destructive',
                });
            },
        });

    const {mutate: uploadAttachment} = useMutation({
        mutationFn: async ({jobabId, file}: {jobabId: number; file: File}) => {
            const user = firebaseAuth().currentUser;
            if (!user) {
                throw new Error('Must be logged in to upload attachments');
            }

            const isImage = file.type.startsWith('image/');
            const search = new URLSearchParams({
                filename: file.name,
                type: isImage ? 'image' : 'file',
            });

            const baseUrl =
                process.env.NODE_ENV === 'development'
                    ? `http://${window.location.hostname}:12001`
                    : 'https://core.jonogon.org';

            const response = await fetch(
                `${baseUrl}/jobabs/${jobabId}/attachments?${search}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        Authorization: `Bearer ${await user.getIdToken()}`,
                    },
                    body: file,
                },
            );

            if (!response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = (await response.json()) as {
                        message: string;
                    };
                    throw new Error(errorData.message || 'Upload failed');
                }
                throw new Error(
                    `Upload failed with status: ${response.status}`,
                );
            }

            const result = await response.json();

            // Invalidate queries after successful upload
            utils.jobabs.list.invalidate();
            utils.jobabs.get.invalidate({id: jobabId});

            return result;
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Failed to upload attachment',
                variant: 'destructive',
            });
        },
    });

    const {mutate: removeAttachment, isLoading: isRemovingAttachment} =
        trpc.jobabs.removeAttachment.useMutation({
            onSuccess: () => {
                // Invalidate all relevant queries
                utils.jobabs.list.invalidate();
                if (jobabId) {
                    utils.jobabs.get.invalidate({id: jobabId});
                }
                toast({
                    title: 'Success',
                    description: 'Attachment removed successfully',
                });
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to remove attachment',
                    variant: 'destructive',
                });
            },
        });

    const handleRemoveAttachment = (attachmentId: number) => {
        setAttachmentsToRemove((prev) => [...prev, attachmentId]);
    };

    const currentLabel = respondentLabels[respondentType];

    const handleRespondentTypeChange = (val: string) => {
        const newType = val as 'organization' | 'expert';
        setRespondentType(newType);
        // Clear the selected respondent when switching types
        setFormData((prev) => ({
            ...prev,
            respondentId: '',
        }));
        // Close the combobox if it's open
        setComboboxOpen(false);
    };

    const addSocialAccount = () => {
        if (
            formData.socialAccounts.length >=
            Object.keys(SOCIAL_NETWORKS).length
        ) {
            return;
        }

        // Find first unused platform
        const usedPlatforms = new Set(
            formData.socialAccounts.map((acc) => acc.platform),
        );
        const availablePlatform = Object.keys(SOCIAL_NETWORKS).find(
            (platform) => !usedPlatforms.has(platform as SocialNetwork),
        ) as SocialNetwork;

        if (availablePlatform) {
            setFormData((prev) => ({
                ...prev,
                socialAccounts: [
                    ...prev.socialAccounts,
                    {platform: availablePlatform, username: '', url: ''},
                ],
            }));
        }
    };

    const removeSocialAccount = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            socialAccounts: prev.socialAccounts.filter((_, i) => i !== index),
        }));
    };

    const updateSocialAccount = (
        index: number,
        field: 'platform' | 'username',
        value: string,
    ) => {
        setFormData((prev) => ({
            ...prev,
            socialAccounts: prev.socialAccounts.map((account, i) => {
                if (i !== index) return account;

                const newAccount = {...account, [field]: value};

                // Always auto-generate URL
                if (field === 'username') {
                    newAccount.url =
                        SOCIAL_NETWORKS[account.platform].baseUrl + value;
                } else if (field === 'platform') {
                    newAccount.url =
                        SOCIAL_NETWORKS[value as SocialNetwork].baseUrl +
                        account.username;
                }

                return newAccount;
            }),
        }));
    };

    const validateForm = () => {
        if (!showNewRespondent) {
            if (!date) {
                setErrors((prev) => ({
                    ...prev,
                    respondedAt: 'Response date is required',
                }));
                return false;
            }

            const result = jobabSchema.safeParse({
                ...formData,
                respondedAt: date,
            });
            if (!result.success) {
                const formattedErrors = result.error.format();
                setErrors({
                    ...errors,
                    respondentId:
                        formattedErrors.respondentId?._errors[0] || '',
                    title: formattedErrors.title?._errors[0] || '',
                    description: formattedErrors.description?._errors[0] || '',
                    sourceType: formattedErrors.sourceType?._errors[0] || '',
                    sourceUrl: formattedErrors.sourceUrl?._errors[0] || '',
                });
                return false;
            }
            return true;
        }

        const result = respondentSchema.safeParse({
            name: formData.newRespondentName,
            bio: formData.newRespondentBio,
            website: formData.newRespondentWebsite,
            social_accounts: formData.socialAccounts,
        });

        if (!result.success) {
            const formattedErrors = result.error.format();
            setErrors({
                ...errors,
                website: formattedErrors.website?._errors[0] || '',
                socialAccounts: formattedErrors.social_accounts?._errors || [],
            });
            return false;
        }

        return true;
    };

    const handleCreateRespondent = async () => {
        if (!validateForm()) return;

        let imageKey = null;
        if (imageFile) {
            imageKey = await uploadRespondentImage(imageFile, respondentType);
        }

        createRespondent({
            type: respondentType,
            name: formData.newRespondentName,
            bio: formData.newRespondentBio,
            website: formData.newRespondentWebsite || undefined,
            img: imageKey || undefined,
            social_accounts:
                formData.socialAccounts.length > 0
                    ? formData.socialAccounts
                    : undefined,
        });
    };

    const handleSubmit = async () => {
        if (!validateForm() || !date) return;


        const commonData = {
            title: formData.title || undefined,
            description: formData.description || undefined,
            source_type: formData.sourceType,
            source_url: formData.sourceUrl || undefined,
            responded_at: date.toISOString(),
            respondent_id: Number(formData.respondentId),
        };

        if (mode === 'edit' && jobabId) {
            try {
                // First remove any attachments marked for deletion
                for (const attachmentId of attachmentsToRemove) {
                    await removeAttachment({
                        jobab_id: jobabId,
                        attachment_id: attachmentId,
                    });
                }

                // Then update the jobab
                await updateJobab({
                    id: jobabId,
                    ...commonData,
                });

                // Finally, upload any new attachments
                if (attachmentQueue.length > 0) {
                    for (const file of attachmentQueue) {
                        await uploadAttachment({
                            jobabId: jobabId,
                            file,
                        });
                    }
                }

                // Invalidate all relevant queries
                utils.jobabs.list.invalidate();
                utils.jobabs.get.invalidate({id: jobabId});

                toast({
                    title: 'Success',
                    description: `জবাব has been successfully updated${attachmentQueue.length > 0 ? ' with attachments' : ''}`,
                });
                resetForm();
                onClose();
            } catch (error) {
                toast({
                    title: 'Error',
                    description:
                        error instanceof Error
                            ? error.message
                            : 'Failed to update জবাব',
                    variant: 'destructive',
                });
            }
        } else {
            createJobab({
                petition_id: petitionId,
                ...commonData,
            });
        }
    };

    const ResponsiveCombobox = () => {
        if (isDesktop) {
            return (
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start">
                            {formData.respondentId
                                ? respondents?.data?.find(
                                      (r) => r.id === formData.respondentId,
                                  )?.name
                                : currentLabel.selectLabel}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <RespondentList />
                    </PopoverContent>
                </Popover>
            );
        }

        return (
            <Drawer open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        {formData.respondentId
                            ? respondents?.data?.find(
                                  (r) => r.id === formData.respondentId,
                              )?.name
                            : currentLabel.selectLabel}
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <div className="mt-4 border-t">
                        <RespondentList />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    };

    const RespondentList = () => {
        const [search, setSearch] = useState('');

        const filteredRespondents = respondents?.data?.filter(
            (r) =>
                r.type === respondentType &&
                (search
                    ? r.name.toLowerCase().includes(search.toLowerCase())
                    : true),
        );

        const displayRespondents = search
            ? filteredRespondents
            : filteredRespondents?.slice(0, 5);

        return (
            <Command className="w-full md:min-w-[480px]">
                <CommandInput
                    placeholder={`Search ${respondentType}...`}
                    value={search}
                    onValueChange={setSearch}
                    className="w-full"
                />
                <CommandList className="w-full">
                    <CommandEmpty>No {respondentType} found.</CommandEmpty>
                    <CommandGroup>
                        {displayRespondents?.map((respondent) => (
                            <CommandItem
                                key={respondent.id}
                                value={respondent.name.toLowerCase()}
                                onSelect={() => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        respondentId: String(respondent.id),
                                    }));
                                    setComboboxOpen(false);
                                    setShowNewRespondent(false);
                                }}>
                                {respondent.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        );
    };

    const uploadRespondentImage = async (
        file: File,
        type: 'organization' | 'expert',
    ) => {
        const user = firebaseAuth().currentUser;
        if (!isAuthenticated || !user) return null;

        setIsImageLoading(true);
        try {
            const search = new URLSearchParams({
                type: type,
            });

            const response = await fetch(
                process.env.NODE_ENV === 'development'
                    ? `http://${window.location.hostname}:12001/respondents/image?${search}`
                    : `https://core.jonogon.org/respondents/image?${search}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/octet-stream',
                        Authorization: `Bearer ${await user.getIdToken()}`,
                    },
                    body: file,
                },
            );

            const data = (await response.json()) as {
                message: 'image-uploaded';
                data: {
                    imageKey: string;
                };
            };
            return data.data.imageKey;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        } finally {
            setIsImageLoading(false);
        }
    };

    const AttachmentQueue = () => {
        const getFileTypeIcon = (filename: string) => {
            const ext = filename.split('.').pop()?.toLowerCase();
            if (ext && ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                return (
                    <ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                );
            }
            return (
                <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            );
        };

        return (
            <div className="space-y-2">
                <Label className="flex justify-between items-center">
                    <span>Attachments</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {(initialData?.attachments?.length || 0) -
                                attachmentsToRemove.length +
                                attachmentQueue.length}{' '}
                            files
                        </span>
                        <Input
                            type="file"
                            accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                            className="hidden"
                            id="attachment-input"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files?.length) {
                                    setAttachmentQueue((prev) => [
                                        ...prev,
                                        ...Array.from(files),
                                    ]);
                                    e.target.value = '';
                                }
                            }}
                            multiple
                        />
                        <Label
                            htmlFor="attachment-input"
                            className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-input bg-background shadow-sm px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
                            <UploadIcon className="h-4 w-4" />
                            Choose Files
                        </Label>
                    </div>
                </Label>

                {((initialData?.attachments &&
                    initialData.attachments.length > 0) ||
                    attachmentQueue.length > 0) && (
                    <div className="relative px-8">
                        <Carousel
                            opts={{align: 'start', loop: false}}
                            className="w-full max-w-[calc(100vw-4rem)]">
                            <CarouselContent>
                                {/* Show existing attachments that are not marked for removal */}
                                {initialData?.attachments
                                    ?.filter(
                                        (file) =>
                                            !attachmentsToRemove.includes(
                                                file.id,
                                            ),
                                    )
                                    .map((file) => (
                                        <CarouselItem
                                            key={file.id}
                                            className="basis-[140px] md:basis-[160px]">
                                            <div className="relative group flex items-center gap-1 bg-card rounded-lg p-1.5 border text-sm mr-1">
                                                {getFileTypeIcon(file.filename)}
                                                <div className="w-[80px] min-w-0">
                                                    <p className="truncate">
                                                        {file.filename}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Existing
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                        handleRemoveAttachment(
                                                            file.id,
                                                        )
                                                    }>
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                {/* Show new attachments in queue */}
                                {attachmentQueue.map((file, index) => (
                                    <CarouselItem
                                        key={`new-${index}`}
                                        className="basis-[140px] md:basis-[160px]">
                                        <div className="relative group flex items-center gap-1 bg-card rounded-lg p-1.5 border text-sm mr-1">
                                            {getFileTypeIcon(file.name)}
                                            <div className="w-[80px] min-w-0">
                                                <p className="truncate">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {(file.size / 1024).toFixed(
                                                        1,
                                                    )}{' '}
                                                    KB
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() =>
                                                    setAttachmentQueue((prev) =>
                                                        prev.filter(
                                                            (_, i) =>
                                                                i !== index,
                                                        ),
                                                    )
                                                }>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            {(initialData?.attachments?.length || 0) -
                                attachmentsToRemove.length +
                                attachmentQueue.length >
                                3 && (
                                <>
                                    <CarouselPrevious
                                        variant="outline"
                                        className="h-7 w-7 -left-8"
                                    />
                                    <CarouselNext
                                        variant="outline"
                                        className="h-7 w-7 -right-8"
                                    />
                                </>
                            )}
                        </Carousel>
                    </div>
                )}
            </div>
        );
    };

    const isSubmitting = isCreating || isUpdating;

    const handleClose = () => {
        resetForm();
        onClose();
    };

    // Restore initial values when form opens in edit mode
    useEffect(() => {
        if (isOpen && mode === 'edit' && initialData) {
            // Find the selected respondent to determine its type
            const selectedRespondent = respondents?.data?.find(
                (r) => r.id === initialData.respondentId,
            );

            if (selectedRespondent) {
                setRespondentType(selectedRespondent.type);
            }

            setFormData({
                ...formData,
                title: initialData.title,
                description: initialData.description,
                respondentId: initialData.respondentId,
                sourceType: initialData.sourceType,
                sourceUrl: initialData.sourceUrl || '',
            });
            setDate(initialData.respondedAt ? new Date(initialData.respondedAt) : undefined);
        }
    }, [isOpen, mode, initialData]);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'edit' ? 'Edit জবাব' : 'Add New জবাব'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 overflow-y-auto flex-1 pr-6 -mr-6">
                    <div>
                        <Label>Response From</Label>
                        <Tabs
                            value={respondentType}
                            onValueChange={handleRespondentTypeChange}
                            className="w-full mt-2">
                            <TabsList className="w-full grid grid-cols-2 h-auto p-2 bg-muted/50">
                                {(
                                    Object.entries(respondentLabels) as Array<
                                        [
                                            keyof typeof respondentLabels,
                                            (typeof respondentLabels)[keyof typeof respondentLabels],
                                        ]
                                    >
                                ).map(([key, value]) => {
                                    const Icon = value.icon;
                                    return (
                                        <TabsTrigger
                                            key={key}
                                            value={key}
                                            className="data-[state=active]:border-red-500 data-[state=active]:text-red-500 border-2 border-transparent py-2 hover:bg-accent/50 transition-colors">
                                            <div className="flex flex-col items-center gap-2">
                                                <Icon className="h-6 w-6" />
                                                <div className="space-y-1 text-center">
                                                    <p className="font-medium leading-none">
                                                        {value.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground leading-normal whitespace-normal">
                                                        {value.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </div>

                    <div>
                        <Label>
                            <div className="font-bold text-lg">
                                {currentLabel.title}{' '}
                                <span className="text-red-500 ml-1">*</span>
                            </div>
                            <div className="text-stone-500">
                                Select or create a new{' '}
                                {respondentType.toLowerCase()}
                            </div>
                        </Label>
                        <div className="flex gap-2 items-end mt-2">
                            <div className="w-full">
                                <ResponsiveCombobox />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    if (formData.respondentId) {
                                        setFormData((prev) => ({
                                            ...prev,
                                            respondentId: '',
                                        }));
                                    } else {
                                        setShowNewRespondent(
                                            !showNewRespondent,
                                        );
                                    }
                                }}>
                                {formData.respondentId ? (
                                    <X className="h-4 w-4" />
                                ) : showNewRespondent ? (
                                    <MinusIcon className="h-4 w-4" />
                                ) : (
                                    <PlusIcon className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {showNewRespondent ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label>
                                        Name
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        value={formData.newRespondentName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                newRespondentName:
                                                    e.target.value,
                                            })
                                        }
                                        className="bg-card text-card-foreground"
                                        placeholder={`Enter ${respondentType} name`}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label>
                                        Website
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        type="url"
                                        value={formData.newRespondentWebsite}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                newRespondentWebsite:
                                                    e.target.value,
                                            })
                                        }
                                        className={cn(
                                            'bg-card text-card-foreground',
                                            errors.website && 'border-red-500',
                                        )}
                                        placeholder="https://"
                                    />
                                    {errors.website && (
                                        <p className="text-sm text-red-500">
                                            {errors.website}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <Label>
                                        Bio
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Textarea
                                        value={formData.newRespondentBio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                newRespondentBio:
                                                    e.target.value,
                                            })
                                        }
                                        className="bg-card text-card-foreground"
                                        placeholder={`Enter ${respondentType} bio`}
                                        rows={2}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-[120px,1fr] gap-4 items-start">
                                <div className="relative w-[120px] h-[120px] border-2 border-dashed rounded-full flex items-center justify-center overflow-hidden bg-muted/50 hover:bg-muted/70 transition-colors">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <span className="text-3xl">+</span>
                                            <span className="text-xs">
                                                Upload
                                            </span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageFile(file);
                                                setPreviewUrl(
                                                    URL.createObjectURL(file),
                                                );
                                            }
                                        }}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Label className="mb-2 block">
                                        Social Accounts
                                    </Label>
                                    <div className="space-y-2">
                                        {formData.socialAccounts.map(
                                            (account, index) => (
                                                <div
                                                    key={index}
                                                    className="flex gap-2 items-center relative">
                                                    <select
                                                        value={account.platform}
                                                        onChange={(e) =>
                                                            updateSocialAccount(
                                                                index,
                                                                'platform',
                                                                e.target
                                                                    .value as SocialNetwork,
                                                            )
                                                        }
                                                        className="bg-card text-card-foreground h-9 rounded-md border border-input w-[140px]">
                                                        {Object.entries(
                                                            SOCIAL_NETWORKS,
                                                        ).map(
                                                            ([key, value]) => (
                                                                <option
                                                                    key={key}
                                                                    value={key}
                                                                    disabled={formData.socialAccounts.some(
                                                                        (
                                                                            acc,
                                                                            i,
                                                                        ) =>
                                                                            i !==
                                                                                index &&
                                                                            acc.platform ===
                                                                                key,
                                                                    )}>
                                                                    {value.name}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    <Input
                                                        placeholder="Username"
                                                        value={account.username}
                                                        onChange={(e) =>
                                                            updateSocialAccount(
                                                                index,
                                                                'username',
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="bg-card text-card-foreground flex-1"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            removeSocialAccount(
                                                                index,
                                                            )
                                                        }>
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ),
                                        )}
                                        {formData.socialAccounts.length <
                                            Object.keys(SOCIAL_NETWORKS)
                                                .length && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addSocialAccount}
                                                className="w-full">
                                                Add Social Account
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={handleCreateRespondent}
                                disabled={
                                    !formData.newRespondentName ||
                                    (formData.newRespondentWebsite &&
                                        !isValidUrl(
                                            formData.newRespondentWebsite,
                                        )) ||
                                    formData.socialAccounts.some(
                                        (account) =>
                                            !account.platform ||
                                            !account.username ||
                                            !isValidUrl(account.url),
                                    )
                                }
                                className="w-full mt-4">
                                Create {respondentType}
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div>
                                <Label>
                                    Response Title
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className={cn(
                                        'bg-card text-card-foreground mt-2',
                                        errors.title && 'border-red-500',
                                    )}
                                    placeholder="Enter a clear title for this response"
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4 items-start">
                                <div className="flex-1">
                                    <Label>
                                        Source Platform
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <select
                                        className={cn(
                                            'w-full mt-1 bg-card text-card-foreground border rounded-md h-9 px-3',
                                            errors.sourceType &&
                                                'border-red-500',
                                        )}
                                        value={formData.sourceType}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                sourceType: e.target
                                                    .value as any,
                                            })
                                        }>
                                        <option value="" disabled>
                                            Select Platform
                                        </option>
                                        <option value="jonogon_direct">
                                            Jonogon Direct
                                        </option>
                                        <option value="news_article">
                                            News Article
                                        </option>
                                        <option value="official_document">
                                            Official Document
                                        </option>
                                        <option value="social_media">
                                            Social Media
                                        </option>
                                        <option value="press_release">
                                            Press Release
                                        </option>
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <Label>
                                        Response Date
                                        <span className="text-red-500 ml-1">
                                            *
                                        </span>
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                className={cn(
                                                    'w-full mt-1 h-9 pl-3 text-left font-normal bg-card text-card-foreground border border-input hover:bg-card hover:text-card-foreground',
                                                    !date &&
                                                        'text-muted-foreground',
                                                )}>
                                                {date ? (
                                                    format(date, 'PPP')
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={setDate}
                                                disabled={(date) =>
                                                    date > new Date()
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div>
                                <Label>Source URL</Label>
                                <Input
                                    type="url"
                                    value={formData.sourceUrl}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            sourceUrl: e.target.value,
                                        })
                                    }
                                    className={cn(
                                        'bg-card text-card-foreground mt-2',
                                        errors.sourceUrl && 'border-red-500',
                                    )}
                                    placeholder="https://"
                                />
                                {errors.sourceUrl && (
                                    <p className="text-sm text-red-500 mt-1">
                                        {errors.sourceUrl}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label>
                                    Response Content
                                    <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="mt-2 bg-card text-card-foreground"
                                    placeholder="Enter the response content..."
                                    rows={3}
                                />
                            </div>
                            <AttachmentQueue />
                            <Separator />

                            <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                    <Button
                                        variant="outline"
                                        onClick={handleClose}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={Boolean(
                                        isSubmitting ||
                                            !formData.respondentId ||
                                            !formData.title ||
                                            !formData.description ||
                                            !formData.sourceType ||
                                            !date ||
                                            (formData.sourceUrl &&
                                                !isValidUrl(
                                                    formData.sourceUrl,
                                                )),
                                    )}>
                                    {mode === 'edit'
                                        ? 'Update Response'
                                        : 'Add Response'}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
