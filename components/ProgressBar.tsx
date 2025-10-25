
import React from 'react';

interface ProgressBarProps {
    value: number; // 0 to 100
    label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label }) => {
    const safeValue = Math.max(0, Math.min(100, value));

    return (
        <div>
            {label && <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                    className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${safeValue}%` }}
                ></div>
            </div>
            <p className="text-right text-xs text-gray-500 mt-1">{Math.round(safeValue)}% Complete</p>
        </div>
    );
};

export default ProgressBar;
