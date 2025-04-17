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


const initialValues = {
  district: "",
  schemeName: "",
  adminApprovalNo: "",
  adminApprovalDate: "",
  adminApprovalAmount: "",
  tenderedAmount: "",
  alltNoDateFundReceived: "",
  fundRecAmounte: "",
  payMade: "",
  claim: "",
  contigencyAmount: "",
  netClaim: "",
  presentPhysicalProgress: "",
  remark: "",
};




function Annex_Form() {
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
  
  // const [contigencyAmountExp, setContigencyAmountExp] = useState('');
  // const [schematicAmountReleas, setSchematicAmountReleas] = useState('');
  // const [contigencyAmountReleas, setContigencyAmountReleas] = useState('');

  // const [SchematicCheclAmt, setSchematicCheclAmt] = useState(false);
  // const [ContigencyCheclAmt, setContigencyCheclAmt] = useState(false);

 

  // const [formRows, setFormRows] = useState([{ id: 1 }]);

  // const [formRows, setFormRows] = useState([{ id: 1, input1: "", input2: "" }]);
  // const [errors, setErrors] = useState({});


  const validationSchema = Yup.object({
    district:  Yup.string().required('District is Required'),
    schemeName:  Yup.string().required('Scheme Name is Required'),
    adminApprovalNo: Yup.number().required('Administrative Approval No. is Required'),
    adminApprovalDate: Yup.string().required('Administrative Approval Date is Required'),
    adminApprovalAmount: Yup.number().required('Administrative Approval Amount is Required'),
    tenderedAmount: Yup.number().required('Tendered Amount is Required'),
    alltNoDateFundReceived: Yup.string().required('Allotment No. & Date of Fund Received is Required'),
    fundRecAmounte: Yup.number().required('Fund Received Amount is Required'),
    payMade: Yup.string().required('Payment Made is Required'),
    claim: Yup.number().required('Claim is Required'),
    contigencyAmount: Yup.number().required('Contigency Amount is Required'),
    netClaim: Yup.number().required('Net Claim is Required'),
    presentPhysicalProgress: Yup.number().required('Present Physical Progress is Required'),
    remark: Yup.string().required('Remarks is Required'),
  });


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
      console.log("Response Data:", response?.data); // Log the actual response data
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
    // console.log(project_id, 'responsedata');
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

        console.log(response?.data, 'vvvvvvvvvvvvvvvvvvvvvvv', response?.data?.message?.letter_No_date);


        setValues({
          letter_No_date: response?.data?.message?.letter_No_date,
          adminApprovalAmount: response?.data?.message?.adminApprovalAmount,
          schematic_amount: response?.data?.message?.schematic_amount,
          contigency_exp_details: response?.data?.message?.contigency_exp_details,
          contigency_amount: response?.data?.message?.contigency_amount,
          total_release_fund: response?.data?.message?.work_order_dt,
          schemeName: response?.data?.message?.amt_put_totender,
          adminApprovalNo: response?.data?.message?.work_order_value,
          adminApprovalDate: response?.data?.message?.adminApprovalDate_comp,
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
    
    const formData = new FormData();

    formData.append("approval_no", approval_no);

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Utilization/dtforannexture',
        // index.php/webApi/Utilization/dtforannexture
        formData,
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      
      if (response?.data.status > 0) {
        console.log(response?.data?.message, 'projCompCertiSingledataxxxxxxxxxxxxx', 'll');

        setLoading(false);
        setGetMsgData(response?.data?.message)
        setValues({
          district: response?.data?.message?.dist_name,
          schemeName: response?.data?.message?.scheme_name,
          adminApprovalNo: "",
          tenderedAmount: response?.data?.message?.amt_put_to_tender,
          adminApprovalDate: response?.data?.message?.admin_approval_dt,
          adminApprovalAmount: response?.data?.message?.total_amt === null ? '' : response?.data?.message?.total_amt,
          alltNoDateFundReceived: response?.data?.message?.allotment_no_and_dt === null ? '' : response?.data?.message?.allotment_no_and_dt,
          fundRecAmounte: response?.data?.message?.fund_recv_tot_amt === null ? '' : response?.data?.message?.fund_recv_tot_amt,
          payMade: "",
          claim: "",
          contigencyAmount: "",
          netClaim: "",
          presentPhysicalProgress: "",
          remark: "",
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
        fetchProjectId()
      if(params?.id > 0){
        setShowForm(true)
        navigate(`/home/annex`);
        // loadFormData(params?.id)
      }
    }, [])


  

  const updateFormData = async () => {
    // setLoading(true); // Set loading state
  
    const formData = new FormData();

    formData.append("sl_no", 0);
    formData.append("approval_no", approvalNo);

    formData.append("district", formik.values.district);
    formData.append("scheme", formik.values.schemeName);
    formData.append("admin_approval_no", formik.values.adminApprovalNo);
    formData.append("adm_approval_dt", formik.values.adminApprovalDate);
    formData.append("admin_approval_amt", formik.values.adminApprovalAmount);
    formData.append("tender_amt", formik.values.tenderedAmount);
    formData.append("fund_recv_allot_no", formik.values.alltNoDateFundReceived);
    formData.append("fund_recv_amt", formik.values.fundRecAmounte);
    formData.append("payment_made", formik.values.payMade);
    formData.append("contingency", formik.values.contigencyAmount);
    formData.append("net_claim", formik.values.netClaim);
    formData.append("claim", formik.values.claim);
    formData.append("physical_progress", formik.values.presentPhysicalProgress);
    formData.append("remarks", formik.values.remark);

    formData.append("created_by", userDataLocalStore.user_id);


    console.log(formData, 'formData');
    


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Utilization/annexturesave`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );
      console.log(response, 'pcrcertificateadd');
      
      // setLoading(false);
      Message("success", "Updated successfully.");
      // loadFormEditData(params?.id, sl_no)
      navigate(`/home/annex`);
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
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
  }, [])

  

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
            placeholder="Choose Project ID"
            onChange={(value) => {
            // loadFormData(value)
            // fundAddedList(value)
            
            setApprovalNo(value)
            setShowForm(true)
            loadFormEditData(value)
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
        </>
        
      {/* )} */}
        
        {/* {JSON.stringify(formValues, null, 2)} */}
       

        {showForm  &&(
        <>
      <Heading title={'Annexure Project Details'} button={'N'}/>
        <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">


          

          <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="District"
                type="text"
                label={<>District<span className="mandator_txt"> *</span></>}
                name="district"
                formControlName={formik.values.district}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.district && formik.touched.district && (
                <VError title={formik.errors.district} />
              )}
            </div>

            
            
           

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Scheme Name"
                type="text"
                label={<>Scheme Name<span className="mandator_txt"> *</span></>}
                name="schemeName"
                formControlName={formik.values.schemeName}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.schemeName && formik.touched.schemeName && (
                <VError title={formik.errors.schemeName} />
              )}
            </div>
            

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Administrative Approval No."
                type="text"
                label={<>Administrative Approval No.<span className="mandator_txt"> *</span></>}
                name="adminApprovalNo"
                formControlName={formik.values.adminApprovalNo}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.adminApprovalNo && formik.touched.adminApprovalNo && (
                <VError title={formik.errors.adminApprovalNo} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Tendered Amount"
                type="number"
                label={<>Tendered Amount<span className="mandator_txt"> *</span></>}
                name="tenderedAmount"
                formControlName={formik.values.tenderedAmount}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.tenderedAmount && formik.touched.tenderedAmount && (
                <VError title={formik.errors.tenderedAmount} />
              )}
            </div>
            
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Administrative Approval Date"
                type="date"
                label={<>Administrative Approval Date<span className="mandator_txt"> *</span></>}
                name="adminApprovalDate"
                formControlName={formik.values.adminApprovalDate}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.adminApprovalDate && formik.touched.adminApprovalDate && (
                <VError title={formik.errors.adminApprovalDate} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Administrative Approval Amount"
                type="number"
                label={<>Administrative Approval Amount<span className="mandator_txt"> *</span></>}
                name="adminApprovalAmount"
                formControlName={formik.values.adminApprovalAmount}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.adminApprovalAmount && formik.touched.adminApprovalAmount && (
                <VError title={formik.errors.adminApprovalAmount} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Allotment No. & Date of Fund Received"
                type="text"
                label={<>Allotment No. & Date of Fund Received<span className="mandator_txt"> *</span></>}
                name="alltNoDateFundReceived"
                formControlName={formik.values.alltNoDateFundReceived}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.alltNoDateFundReceived && formik.touched.alltNoDateFundReceived && (
                <VError title={formik.errors.alltNoDateFundReceived} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Fund Received Amount"
                type="number"
                label={<>Fund Received Amount <span className="mandator_txt"> *</span></>}
                name="fundRecAmounte"
                formControlName={formik.values.fundRecAmounte}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.fundRecAmounte && formik.touched.fundRecAmounte && (
                <VError title={formik.errors.fundRecAmounte} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Payment Made"
                type="number"
                label={<>Payment Made <span className="mandator_txt"> *</span></>}
                name="payMade"
                formControlName={formik.values.payMade}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.payMade && formik.touched.payMade && (
                <VError title={formik.errors.payMade} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Claim"
                type="number"
                label={<>Claim <span className="mandator_txt"> *</span></>}
                name="claim"
                formControlName={formik.values.claim}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.claim && formik.touched.claim && (
                <VError title={formik.errors.claim} />
              )}
            </div>


            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Contigency Amount"
                type="number"
                label={<>Contigency Amount <span className="mandator_txt"> *</span></>}
                name="contigencyAmount"
                formControlName={formik.values.contigencyAmount}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.contigencyAmount && formik.touched.contigencyAmount && (
                <VError title={formik.errors.contigencyAmount} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Net Claim"
                type="number"
                label={<>Net Claim <span className="mandator_txt"> *</span></>}
                name="netClaim"
                formControlName={formik.values.netClaim}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.netClaim && formik.touched.netClaim && (
                <VError title={formik.errors.netClaim} />
              )}
            </div>

            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Present Physical Progress"
                type="number"
                label={<>Present Physical Progress <span className="mandator_txt"> *</span></>}
                name="presentPhysicalProgress"
                formControlName={formik.values.presentPhysicalProgress}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.presentPhysicalProgress && formik.touched.netClaim && (
                <VError title={formik.errors.presentPhysicalProgress} />
              )}
            </div>

            <div class="sm:col-span-12">
            <TDInputTemplate
            type="text"
            placeholder="Remarks Text.."
            label="Remarks"
            name="remark"
            formControlName={formik.values.remark}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            mode={3}
            required={true}
            />
            {formik.errors.remark && formik.touched.remark && (
            <VError title={formik.errors.remark} />
            )}
            </div>

            

           

            

    
            
            
        {/* <div className="sm:col-span-12 justify-center gap-4 mt-0">
        <Heading title={'Print Preview'} button={'N'}/>  
        <div className="print_out_txt">
  <p className="text-justify">
    Certified that out of Rs.&nbsp;
    <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Total Of Schematic Expenses"
        type="number"
        formControlName={totalAmount.toFixed(2)}
        // value={totalAmount.toFixed(2)}
        name="totalScheConti_print"
        mode={1}
      />
    </span>
    /- (Rupees.
   {toWords(totalAmount.toFixed(2)).charAt(0).toUpperCase() + toWords(totalAmount.toFixed(2)).slice(1).toLowerCase()}
    
    &nbsp;only)..... of Grants-in-aid/Fund sanctioned during the year <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Administrative Approval Amount"
        type="text"
        formControlName={formik.values.adminApprovalAmount}
        name="year_print"
        mode={1}
      />
    </span>
    in favour of Accounts Officer Paschimanchal Unnayan Parshad under this Ministry/Department letter No.
    given in the margin and Rs. <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Previous Year Unspent Balance"
        type="text"
        formControlName={formik.values.alltNoDateFundReceived}
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
        formControlName={formik.values.adminApprovalDate}
        name="schemeName_print"
        mode={1}
      />
    </span> PROJECT CODE {getMsgData[0]?.project_id} for which it was
    sanctioned, and that the balance of Rs.<span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Remaining Unutilized"
        formControlName={formik.values.fundRecAmounte}
        type="text"
        name="remainingUnutilized_print"
        mode={1}
      />
    </span> remaining unutilized at the end of the year has been
    surrendered to Government (Payment Made <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Schematic Expenses Details"
        type="text"
        formControlName={formik.values.payMade}
        name="schemeName_print"
        mode={1}
      />
    </span> Dated <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Schematic Expenses Details"
        type="text"
        formControlName={formik.values.claim}
        name="schemeName_print"
        mode={1}
      />
    </span>) and will be adjusted towards the
    grants-in-aid/fund payable during the Contigency Amount <span className="inline-block w-60 align-middle">
      <TDInputTemplate
        placeholder="Contigency Amount"
        type="text"
        formControlName={formik.values.contigencyAmount}
        name="contigencyAmount_print"
        mode={1}
      />
    </span>.
  </p>
  </div>
</div> */}
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
        disabled={true}
        width="w-1/6"
        bgColor="bg-blue-900"
      />
      
       {/* {formik.values.purpose_field === 'S' && (
  <>
    {formik.values.schemeName < totalAmount.toFixed(2) ? (
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
    {formik.values.adminApprovalNo < totalAmount.toFixed(2) ? (
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

export default Annex_Form
