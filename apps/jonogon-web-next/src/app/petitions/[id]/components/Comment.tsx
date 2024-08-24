import InputBox from './InputBox';
import Reply from './Reply';
import {GoReply} from 'react-icons/go';
import {AiOutlineLike} from 'react-icons/ai';
import {useEffect, useRef, useState} from 'react';
import {GoTriangleUp} from 'react-icons/go';

export default function Comment() {
    const [inputOpened, setInputOpened] = useState(false);
    const [replyInputOpened, setReplyInputOpened] = useState(false);
    const [replyBtnSignal, setReplyBtnSignal] = useState(false); // dis some weird hacking to do dependency inversion magic lol

    return (
        <div className="flex flex-col my-2 p-2 gap-1">
            <div className="flex flex-row gap-1 items-center">
                <div className="w-8 h-8 rounded-full bg-gray-200 border"></div>
                <div className="flex flex-row gap-1 items-center">
                    <p>@arafat</p>
                </div>
            </div>
            <p className="">@imtiaz wdym could u elaborate that more?</p>
            <div className="flex flex-row text-sm justify-between items-center">
                <div className="flex flex-row gap-2">
                    <p>23 replies</p>
                    <p>77 likes</p>
                </div>
                <div className="flex flex-row gap-3 items-center justify-center h-full">
                    <p className="flex flex-row gap-1 items-center cursor-pointer">
                        <AiOutlineLike size={16} />
                        Like
                    </p>

                    <p
                        className="flex flex-row gap-1 items-center cursor-pointer"
                        onClick={() => {
                            setInputOpened(true);
                            setReplyBtnSignal(!replyBtnSignal);
                            console.log('clicked on reply btn');
                        }}>
                        <GoReply />
                        Reply
                    </p>
                    <p className="flex flex-row items-center cursor-pointer">
                        <GoTriangleUp size={24} />
                        Hide
                    </p>
                </div>
            </div>
            {inputOpened && (
                <div>
                    <InputBox
                        replyBtnSignal={replyBtnSignal}
                        setInputOpened={setInputOpened}
                        tag={'@arafat '}
                    />
                </div>
            )}

            <div>
                <div className="ml-3 pl-6 mt-2 border-l">
                    <Reply
                        setInputOpen={setReplyInputOpened}
                        replyBtnSignal={replyBtnSignal}
                        setReplyBtnSignal={setReplyBtnSignal}
                    />
                    <Reply
                        setInputOpen={setReplyInputOpened}
                        replyBtnSignal={replyBtnSignal}
                        setReplyBtnSignal={setReplyBtnSignal}
                    />
                    <Reply
                        setInputOpen={setReplyInputOpened}
                        replyBtnSignal={replyBtnSignal}
                        setReplyBtnSignal={setReplyBtnSignal}
                    />
                    <Reply
                        setInputOpen={setReplyInputOpened}
                        replyBtnSignal={replyBtnSignal}
                        setReplyBtnSignal={setReplyBtnSignal}
                    />
                    <Reply
                        setInputOpen={setReplyInputOpened}
                        replyBtnSignal={replyBtnSignal}
                        setReplyBtnSignal={setReplyBtnSignal}
                    />
                    <Reply
                        setInputOpen={setReplyInputOpened}
                        replyBtnSignal={replyBtnSignal}
                        setReplyBtnSignal={setReplyBtnSignal}
                    />
                </div>
                {/* <div className={`${replyInputOpened ? '' : 'hidden'}`}>
                    <InputBox />
                </div> */}
                <div>
                    {replyInputOpened && (
                        <InputBox
                            setInputOpened={setReplyInputOpened}
                            replyBtnSignal={replyBtnSignal}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
