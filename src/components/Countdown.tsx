import React, { useEffect, useState } from "react";

interface CountdownProps {
    endTime: Date; // The end time as a Date object
}

const Countdown: React.FC<CountdownProps> = ({ endTime }) => {
    const calculateTimeLeft = (endTime: Date) => {
        const difference = endTime.getTime() - new Date().getTime();

        if (difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(endTime));

    useEffect(() => {
        // Calculate time to next full second
        const now = new Date();
        const msToNextSecond = 1000 - now.getMilliseconds();

        // Start the timer at the next full second
        const timeout = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(endTime));

            // After the first timeout, use regular 1-second intervals
            const interval = setInterval(() => {
                setTimeLeft(calculateTimeLeft(endTime));
            }, 1000);

            // Cleanup: Clear the interval on unmount
            return () => clearInterval(interval);
        }, msToNextSecond);

        // Cleanup: Clear the initial timeout on unmount
        return () => clearTimeout(timeout);
    }, [endTime]);

    return (
        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": timeLeft.days } as React.CSSProperties}></span>
                </span>
                days
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": timeLeft.hours } as React.CSSProperties}></span>
                </span>
                hours
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": timeLeft.minutes } as React.CSSProperties}></span>
                </span>
                min
            </div>
            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-5xl">
                    <span style={{ "--value": timeLeft.seconds } as React.CSSProperties}></span>
                </span>
                sec
            </div>
        </div>
    );
};

export default Countdown;
