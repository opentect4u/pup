import { EyeOutlined } from '@ant-design/icons';

const TableRow = ({ index, data, navigate, curentPage }) => {

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
      <tr key={index} className="border-b dark:border-gray-700">
        {/* <td className="px-4 py-3">{(currentPage - 1) * rowsPerPage + index + 1} yyy</td> */}
        <td className="px-4 py-3">{data?.project_id}</td>
        <td className="px-4 py-3">{data?.approval_no}</td>
        <td className="px-4 py-3">{data?.admin_approval_dt}</td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
            onClick={() => navigate(`/home/admin_approval/AdApcrud/${data?.approval_no}`)}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_2) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data?.project_id} </td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">{data?.dist_name}</td>
        <td className="px-4 py-3">{data?.block_name}</td>
        <td scope="row" className="px-4 py-3">
          <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
  me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
  dark:focus:ring-blue-800"
            onClick={() => navigate(`/home/tender_formality/tfcrud/${data?.approval_no}`, {
              state: { ...data, operation_status: 'edit' },
            })}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }


  if (curentPage === pageTree.page_3) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data.project_id}</td>
        <td className="px-4 py-3">{data.scheme_name}</td>
        <td className="px-4 py-3">{data.sector_name}</td>
        <td className="px-4 py-3">{data.fin_year}</td>
        <td className="px-4 py-3">{data.dist_name}</td>
        <td className="px-4 py-3">{data.block_name}</td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
        me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
        dark:focus:ring-blue-800"
            onClick={() => {
              navigate(`/home/pr/prdetails/${data.approval_no}`, {
                state: { ...data, operation_status: 'edit' },
              });
            }}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }


  if (curentPage === pageTree.page_4) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data?.project_id}</td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">{data?.dist_name}</td>
        <td className="px-4 py-3">{data?.block_name}</td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
            onClick={() => navigate(`/home/fund_release/frcrud_test/${data?.approval_no}`, {
              state: { ...data, operation_status: 'edit' },
            })}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_5) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data.project_id}</td>
        <td className="px-4 py-3">{data.scheme_name}</td>
        <td className="px-4 py-3">{data.sector_name}</td>
        <td className="px-4 py-3">{data.fin_year}</td>
        <td className="px-4 py-3">{data.dist_name}</td>
        <td className="px-4 py-3">{data.block_name}</td>
        <td className="px-4 py-3">
          <button
            type="button"
            className="text-blue-700 border border-blue-700 hover:bg-blue-800 hover:text-white px-3 py-1.5 rounded-lg"
            onClick={() => navigate(`/home/fund_expense/fecrud/${data.approval_no}`, { state: { ...data, operation_status: 'edit' } })}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_6) {
    return (
      <tr key={index} className="border-b">
        <td className="px-4 py-3">{data?.project_id}</td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">{data?.dist_name}</td>
        <td className="px-4 py-3">{data?.block_name}</td>
        <td className="px-4 py-3">
          <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
                        font-medium rounded-lg text-sm px-3 py-1.5"
            onClick={() => navigate(`/home/uc/uccrud/${data?.approval_no}`, {
              // state: { ...data, operation_status: 'edit' }
            })}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }

  return null; // Default case if no condition matches

};

export default TableRow;

