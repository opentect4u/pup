const TableHeader = ({ curentPage }) => {
    if (curentPage === 'FundRelView') {
      return (
        <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th className="px-4 py-3">Project ID</th>
            <th className="px-4 py-3">Schematic Name</th>
            <th className="px-4 py-3">Sector Name</th>
            <th className="px-4 py-3">Financial Year</th>
            <th className="px-4 py-3">District</th>
            <th className="px-4 py-3">Block</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
      );
    }
  
    if (curentPage === 'TFView') {
      return (
        <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
        <tr>
        <th className="px-4 py-3">Project ID</th>
        <th className="px-4 py-3">Schematic Name</th>
        <th className="px-4 py-3">Sector Name</th>
        <th className="px-4 py-3">Financial Year</th>
        <th className="px-4 py-3">District</th>
        <th className="px-4 py-3">Block</th>
        <th className="px-4 py-3">Actions</th>
        </tr>
        </thead>
      );
    }
   
  
    return null; // Default case if no condition matches
  };
  
  export default TableHeader;
  