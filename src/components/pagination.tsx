import React, { useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
}) => {
  const [goToPage, setGoToPage] = useState('');

  const handleGoToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNumber = parseInt(goToPage);
    
    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setGoToPage(''); 
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setGoToPage(value);
    }
  };

  // don't show pagination if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  return (
   <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
  {/* Previous Button */}
  <button
    onClick={() => onPageChange(currentPage - 1)}
    disabled={currentPage === 1 || isLoading}
    className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
  >
    ← Previous
  </button>

  {/* Page Info + Go To Form */}
  <div className="flex flex-col sm:flex-row items-center gap-4">
    <span className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
      Page {currentPage} of {totalPages}
    </span>

    <form onSubmit={handleGoToPage} className="flex items-center gap-2">
      <label htmlFor="goToPage" className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
        Go to:
      </label>
      <input
        id="goToPage"
        type="text"
        value={goToPage}
        onChange={handleInputChange}
        placeholder="Page #"
        disabled={isLoading}
        className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 transition-colors"
      />
      <button
        type="submit"
        disabled={isLoading || !goToPage}
        className="px-3 py-1 text-sm bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
      >
        Go
      </button>
    </form>
  </div>

  <button
    onClick={() => onPageChange(currentPage + 1)}
    disabled={currentPage === totalPages || isLoading}
    className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
  >
    Next →
  </button>
</div>

  );
};

export default Pagination;