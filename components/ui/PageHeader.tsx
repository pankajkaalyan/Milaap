import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={`text-center ${className} mb-8`}>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4 animate-fade-in-down">
            {title}
        </h1>
        {subtitle && (
            <p className="max-w-3xl mx-auto text-lg text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {subtitle}
            </p>
        )}
    </div>
  );
};

export default PageHeader;