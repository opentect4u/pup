import { DownloadOutlined, EditOutlined, EyeOutlined, FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from '@ant-design/icons';
import TDInputTemplate from './TDInputTemplate';
import { auth_key, folder_admin, url } from '../Assets/Addresses/BaseUrl';
import { FaExclamationTriangle, FaRunning } from 'react-icons/fa';
import BtnComp from './BtnComp';
import { Space, Switch } from 'antd';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Message } from './Message';



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
  date_ofCompletion,
  projectNotCompleted,
  fetchTableDataList_Fn }) => {

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
    page_10: 'ProjectStatusView',
  }

  const getDateStatus = (compDateStr, currentDateStr) => {
    const compDate = new Date(compDateStr);
    // const currentDate = new Date(currentDateStr);
    const currentDate = currentDateStr;

    // Set time to midnight to avoid partial day issues
    compDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const delta = Math.floor((compDate - currentDate) / msPerDay);

    if (delta < 0) {
      // return `<span>The Date is Over by ${Math.abs(delta)} day(s).</span>`;
      return <span className='overDate'>Date Over by {Math.abs(delta)} Day(s).</span>;
    } else if (delta > 0) {
      return <span className='notOverDate'>{delta} Day(s) Remaining.</span>;
    } else {
      return <span className='toProSubDate'>Today is Project Submission Day</span>;
    }
  };

  function formatMultiData(data) {
    const parts = data.split(',').map(part => part.trim());
    return parts.length === 1 ? parts[0] : parts[0] + '..';
  }

  const [switchState, setSwitchState] = useState('off');
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
      setUserDataLocalStore(JSON.parse(userData))
    } else {
      setUserDataLocalStore([])
    }

    if (data?.edit_flag == 'Y') {
      setSwitchState('on')
    }

    if (data?.edit_flag == 'N') {
      setSwitchState('off')
    }
  }, []);



  const sendUserEditAccess = async (checked, approval_no, project_id) => {
    console.log(checked, 'FormData_test', approval_no, 'gg', project_id);
    // setLoading(true); // Set loading state

    const formData = new FormData();

    if (curentPage === pageTree.page_1) {
      formData.append("operation_module", "AA"); //'AA', 'TD', 'FR','EXP','UC','PCR'
    }
    if (curentPage === pageTree.page_2) {
      formData.append("operation_module", "TD");
    }

    if (curentPage === pageTree.page_4) {
      formData.append("operation_module", "FR");
    }
    if (curentPage === pageTree.page_5) {
      formData.append("operation_module", "EXP");
    }
    if (curentPage === pageTree.page_6) {
      formData.append("operation_module", "UC");
    }
    if (curentPage === pageTree.page_7) {
      formData.append("operation_module", "PCR");
    }


    formData.append("project_id", project_id);
    formData.append("approval_no", approval_no);
    formData.append("operation_type", 'P');
    formData.append("edit_flag", checked ? 'Y' : 'N');
    formData.append("created_by", userDataLocalStore.user_id);
    console.log(formData, "FormData_test");

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Mdapi/editpermission`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );

      console.log(formData, "FormData_test", response);

      // setLoading(false);
      // Message("success", "Updated successfully.");
      fetchTableDataList_Fn()

    } catch (error) {
      Message("error", "Error Submitting Form");
      console.error("Error submitting form:", error);
    }
  }


  if (curentPage === pageTree.page_1) {
    return (

      <tr key={index} className="border-b dark:border-gray-700">

        <td className="px-4 py-3">{data?.project_id}</td>
        <td className="px-4 py-3">{data?.admin_approval_dt}</td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3 editOnOff">
          <Space direction="vertical">
            <Switch
              checked={switchState === 'on'}
              onChange={(checked) => {
                setSwitchState(checked ? 'on' : 'off')
                sendUserEditAccess(checked, data?.approval_no, data?.project_id)
              }}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={userDataLocalStore.user_type === 'S' ? false : true}
            />
          </Space>
        </td>
        <td className="px-4 py-3">
          {data?.edit_flag == 'Y' ? (
            <button
              type="button"
              className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => navigate(`/home/admin_approval/AdApcrud/${data?.approval_no}`)}
            >
              <EditOutlined />
            </button>
          ) : userDataLocalStore.user_type === 'S' ? (
            // You can render something specific here if needed
            <button
              type="button"
              className="text-blue-700 border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => navigate(`/home/admin_approval/AdApcrud/${data?.approval_no}`)}
            >
              <EditOutlined />
            </button>
          ) : (
            <button
              type="button"
              className="text-slate-700 cursor-not-allowed border border-slate-700 bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => { }}
            >
              <EditOutlined />
            </button>
          )}

        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_2) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">
        {/* {JSON.stringify(data, null, 2)} */}
        <td className="px-4 py-3">{data?.project_id} </td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3"> {formatMultiData(data?.dist_name != null ? data?.dist_name : '--')} </td>
        <td className="px-4 py-3">{formatMultiData(data.block_name != null ? data?.block_name : '--')}</td>
        <td className="px-4 py-3 editOnOff">
          <Space direction="vertical">
            <Switch
              checked={switchState === 'on'}
              onChange={(checked) => {
                setSwitchState(checked ? 'on' : 'off')
                sendUserEditAccess(checked, data?.approval_no, data?.project_id)
              }}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={userDataLocalStore.user_type === 'S' ? false : true}
            />
          </Space>
        </td>
        <td scope="row" className="px-4 py-3">
          {data?.edit_flag == 'Y' ? (
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
          ) : userDataLocalStore.user_type === 'S' ? (
            // You can render something specific here if needed
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
          ) : (
            <button
              type="button"
              className="text-slate-700 cursor-not-allowed border border-slate-700 bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => { }}
            >
              <EditOutlined />
            </button>
          )}

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
        <td className="px-4 py-3">{formatMultiData(data.dist_name != null ? data?.dist_name : '--')}</td>
        <td className="px-4 py-3">
          <div style={{ display: 'flex' }}>
            {formatMultiData(data.block_name != null ? data?.block_name : '--')}
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
        <td className="px-4 py-3">{formatMultiData(data.dist_name != null ? data?.dist_name : '--')}</td>
        <td className="px-4 py-3">{formatMultiData(data.block_name != null ? data?.block_name : '--')}</td>
        <td className="px-4 py-3 editOnOff">
          <Space direction="vertical">
            <Switch
              checked={switchState === 'on'}
              onChange={(checked) => {
                setSwitchState(checked ? 'on' : 'off')
                sendUserEditAccess(checked, data?.approval_no, data?.project_id)
              }}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={userDataLocalStore.user_type === 'S' ? false : true}
            />
          </Space>
        </td>
        <td className="px-4 py-3">
          {data?.edit_flag == 'Y' ? (
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
          ) : userDataLocalStore.user_type === 'S' ? (
            // You can render something specific here if needed
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
          ) : (
            <button
              type="button"
              className="text-slate-700 cursor-not-allowed border border-slate-700 bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => { }}
            >
              <EditOutlined />
            </button>
          )}

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
        <td className="px-4 py-3">{formatMultiData(data.dist_name != null ? data?.dist_name : '--')}</td>
        <td className="px-4 py-3">{formatMultiData(data.block_name != null ? data?.block_name : '--')}</td>
        <td className="px-4 py-3 editOnOff">
          <Space direction="vertical">
            <Switch
              checked={switchState === 'on'}
              onChange={(checked) => {
                setSwitchState(checked ? 'on' : 'off')
                sendUserEditAccess(checked, data?.approval_no, data?.project_id)
              }}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={userDataLocalStore.user_type === 'S' ? false : true}
            />
          </Space>
        </td>
        <td className="px-4 py-3">

          {data?.edit_flag === 'Y' ? (
            <button
              type="button"
              className="text-blue-700 border border-blue-700 hover:bg-blue-800 hover:text-white px-3 py-1.5 rounded-lg"
              onClick={() => navigate(`/home/fund_expense/fecrud/${data.approval_no}`, { state: { ...data, operation_status: 'edit' } })}
            >
              <EditOutlined />
            </button>
          ) : userDataLocalStore.user_type === 'S' ? (
            // You can render something specific here if needed
            <button
              type="button"
              className="text-blue-700 border border-blue-700 hover:bg-blue-800 hover:text-white px-3 py-1.5 rounded-lg"
              onClick={() => navigate(`/home/fund_expense/fecrud/${data.approval_no}`, { state: { ...data, operation_status: 'edit' } })}
            >
              <EditOutlined />
            </button>
          ) : (
            <button
              type="button"
              className="text-slate-700 cursor-not-allowed border border-slate-700 bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => { }}
            >
              <EditOutlined />
            </button>
          )}

        </td>
      </tr>
    );
  }

  if (curentPage === pageTree.page_6) {
    return (
      <tr key={index} className="border-b">
        {/* {JSON.stringify(data, null, 2)} */}
        <td className="px-4 py-3">{data?.project_id}</td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.sector_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">{formatMultiData(data.dist_name != null ? data?.dist_name : '--')}</td>
        <td className="px-4 py-3">{formatMultiData(data.block_name != null ? data?.block_name : '--')}</td>
        <td className="px-4 py-3 editOnOff">
          <Space direction="vertical">
            <Switch
              checked={switchState === 'on'}
              onChange={(checked) => {
                setSwitchState(checked ? 'on' : 'off')
                sendUserEditAccess(checked, data?.approval_no, data?.project_id)
              }}
              checkedChildren="ON"
              unCheckedChildren="OFF"
              disabled={userDataLocalStore.user_type === 'S' ? false : true}
            />
          </Space>
        </td>
        <td className="px-4 py-3">
        {data?.edit_flag === 'Y' ? (
        <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
        font-medium rounded-lg text-sm px-3 py-1.5"
        onClick={() => navigate(`/home/uc/uccrud/${data?.approval_no}`, {
        // state: { ...data, operation_status: 'edit' }
        })}
        >
        <EditOutlined />
        </button>
          ) : userDataLocalStore.user_type === 'S' ? (
            // You can render something specific here if needed
            <button type="button" className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
        font-medium rounded-lg text-sm px-3 py-1.5"
        onClick={() => navigate(`/home/uc/uccrud/${data?.approval_no}`, {
        // state: { ...data, operation_status: 'edit' }
        })}
        >
        <EditOutlined />
        </button>
          ) : (
            <button
              type="button"
              className="text-slate-700 cursor-not-allowed border border-slate-700 bg-slate-300 focus:ring-4 focus:outline-none focus:ring-slate-300 font-medium rounded-lg text-sm px-3 py-1.5"
              onClick={() => { }}
            >
              <EditOutlined />
            </button>
          )}
          
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
        <td className="px-4 py-3" style={{ width: 250 }}>

          {data?.upload_status == 0 && (
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
                <button onClick={() => { handleUpload(data?.approval_no) }} className="downloadXL mt-3" style={{ marginRight: 0 }}
                >Upload </button>
              )}
            </div>
          )}

          {data?.upload_status == 1 && (
            <div style={{ color: '#3eb8bd', fontWeight: 600 }}>PDF Already Uploaded</div>
          )}


        </td>
        <td className="px-4 py-3">
          {data?.upload_status == 1 && (
            <>
              {/* <button onClick={() => { download('pcr', data?.pcr_certificate) }}><FilePdfOutlined style={{ fontSize: 22, color:"#3EB8BD"}} /></button> */}
              <a href={url + PDFfolder_name + data?.pcr_certificate} target='_blank'><FilePdfOutlined style={{ fontSize: 22, color: "#3EB8BD" }} /></a>
            </>
          )}

          {data?.upload_status == 0 && (
            <button ><FilePdfOutlined style={{ fontSize: 22, color: "#ccc" }} /></button>
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
        <td className="px-4 py-3">{data?.project_id} {JSON.stringify(data, null, 2)}</td>
        <td className="px-4 py-3">{data?.scheme_name}</td>
        <td className="px-4 py-3">{data?.fin_year}</td>
        <td className="px-4 py-3">
          <button onClick={() => { printData(data?.approval_no, data?.sl_no) }} className="downloadXL"><PrinterOutlined /> Print</button>
        </td>
        {/* <td className="px-4 py-3">
          <button onClick={() => { navigate('/home/annex/annex-add/0', {
          state: { operation_status: 'add', approval_no_url: data?.sl_no },
          })}} className="downloadXL"> Add Annexure</button>
          
        </td> */}
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

  if (curentPage === pageTree.page_10) {
    return (
      <tr key={index} className="border-b dark:border-gray-700">

        <td className="px-4 py-3">{data.project_id}</td>
        <td className="px-4 py-3">{data.scheme_name}</td>
        <td className="px-4 py-3">{data.sector_name}</td>
        <td className="px-4 py-3">{data.comp_date_apprx}</td>
        <td className="px-4 py-3">{formatMultiData(data.dist_name != null ? data?.dist_name : '--')}</td>
        <td className="px-4 py-3">
          <div style={{ display: 'flex' }}>
            {formatMultiData(data.block_name != null ? data?.block_name : '--')}
          </div>
        </td>
        {projectNotCompleted == true && (
          <td className="px-4 py-3">
            {getDateStatus(data.comp_date_apprx, new Date())}
          </td>
        )}
        {/* <td className="px-4 py-3">
          <button
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 
        focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center 
        me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
        dark:focus:ring-blue-800"
            onClick={() => {
              navigate(`/home/project-status/prostatus-details/${data.approval_no}`, {
                state: { ...data, operation_status: 'edit' },
              });
            }}
          >
            <EyeOutlined />
          </button>
        </td> */}
      </tr>
    );
  }

  return null; // Default case if no condition matches

};

export default TableRow;

