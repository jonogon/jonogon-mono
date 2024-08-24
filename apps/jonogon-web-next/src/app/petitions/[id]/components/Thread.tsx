import Comment from './Comment';
import RootInputBox from './RootInputBox';

export default function CommentThread() {
    return (
        <div className="mt-8">
            <p className="font-bold">344 comments</p>
            <RootInputBox />
            <div>
                <Comment />
                <Comment />
                <Comment />
            </div>
        </div>
    );
}
