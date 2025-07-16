import * as React from 'react';
import { FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

interface CarBodyStatusProps {
    status: number; // 0 (fully damaged) to 100 (fully intact)
}

const CarBodyStatus: React.FC<CarBodyStatusProps> = ({ status }) => {
    // start “full” on mount, then animate to `status`
    const [progress, setProgress] = React.useState(100);

    React.useEffect(() => {
        // give the first render a tick so the browser paints width:100%,
        // then (in the next frame) we switch to your real value:
        const id = window.requestAnimationFrame(() => {
            setProgress(status);
        });
        return () => window.cancelAnimationFrame(id);
    }, [status]);

    const progressColor =
        status > 75 ? 'bg-green-500'
            : status > 40 ? 'bg-yellow-500'
                : 'bg-red-500';

    const Icon = status > 75 ? FiCheckCircle : FiAlertTriangle;
    const progressIconColor =
        status > 75 ? 'fill-green-500'
            : status > 40 ? 'fill-yellow-500'
                : 'fill-red-500';

    return (
        <div style={{ direction: 'ltr' }} className="flex items-center gap-2 w-full max-w-md">
            <div className="relative w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            <Icon className={`h-6 w-6 ${progressIconColor}`} />
        </div>
    );
};

export default CarBodyStatus;
