import { DownloadOutlined, EditOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import TDInputTemplate from './TDInputTemplate';
import { folder_admin, url } from '../Assets/Addresses/BaseUrl';
import { FaExclamationTriangle, FaRunning } from 'react-icons/fa';



const TableRow = ({ 
  index,
  data,
  navigate,
  curentPage,
  handleChange,
  handleFileChange_pdf_1,
  handleUpload,
  printData,
  download,
  filePreview,
  errorpdf_1,
  PDFfolder_name,
  date_ofCompletion}) => {

  const pageTree = {
    page_1: 'AdApView',
    page_2: 'TFView',
    page_3: 'PRView',
    page_4: 'FundRelView',
    page_5: 'FundExpView',
    page_6: 'UCView',
    page_7: 'PCRView',
    page_8: 'UC_Generate',
    page_9: 'annexure',
  }

  var date_ofCompletion = new Date('2025-04-09');

  // const isPastCompletion = date_ofCompletion < new Date();

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
            <EditOutlined />
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
            <EditOutlined />
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
        <td className="px-4 py-3">
        <div style={{display:'flex'}}>
        {data.block_name} 
        {/* {new Date(data?.admin_approval_dt) > date_ofCompletion &&(
          <FaRunning className="text-red-600 animate-bounce text-xl ml-2" />
        ) } */}
        </div>
        </td>
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
            onClick={() => navigate(`/home/fund_release/frcrud/${data?.approval_no}`, {
              state: { ...data, operation_status: 'edit' },
            })}
          >
            <EditOutlined />
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
            <EditOutlined />
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
            <EditOutlined />
          </button>
        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_7) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data?.project_id} </td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">

          {/* <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
  me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
  dark:focus:ring-blue-800"
            onClick={() => alert('Under Development')}
          >
            <DownloadOutlined />
          </button> */}
          <button onClick={() => { printData(data?.approval_no) }} className="downloadXL"><PrinterOutlined /> Print</button>
        </td>
        <td className="px-4 py-3" style={{width:250}}>

        {data?.upload_status == 0 &&(
          <div class="flex flex-col">
          <div style={{ position: 'relative' }}>
            
            <TDInputTemplate
  type="file"
  name="admin_appr_pdf"
  // placeholder="Upload PDF"
  // label="Upload PDF"
  id={`file-input-${data?.approval_no}`}
  handleChange={(event) => handleFileChange_pdf_1(event, data?.approval_no)}
  mode={1}
/>

            

            {filePreview && (
              <a
                href={filePreview}
                target="_blank"
                rel="noopener noreferrer"
                style={{ position: "absolute", top: 16, right: 10 }}
              >
                <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
              </a>
            )}

            {errorpdf_1 && (
              <p style={{ color: "red", fontSize: 12 }}>{errorpdf_1}</p>
            )}

          </div>

          {filePreview && (
          <button onClick={()=>{handleUpload(data?.approval_no)}} className="downloadXL mt-3" style={{marginRight:0}}
          >Upload </button>
          )}
          </div>
        )}

{data?.upload_status == 1 &&(
          <div style={{color:'#3eb8bd', fontWeight:600}}>PDF Already Uploaded</div>
        )}

          
        </td>
        <td className="px-4 py-3">
          {data?.upload_status == 1 &&(
            <>
            {/* <button onClick={() => { download('pcr', data?.pcr_certificate) }}><FilePdfOutlined style={{ fontSize: 22, color:"#3EB8BD"}} /></button> */}
          <a href={url + PDFfolder_name + data?.pcr_certificate} target='_blank'><FilePdfOutlined style={{ fontSize: 22, color:"#3EB8BD"}} /></a>
          </>
          )}

          {data?.upload_status == 0 &&(
            <button ><FilePdfOutlined style={{ fontSize: 22, color:"#ccc"}} /></button>
          )}
          
        </td>

        <td scope="row" className="px-4 py-3">
          <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
  me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
  dark:focus:ring-blue-800"
            onClick={() => navigate(`/home/pcr/pcr-add/${data?.approval_no}`, {
              state: { ...data, operation_status: 'edit' },
            })}
          >
            <EyeOutlined />
          </button>
        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_8) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data?.project_id} </td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">
          <button onClick={() => { printData(data?.approval_no, data?.sl_no) }} className="downloadXL"><PrinterOutlined /> Print</button>
        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_9) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        <td className="px-4 py-3">{data?.admin_approval_no} </td>
        <td className="px-4 py-3">{data?.scheme}</td>
        <td className="px-4 py-3">{data?.district}</td>
        <td className="px-4 py-3">
          <button onClick={() => { printData(data?.approval_no, data?.sl_no) }} className="downloadXL"><PrinterOutlined /> Print</button>
        </td>
      </tr>
    );
  }

  return null; // Default case if no condition matches

};

export default TableRow;

