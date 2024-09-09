import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { TrashIcon } from '@radix-ui/react-icons';

interface PetitionFileUploaderProps {
  label: string;
  banglaLabel: string;
  fileType: 'image' | 'file';
  files: any;
  onAttachmentsChange: (attachment: { type: 'image' | 'file', file: File }) => void;
  removeAttachment: (attachment: { petition_id: number, attachment_id: number }) => void;
  petitionId: number;
}

export default function PetitionFileUploader(
  {
    label,
    banglaLabel,
    fileType,
    files,
    onAttachmentsChange,
    removeAttachment,
    petitionId,
    }: PetitionFileUploaderProps) {
    const [attachmentQueue, setAttachmentQueue] = useState<
    {
      type: 'image' | 'file';
      file: File;
    }[]
    >([]);
  
  useEffect(() => {
    setAttachmentQueue((queue) => {
      const newFilesCount = files.filter((file: any) => file.type === fileType).length;
      const itemsToKeep = queue.length - newFilesCount;
      return queue.slice(0, Math.max(0, itemsToKeep));
    });
  }, [files, fileType]);

  const onAttachmentUpload = ((files: File[]) => {
    const newQueue = [
      ...attachmentQueue,
      ...files.map((file) => ({
        type: fileType as 'image' | 'file',
        file: file,
      })),
    ];
    setAttachmentQueue(newQueue);
    newQueue.forEach(item => onAttachmentsChange(item));
  });
  
  const fileLink = (url: string) => {
    return url?.replace(
      '$CORE_HOSTNAME',
      window.location.hostname,
    );
  }
  
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={fileType} className={'max-w-max cursor-pointer'}>
        <div className={'font-bold text-lg'}>
          {label} {' '}
          <span
            className={'font-light italic text-stone-600'}>
            (optional)
          </span>
        </div>
        <span className={'text-stone-500'}>
          কিছু {banglaLabel} upload করতে পারেন
        </span>
      </Label>
      <div className={'flex flex-row flex-wrap gap-2'}>
        <Label htmlFor={fileType}
          className={
            'flex justify-center items-center border-4 w-24 h-20 rounded-lg relative bg-card hover:bg-card/30 cursor-pointer'
          }>
          <span
            className={
              'text-5xl text-stone-400 drop-shadow-sm'
            }>
            +
          </span>
          <input
            id={fileType}
            type={'file'}
            multiple
            accept={fileType === 'image' ? 'image/*': 'application/pdf, application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            className={'hidden'}
            onChange={(ev) => {
              const files = ev.target.files;
              if (files) {
                onAttachmentUpload(Array.from(files))
                ev.target.value = '';
              };
            }}
          />
        </Label>

        {attachmentQueue
          .map((_, i) => (
            <div
              key={i}
              className={
                'flex justify-center items-center border-4 w-24 h-20 rounded-lg'
              }>
              <div
                className={
                  'animate-spin border-4 border-b-transparent border-l-transparent border-red-500 w-8 h-8 rounded-full'
                }></div>
            </div>
          ))}

        {files
          .filter((file: any) => file.type === fileType)
          .map((file: any) => (
            <div
              key={file.id}
              className={
                `flex justify-center items-center border-4 w-24 h-20 rounded-lg relative ${file.type === 'image' ? 'bg-black' : 'bg-white'}`
              }
            >
              {file.type === 'image' ? (
                <img
                  src={fileLink(file.thumbnail)}
                  alt={file.filename}
                  className={
                    'w-full h-full object-contain object-center'
                  }
                />
              ) : (
                <a
                  href={fileLink(file.attachment)}
                  target="_blank"
                  className={
                    'flex h-full'
                  }
                >
                  <span className={'text-xs w-75 text-blue-400 break-all p-1'}>
                    {file.filename.length > 22
                      ? file.filename.substring(0, 22) + '...'
                      : file.filename}
                  </span>
                  <span className={'text-xs text-blue-950 absolute bottom-1 left-1 bg-slate-300 rounded-md px-1'}>
                    {file.filename.substring(file.filename.lastIndexOf('.') + 1).toUpperCase()}
                  </span>
                </a>
              )}
              <button
                className={
                  'absolute bottom-1 right-1 bg-red-500/90 text-sm hover:bg-red-600 p-2 rounded-md'
                }
                onClick={() =>
                  removeAttachment(
                    {
                      petition_id: Number(petitionId ?? '0'),
                      attachment_id: Number(file.id)
                    }
                  )
                }>
                <TrashIcon />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
