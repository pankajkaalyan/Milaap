import React, { useMemo } from 'react';

interface ChartData {
    day: string;
    count: number;
}

interface AnalyticsChartProps {
    data: ChartData[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.count), 0), [data]);
    const yAxisSteps = 5;

    return (
        <div className="w-full h-full flex flex-col p-4 text-gray-400 text-xs">
            <div className="flex-grow flex items-end space-x-[2%]">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 h-full flex flex-col-reverse items-center group">
                        <span className="mt-1">{item.day}</span>
                        <div 
                            className="w-full bg-gradient-to-t from-amber-600 to-orange-500 rounded-t-md transition-all duration-300 ease-in-out relative"
                            style={{ height: `${(item.count / maxValue) * 100}%` }}
                        >
                             <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-600 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {item.count} users
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full border-t border-gray-700 mt-2" />
        </div>
    );
};

export default AnalyticsChart;