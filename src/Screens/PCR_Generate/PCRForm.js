import React, { useEffect, useRef, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url, folder_tender } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
import Radiobtn from '../../Components/Radiobtn';


const options = [
	{
		label: "Yes",
		value: "M",
	},
	{
		label: "No",
		value: "N",
	}
	
	
]

const initialValues = {
  contractor_name_dtls: '',
  fin_year: '',
  scheme_name: '',
  e_nit_no: '',
  work_order_dtl: '',
  wo_date: '',
  amt_put_to_tender: '',
  wo_value: '',
  stipulated_dt: '',
  actual_date_comp: '',
  gross_value: '',
  final_value: '',
  remarks: '',
};

const validationSchema = Yup.object({
  // project_id: Yup.string().required('Project ID / Approval Number is Required'),

  contractor_name_dtls:  Yup.string().required('Contractor Name & Details is Required'),
  fin_year:  Yup.string().required('Financial Year is Required'),
  scheme_name:  Yup.string().required('Name Of Work is Required'),
  e_nit_no:  Yup.string().required('e-NIT No. is Required'),
  work_order_dtl:  Yup.string().required('Work Order Details is Required'),
  wo_date:  Yup.string().required('Work Order Details Date is Required'),
  amt_put_to_tender:  Yup.string().required('Amount Put to Tender is Required'),
  wo_value:  Yup.string().required('Tender Amount is Required'),
  stipulated_dt:  Yup.string().required('Stipulated Date of Completion is Required'),
  actual_date_comp:  Yup.string().required('Actual Date of gross_valueetion is Required'),
  gross_value:  Yup.string().required('Gross Value of Work Done is Required'),
  final_value:  Yup.string().required('Final Bill Value is Required'),
  remarks:  Yup.string().required('Remarks is Required'),


});

function PCRForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  // const operation_status = location.state?.operation_status || "add";
  // const sl_no = location.state?.sl_no || "";
  const navigate = useNavigate()
  const [filePreview_1, setFilePreview_1] = useState(null);
  const [filePreview_2, setFilePreview_2] = useState(null);
  const [loading, setLoading] = useState(false)
  // const [projectId, setProjectId] = useState([]);

  const [projectId, setProjectId] = useState([]);
  // const [getStatusData, setGetStatusData] = useState([]);
  const [getMsgData, setGetMsgData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [approvalNo, setApprovalNo] = useState('');
  const [fundStatus, setFundStatus] = useState(() => []);
  const toast = useRef(null)
  const [radioType, setRadioType] = useState("M")
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [operation_status, setOperation_status] = useState('');
  const [sl_no, setSl_no] = useState('');
  const [errorpdf_1, setErrorpdf_1] = useState("");
  const [errorpdf_2, setErrorpdf_2] = useState("");
  const [projectCompletionDate, setProjectCompletionDate] = useState('');
  const [projectIncomplete, setProjectIncomplete] = useState(false);





  const fetchProjectId = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/getProjListForPcr',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      if(response?.data?.status > 0){
      // fundAddedList()
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

  const loadFormData = async (approval_no) => {
    setLoading(true); // Set loading state

    const formData = new FormData();

    formData.append("approval_no", approval_no);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/projCompCertiSingledata',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      
      if (response?.data.status > 0) {
        setLoading(false);
        setGetMsgData(response?.data?.message)


        setValues({
          contractor_name_dtls: response?.data?.message?.contractor_name_dtls,
          fin_year: response?.data?.message?.fin_year,
          scheme_name: response?.data?.message?.scheme_name,
          e_nit_no: response?.data?.message?.e_nit_no === null ? '' : response?.data?.message?.e_nit_no,
          work_order_dtl: response?.data?.message?.work_order_dtl,
          wo_date: response?.data?.message?.work_order_dt,
          amt_put_to_tender: response?.data?.message?.amt_put_totender,
          wo_value: response?.data?.message?.work_order_value,
          stipulated_dt: response?.data?.message?.stipulated_dt_comp,
          actual_date_comp: response?.data?.message?.actual_dt_com,
          gross_value: response?.data?.message?.gross_value,
          final_value: response?.data?.message?.final_value,
          remarks: response?.data?.message?.remarks,
        })
        
        // setGetStatusData(response?.data?.prog_img)
        // setFolderProgres(response?.data?.folder_name)

      }

      if (response?.data.status < 1) {
        setLoading(false);
        // setGetStatusData([])
        setGetMsgData([])
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

  const loadFormEditData = async (approval_no) => {
    
    // setOperation_status('edit');
    // setSl_no(sl_no)

    setLoading(true); // Set loading state
    
    const formData = new FormData();

    formData.append("approval_no", approval_no);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/projCompCertiReq',
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      
      if (response?.data.status > 0) {

        setLoading(false);
        setGetMsgData(response?.data?.message)
        setProjectCompletionDate(response?.data?.comp_date_actual)
        setProjectIncomplete(false)

        setValues({
          contractor_name_dtls: response?.data?.message[0]?.contractor_name_dtls,
          fin_year: response?.data?.message[0]?.fin_year,
          scheme_name: response?.data?.message[0]?.scheme_name,
          e_nit_no: response?.data?.message[0]?.e_nit_no === null ? '' : response?.data?.message[0]?.e_nit_no,
          work_order_dtl: response?.data?.message[0]?.work_order_dtl,
          wo_date: response?.data?.message[0]?.wo_date,
          amt_put_to_tender: response?.data?.message[0]?.amt_put_to_tender,
          wo_value: response?.data?.message[0]?.wo_value,
          stipulated_dt: response?.data?.message[0]?.stipulated_dt,
          actual_date_comp: response?.data?.comp_date_actual,
          gross_value: response?.data?.message[0]?.gross_value,
          final_value: response?.data?.message[0]?.final_value,
          remarks: response?.data?.message[0]?.remarks,
        })
      }

      if (response?.data.status < 1) {
        setLoading(false);
        setGetMsgData([])
        setProjectCompletionDate('')
        setProjectIncomplete(true)
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
    }

  };

    useEffect(()=>{
      if(params?.id < 1){
        fetchProjectId()
      }
      
      if(params?.id > 0){
        setShowForm(true)
        loadFormData(params?.id)
      }
  
    }, [])


  

  const updateFormData = async () => {
    // setLoading(true); // Set loading state
  
    const formData = new FormData();

    formData.append("approval_no", approvalNo);
    formData.append("contractor_name_dtls", formik.values.contractor_name_dtls);
    formData.append("fin_year", formik.values.fin_year);  //////////
    formData.append("scheme_name", formik.values.scheme_name);
    formData.append("e_nit_no", getMsgData[0]?.e_nit_no);
    formData.append("work_order_dtl", formik.values.work_order_dtl);

    formData.append("work_order_dt", formik.values.wo_date);
    formData.append("amt_put_totender", formik.values.amt_put_to_tender);
    formData.append("work_order_value", formik.values.wo_value);
    formData.append("stipulated_dt_comp", formik.values.stipulated_dt);
    formData.append("actual_dt_com", projectCompletionDate);

    formData.append("gross_value", formik.values.gross_value);
    formData.append("final_value", formik.values.final_value);
    formData.append("remarks", formik.values.remarks);
    formData.append("created_by", userDataLocalStore.user_id);


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Utilization/pcrcertificateadd`,
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
      // loadFormEditData(params?.id, sl_no)
      navigate(`/home/pcr`);
      // fundAddedList(params?.id)

      // formik.resetForm();
    } catch (error) {
      // setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };
  

  const onSubmit = (values) => {
    updateFormData()
  };

  const formik = useFormik({
      // initialValues,
      initialValues: formValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

  useEffect(()=>{
    // if(operation_status == 'edit'){
      
    // }


    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

  }, [])

  // const handleFileChange_pdf_1 = (event) => {

  //   const file = event.target.files[0]; // Get the selected file

  //   if (file) {
  //     const fileSizeMB = file.size / (1024 * 1024); // Convert bytes to MB
  //     const fileType = file.type; // Get file MIME type

  //     // Check if file is a PDF
  //     if (fileType !== "application/pdf") {
  //       setErrorpdf_1("Only PDF files are allowed.");
  //       return;
  //     }

  //     // Check if file size exceeds 20MB
  //     if (fileSizeMB > 2) {
  //       setErrorpdf_1("File size should not exceed 2MB.");
  //       return;
  //     }

  //     setErrorpdf_1("");
  //     formik.setFieldValue("td_pdf", file);
  //     setFilePreview_1(URL.createObjectURL(file)); // Create a preview URL
  //     // Proceed with file upload or further processing
  //   }
  // };

  
    
  

  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">


      
      {/* {params?.id < 1 &&( */}
        <>
        
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
            setApprovalNo(value)
            setShowForm(true)
            loadFormEditData(value)
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
              <TDInputTemplate
              type="text"
              label="Project ID"
              formControlName={getMsgData.project_id}
              mode={1}
              disabled={true}
              />

              )}

         
            

            </div>
          </div>
          </Spin>

          {projectCompletionDate === null &&(
          <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-gray-500 dark:text-gray-400"
          spinning={loading}
          >
          <div class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <span class="sr-only">Info</span>
          <div>
          This Project is not yet completed, so you cannot Generate the Project Completion Certificate (PCR) Report at this time.
          </div>
          </div>
          </Spin>
          )}



        
      
        </>
        
      {/* )} */}
        
        {/* {JSON.stringify(projectCompletionDate, null, 2)} */}

        {projectIncomplete &&(
            <div class="sm:col-span-12 mb-3">
            <div class="p-4 mb-0 text-sm text-yellow-800 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <span class="font-bold"><svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg></span>The project details are incomplete and lack key information, making the scope and objectives unclear.
            </div>
            </div>
            )}
       
       {projectCompletionDate != null &&(
        <>
        {showForm  &&(
        <>
      <Heading title={'PCR Project Details'} button={'N'}/>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          

            <div class="sm:col-span-4">
              <TDInputTemplate
                type="text"
                placeholder="Contractor Name & Details"
                label="Contractor Name & Details"
                name="contractor_name_dtls"
                formControlName={formik.values.contractor_name_dtls}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.contractor_name_dtls && formik.touched.contractor_name_dtls && (
                <VError title={formik.errors.contractor_name_dtls} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Financial Year..."
                type="text"
                label="Financial Year"
                name="fin_year"
                formControlName={formik.values.fin_year}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.fin_year && formik.touched.fin_year && (
                <VError title={formik.errors.fin_year} />
              )}
            </div>
          
           
            
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name Of Work"
                type="text"
                label="Name Of Work"
                name="scheme_name"
                formControlName={formik.values.scheme_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.scheme_name && formik.touched.scheme_name && (
                <VError title={formik.errors.scheme_name} />
              )}
            </div>
            
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="e-NIT No."
                type="text"
                label="e-NIT No."
                name="e_nit_no"
                formControlName={formik.values.e_nit_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={true}
                mode={1}
              />
              {formik.errors.e_nit_no && formik.touched.e_nit_no && (
                <VError title={formik.errors.e_nit_no} />
              )}
            </div>
            
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Work Order Details"
                type="text"
                label="Work Order Details"
                name="work_order_dtl"
                formControlName={formik.values.work_order_dtl}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.work_order_dtl && formik.touched.work_order_dtl && (
                <VError title={formik.errors.work_order_dtl} />
              )}
            </div>


            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Work Order Details Date"
                type="date"
                label="Work Order Details Date"
                name="wo_date"
                formControlName={formik.values.wo_date}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.wo_date && formik.touched.wo_date && (
                <VError title={formik.errors.wo_date} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Amount Put to Tender..."
                type="number"
                label="Amount Put to Tender"
                name="amt_put_to_tender"
                formControlName={formik.values.amt_put_to_tender}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.amt_put_to_tender && formik.touched.amt_put_to_tender && (
                <VError title={formik.errors.amt_put_to_tender} />
              )}
            </div>



          

            

            

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Tender Amount"
                type="number"
                label="Tender Amount"
                name="wo_value"
                formControlName={formik.values.wo_value}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.wo_value && formik.touched.wo_value && (
                <VError title={formik.errors.wo_value} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Stipulated Date of Completion"
                type="date"
                label="Stipulated Date of Completion"
                name="stipulated_dt"
                formControlName={formik.values.stipulated_dt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.stipulated_dt && formik.touched.stipulated_dt && (
                <VError title={formik.errors.stipulated_dt} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Actual Date of Completion (Extend)"
                type="text"
                label="Actual Date of Completion (Extend)"
                name="actual_date_comp"
                formControlName={formik.values.actual_date_comp}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={true}
                mode={1}
              />
              {formik.errors.actual_date_comp && formik.touched.actual_date_comp && (
                <VError title={formik.errors.actual_date_comp} />
              )}
            </div>
           
            
            
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Gross Value of Work Done"
                type="number"
                label="Gross Value of Work Done"
                name="gross_value"
                formControlName={formik.values.gross_value}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.gross_value && formik.touched.gross_value && (
                <VError title={formik.errors.gross_value} />
              )}
            </div>


            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Final Bill Value"
                type="number"
                label="Final Bill Value"
                name="final_value"
                formControlName={formik.values.final_value}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                disabled={params.id > 0 ? true : false}
                mode={1}
              />
              {formik.errors.final_value && formik.touched.final_value && (
                <VError title={formik.errors.final_value} />
              )}
            </div>

            <div class="sm:col-span-12">
                        <TDInputTemplate
                          type="text"
                          placeholder="Remarks Text.."
                          label="Remarks"
                          name="remarks"
                          formControlName={formik.values.remarks}
                          handleChange={formik.handleChange}
                          handleBlur={formik.handleBlur}
                          disabled={params.id > 0 ? true : false}
                          mode={3}
                        />
                        {formik.errors.remarks && formik.touched.remarks && (
                          <VError title={formik.errors.remarks} />
                        )}
                      </div>

                      {projectIncomplete === false &&(


        <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
        {params.id < 1 &&(
          <>
          <BtnComp title={'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
       
        
        <BtnComp type={'submit'} title={'Update'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
        </>
      )}
         </div>
         )}


          </div>

        </form>
        </>
        )}
        </>
       )}
        


      </div>
    </section>
  )
}

export default PCRForm
