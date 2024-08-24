import {useState} from 'react';

function ActualInputBox({setClicked}: {setClicked: (x: boolean) => void}) {
    return (
        <div className="w-full border bg-white rounded-lg">
            <textarea className="w-full p-4 rounded-lg focus:border-black focus:outline-none" />
            <div className="flex gap-2 justify-end p-2">
                <p
                    className="p-2 border bg-none rounded-full text-sm cursor-pointer px-4"
                    onClick={() => {
                        setClicked(false);
                    }}>
                    Cancel
                </p>
                <p className="p-2 border bg-green-600 text-white rounded-full text-sm cursor-pointer px-4">
                    Comment
                </p>
            </div>
        </div>
    );
}

function FakeInputBox() {
    return (
        <div className="border rounded-full w-full p-3 my-4 cursor-pointer">
            Add a comment
        </div>
    );
}

export default function RootInputBox() {
    const [clicked, setClicked] = useState(false);

    return (
        <>
            {clicked ? (
                <ActualInputBox setClicked={setClicked} />
            ) : (
                <div
                    onClick={() => {
                        setClicked(true);
                    }}>
                    <FakeInputBox />
                </div>
            )}
        </>
    );
}
