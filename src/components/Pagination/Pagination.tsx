import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react'

type Props = {
    currentPage: number;
    onChangePage: (page: number) => void;
    totalPages: number;
    rowsPerPage: number;
    onChangeRowsPerPage: (numRows: number) => void;
}

export default function Pagination({ currentPage, onChangePage, totalPages, rowsPerPage, onChangeRowsPerPage }: Props) {

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl shadow-lg mt-6">
            <div className="flex items-center text-sm text-gray-700">
                <span>Rows per page</span>
                <select
                    value={rowsPerPage}
                    onChange={(e) => onChangeRowsPerPage(Number(e.target.value))}
                    className="ml-2 p-1 border border-gray-300 rounded-md bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <div className='flex items-center text-sm text-gray-700'>
                <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                </div>

                {/* Pagination Controls */}
                <div className="flex space-x-1">
                    <button
                        onClick={() => onChangePage(1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="First Page"
                    >
                        <ChevronsLeft size={18} />
                    </button>
                    <button
                        onClick={() => onChangePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Previous Page"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => onChangePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Next Page"
                    >
                        <ChevronRight size={18} />
                    </button>
                    <button
                        onClick={() => onChangePage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Last Page"
                    >
                        <ChevronsRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}