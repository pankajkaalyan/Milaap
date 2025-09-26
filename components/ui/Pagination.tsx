import React from 'react';
import { useAppContext } from '../../hooks/useAppContext';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  paginationGroup: number[];
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, paginationGroup }) => {
  const { t } = useAppContext();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
      <span className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </span>
      <nav className="flex items-center space-x-1">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('admin.users.table.first')}
        </button>
        <button onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('admin.users.table.prev')}
        </button>
        
        {paginationGroup[0] > 1 && <span className="p-2">...</span>}

        {paginationGroup.map(item => (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={`p-2 rounded-md w-9 h-9 flex items-center justify-center ${currentPage === item ? 'bg-pink-600 text-white' : 'hover:bg-white/10'}`}
          >
            {item}
          </button>
        ))}

        {paginationGroup[paginationGroup.length - 1] < totalPages && <span className="p-2">...</span>}

        <button onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('admin.users.table.next')}
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('admin.users.table.last')}
        </button>
      </nav>
    </div>
  );
};

export default Pagination;