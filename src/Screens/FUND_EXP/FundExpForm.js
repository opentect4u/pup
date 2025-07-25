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
import { EditOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select, Spin } from 'antd';
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
import { getLocalStoreTokenDts } from '../../CommonFunction/getLocalforageTokenDts';




const initialValues = {
  // exp_text: '',
  // al1_pdf: '',
  sch_amt_one: '',
  cont_amt_one: '',
  payment_date:'',
  sch_remark: '',
  cont_remark: [],
};






function FundExpForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();

  const [operation_status, setOperation_status] = useState('');
  const [payment_no, setpayment_no] = useState('');
  const [payment_date, setpayment_date] = useState('');

  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  const [folderName, setFolderName] = useState('');
  const [schemaAmt, setSchemaAmt] = useState('');
  const [contiAmt, setContiAmt] = useState('');
  const [loading, setLoading] = useState(false)

  const [projectId, setProjectId] = useState([]);
  // const [getStatusData, setGetStatusData] = useState([]);
  const [getMsgData, setGetMsgData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [approvalNo, setApprovalNo] = useState('');
  const toast = useRef(null)
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);

  const [balanceSchematicAmount, setBalanceSchematicAmount] = useState('');
  const [balanceContigencyAmount, setBalanceContigencyAmount] = useState('');
  const [contigencyRemarks, setContigencyRemarks] = useState([]);
  const [contigencyId, setContigencyId] = useState([]);
  const [projectIncomplete, setProjectIncomplete] = useState(false);
  const [editFlagStatus, setEditFlagStatus] = useState("");
  
  const validationSchema = Yup.object({
    // exp_text: Yup.string().required('Remarks is Required'),
    // al1_pdf: Yup.string().required('Allotment Order No. is Required'),

    // sch_amt_one: Yup.string().required('Schematic Amount is Required'),
    sch_amt_one: Yup.number()
      .typeError('Schematic Amount must be a number')
      .positive('Schematic Amount must be greater than zero')
      .max(balanceSchematicAmount, `Amount must be within ${balanceSchematicAmount}`)
      .required('Schematic Amount is required'),
    cont_amt_one: Yup.number()
      .typeError('Contigency Amount must be a number')
      // .positive('Contigency Amount must be greater than zero')
      .max(balanceContigencyAmount, `Amount must be within ${balanceContigencyAmount}`)
      .required('Contigency Amount is required'),
    payment_date: Yup.string().required('Expenditure Date is Required'),
    sch_remark: Yup.string().required('Schematic Remarks is Required'),
    cont_remark: Yup.array()
      .min(1, 'Contingency Remarks is Required') // Ensures at least one selection
      .required('Contingency Remarks is Required'),
  
  });
    
    const fundAddedList = async (approvalNo_Para) => {
      setLoading(true); // Set loading state
      const tokenValue = await getLocalStoreTokenDts(navigate);
      
      const formData = new FormData();
      // formData.append("approval_no", params?.id);
      formData.append("approval_no", approvalNo_Para);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Expense/get_added_expense_list`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key, // Important for FormData
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );


        if(response.data.status > 0){
          setLoading(false);
          setFundStatus(response?.data?.message)
          setFolderName(response.data.folder_name)
          setSchemaAmt(response?.data?.message.reduce((acc, item) => acc + (Number(item?.sch_amt) || 0), 0));
          setContiAmt(response?.data?.message.reduce((acc, item) => acc + (Number(item?.cont_amt) || 0), 0));
          
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
        Message("error", "Error Fetching Form Data: fundAddedList");
        // console.error("Error submitting form:", error);

        localStorage.removeItem("user_dt");
      navigate('/')
      }
  
    };

    const saveFormData = async () => {
      // setLoading(true); // Set loading state
      const tokenValue = await getLocalStoreTokenDts(navigate);
      const formData = new FormData();
  
      // formData.append("approval_no", params?.id);
      formData.append("approval_no", approvalNo);
      formData.append("payment_to", '');
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("payment_date", formik.values.payment_date);
      formData.append("sch_remark", formik.values.sch_remark);
      formData.append("cont_remark", formik.values.cont_remark);
      formData.append("created_by", userDataLocalStore.user_id);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Expense/expense_add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key, // Important for FormData
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
        
        if(response.data.status > 0){
          // setLoading(false);
        Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
        fundAddedList(approvalNo)
        formik.setFieldValue("cont_remark", [])
        formik.resetForm();

          
        }

        if(response.data.status < 1){
          setLoading(false);
          // setShowForm(false);
        }
        
        
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);

        localStorage.removeItem("user_dt");
      navigate('/')
      }
  
    };


    const updateFormData = async () => {
      // setLoading(true); // Set loading state
      const tokenValue = await getLocalStoreTokenDts(navigate);
    
      const formData = new FormData();
  
      
      formData.append("payment_to", '');
      formData.append("sch_amt", formik.values.sch_amt_one);  //////////
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("sch_remark", formik.values.sch_remark);
      formData.append("cont_remark", formik.values.cont_remark);
  
      formData.append("approval_no", params?.id);
      formData.append("payment_no", payment_no);
      formData.append("payment_date", payment_date);
      formData.append("modified_by", userDataLocalStore.user_id);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
  
    
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Expense/expense_edit`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key, // Important for FormData
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
        
        // setLoading(false);
        Message("success", "Updated successfully.");
        // loadFormEditData(params?.id, payment_no, payment_date)
        setValues(initialValues)
        fundAddedList(params?.id)
        // navigate(`/home/tender_formality`);
  
        formik.resetForm();
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);

        localStorage.removeItem("user_dt");
      navigate('/')
      }
  
    };

 const onSubmit = (values) => {
    if(params?.id > 0){
      updateFormData()
    } else {
      saveFormData()
    }
    
  };

  const fetchProjectId = async () => {
    setLoading(true);

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Admapi/get_approval_no',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
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

      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchContigenceRemarks = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/contRmrks',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      if(response?.data?.status > 0){
      // fundAddedList()
      setContigencyRemarks(response?.data?.message)
      setLoading(false);
      }

      if(response?.data?.status < 1){
        setContigencyRemarks([])
        setLoading(false);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);

      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const loadFormData = async (project_id) => {
    setLoading(true); // Set loading state

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("approval_no", project_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/progress_list',
        formData,
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      if (response?.data.status > 0) {
        setLoading(false);
        setGetMsgData(response?.data?.message)

        setBalanceSchematicAmount(response?.data?.fund_total[0]?.tot_sch_amt - response?.data?.expense_total[0]?.tot_sch_amt)
        setBalanceContigencyAmount(response?.data?.fund_total[0]?.tot_cont_amt - response?.data?.expense_total[0]?.tot_cont_amt)
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

      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };





  const loadFormEditData = async (approval_no, payment_no, payment_date) => {
    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    setOperation_status('edit');
    setpayment_no(payment_no)
    setpayment_date(payment_date)

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append("payment_no", payment_no);
    formData.append("payment_date", payment_date);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Expense/expense_single_data',
        formData,
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      
      if (response?.data.status > 0) {
        setLoading(false);
        setValues({
          payment_date: response?.data?.message?.payment_date != null ? response?.data?.message?.payment_date : '',
          sch_amt_one: response.data.message.sch_amt != null ? response?.data?.message?.sch_amt : '',
          cont_amt_one: response.data.message.cont_amt != null ? response?.data?.message?.cont_amt : '',
          sch_remark:  response.data.message.sch_remark != null ? response?.data?.message?.sch_remark : '',
          cont_remark: response?.data?.cont_remark != null ? response?.data?.message?.cont_remark : '',
        })
        setEditFlagStatus(response?.data?.message?.edit_flag)

      }

      if (response?.data.status < 1) {
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly

      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };

  useEffect(()=>{
    fetchProjectId()
    // fundAddedList()
    fetchContigenceRemarks()
  }, [])

  const formik = useFormik({
      // initialValues:formValues,
      initialValues: +params.id > 0 ? formValues : initialValues,
      // initialValues: +params.id > 0 ? formValues : {
      //   cont_remark: selectedGpNames, // Set preselected values
      // },
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

    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }


    if(params?.id > 0){
    // loadFormEditData(params?.id, payment_no, payment_date)
    loadFormData(params?.id)
    fundAddedList(params?.id)
    setApprovalNo(params?.id)
    setShowForm(true);
    }
    }, [])


    const data = [
      { gp_id: "294", gp_name: "BIPRATIKURI" },
      { gp_id: "295", gp_name: "CHAUHATTA-MAHODARI-I" },
      { gp_id: "296", gp_name: "CHAUHATTA-MAHODARI-II" },
      { gp_id: "297", gp_name: "DWARAKA" },
      { gp_id: "298", gp_name: "HATIA" },
      { gp_id: "299", gp_name: "INDUS" },
      { gp_id: "300", gp_name: "JAMNA" },
      { gp_id: "301", gp_name: "KIRNAHAR-I" },
      { gp_id: "302", gp_name: "KURUNNAHAR" },
      { gp_id: "303", gp_name: "LABPUR-I" },
      { gp_id: "304", gp_name: "LABPUR-II" },
      { gp_id: "305", gp_name: "THIBA" }
    ];
    
    const options = contigencyRemarks.map(item => ({
      value: item.sl_no,
      label: item.cont_rmrks
    }));


  
    // const handleChange_contigen = (value) => {
    //   if(value.length > 3){
    //     formik.setFieldValue("cont_remark", [])
    //   }
    // };
    
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

{/* {JSON.stringify(fundStatus.length +1 , null, 2)} */}

        {/* {fundStatus?.length > 0 && (
          <> */}
            <Heading title={"Expenditure History"} button={'N'} />

            <Toast ref={toast} />

          <DataTable
          value={fundStatus?.map((item, i) => [{ ...item, id: i }]).flat()}
          selectionMode="checkbox"
          tableStyle={{ minWidth: "50rem" }}
          dataKey="id"
          tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
          >

          <Column
          field="payment_no"
          header="RA Bill"
          footer={
            <span style={{ fontWeight: "bold", color: "#0694A2" }}>
            Total: 
            </span>
            }
          ></Column>

          <Column
          field="payment_date"
          header="Date"
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
          field="sch_remark"
          header="Schematic Remarks"
          ></Column>

          <Column
          field="cont_remark"
          header="Contigency Remarks"
          ></Column>

{params.id > 0 &&(
        <Column
        field="comp_date_apprx"
        header="Action"
        body={(rowData) => (
          <a onClick={() => { loadFormEditData(params?.id, rowData.payment_no, rowData.payment_date)}}><EditOutlined style={{fontSize:22, }} /></a>
          )}
        ></Column>
)}
          

          

          </DataTable>

           
          {/* </>
        )} */}
        </Spin>
       
       {showForm &&(
        <>
        {params.id > 0 &&(<Heading title={`Expenditure Details`} button="N" />)}
        {params.id < 1 &&(<Heading title={`Expenditure Details (RA Bill ${fundStatus?.length + 1})`} button="N" />)}
       
       <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          <div class="sm:col-span-3">
            <TDInputTemplate
                placeholder="Expenditure Date goes here..."
                type="date"
                label={<>Expenditure Date<span className="mandator_txt"> *</span></>}
                name="payment_date"
                formControlName={formik.values.payment_date}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled={params?.id > 0? true : false}
              />
              {formik.errors.payment_date && formik.touched.payment_date && (
                <VError title={formik.errors.payment_date} />
              )}
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

            <div class="sm:col-span-6 contigencySelect">
            <label for="sch_amt_one" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Choose Contigency Remarks<span className="mandator_txt"> *</span></label>
            
              <Select
              placeholder="Choose Contingency Remarks goes here..."
              label="Choose Contingency Remarks"
              name="cont_remark"
              mode="tags"
              style={{ width: '100%' }}
              value={formik.values.cont_remark}
              onChange={(value) => {
                formik.setFieldValue("cont_remark", value)
              }} // Update Formik state
              handleChange={formik.handleChange}
              onBlur={() => formik.setFieldTouched("cont_remark", true)}
              tokenSeparators={[]}
              options={contigencyRemarks.map(item => ({
                value: item.sl_no,
                label: item.cont_rmrks
              }))}
              filterOption={(input, option) => 
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              />

{/* <Select
  style={{ width: '100%' }}
  // key={formik.values.cont_remark.length} // Change key to force re-render
  // value={formik.values.cont_remark}
  onChange={(value) => formik.setFieldValue("cont_remark", value)}
  options={options}
/> */}

              {formik.errors.cont_remark && formik.touched.cont_remark && (
              <VError title={formik.errors.cont_remark} />
              )}
            </div>

            <div class="sm:col-span-12">
              <TDInputTemplate
                type="text"
                placeholder="Schematic Remarks Text.."
                label="Schematic Remarks"
                name="sch_remark"
                formControlName={formik.values.sch_remark}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={3}
                required={true}
              />
              {formik.errors.sch_remark && formik.touched.sch_remark && (
                <VError title={formik.errors.sch_remark} />
              )}
            </div>

            

            
          {/* aaa{JSON.stringify(editFlagStatus , null, 2)} ccc */}
        {projectIncomplete === false &&(
            <div className="sm:col-span-12 flex justify-center gap-4 mt-4">

            
            


{params.id < 1 ? (
<>
<BtnComp title={'Reset'} type="reset" 
onClick={() => { 
formik.resetForm();
formik.setFieldValue("cont_remark", []);
}}
width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
<BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</>
) : editFlagStatus == 'Y' ? (
<>
<BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</>
) : userDataLocalStore.user_type === 'S' ? (
// You can render something specific here if needed
<>
<BtnComp type={'submit'} title={params.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
</>
)  : null }


         </div>
         )}

           
           
        
          </div>

        </form>
        </>
       )}
      </div>
    </section>
  )
}

export default FundExpForm
