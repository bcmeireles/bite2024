import React, { useEffect, useState } from 'react'
import Navbar from '../components/navbar/Navbar';
import background from '../background.svg';

interface StudyProps {
    unit: number;
}

interface Content {
    text: string;
    image: string;
}

const Study: React.FC<StudyProps> = ({ unit }) => {
    const [contentIndex, setContentIndex] = useState(0);
    const [contents, setContents] = useState<Content[]>([]);

    useEffect(() => {
        const fetchContents = async () => {
            try {
                const response = await fetch('http://localhost:5000/study/' + unit);

                if (!response.ok) {
                    throw new Error('Error fetching quizzes');
                }

                const data = await response.json();
                setContents(data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchContents();
    }, [unit]);

    const handleNext = () => {
        setContentIndex((prevIndex) => Math.min(prevIndex + 1, contents.length - 1));
    };

    const handlePrevious = () => {
        setContentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleQuiz = () => {
        window.location.href = `/quiz/${unit}`;
    };

    return (
        <div className="h-screen bg-white flex items-center justify-center px-6 relative">
            <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
            <div className="z-10 relative w-full max-w-2xl mx-auto">
                <Navbar selected={1} />
                <h1 className="text-center text-2xl mb-4">Unit {unit}</h1>
                {contents.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="text-center">
                            {contents[contentIndex].text}
                        </div>
                        <div className="flex justify-center">
                            <img src={contents[contentIndex].image} alt="Content" className="max-h-64" />
                        </div>
                        <div className="flex justify-center space-x-2">
                            {contentIndex > 0 && <button onClick={handlePrevious} className="bg-blue-500 text-white px-4 py-2 rounded">Previous</button>}
                            {contentIndex < contents.length - 1 && <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>}
                            {contentIndex === contents.length - 1 && <button onClick={handleQuiz} className="bg-green-500 text-white px-4 py-2 rounded">Take Quiz</button>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Study
