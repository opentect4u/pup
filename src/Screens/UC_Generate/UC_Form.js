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
import { Input, InputNumber, Select, Spin } from 'antd';
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
import Radiobtn from '../../Components/Radiobtn';
import { toWords } from 'number-to-words';
import { FieldArray } from 'formik';
import { getLocalStoreTokenDts } from '../../CommonFunction/getLocalforageTokenDts';


const initialValues = {
  fin_year: '',
  schematic_amount_release: '',
  contigency_amount_release: '',
  scheme_name: '',

  purpose_field:'',
  // margin_Balance: '',
  videNo: '',
  videNoDate: '',
  unutilized_Balance: '',
  nextYear: '',

};

const purposeOfCertificate = [
  {sl_no: 1, name: 'Schematic', value: 'S' },
  {sl_no:2,  name: 'Contigency', value: 'C' },
]



function UC_Form() {
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
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const [sl_no, setSl_no] = useState('');
  
  const [contigencyAmountExp, setContigencyAmountExp] = useState('');
  const [schematicAmountReleas, setSchematicAmountReleas] = useState('');
  const [contigencyAmountReleas, setContigencyAmountReleas] = useState('');
  const [expenseData, setExpenseData] = useState('');

  const [SchematicCheclAmt, setSchematicCheclAmt] = useState(false);
  const [ContigencyCheclAmt, setContigencyCheclAmt] = useState(false);
  const [totalExpenseAmt, setTotalExpenseAmt] = useState(false);
 

  // const [formRows, setFormRows] = useState([{ id: 1 }]);

  const [formRows, setFormRows] = useState([{ id: 1, input1: "", input2: "" }]);
  const [errors, setErrors] = useState({});


  const validationSchema = Yup.object({
    fin_year:  Yup.string().required('Financial Year is Required'),
    schematic_amount_release:  Yup.string().required('Schematic Amount is Required'),
    // schematic_amount_release: Yup.number()
    //       .typeError('Schematic Amount must be a number')
    //       .positive('Schematic Amount must be greater than zero')
    //       .max(schematicAmountReleas, `Amount must be within ${schematicAmountReleas}`)
    //       .required('Schematic Amount (Release) is required'),

    contigency_amount_release: Yup.string().required('Contigency Amount (Release) is Required'),

    // contigency_amount_release: Yup.number()
    //       .typeError('Contigency Amount must be a number')
    //       .positive('Contigency Amount must be greater than zero')
    //       .max(contigencyAmountReleas, `Amount must be within ${contigencyAmountReleas}`)
    //       .required('Contigency Amount (Release) is required'),

    scheme_name:  Yup.string().required('Scheme Name is Required'),

    purpose_field:  Yup.string().required('Select Purpose Of Certificate is Required'),
    // margin_Balance: Yup.string().required('Margin Balance is Required'),
    videNo: Yup.string().required('Vide No. is Required'),
    videNoDate: Yup.string().required('Vide No. Date is Required'),
    unutilized_Balance: Yup.string().required('Unutilized Balancee is Required'),
    nextYear: Yup.string().required('Next Year is Required'),
  
  });


  const handleInputChange = (id, field, value) => {
    setFormRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const handleAddRow = () => {
    setFormRows([
      ...formRows,
      { id: formRows.length + 1, input1: "", input2: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    setFormRows(formRows.filter((row) => row.id !== id));
  };

  const totalAmount = formRows.reduce((acc, row) => {
    const amount = parseFloat(row.input2);
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);



  






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
    }
  };

  const loadFormData = async (approval_no) => {
    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/projCompCertiSingledata',
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



        setValues({
          letter_No_date: response?.data?.message?.letter_No_date,
          fin_year: response?.data?.message?.fin_year,
          schematic_amount: response?.data?.message?.schematic_amount,
          contigency_exp_details: response?.data?.message?.contigency_exp_details,
          contigency_amount: response?.data?.message?.contigency_amount,
          total_release_fund: response?.data?.message?.work_order_dt,
          schematic_amount_release: response?.data?.message?.amt_put_totender,
          contigency_amount_release: response?.data?.message?.work_order_value,
          scheme_name: response?.data?.message?.scheme_name_comp,
          actual_date_comp: response?.data?.message?.actual_dt_com,
          block: response?.data?.message?.block,
          district: response?.data?.message?.district,
          remarks: response?.data?.message?.remarks,
        })
        
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

  const loadFormEditData = async (approval_no) => {
    
    // setOperation_status('edit');
    // setSl_no(sl_no)

    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);
    const formData = new FormData();

    formData.append("approval_no", approval_no);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/dtprojforUtil',
        formData,
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      
      if (response?.data.status > 0) {

        // setSchematicAmountExp(response?.data?.message[2]?.expen_sch_amt)
        // setContigencyAmountExp(response?.data?.message[2]?.expen_cont_amt)

        setSchematicAmountReleas(response?.data?.message[1]?.fund_rece_sch_amt)
        setContigencyAmountReleas(response?.data?.message[1]?.fund_rece_cont_amt)
        setExpenseData(response?.data?.expen_data)

        setLoading(false);
        setGetMsgData(response?.data?.message)
        setValues({
          fin_year: response?.data?.message[0]?.fin_year,
          schematic_amount_release: response?.data?.expen_data?.fund_rece_sch_amt === null ? 0 : response?.data?.expen_data?.fund_rece_sch_amt,
          contigency_amount_release: response?.data?.expen_data?.fund_rece_cont_amt === null ? 0 : response?.data?.expen_data?.fund_rece_cont_amt,
          scheme_name: response?.data?.message[0]?.scheme_name === null ? 0 : response?.data?.message[0]?.scheme_name,
          purpose_field: '',
          // margin_Balance: '',
          videNo: '',
          videNoDate: '',
          unutilized_Balance: '',
          nextYear: '',
        })
      }

      if (response?.data.status < 1) {
        setLoading(false);

        setGetMsgData([])
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
        navigate(`/home/uc_c`);
        // loadFormData(params?.id)
      }
  
    }, [])


  

  const updateFormData = async () => {
    // setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("sl_no", 0);
    formData.append("approval_no", approvalNo);
    formData.append("exp_letter_dt", JSON.stringify(formRows));
    formData.append("certi_type", formik.values.purpose_field);
    formData.append("recv_sche_amt", formik.values.schematic_amount_release);
    formData.append("recv_cont_amt", formik.values.contigency_amount_release);
    formData.append("fin_year", formik.values.fin_year);
    formData.append("scheme_name", formik.values.scheme_name);

    // formData.append("margin_bal", formik.values.margin_Balance);  //////////
    formData.append("margin_bal", '0');

    formData.append("bal_amt", formik.values.unutilized_Balance);
    formData.append("vide_no", formik.values.videNo);
    formData.append("vide_dt", formik.values.videNoDate);
    formData.append("next_year", formik.values.nextYear);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Utilization/uticertificatesave`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );
      
      setLoading(false);
      Message("success", "Updated successfully.");
      navigate(`/home/uc_c`);

    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }

  };
  

  const onSubmit = (values) => {
    let isValid = true;
    const newErrors = {};

    formRows.forEach((row) => {
      if (!row.input1 || !row.input2) {
        isValid = false;
        newErrors[row.id] = {
          input1: !row.input1 ? "Letter No. and Date is Required" : "",
          input2: !row.input2 ? "Expense Amount is Required" : "",
        };
      }

      


    });

    setErrors(newErrors);

    if (isValid) {
      if(formik.values.purpose_field === 'S' && SchematicCheclAmt === false){
        updateFormData()
      }

      if(formik.values.purpose_field === 'C' && ContigencyCheclAmt === false){
        updateFormData()
      }
      
    } else {
      console.log("Validation failed");
    }
    
    
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
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
  }, [])

  

  useEffect(() => {
    const checkSchematicAmount = () => {
      if (
        formik.values.purpose_field === 'S' &&
        // formik.values.schematic_amount_release < totalAmount
        expenseData?.expen_sch_amt < totalAmount
      ) {
        setSchematicCheclAmt(true);
      } else {
        setSchematicCheclAmt(false);
      }
    };

    if(formik.values.purpose_field === 'S'){
      formik.setFieldValue("unutilized_Balance", expenseData?.unutilize_sche_amt)
    }
  
    checkSchematicAmount();
  }, [formik.values.purpose_field, formik.values.schematic_amount_release, totalAmount]);


  useEffect(() => {
    const checkContigencyAmount = () => {
      if (
        formik.values.purpose_field === 'C' &&
        // formik.values.contigency_amount_release < totalAmount
        expenseData?.expen_cont_amt < totalAmount
      ) {
        setContigencyCheclAmt(true);
      } else {
        setContigencyCheclAmt(false);
      }
    };

    if(formik.values.purpose_field === 'C'){
      formik.setFieldValue("unutilized_Balance", expenseData?.unutilize_cont_amt)
    }
  
    checkContigencyAmount();
  }, [formik.values.purpose_field, formik.values.contigency_amount_release, totalAmount]);
    
  

  function numberToIndianWords(num) {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
      'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
      'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];
  
    const units = [
      '', 'Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'
    ];
  
    if (num === 0) return 'Zero';
  
    function getWords(n) {
      if (n < 20) return a[n];
      else if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
      else return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + getWords(n % 100) : '');
    }
  
    const parts = [];
    let remaining = num;
  
    // First 3 digits (units/hundreds)
    parts.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  
    // Then pairs (thousand onwards)
    while (remaining > 0) {
      parts.push(remaining % 100);
      remaining = Math.floor(remaining / 100);
    }
  
    let word = '';
    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i]) {
        word += getWords(parts[i]) + (units[i] ? ' ' + units[i] : '') + ' ';
      }
    }
  
    return word.trim();
  }
  

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
              label="Project ID / Approval Number"
              formControlName={getMsgData.project_id}
              mode={1}
              disabled={true}
              />

              )}

         
            

            </div>


            

            
            

          </div>

        
      </Spin>
        </>
        
      {/* )} */}
        
        {/* {JSON.stringify(formValues, null, 2)} */}
       

        {showForm  &&(
        <>
      <Heading title={'Project Details'} button={'N'}/>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">


          <div class="sm:col-span-4">
              

              <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Select Type Of Certificate<span className="mandator_txt"> *</span></label>
              {/* {JSON.stringify(headAccountDropList, null, 2)} */}
              <Select
                placeholder="Choose Type Of Certificate"
                value={formik.values.purpose_field || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("purpose_field", value)
                  setTotalExpenseAmt(true)
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

          <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Financial Year..."
                type="text"
                label={<>Financial Year<span className="mandator_txt"> *</span></>}
                name="fin_year"
                formControlName={formik.values.fin_year}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled={true}
              />
              {formik.errors.fin_year && formik.touched.fin_year && (
                <VError title={formik.errors.fin_year} />
              )}
            </div>

            
            
           

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Schematic Amount (Release)"
                type="number"
                label={<>Schematic Amount (Release)<span className="mandator_txt"> *</span></>}
                name="schematic_amount_release"
                formControlName={formik.values.schematic_amount_release}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled={true}
              />
              {formik.errors.schematic_amount_release && formik.touched.schematic_amount_release && (
                <VError title={formik.errors.schematic_amount_release} />
              )}
            </div>
            

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Contigency Amount (Release)"
                type="number"
                label={<>Contigency Amount (Release)<span className="mandator_txt"> *</span></>}
                name="contigency_amount_release"
                formControlName={formik.values.contigency_amount_release}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled={true}
              />
              {formik.errors.contigency_amount_release && formik.touched.contigency_amount_release && (
                <VError title={formik.errors.contigency_amount_release} />
              )}
            </div>


            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Scheme Name"
                type="text"
                label={<>Scheme Name<span className="mandator_txt"> *</span></>}
                name="scheme_name"
                formControlName={formik.values.scheme_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled={true}
              />
              {formik.errors.scheme_name && formik.touched.scheme_name && (
                <VError title={formik.errors.scheme_name} />
              )}
            </div>

            {/* <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Margin Balance"
                type="number"
                label={<>Margin Balance<span className="mandator_txt"> *</span></>}
                name="margin_Balance"
                formControlName={formik.values.margin_Balance}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.margin_Balance && formik.touched.margin_Balance && (
                <VError title={formik.errors.margin_Balance} />
              )}
            </div> */}

              <div class="sm:col-span-12">
              <div class="p-4 mb-0 text-sm text-yellow-800 border-2 border-yellow-500 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                <span class="font-bold"><svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
</svg></span>Comprehensive Overview of Remaining Unutilized Account Balances.
              </div>
            </div>
            

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Unutilized Balance"
                type="number"
                label={<>Unutilized Balancee<span className="mandator_txt"> *</span></>}
                name="unutilized_Balance"
                formControlName={formik.values.unutilized_Balance}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
                disabled={true}
              />
              {formik.errors.unutilized_Balance && formik.touched.unutilized_Balance && (
                <VError title={formik.errors.unutilized_Balance} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Vide No."
                type="text"
                label={<>Vide No.<span className="mandator_txt"> *</span></>}
                name="videNo"
                formControlName={formik.values.videNo}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.videNo && formik.touched.videNo && (
                <VError title={formik.errors.videNo} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Vide No. Date"
                type="date"
                label={<>Vide No. Date<span className="mandator_txt"> *</span></>}
                name="videNoDate"
                formControlName={formik.values.videNoDate}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.videNoDate && formik.touched.videNoDate && (
                <VError title={formik.errors.videNoDate} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Next Year"
                type="text"
                label={<>Next Year<span className="mandator_txt"> *</span></>}
                name="nextYear"
                formControlName={formik.values.nextYear}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.nextYear && formik.touched.nextYear && (
                <VError title={formik.errors.nextYear} />
              )}
            </div>

            

            <div className="sm:col-span-12 grid gap-4 sm:grid-cols-12 mt-0">

            {totalExpenseAmt &&(
      <div class="sm:col-span-12">
      <div class="p-4 mb-0 text-sm text-blue-800 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-300" role="alert">
      <span class="font-bold"><svg class="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg></span>Total {formik.values.purpose_field === 'S' ? 'Schematic' : 'Contigency'} Expenditure Amount is <span class="font-bold">Rs.{formik.values.purpose_field === 'S' ? expenseData?.expen_sch_amt : expenseData?.expen_cont_amt}</span>. (Expenses exceeding this amount are not permitted.)

      
      </div>
      </div>
      )}
            
      {formRows.map((row, index) => (

        <>
      {/* <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
      <span class="font-medium">Info alert!</span> Change a few things up and try submitting again.
      </div> */}
      
      

      <div key={row.id} className="sm:col-span-12 grid gap-4 sm:grid-cols-12 mt-0">
      <div class="sm:col-span-4">
      <label for="scheme_name" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Letter No. and Date <span className="mandator_txt"> *</span></label>
      <input
      type="text"
      placeholder="Letter No. and Date"
      value={row.input1}
      onChange={(e) => handleInputChange(row.id, "input1", e.target.value)}
      className="bg-white border-2 border-slate-300 text-gray-800 text-sm rounded-md  focus:border-gray-400 active:border-sky-600 focus:ring-sky-600 focus:border-1 duration-500  w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-sky-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 flex items-center"
      />
      {errors[row.id] && (
      <div className="text-red-500 text-sm mt-1">
      {errors[row.id].input1 && <div>{errors[row.id].input1}</div>}
      </div>
      )}
      </div>
      <div class="sm:col-span-4">
      <label for="scheme_name" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Expense Amount <span className="mandator_txt"> *</span></label>
      <input
      type="number"
      placeholder="Expense Amount"
      value={row.input2}
      onChange={(e) => handleInputChange(row.id, "input2", e.target.value)}
      className="bg-white border-2 border-slate-300 text-gray-800 text-sm rounded-md  focus:border-gray-400 active:border-sky-600 focus:ring-sky-600 focus:border-1 duration-500  w-full p-2 dark:bg-bg-white dark:border-gray-600 dark:placeholder-sky-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 flex items-center"
      />
      {errors[row.id] && (
      <div className="text-red-500 text-sm mt-1">
      {errors[row.id].input2 && <div>{errors[row.id].input2}</div>}
      </div>
      )}
      </div>
      {index >= 1 && (
      <div class="sm:col-span-4 mt-7">

      <BtnComp title={'Remove'} onClick={() => handleRemoveRow(row.id)} width={'w-1/1'} bgColor={'bg-red-700'} />
      </div>
      )}

      {/* {errors[row.id] && (
      <div className="text-red-500 text-sm mt-1">
      {errors[row.id].input1 && <div>{errors[row.id].input1}</div>}
      {errors[row.id].input2 && <div>{errors[row.id].input2}</div>}
      </div>
      )} */}
      </div>
        
        </>
        
        
      ))}



<div class="sm:col-span-4 mt-0">
      
      
      <BtnComp title={'Add'} onClick={handleAddRow} width={'w-1/1'} bgColor={'bg-blue-900'} />
      </div>
      <div class="sm:col-span-4 mt-0">
      
  <div className="text-sm font-bold text-sky-700 dark:text-white">
  <span className="block text-xs font-bold text-slate-500 dark:text-gray-100">Total Amount: </span>₹ {totalAmount.toFixed(2)}
  </div>
  
  {/* {JSON.stringify(totalAmount.toFixed(2) , null, 2)} jjj
  {JSON.stringify(formik.values.schematic_amount_release , null, 2)} ///
  {JSON.stringify(SchematicCheclAmt , null, 2)} */}


{formik.values.purpose_field === 'S' && SchematicCheclAmt && (
  <span className="text-red-500 text-xs mt-1" style={{ fontWeight: '700' }}>
    Expense will not be greater than Schematic Expenditure Amount Rs.{expenseData?.expen_sch_amt}
  </span>
)}

{formik.values.purpose_field === 'C' && ContigencyCheclAmt && (
  <span className="text-red-500 text-xs mt-1" style={{ fontWeight: '700' }}>
    Expense will not Grater than Contigency Expenditure Amount Rs.{expenseData?.expen_cont_amt}
  </span>
)}

      </div>

      
      

    

           
            
            </div>

            

    
            
            
            {/* <Heading title={'Print Preview'} button={'N'}/>   */}
        <div className="sm:col-span-12 justify-center gap-4 mt-0">
        <Heading title={'Print Preview'} button={'N'}/>  
        <div className="print_out_txt">
  <p className="text-justify">
    Certified that out of Rs.&nbsp;
    <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Total Of Schematic Expenses"
        type="number"
        // formControlName={totalAmount.toFixed(2)}
        formControlName={expenseData?.fund_recv_tot_amt}
        // value={totalAmount.toFixed(2)}
        name="totalScheConti_print"
        mode={1}
      />
    </span>
    /- (Rupees.
    {numberToIndianWords(Number(expenseData?.fund_recv_tot_amt) || 0)}
   {/* {toWords(Number(expenseData?.fund_recv_tot_amt)).charAt(0).toUpperCase() + toWords(Number(expenseData?.fund_recv_tot_amt)).slice(1).toLowerCase()} */}
    
    &nbsp;only)..... of Grants-in-aid/Fund sanctioned during the year <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Financial Year"
        type="text"
        formControlName={formik.values.fin_year}
        name="year_print"
        mode={1}
      />
    </span>
    in favour of Accounts Officer Paschimanchal Unnayan Parshad under this Ministry/Department letter No.
    given in the margin and Rs. <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Previous Year Unspent Balance"
        type="text"
        formControlName={formik.values.unutilized_Balance}
        name="unspentBalance_print"
        mode={1}
      />
    </span> on account of unspent balance of the previous year, a sum of Rs.&nbsp;
    <span className="inline-block w-60 align-middle">
    <TDInputTemplate
        placeholder="Total Of Schematic Expenses"
        type="number"
        formControlName={totalAmount.toFixed(2)}
        name="totalScheConti_print"
        mode={1}
      />
    </span>
    (Rupees. 

      {toWords(totalAmount.toFixed(2)).charAt(0).toUpperCase() + toWords(totalAmount.toFixed(2)).slice(1).toLowerCase()}
    
    &nbsp; only) has been utilized for the purpose of <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Schematic Expenses Details"
        type="text"
        formControlName={formik.values.scheme_name}
        // name="schemeName_print"
        mode={1}
      />
    </span> PROJECT CODE {getMsgData[0]?.project_id} for which it was
    sanctioned, and that the balance of Rs.<span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Remaining Unutilized"
        formControlName={formik.values.unutilized_Balance}
        type="text"
        name="remainingUnutilized_print"
        mode={1}
      />
    </span> remaining unutilized at the end of the year has been
    surrendered to Government (vide No. <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Vide No Details"
        type="text"
        formControlName={formik.values.videNo}
        // name="schemeName_print"
        mode={1}
      />
    </span> Dated <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Vide No Date"
        type="text"
        formControlName={formik.values.videNoDate}
        // name="schemeName_print"
        mode={1}
      />
    </span>) and will be adjusted towards the
    grants-in-aid/fund payable during the next year <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Next Year"
        type="text"
        formControlName={formik.values.nextYear}
        name="nextYear_print"
        mode={1}
      />
    </span>.
  </p>
  </div>
</div>
        <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
        {params.id < 1 &&(
          <>
          <BtnComp title={'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />

       <BtnComp
        type="submit"
        title="Update"
        onClick={() => {}}
        width="w-1/6"
        bgColor="bg-blue-900"
      />
      
       {/* {formik.values.purpose_field === 'S' && (
  <>
    {formik.values.schematic_amount_release < totalAmount.toFixed(2) ? (
      <BtnComp
        type="submit"
        title="Update"
        onClick={() => {}}
        disabled={true}
        width="w-1/6"
        bgColor="bg-blue-900"
      />
    ) : (
      <BtnComp
        type="submit"
        title="Update"
        onClick={() => {}}
        disabled={false}
        width="w-1/6"
        bgColor="bg-blue-900"
      />
    )}
  </>
)} */}


{/* {formik.values.purpose_field === 'C' && (
  <>
    {formik.values.contigency_amount_release < totalAmount.toFixed(2) ? (
      <BtnComp
        type="submit"
        title="Update"
        onClick={() => {}}
        disabled={true}
        width="w-1/6"
        bgColor="bg-blue-900"
      />
    ) : (
      <BtnComp
        type="submit"
        title="Update"
        onClick={() => {}}
        disabled={false}
        width="w-1/6"
        bgColor="bg-blue-900"
      />
    )}
  </>
)} */}




        </>
      )}
         </div>
          </div>

        </form>
        </>
        )}


      </div>
    </section>
  )
}

export default UC_Form
