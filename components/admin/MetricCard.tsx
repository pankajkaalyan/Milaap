import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-black/20 backdrop-filter backdrop-blur-lg border border-white/10 rounded-xl p-5 flex items-center space-x-4 transform hover:-translate-y-1 transition-transform duration-300">
        <div className={`p-3 bg-white/10 rounded-lg ${color}`}>
            <div className="h-7 w-7">
                {icon}
            </div>
        </div>
        <div>
            <h4 className="text-sm text-gray-400 font-medium">{title}</h4>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
  );
};

export default MetricCard;