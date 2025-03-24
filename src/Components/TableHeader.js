const TableHeader = ({ curentPage }) => {

  const pageTree = {
    page_1: 'AdApView',
    page_2: 'TFView',
    page_3: 'PRView',
    page_4: 'FundRelView',
    page_5: 'FundExpView',
    page_6: 'UCView',
  }

  if (curentPage === pageTree.page_1) {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {/* <th className="px-4 py-3">Sl.No.</th> */}
          <th className="px-4 py-3">Project ID</th>
          <th className="px-4 py-3">Approval No</th>
          <th className="px-4 py-3">Date of Approval</th>
          <th className="px-4 py-3">Scheme Name</th>
          <th className="px-4 py-3">Sector</th>
          <th className="px-4 py-3">Actions</th>
        </tr>
      </thead>
    );
  }



  if (curentPage === pageTree.page_2) {
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

  if (curentPage === pageTree.page_3) {
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

  if (curentPage === pageTree.page_4) {
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

  if (curentPage === pageTree.page_5) {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700">
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

  if (curentPage === pageTree.page_6) {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-slate-200">
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
