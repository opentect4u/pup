import React, { useEffect, useMemo, useRef, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url, folder_certificate, folder_fund, proj_final_pic, folder_tender } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
import Radiobtn from '../../Components/Radiobtn';
import { Image } from 'antd';

const options = [
	{
		label: "Yes",
		value: "Y",
	},
	{
		label: "No",
		value: "N",
	}
	
	
]

const initialValues = {
  certificate_path: '',
  annexure_path: '',
  purpose_field:'',
  exp_text: '',
  photo_com_report: '',
  
};


const purposeOfCertificate = [
  {sl_no: 1, name: 'Schematic', value: 'S' },
  {sl_no:2,  name: 'Contigency', value: 'C' },
]







function UCForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  // const operation_status = location.state?.operation_status || "add";
  // const certificate_no = location.state?.certificate_no || "";
  const [operation_status, setOperation_status] = useState('');
  const [certificate_no, setcertificate_no] = useState('');
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
  const [radioType, setRadioType] = useState("N")
  const [finalPic, setFinalPic] = useState([]);
  const [projectStatus, setProjectStatus] = useState('');
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [filePreview_1, setFilePreview_1] = useState(null);
  const [errorpdf_1, setErrorpdf_1] = useState("");
  const [projectIncomplete, setProjectIncomplete] = useState(false);

  const validationSchema = useMemo(() => 
    Yup.object({
      certificate_path: Yup.mixed().required('Utilization Certificate is Required'),
      annexure_path: Yup.mixed().required('Annexure is Required'),
      exp_text: Yup.string().required('Remarks is Required'),
      purpose_field:  Yup.string().required('Type Of Certificate is Required'),
      photo_com_report: radioType === 'Y' 
        ? Yup.mixed().required('Photograph Of Completed Report is Required') 
        : Yup.mixed().notRequired(),
    }), [radioType]
  );


    
    const fundAddedList = async (approvalNo_Para) => {
      setLoading(true); // Set loading state
    
      
      const formData = new FormData();
      // formData.append("approval_no", params?.id);
      formData.append("approval_no", approvalNo_Para);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Utilization/get_added_utlization_list`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );

        // console.log("FormData_____DONE////////////////", response?.data);

        if(response.data.status > 0){
          setFundStatus(response?.data?.message)
          setFolderName(response.data.folder_name)
          setFinalPic(response?.data?.final_pic)
          setProjectStatus(response?.data?.project_status)
          setLoading(false);
        }

        if(response.data.status < 1){
          setFundStatus([])
          setFinalPic([])
          setProjectStatus(response?.data?.project_status)
          setLoading(false);
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
      // setLoading(true); // Set loading state
    
      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", approvalNo);
      formData.append("issued_by", '');
      formData.append("certificate_path", formik.values.certificate_path); // Ensure this is a file if applicable
      formData.append("annexture_certi", formik.values.annexure_path); // Ensure this is a file if applicable
      formData.append("certi_type", formik.values.purpose_field); // Ensure this is a file if applicable
      formData.append("issued_to", '');
      formData.append("certificate_date", '');
      formData.append("remarks", formik.values.exp_text);
      formData.append("is_final", radioType);
      formData.append("final_pic", formik.values.photo_com_report);
      formData.append("created_by", userDataLocalStore.user_id);
  
    
      console.log("FormData_____DONE", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Utilization/utlization_add`,
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
        // navigate(`/home/fund_release`);
        fundAddedList(approvalNo)
        formik.resetForm();
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);
      }
  
    };


    const updateFormData = async () => {
      // setLoading(true); // Set loading state
  
    
      const formData = new FormData();
  
      
      formData.append("issued_by", '');
      formData.append("issued_to", '');  //////////
      formData.append("certificate_path", formik.values.certificate_path);
      formData.append("annexture_certi", formik.values.annexure_path);
      formData.append("certi_type", formik.values.purpose_field); // Ensure this is a file if applicable
      formData.append("certificate_date", '');
      formData.append("remarks", formik.values.exp_text);
  
  
      formData.append("approval_no", params?.id);
      formData.append("certificate_no", certificate_no);
      formData.append("modified_by", userDataLocalStore.user_id);

    
      console.log("formDataformData", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Utilization/utlization_edit`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );
        console.log(response, 'response___________');
        
        // setLoading(false);
        Message("success", "Updated successfully.");
        setValues(initialValues)
        // loadFormEditData(params?.id, certificate_no)
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
        setProjectIncomplete(false)

      }

      if (response?.data.status < 1) {
        setLoading(false);
        // setGetStatusData([])
        setGetMsgData([])
        setProjectIncomplete(true)
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

  const loadFormEditData = async (approval_no, certificate_no) => {
    setLoading(true); // Set loading state

    setOperation_status('edit');
    setcertificate_no(certificate_no)

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append("certificate_no", certificate_no);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/utlization_single_data',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log(response?.data?.message, 'fffffffffjjhkuuuuuuuuuuuuuujhjk');
      
      if (response?.data.status > 0) {
        setLoading(false);
        setValues({
          // annexure_path: response?.data?.message?.annexture_certi === null ? '' : response?.data?.message?.annexture_certi,
          annexure_path: response?.data?.message?.annexture_certi != null ? response?.data?.message?.annexture_certi : '',
          purpose_field: response?.data?.message?.certi_type != null ? response?.data?.message?.certi_type : '',
          certificate_path: response?.data?.message?.certificate_path != null ? response?.data?.message?.certificate_path : '',
          exp_text: response?.data?.message?.remarks != null ? response?.data?.message?.remarks : '',
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
    fetchProjectId()
    // fundAddedList()
  }, [])
  
  useEffect(()=>{

    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

    if(params?.id > 0){
      // loadFormEditData(params?.id, certificate_no)
      loadFormData(params?.id)
      fundAddedList(params?.id)
      setApprovalNo(params?.id)
      setShowForm(true);
    }
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

    const onChange = (e) => {
      setRadioType(e)
    }

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
  
        // Check if file size exceeds 2MB
        if (fileSizeMB > 2) {
          setErrorpdf_1("File size should not exceed 2MB.");
          return;
        }
  
        setErrorpdf_1("");
        console.log("File is valid:", file.name);
        formik.setFieldValue("certificate_path", file);
        setFilePreview_1(URL.createObjectURL(file)); // Create a preview URL
        // Proceed with file upload or further processing
      }
    };


    const handleFileChange_pdf_2 = (event) => {

      const file = event.target.files[0]; // Get the selected file
  
      if (file) {
        const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
        const fileType = file.type; // Get file MIME type
  
        // Check if file is a PDF
        if (fileType !== "application/pdf") {
          setErrorpdf_1("Only PDF files are allowed.");
          return;
        }
  
        // Check if file size exceeds 2MB
        if (fileSizeMB > 2) {
          setErrorpdf_1("File size should not exceed 2MB.");
          return;
        }
  
        setErrorpdf_1("");
        console.log("File is valid:", file.name);
        formik.setFieldValue("annexure_path", file);
        setFilePreview_1(URL.createObjectURL(file)); // Create a preview URL
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
          showSearch // Enable search
          placeholder="Choose Project ID"
          onChange={(value) => {
          formik.setFieldValue("approval_no", value);
          loadFormData(value)
          fundAddedList(value)
          setApprovalNo(value)
          setShowForm(true);
          }}
          // style={{ width: "100%" }}
          onBlur={formik.handleBlur}
          style={{ width: "100%" }}
          optionFilterProp="children"
          filterOption={(input, option) =>
          option?.children?.toLowerCase().includes(input.toLowerCase())
          }
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

        {projectIncomplete &&(
            <div class="sm:col-span-12">
            <div class="p-4 mb-0 text-sm text-yellow-800 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <span class="font-bold"><svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg></span>The project details are incomplete and lack key information, making the scope and objectives unclear.
            </div>
            </div>
            )}

        <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-0 -mb-0">
        {/* All Data  */}
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
            {/* {JSON.stringify(formValues, null, 2)} */}
        {/* {fundStatus?.length > 0 &&( */}
          <>
          <Heading title={"Utilization Certificate History"} button={'N'}/>

          <Toast ref={toast} />

          <DataTable
          value={fundStatus?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >

          <Column
          field="certificate_no"
          header="SL.No."
          // footer={
          //   <span style={{ fontWeight: "bold", color: "#0694A2" }}>
          //   Total: 
          //   </span>
          //   }
          ></Column>

          {/* <Column
          field="certificate_date"
          header="Date"
          ></Column> */}

          {/* <Column
          field="issued_by"
          header="Issued By"
          ></Column>

          <Column
          field="issued_to"
          header="Issued To"
          ></Column> */}

<Column
          // field="instl_amt"
          header="Type Of Certificate"
          body={(rowData) => (
            <>
            {rowData.certi_type == 'S'? 'Schematic': 'Contigency'}
            </>
            )}
          ></Column>


          <Column
          // field="instl_amt"
          header="Allotment Order No."
          body={(rowData) => (
          <a href={url + folder_certificate + rowData?.certificate_path} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column>

          <Column
          // field="instl_amt"
          header="Annexure"
          body={(rowData) => (
          <a href={url + folder_certificate + rowData?.annexture_certi} target='_blank'><FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
          )}
          ></Column>

          <Column
          field="is_final"
          header="This Is Final Utilization Certificate?"
          body={(rowData) => (
            <>
            {rowData.is_final == 'Y'? 'Yes': 'No'}
            </>
            )}
          ></Column>



          <Column
          field="remarks"
          header="Remarks"
          ></Column>

{params.id > 0 &&(
<Column
          field="comp_date_apprx"
          header="Action"
          body={(rowData) => (
            <a onClick={() => { loadFormEditData(params?.id, rowData.certificate_no)}}><EditOutlined style={{fontSize:22, }} /></a>
            )}
          ></Column>
        )}

          

          </DataTable>

          
          </>
        {/* )} */}
        </Spin>
        {/* fundStatus.length < 6 */}

        {/* {JSON.stringify(projectStatus , null, 2)} */}
      {projectStatus == 'CLOSE' &&(
      <>
      <div class="w-full p-4 text-left bg-white border border-gray-200 rounded-lg shadow-sm sm:p-0 dark:bg-gray-800 dark:border-gray-700 mb-5 shadow-xl">

      <div class="flex flex-col justify-between p-4 leading-normal">
      <h5 class="mb-3 text-lg font-bold text-gray-900 dark:text-white">Photograph Of Completed Report</h5>

      <div className="place-content-left flex items-left gap-4">
      {/* {JSON.stringify(JSON.parse(data?.pic_path), null, 2)} */}

      {finalPic?.map((imgPath, index) => (
      <>
      <Image width={80} className="mr-3 lightBox_thum" src={url + proj_final_pic + imgPath.final_pic} />
      </>
      ))}

      </div>
      </div>
      </div>
      </>
      )}



       {showForm &&(
        <>
       {projectStatus == 'OPEN' &&(
        <>
        <div className='mt-5'>
        <Heading title={"Utilization Certificate Details"} button={'N'}/>
        <form onSubmit={formik.handleSubmit}>
        <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
         

<div class="sm:col-span-4">
              

              <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Type Of Certificate<span className="mandator_txt"> *</span></label>
              {/* {JSON.stringify(headAccountDropList, null, 2)} */}
              <Select
                placeholder="Choose Type Of Certificate"
                value={formik.values.purpose_field || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("purpose_field", value)
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                // name="purposeOfCertificate"
              >
                <Select.Option value="" disabled> Choose Purpose Of Certificate </Select.Option>
                {purposeOfCertificate?.map(data => (
                  <Select.Option key={data.value} value={data.value}>
                    {data.name}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.purpose_field && formik.touched.purpose_field && (
                <VError title={formik.errors.purpose_field} />
              )}
            </div>
        
          <div class="sm:col-span-4" style={{position:'relative'}}>
    
            <TDInputTemplate
              type="file"
              name="certificate_path"
              placeholder="Utilization Certificate"
              label={<>Utilization Certificate (PDF Max Size 2 MB) <span className="mandator_txt"> *</span></>}
              handleChange={(event) => {
                handleFileChange_pdf_1(event)
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview_1 && (
            <a href={filePreview_1} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {formValues.certificate_path.length > 0 &&(
            <>
            {filePreview_1 === null && (
            <a href={url + folder_certificate + formValues.certificate_path} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}
            </>
            )}


            {formik.errors.certificate_path && formik.touched.certificate_path && (
              <VError title={formik.errors.certificate_path} />
            )}
             {errorpdf_1 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_1}</p>}
          </div>

          <div class="sm:col-span-4" style={{position:'relative'}}>
    
            <TDInputTemplate
              type="file"
              name="annexure_path"
              placeholder="Annexure"
              label={<>Annexure (PDF Max Size 2 MB) <span className="mandator_txt"> *</span></>}
              handleChange={(event) => {
                handleFileChange_pdf_2(event)
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

            {filePreview_1 && (
            <a href={filePreview_1} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}

            {formValues.annexure_path.length > 0 &&(
            <>
            {filePreview_1 === null && (
            <a href={url + folder_certificate + formValues.annexure_path} target='_blank' style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}
            </>
            )}


            {formik.errors.annexure_path && formik.touched.annexure_path && (
              <VError title={formik.errors.annexure_path} />
            )}
             {errorpdf_1 && <p style={{ color: "red", fontSize:12 }}>{errorpdf_1}</p>}
          </div>

         

          <div class="sm:col-span-12">
            <TDInputTemplate
              type="text"
              placeholder="Remarks Text.."
              label="Remarks"
              name="exp_text"
              formControlName={formik.values.exp_text}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={3}
              required={true}
            />
            {formik.errors.exp_text && formik.touched.exp_text && (
              <VError title={formik.errors.exp_text} />
            )}
          </div>

          {operation_status != 'edit' &&(
          <div class="sm:col-span-4">
          <label className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">This Is Final Utilization Certificate?</label>
          <Radiobtn
          data={options}
          val={radioType}
          onChangeVal={(value) => {
          onChange(value)
          }}
          />
          </div>
          )}
          
          {radioType == "Y" &&(
            <div class="sm:col-span-4">
            <TDInputTemplate
            type="file"
            name="photo_com_report"
            label="Photograph Of Completed Report"
            handleChange={(event) => {
            formik.setFieldValue("photo_com_report", event.currentTarget.files[0]);
            }}
            handleBlur={formik.handleBlur}
            mode={1}
            />

            {formik.errors.photo_com_report && formik.touched.photo_com_report && (
              <VError title={formik.errors.photo_com_report} />
            )}
          </div>
          )}
          
          
          
          {projectIncomplete === false &&(
          <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
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
       )}

         
         
      
        </div>

      </form>
      </div>
      </>
       )}
       
        </>
       )}
      </div>
    </section>
  )
}

export default UCForm
