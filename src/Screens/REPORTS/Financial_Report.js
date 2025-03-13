import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, folder_tender, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import { Select, Spin } from "antd";
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
// import { Tooltip } from 'react-tooltip'
import { Tooltip as ReactTooltip } from "react-tooltip";

const initialValues = {
  fin_yr: '',
};



const validationSchema = Yup.object({
  fin_yr: Yup.string().required('Financial Year is Required'),
});


function Financial_Report() {
  const [loading, setLoading] = useState(false);
  const [editingAccountHead, setEditingAccountHead] = useState(null); // New state for editing
  const [fundStatus, setFundStatus] = useState(() => []);
  const [reportData, setReportData] = useState(() => []);
  const toast = useRef(null)
  const [financialYearDropList, setFinancialYearDropList] = useState([]);

  const [currentPage, setCurrentPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(10)

  const [showBlockName, setShowBlockName] = useState(false);
  const [showSourceOfFund, setShowSourceOfFund] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  


  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/fin_year',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data:", response.data.message); // Log the actual response data
      setFinancialYearDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };

  const fundAddedList = async () => {
    setLoading(true); // Set loading state
    
    
    const formData = new FormData();
    formData.append("approval_no", 2);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Fund/get_added_fund_list`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );

      console.log("approvalNoapprovalNoapprovalNoapprovalNo", response?.data);

      if(response.data.status > 0){
        setFundStatus(response?.data?.message)
        // setFolderName(response.data.folder_name)
        setLoading(false);
        // setShowForm(true);
      }

      if(response.data.status < 1){
        setFundStatus([])
        setLoading(false);
        // setShowForm(false);
      }
      // setLoading(false);
      // Message("success", "Updated successfully.");
      // navigate(`/home/fund_release`);
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };

  useEffect(()=>{
        fundAddedList()
        fetchFinancialYeardownOption()
    }, [])


const onPageChange = (event) => {
		setCurrentPage(event.first)
		setRowsPerPage(event.rows)
	}

  const showReport = async ()=>{
    setLoading(true);
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("fin_year", formik.values.fin_yr);
    console.log(formData, 'formData');

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Report/proj_dtl_finyearwise`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );

      console.log(response?.data?.message, 'xxxxxxxxxxxxxxxx', formData);
      
      if(response?.data?.status > 0){
        setLoading(false);
        setReportData(response?.data?.message)
        // setShowForm(true);
      }

      if(response?.data?.status < 1){
        setLoading(false);
        setReportData([])
      }
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }
    

  }

  const onSubmit = (values) => {
      // console.log(values, 'credcredcredcredcred', formik.values.scheme_name);
      showReport()
      
    };
  
    const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

    const handleShowAllChange = () => {
      const newValue = !showAll;
      setShowAll(newValue);
      setShowBlockName(newValue);
      setShowSourceOfFund(newValue);
    };
  


  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          {/* <div className="col-span-1"> */}
            <Heading title={editingAccountHead ? "Edit Account Head" : "Add Account Head"} button="N" />

            <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          <div class="sm:col-span-4">
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Financial Year</label>
              <Select
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                  console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Financial Year </Select.Option>
                {financialYearDropList?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.fin_year}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.fin_yr && formik.touched.fin_yr && (
                <VError title={formik.errors.fin_yr} />
              )}
            </div>

            <div className="sm:col-span-8 flex justify-left gap-4 mt-6">
            <BtnComp type={'submit'} title={'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
              <BtnComp title={'Reset'} type="reset" 
              onClick={() => { 
                formik.resetForm();
              }}
              width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
              {/* <button type="submit">Search</button> */}
             
            </div>
          </div>

        </form>
        {/* {JSON.stringify(reportData.length, null, 2)} */}
           <Spin
                      indicator={<LoadingOutlined spin />}
                      size="large"
                      className="text-gray-500 dark:text-gray-400"
                      spinning={loading}
                    >
                    {/*  */}
                      <>
                      <Toast ref={toast} />
           <div className="table_cus">
            {reportData.length > 0 &&(
            <div className="mb-4">
            <label>
            <input 
            type="checkbox" 
            checked={showAll} 
            onChange={handleShowAllChange} 
            /> Show All
            </label>
            <label>
            <input 
            type="checkbox" 
            checked={showBlockName} 
            onChange={() => setShowBlockName(!showBlockName)} 
            /> Show Block Name
            </label>
            <label className="ml-4">
            <input 
            type="checkbox" 
            checked={showSourceOfFund} 
            onChange={() => setShowSourceOfFund(!showSourceOfFund)} 
            /> Show Source of Fund
            </label>
            </div>
            )}

          <DataTable
          value={reportData?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          paginator
          rows={rowsPerPage }
          first={currentPage}
          onPage={onPageChange}
          rowsPerPageOptions={[5, 10, 20]} // Add options for number of rows per page
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
            Total: 
            </span>
            }
          ></Column>

          {/* <Column
          field="project_id"
          header="Project ID"
          ></Column> */}

          <Column
          field="project_id"
          header="Project ID"
          ></Column>

          <Column
          field="admin_approval_dt"
          header="Date of Administrative Approval"
          ></Column>

          <Column
          // field="scheme_name"
          header="Scheme Name"
          headerClassName="custom-scheme_name-header"
          bodyClassName="custom-scheme_name-body"
          body={(rowData) => {
            const maxWords = 4; // Set the word limit
            const words = rowData.scheme_name?.split(" ") || [];
            const truncatedText = words.length > maxWords ? words.slice(0, maxWords).join(" ") + "..." : rowData.scheme_name;
        
            return (
              <>
                <span
                  data-tooltip-id={`tooltip-${rowData.scheme_name}`} // Unique ID for tooltip
                  data-tooltip-content={rowData.scheme_name}
                  style={{ cursor: "pointer" }}
                >
                  {truncatedText}
                </span>
                <ReactTooltip id={`tooltip-${rowData.scheme_name}`} place="bottom" />
              </>
            );
          }}

          
          ></Column>


          <Column
          field="sector_name"
          header="Sector Name"
          ></Column>

          <Column
          field="fr_sch_amt"
          header="Schematic Amount"
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {reportData?.reduce((sum, item) => sum + (parseFloat(item?.fr_sch_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>

          <Column
          field="fr_cont_amt"
          header="Contigency Amount"
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {reportData?.reduce((sum, item) => sum + (parseFloat(item?.fr_cont_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>

          <Column
          field="head_account"
          header="Head Account"
          ></Column>

          <Column
          field="dist_name"
          header="District Name"
          ></Column>

          {/* <Column
          field="block_name"
          header="Block Name"
          ></Column>

          <Column
          field="source_of_fund"
          header="Source of Fund"
          ></Column> */}

          {/* Conditionally Rendered Columns */}
        {showBlockName && <Column field="block_name" header="Block Name" />}
        {showSourceOfFund && <Column field="source_of_fund" header="Source of Fund" />}




          {/*            
          <Column
          field="fin_year"
          header="Financial Year"
          ></Column>




          <Column
          field="agency_name"
          header="Agency Name"
          ></Column>

          <Column
          field="invite_auth"
          header="Tender Inviting Authority"
          ></Column>

          <Column
          field="mat_date"
          header="Tender Matured On"
          ></Column>

          <Column
          field="wo_date"
          header="Work Order Issued On"

          ></Column>

          <Column
          field="wo_copy"
          header="Work Order Copy"
          body={(rowData) => (
          <a href={url + folder_tender + rowData?.wo_copy} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column>

          <Column
          field="wo_value"
          header="Work Order Value"
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {reportData?.reduce((sum, item) => sum + (parseFloat(item?.wo_value) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>

          <Column
          field="comp_date_apprx"
          header="Complete Date Of Approx"
          ></Column>

          <Column
          field="fr_instl_amt"
          header="Fund Release Installment Amount "
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {reportData?.reduce((sum, item) => sum + (parseFloat(item?.fr_instl_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>



          <Column
          header="Expenditure Schematic Amount"
          body={(rowData) => (
          <>
          {rowData?.exp_sch_amt === null ? '--' : rowData?.exp_sch_amt}
          </>
          )}
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {reportData?.reduce((sum, item) => sum + (parseFloat(item?.exp_sch_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>

          <Column
          header="Expenditure Contigency Amount"
          body={(rowData) => (
          <>
          {rowData?.exp_cont_amt === null ? '--' : rowData?.exp_cont_amt}
          </>
          )}
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {reportData?.reduce((sum, item) => sum + (parseFloat(item?.exp_cont_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column> */}


          {/* <Column
          // field="instl_amt"
          header="Allotment Order No."
          body={(rowData) => (
          <a href={url + folderName + rowData?.allotment_no} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column> */}

          </DataTable>
           </div>
                      </>
                    {/* )} */}
           
                     </Spin>
          {/* </div> */}

          
        </div>
      </div>
    </section>
  );
}

export default Financial_Report;
