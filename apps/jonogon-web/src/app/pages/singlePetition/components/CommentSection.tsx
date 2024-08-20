import {trpc} from '@/app/trpc';
import {useEffect, useState} from 'react';
import {useParams} from 'wouter';

interface CommentInterface {
    body: string;
}

interface InputPropInterface {
    comments: CommentInterface[];
    setComments: (x: CommentInterface[]) => void;
}

function InputBox({comments, setComments}: InputPropInterface) {
    const [inputBody, setInputBody] = useState('');

    const onEnter = () => {
        setComments([...comments, {body: inputBody}]);
        setInputBody('');
    };

    return (
        <div className="border p-2">
            <div className="flex flex-row gap-2">
                <input
                    className="w-3/4 p-4"
                    value={inputBody}
                    onChange={(event) => setInputBody(event.target.value)}
                />
                <button
                    className="border bg-white p-2 px-6 rounded flex-grow"
                    onClick={onEnter}>
                    Comment
                </button>
            </div>
        </div>
    );
}

function Comment({data}: {data: CommentInterface}) {
    const [comments, setComments] = useState<CommentInterface[]>([]);
    const [inputOpened, setInputOpened] = useState(false);
    const [childrenExpanded, setChildrenExpanded] = useState(true);

    return (
        <div className="border-l px-6 mt-2">
            <p>{data.body}</p>
            <div className="flex flex-row text-sm gap-4 cursor-pointer my-1">
                <p
                    onClick={() => {
                        setInputOpened(true);
                    }}>
                    reply
                </p>
                {!!comments.length &&
                    (childrenExpanded ? (
                        <p
                            onClick={() => {
                                setChildrenExpanded(false);
                            }}>
                            less
                        </p>
                    ) : (
                        <p
                            onClick={() => {
                                setChildrenExpanded(true);
                            }}>
                            more
                        </p>
                    ))}
            </div>

            {inputOpened && (
                <>
                    <InputBox comments={comments} setComments={setComments} />
                    <button
                        className="px-4 border rounded"
                        onClick={() => {
                            setInputOpened(false);
                        }}>
                        Cancel
                    </button>
                </>
            )}
            {childrenExpanded && (
                <div>
                    {comments.map((comment) => {
                        return <Comment data={comment} />;
                    })}
                </div>
            )}
        </div>
    );
}

export default function CommentSection() {
    const [comments, setComments] = useState([
        {
            body: 'hello',
        },
        {
            body: '2nd hello',
        },
        {
            body: '3rd hello',
        },
    ]);
    // fetch the comments and then do magic with them
    const {petition_id} = useParams();
    const {data} = trpc.comments.list.useQuery({
        petition_id: petition_id!!,
    });

    // // DO NOT COMMIT THIS. IT HAS ANY
    // const [comments, setComments] = useState<any[]>([]);

    // useEffect(() => {
    //     const nestedComments = data ?? [];

    //     setComments(nestedComments);
    // }, [data]);

    return (
        <>
            <div>
                <InputBox comments={comments} setComments={setComments} />
                {comments.map((comment) => {
                    return <Comment data={comment} />;
                })}
            </div>
        </>
    );
}
