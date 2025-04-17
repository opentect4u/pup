import React, { useEffect, useRef, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';
import { FilePdfOutlined, LoadingOutlined, CalendarOutlined, EditOutlined } from '@ant-design/icons';
import { Select, Spin, Flex, Progress } from 'antd';
import { FaMapMarker } from "react-icons/fa";
import { Image } from 'antd';
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"


const initialValues = {
  receipt_first: '',
  allotment_order_no: '',
  allotment_order_date: '',
  al1_pdf: '',
  sch_amt_one: '',
  cont_amt_one: '',
  tot_amt: '',
  isntl_date: '',
};



const validationSchema = Yup.object({
  receipt_first: Yup.string().required('Receipt is Required'),
  allotment_order_no: Yup.string().required('Allotment Order No. is Required'),
  allotment_order_date: Yup.string().required('Allotment Order Date is Required'),
  al1_pdf: Yup.string().required('Upload Allotment Order is Required'),
  sch_amt_one: Yup.string().required('Schematic Amount is Required'),
  cont_amt_one: Yup.string().required('Contigency Amount is Required'),
  isntl_date: Yup.string().required('Installment Date is Required'),
  tot_amt: Yup.string(),
  // receipt_first: Yup.string(),
  // al1_pdf: Yup.string(),
  // sch_amt_one: Yup.string(),
  // cont_amt_one: Yup.string(),

});


function FundRelForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  // const operation_status = location.state?.operation_status || "add";
  // const receive_no = location.state?.receive_no || "";
  // const receive_date = location.state?.receive_date || "";
  const [operation_status, setOperation_status] = useState('');
  const [receive_no, setreceive_no] = useState('');
  const [receive_date, setreceive_date] = useState('');

  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  const [projectId, setProjectId] = useState([]);
  // const [getStatusData, setGetStatusData] = useState([]);
  const [getMsgData, setGetMsgData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [approvalNo, setApprovalNo] = useState('');
  const toast = useRef(null)
  const [filePreview_2, setFilePreview_2] = useState(null);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [errorpdf_1, setErrorpdf_1] = useState("");




    
    const fundAddedList = async (approvalNo_Para) => {
      setLoading(true); // Set loading state
      console.log(approvalNo, 'approvalNoapprovalNoapprovalNoapprovalNo');
      
      
      const formData = new FormData();
      formData.append("approval_no", approvalNo_Para);
  
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
          setFolderName(response.data.folder_name)
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

    const saveFormData = async () => {
      setLoading(true); // Set loading state

      console.log(approvalNo, 'approvalNoapprovalNoapprovalNoapprovalNo', '<<<<');
      
    
      const formData = new FormData();
  
      // // Append each field to FormData
      
      formData.append("instl_amt", formik.values.receipt_first);
      formData.append("allot_order_no", formik.values.allotment_order_no);
      formData.append("allot_order_dt", formik.values.allotment_order_date);
      formData.append("allotment_no", formik.values.al1_pdf); // Ensure this is a file if applicable
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("isntl_date", formik.values.isntl_date);

      formData.append("approval_no", approvalNo); //
      formData.append("created_by", userDataLocalStore.user_id);

    
      console.log("FormData:", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Fund/fund_add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );
    
        // setLoading(false);
        Message("success", "Updated successfully.");
        setLoading(false);
        // navigate(`/home/fund_release`);
        fundAddedList(approvalNo)
        formik.resetForm();
      } catch (error) {
        setLoading(false);
        Message("error", "Error..");
        console.error("Error submitting form:", error);
      }
  
    };

    const updateFormData = async () => {
      // setLoading(true); // Set loading state
  
    
      const formData = new FormData();
  
      
      formData.append("instl_amt", formik.values.receipt_first);

      formData.append("allot_order_no", formik.values.allotment_order_no);
      formData.append("allot_order_dt", formik.values.allotment_order_date);
      
      formData.append("allotment_no", formik.values.al1_pdf);  //////////
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      // formData.append("isntl_date", formik.values.isntl_date);
      formData.append("isntl_date", receive_date);

      formData.append("approval_no", params?.id);
      formData.append("receive_date", receive_date);
      formData.append("receive_no", receive_no);
      formData.append("modified_by", userDataLocalStore.user_id);

        // approval_no,
        // receive_no,
        // receive_date
        // modified_by

// instl_amt,
// isntl_date,
// allotment_no,
// sch_amt,
// cont_amt,


      // receipt_first: response?.data?.message?.instl_amt,
      // al1_pdf: response.data.message.allotment_no,
      // sch_amt_one: response.data.message.sch_amt,
      // cont_amt_one: response.data.message.cont_amt,
      // tot_amt: response.data.message.tender_notice,
      // isntl_date: response.data.message.receive_date,
  
    
      console.log("formDataformData", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Fund/fund_edit`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );
        console.log(response, 'response');
        
        // setLoading(false);
        Message("success", "Updated successfully.");
        // loadFormEditData(params?.id, receive_no, receive_date)
        // navigate(`/home/tender_formality`);
        setValues(initialValues)
        fundAddedList(params?.id)
  
        formik.resetForm();
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);
      }
  
    };

 const onSubmit = (values) => {
  if(errorpdf_1.length < 1){
    if(params?.id > 0){
      updateFormData()
    } else {
      saveFormData()
    }
  }
    
  };


  const fetchProjectId = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Admapi/get_approval_no',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if(response?.data?.status > 0){
      // fundAddedList()
      console.log("Response Data:", response?.data?.status); // Log the actual response data
      setProjectId(response.data.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };

  const loadFormData = async (project_id) => {
    // console.log(project_id, 'responsedata');
    setLoading(true); // Set loading state

    const formData = new FormData();

    formData.append("approval_no", project_id);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/progress_list',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response?.data, 'responsedata');
      
      if (response?.data.status > 0) {
        setLoading(false);
        setGetMsgData(response?.data?.message)
        
        // setGetStatusData(response?.data?.prog_img)
        // setFolderProgres(response?.data?.folder_name)

      }

      if (response?.data.status < 1) {
        setLoading(false);
        // setGetStatusData([])
        setGetMsgData([])
        // setShowForm(false);
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

  const loadFormEditData = async (approval_no, receive_no, receive_date) => {
    // console.log(project_id, 'responsedata');
    setLoading(true); // Set loading state

    setOperation_status('edit');
    setreceive_no(receive_no)
    setreceive_date(receive_date)

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append("receive_no", receive_no);
    formData.append("receive_date", receive_date);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Fund/fund_single_data',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      console.log(response?.data?.message, 'ffffffffffffffffff', formData);
      
      if (response?.data.status > 0) {
        setLoading(false);
        setValues({
          receipt_first: response?.data?.message?.instl_amt,
          allotment_order_no: response?.data?.message?.allot_order_no,
          allotment_order_date : response?.data?.message?.allot_order_dt,
          al1_pdf: response.data.message.allotment_no,
          sch_amt_one: response.data.message.sch_amt,
          cont_amt_one: response.data.message.cont_amt,
          tot_amt: response.data.message.tender_notice,
          isntl_date: response.data.message.receive_date,
        })
      }

      if (response?.data.status < 1) {
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };


  useEffect(()=>{

    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

    
    fetchProjectId()

  }, [])



  const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues: +params.id > 0 ? formValues : initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

  useEffect(() => {
    const schmAmt = parseFloat(formik.values.sch_amt_one) || 0;
    const contAmt = parseFloat(formik.values.cont_amt_one) || 0;
    const total = schmAmt + contAmt;
  
    formik.setFieldValue("tot_amt", total);
  }, [formik.values.sch_amt_one, formik.values.cont_amt_one]);

  useEffect(()=>{
    if(params?.id > 0){
      // loadFormEditData(params?.id, receive_no, receive_date)
      loadFormData(params?.id)
      fundAddedList(params?.id)
      setApprovalNo(params?.id)
      setShowForm(true);
    }
  }, [])

  
  
                const handleFileChange_pdf_1 = (event) => {

                  const file = event.target.files[0]; // Get the selected file
              
                  if (file) {
                    const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
                    const fileType = file.type; // Get file MIME type
              
                    // Check if file is a PDF
                    if (fileType !== "application/pdf") {
                      setErrorpdf_1("Only PDF files are allowed.");
                      return;
                    }
              
                    // Check if file size exceeds 20MB
                    if (fileSizeMB > 2) {
                      setErrorpdf_1("File size should not exceed 2MB.");
                      return;
                    }
              
                    setErrorpdf_1("");
                    console.log("File is valid:", file.name);
                    formik.setFieldValue("al1_pdf", file);
                    setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
                    // Proceed with file upload or further processing
                  }
                };
                            
    
  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">

      <Heading title={'Project Details'} button={'Y'} />
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-gray-500 dark:text-gray-400"
          spinning={loading}
        >

          
            <div class="grid gap-4 sm:grid-cols-12 sm:gap-6 mb-5">

              <div class="sm:col-span-4">
                

              {params?.id < 1 &&(
              <>
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project ID</label>
              <Select
              placeholder="Choose Project ID"
              onChange={(value) => {
              loadFormData(value)
              fundAddedList(value)
              setApprovalNo(value)
              setShowForm(true)
              }}
              style={{ width: "100%" }}
              >
              <Select.Option value="" disabled> Choose Project ID </Select.Option>
              {projectId.map(data => (
              <Select.Option key={data.approval_no} value={data.approval_no}>
              {data.project_id}
              </Select.Option>
              ))}
              </Select>
              </>

              )}
              {params?.id > 0 &&(
              <>
              {projectId.map((data) => (
              <div key={data.approval_no}>
              {data.approval_no === params?.id && (
              <>
              <TDInputTemplate
              type="text"
              label="Project ID"
              formControlName={data.project_id}
              mode={1}
              disabled={true}
              />
              </>
              )}
              </div>
              ))}

              </>
              )}

              </div>


              <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 -mb-2">
                {/* Progress Details */}
              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="date"
                  label="Date of administrative approval"
                  formControlName={getMsgData[0]?.admin_approval_dt ? getMsgData[0]?.admin_approval_dt : '0000-00-00'}
                  mode={1}
                  disabled={true}
                />
                

              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Enter scheme name"
                  formControlName={getMsgData[0]?.scheme_name ? getMsgData[0]?.scheme_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>
              <div class="sm:col-span-4">


                

                <TDInputTemplate
                  type="text"
                  label="Enter Sector name"
                  formControlName={getMsgData[0]?.sector_name ? getMsgData[0]?.sector_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

                {/* sectorDropList */}
                {/* {JSON.stringify(sectorDropList, null, 2)} */}


              </div>
              <div class="sm:col-span-4">
                

                <TDInputTemplate
                  type="text"
                  label="Financial Year"
                  formControlName={getMsgData[0]?.fin_year ? getMsgData[0]?.fin_year : '0000-00'}
                  mode={1}
                  disabled={true}
                />

              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Project implemented By"
                  formControlName={getMsgData[0]?.agency_name ? getMsgData[0]?.agency_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />
              </div>

              <div class="sm:col-span-4">

                
                <TDInputTemplate
                  type="text"
                  label="District"
                  formControlName={getMsgData[0]?.dist_name ? getMsgData[0]?.dist_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>
              <div class="sm:col-span-4">
                
                <TDInputTemplate
                  type="text"
                  label="Block"
                  formControlName={getMsgData[0]?.block_name ? getMsgData[0]?.block_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>

              <div class="sm:col-span-4">
                

              <TDInputTemplate
                  type="date"
                  label="Work Order Issued On"
                  formControlName={getMsgData[1]?.wo_date ? getMsgData[1]?.wo_date : '0000-00'}
                  mode={1}
                  disabled={true}
              />

              </div>
              

            </div>

          
        </Spin>

       
      <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
            {/* {JSON.stringify(fundStatus, null, 2)} */}

            
            

        {fundStatus?.length > 0 &&(
          <>
          <Heading title={"Fund Receipt History"} button={'N'}/>

          <Toast ref={toast} />

          <DataTable
          value={fundStatus?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >
          {/* <Column
          header="Sl No."
          body={(rowData) => (
          <span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
          )}
          ></Column> */}

          <Column
          field="receive_no"
          header="Installment Tenure"
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
            Total: 
            </span>
            }
          ></Column>

          <Column
          field="allot_order_no"
          header="Allotment Order No."
          ></Column>

          <Column
          field="allot_order_dt"
          header="Allotment Order Date"
          ></Column>

          <Column
          field="isntl_date"
          header="Installment Date"
          ></Column>

          <Column
          field="instl_amt"
          header="Receipt of Installment (Rs.)"
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {fundStatus?.reduce((sum, item) => sum + (parseFloat(item?.instl_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>
          <Column
          field="sch_amt"
          header="Schematic Amount"
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {fundStatus?.reduce((sum, item) => sum + (parseFloat(item?.sch_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>
          <Column
          field="cont_amt"
          header="Contigency Amount"
          footer={
          <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          {fundStatus?.reduce((sum, item) => sum + (parseFloat(item?.cont_amt) || 0), 0).toFixed(2)}
          </span>
          }
          ></Column>

          <Column
          field="cont_amt"
          header="Total Amount"
          body={(item) => (
            (parseFloat(item?.sch_amt) || 0) + (parseFloat(item?.cont_amt) || 0)
          )}
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
              {fundStatus?.reduce(
                (sum, item) =>
                  sum +
                  (parseFloat(item?.sch_amt) || 0) +
                  (parseFloat(item?.cont_amt) || 0),
                0
              ).toFixed(2)}
            </span>
          }

          ></Column>

          <Column
          // field="instl_amt"
          header="Upload Allotment Order"
          body={(rowData) => (
          <a href={url + folderName + rowData?.allotment_no} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column>

{params.id > 0 &&(
<Column
          field="comp_date_apprx"
          header="Action"
          body={(rowData) => (
            <a onClick={() => { loadFormEditData(params?.id, rowData.receive_no, rowData.isntl_date)}}><EditOutlined style={{fontSize:22, }} /></a>
            )}
          ></Column>
)}

          </DataTable>

        
          </>
        )}
        </Spin>

       {/* {JSON.stringify(approvalNo, null, 2)} ////////
       {JSON.stringify(showForm, null, 2)} */}
       {/* fundStatus.length < 4 &&  */}
       
       {showForm  &&(
        <>
       <Heading title={"Fund Release/Receipt Details"} button={'N'}/>

       {/* <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					> */}
       <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
            <div class="sm:col-span-3">
              <TDInputTemplate
                type="number"
                placeholder="Rs...."
                label={<>Receipt of Installment (Rs.)<span className="mandator_txt"> *</span></>}
                name="receipt_first"
                formControlName={formik.values.receipt_first}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.receipt_first && formik.touched.receipt_first && (
                <VError title={formik.errors.receipt_first} />
              )}
            </div>



            <div class="sm:col-span-3">
              <TDInputTemplate
                type="text"
                placeholder="Allotment Order No...."
                label={<>Allotment Order No.<span className="mandator_txt"> *</span></>}
                name="allotment_order_no"
                formControlName={formik.values.allotment_order_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.allotment_order_no && formik.touched.allotment_order_no && (
                <VError title={formik.errors.allotment_order_no} />
              )}
            </div>


            <div class="sm:col-span-3">
            <TDInputTemplate
                placeholder="Allotment Order Date goes here..."
                type="date"
                label={<>Allotment Order Date<span className="mandator_txt"> *</span></>}
                name="allotment_order_date"
                formControlName={formik.values.allotment_order_date}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                // disabled= {operation_status ==  'edit'? true : false}
              />
              {formik.errors.allotment_order_date && formik.touched.allotment_order_date && (
                <VError title={formik.errors.allotment_order_date} />
              )}
            </div>


          
            <div class="sm:col-span-3" style={{position:'relative'}}>
              <TDInputTemplate
              type="file"
              name="al1_pdf"
              placeholder="Upload Allotment Order"
              label={<>Upload Allotment Order (PDF Max Size 2 MB)<span className="mandator_txt"> *</span></>}
              // handleChange={(event) => {
              // formik.setFieldValue("al1_pdf", event.currentTarget.files[0]);
              // }}
              // handleChange={(event) => {
              //   const file = event.currentTarget.files[0];
              //   if (file) {
              //   formik.setFieldValue("al1_pdf", file);
              //   setFilePreview_2(URL.createObjectURL(file)); // Create a preview URL
              //   }
              // }}
              handleChange={(event) => {
                handleFileChange_pdf_1(event)
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

              {filePreview_2 && (
              <a href={filePreview_2} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
              <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
              </a>
              )}

              {formValues.al1_pdf != null &&(
              <>
              {filePreview_2 === null && (
              <a href={url + folderName + formValues.al1_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
              <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
              )}
              </>
              )}
              
              {formik.errors.al1_pdf && formik.touched.al1_pdf && (
                <VError title={formik.errors.al1_pdf} />
              )}
               {errorpdf_1 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_1}</p>}
            </div>
            <div class="sm:col-span-3">
              <TDInputTemplate
                placeholder="Schematic Amount"
                type="number"
                label={<>Schematic Amount<span className="mandator_txt"> *</span></>}
                name="sch_amt_one"
                formControlName={formik.values.sch_amt_one}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.sch_amt_one && formik.touched.sch_amt_one && (
                <VError title={formik.errors.sch_amt_one} />
              )}
            </div>
            <div class="sm:col-span-3">
              <TDInputTemplate
                 placeholder="Contigency Amount"
                 type="number"
                 label={<>Contigency Amount<span className="mandator_txt"> *</span></>}
                 name="cont_amt_one"
                 formControlName={formik.values.cont_amt_one}
                 handleChange={formik.handleChange}
                 handleBlur={formik.handleBlur}
                 mode={1}
              />
              {formik.errors.cont_amt_one && formik.touched.cont_amt_one && (
                <VError title={formik.errors.cont_amt_one} />
              )}
            </div>

            <div class="sm:col-span-3">
            <TDInputTemplate
                placeholder="Total amount goes here..."
                type="number"
                label="Total Amount"
                name="tot_amt"
                formControlName={formik.values.tot_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled= {true}
              />
              {formik.errors.tot_amt && formik.touched.tot_amt && (
                <VError title={formik.errors.tot_amt} />
              )}
            </div>

            <div class="sm:col-span-3">
            <TDInputTemplate
                placeholder="Installment Date goes here..."
                type="date"
                label={<>Installment Date<span className="mandator_txt"> *</span></>}
                name="isntl_date"
                formControlName={formik.values.isntl_date}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled= {operation_status ==  'edit'? true : false}
              />
              {formik.errors.isntl_date && formik.touched.isntl_date && (
                <VError title={formik.errors.isntl_date} />
              )}
            </div>

            <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
         {/* <BtnComp title={'Reset'} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'}/>
         <BtnComp title={'Submit'} width={'w-1/6'} bgColor={'bg-blue-900'}/> */}
          {params.id < 1 &&(
          <BtnComp title={'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
        )}
        {/* <button type="submit">Search</button> */}
        <BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
         </div>

            
           
        
          </div>

        </form>
        {/* </Spin> */}
        </>
       )}
      </div>
    </section>
  )
}

export default FundRelForm
