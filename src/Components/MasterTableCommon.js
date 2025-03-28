import { EditOutlined } from '@ant-design/icons';
import React from 'react';

function MasterTableCommon({
    currentTableData,
    currentPage,
    rowsPerPage,
    handleEdit,
    handlePageChange,
    totalPages,
    masterName,
    sectorDropList
}) {
    const masterFields = {
        sector: 'sector_desc',
        source: 'fund_type',
        implementing: 'agency_name',
        account: 'account_head',
        department: 'dept_name',
        designation: 'desig_name'
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-200">
                    <tr>
                        <th className="px-4 py-3">Sl.No.</th>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTableData.map((data, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                            <td className="px-4 py-3">{data?.[masterFields[masterName]]}</td>
                            <td className="px-4 py-3">
                                <button className="text-blue-700 border px-3 py-1.5 rounded-lg" onClick={() => handleEdit(data)}>
                                    <EditOutlined />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between p-4">
                <span className="text-sm text-gray-500">
                    Showing {(currentPage - 1) * rowsPerPage + 1} to {Math.min(currentPage * rowsPerPage, sectorDropList.length)} of {sectorDropList.length}
                </span>
                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => handlePageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MasterTableCommon;
