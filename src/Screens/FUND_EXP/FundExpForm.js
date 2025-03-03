import React, { useEffect, useState } from 'react'
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
import { FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const initialValues = {
  exp_text: '',
  // al1_pdf: '',
  sch_amt_one: '',
  cont_amt_one: '',
};



const validationSchema = Yup.object({
  exp_text: Yup.string().required('Expenditure is Required'),
  // al1_pdf: Yup.string().required('Allotment Order No. is Required'),
  sch_amt_one: Yup.string().required('Schematic Amount is Required'),
  cont_amt_one: Yup.string().required('Contigency Amount is Required'),

  // exp_text: Yup.string(),
  // al1_pdf: Yup.string(),
  // sch_amt_one: Yup.string(),
  // cont_amt_one: Yup.string(),

});


function FundExpForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  // const sl_no = location.state?.sl_no || "";
  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  const [folderName, setFolderName] = useState('');
  const [schemaAmt, setSchemaAmt] = useState('');
  const [contiAmt, setContiAmt] = useState('');
  const [loading, setLoading] = useState(false)



  useEffect(()=>{
      console.log(operation_status, 'loadFormData', 'kkkk', params?.id);
    }, [])

    
    const fundAddedList = async () => {
      setLoading(true); // Set loading state
    
      
      const formData = new FormData();
      formData.append("approval_no", params?.id);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Expense/get_added_expense_list`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );

        console.log("FormData_____", response?.data);

        if(response.data.status > 0){
          setLoading(false);
          setFundStatus(response?.data?.message)
          setFolderName(response.data.folder_name)
          setSchemaAmt(response?.data?.message.reduce((acc, item) => acc + (Number(item?.sch_amt) || 0), 0));
          setContiAmt(response?.data?.message.reduce((acc, item) => acc + (Number(item?.cont_amt) || 0), 0));
          // console.log(schematicAmount_amt, 'pppppppppppppppp', contigencyAmount_amt);
          
        }

        if(response.data.status < 1){
          setFundStatus([])
          setLoading(false);
        }
        // setLoading(false);
        // Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
      } catch (error) {
        setLoading(false);
        Message("error", "Error Fetching Form Data:");
        // console.error("Error submitting form:", error);
      }
  
    };

    const saveFormData = async () => {
      // setLoading(true); // Set loading state
    
      const formData = new FormData();
  
      formData.append("approval_no", params?.id);
      formData.append("payment_to", formik.values.exp_text);
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("created_by", "SSS Name Created By");

  
    
      console.log("FormData:", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Expense/expense_add`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              'auth_key': auth_key // Important for FormData
            },
          }
        );
        console.log(response, 'FormData_____', (prevFundStatus) => [...prevFundStatus, formData]);
        
        // setLoading(false);
        Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
        fundAddedList()
        formik.resetForm();
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);
      }
  
    };

 const onSubmit = (values) => {
    console.log(values, 'credcredcredcredcred', operation_status ==  'edit', 'lll', params?.id);

    // if(operation_status == 'edit'){
    //   updateFormData()
    // } 
    if(operation_status ==  'add'){
      saveFormData()
      
    }
    
  };

  useEffect(()=>{
    fundAddedList()
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


    
  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">
       
      <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
        {fundStatus?.length > 0 && (
          <>
            <Heading title={"Expenditure  History"} button={'Y'} />
            {fundStatus?.map((data, index) => (
              <div class="grid gap-0 sm:grid-cols-12 sm:gap-6 mb-5">
                <div class="sm:col-span-12">
                  <h6 class="text-lg font-bold dark:text-white mb-0">{data?.payment_no == 1 ? 'First' : data?.payment_no == 2 ? 'Secound' : data?.payment_no == 3 ? 'Third' : 'Fourth'} Expenditure Details</h6>
                </div>
                <div class="sm:col-span-4">
                  <TDInputTemplate
                    type="text"
                    label={data?.payment_no == 1 ? 'Expenditure One' : data?.payment_no == 2 ? 'Expenditure Two' : data?.payment_no == 3 ? 'Expenditure Three' : 'Expenditure Four'}
                    formControlName={data?.payment_to}
                    mode={1}
                    disable={true}
                  />

                </div>

                {/* <div class="sm:col-span-3">

                  <TDInputTemplate
                    placeholder="Payment Date"
                    type="text"
                    label="Payment Date"
                    //  name="sch_amt_one"
                    formControlName={data?.payment_date}
                    disable={true}
                    mode={1}
                  />
                </div> */}
                <div class="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Schematic Amount"
                    type="number"
                    label="Schematic Amount"
                    //  name="sch_amt_one"
                    formControlName={data?.sch_amt}
                    mode={1}
                  />

                </div>
                <div class="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Contigency Amount"
                    type="number"
                    label="Contigency Amount"
                    // name="cont_amt_one"
                    formControlName={data?.cont_amt}
                    mode={1}
                  />

                </div>

              </div>
            ))}
            {/* Calculate Total Contingency Amount */}
            <div className="sm:col-span-12 flex justify-left gap-4 mt-4 mb-10">
            <div className="sm:col-span-3 ant-radio-group ant-radio-group-outline mt-0 mb-0 bg-white rounded-lg p-2 shadow-lg gap-4">
            <p className="text-blue-600 font-bold">Total Schematic Amount: {schemaAmt}</p>
            </div>
            <div className="sm:col-span-3 ant-radio-group ant-radio-group-outline mt-0 mb-0 bg-white rounded-lg p-2 shadow-lg gap-4">
            <p className="text-blue-600 font-bold">Total Contingency Amount: {contiAmt}</p>
            </div>
            </div>
          </>
        )}
        </Spin>
       
       {fundStatus.length < 4 &&(
        <>
       <Heading title={"Expenditure Details"} button={'N'}/>
       
       <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
            <div class="sm:col-span-4">
              <TDInputTemplate
                type="text"
                placeholder="Expenditure Text.."
                label="Expenditure One"
                name="exp_text"
                formControlName={formik.values.exp_text}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.exp_text && formik.touched.exp_text && (
                <VError title={formik.errors.exp_text} />
              )}
            </div>
          
            {/* <div class="sm:col-span-3">
              <TDInputTemplate
              type="file"
              name="al1_pdf"
              placeholder="Allotment Order No."
              label="Allotment Order No."
              handleChange={(event) => {
              formik.setFieldValue("al1_pdf", event.currentTarget.files[0]);
              }}
              handleBlur={formik.handleBlur}
              mode={1}
              />

              {formik.errors.al1_pdf && formik.touched.al1_pdf && (
                <VError title={formik.errors.al1_pdf} />
              )}
            </div> */}
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Schematic Amount"
                type="number"
                label="Schematic Amount"
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
            <div class="sm:col-span-4">
              <TDInputTemplate
                 placeholder="Contigency Amount"
                 type="number"
                 label="Contigency Amount"
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

            <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
         {/* <BtnComp title={'Reset'} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'}/>
         <BtnComp title={'Submit'} width={'w-1/6'} bgColor={'bg-blue-900'}/> */}
         <BtnComp title={'Reset'} type="reset" 
        onClick={() => { 
          formik.resetForm();
        }}
        width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
        {/* <button type="submit">Search</button> */}
        <BtnComp type={'submit'} title={operation_status ==  'edit' ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
         </div>

            {/* <div class="sm:col-span-12">
              <TDInputTemplate
                type="date"
                placeholder="Rs. 1000000"
                label="Receipt of second installment (Rs.)"
                name="receipt_second"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-8">
              <TDInputTemplate
                placeholder="Allotment Order No."
                type="text"
                label="Allotment Order No."
                name="all_two"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Upload PDF"
                type="file"
                label="Upload PDF"
                name="al2_pdf"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                placeholder="Schematic Amount"
                type="number"
                label="Schematic Amount"
                name="sch_amt_two"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                 placeholder="Contigency Amount"
                 type="number"
                 label="Contigency Amount"
                 name="cont_amt_two"
                 // formControlName={formik.values.email}
                 // handleChange={formik.handleChange}
                 // handleBlur={formik.handleBlur}
                 mode={1}
              />
            </div>
            <div class="sm:col-span-12">
              <TDInputTemplate
                type="date"
                placeholder="Rs. 1000000"
                label="Receipt of third installment (Rs.)"
                name="receipt_third"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-8">
              <TDInputTemplate
                placeholder="Allotment Order No."
                type="text"
                label="Allotment Order No."
                name="all_three"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Upload PDF"
                type="file"
                label="Upload PDF"
                name="al3_pdf"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                placeholder="Schematic Amount"
                type="number"
                label="Schematic Amount"
                name="sch_amt_three"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                 placeholder="Contigency Amount"
                 type="number"
                 label="Contigency Amount"
                 name="cont_amt_three"
                 // formControlName={formik.values.email}
                 // handleChange={formik.handleChange}
                 // handleBlur={formik.handleBlur}
                 mode={1}
              />
            </div>
            <div class="sm:col-span-12">
              <TDInputTemplate
                type="date"
                placeholder="Rs. 1000000"
                label="Receipt of fourth installment (Rs.)"
                name="receipt_fourth"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-8">
              <TDInputTemplate
                placeholder="Allotment Order No."
                type="text"
                label="Allotment Order No."
                name="all_fourth"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Upload PDF"
                type="file"
                label="Upload PDF"
                name="al4_pdf"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                placeholder="Schematic Amount"
                type="number"
                label="Schematic Amount"
                name="sch_amt_four"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                 placeholder="Contigency Amount"
                 type="number"
                 label="Contigency Amount"
                 name="cont_amt_four"
                 // formControlName={formik.values.email}
                 // handleChange={formik.handleChange}
                 // handleBlur={formik.handleBlur}
                 mode={1}
              />
            </div>

           <hr className='sm:col-span-12'/>
            <div class="sm:col-span-6">
              <TDInputTemplate
                placeholder="Total Schematic Amount"
                type="number"
                label="Total Schematic Amount"
                name="tot_schm_amt"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div>
            <div class="sm:col-span-6">
              <TDInputTemplate
                 placeholder="Total Contigency Amount"
                 type="number"
                 label="Total Contigency Amount"
                 name="tot_cont_amt"
                 // formControlName={formik.values.email}
                 // handleChange={formik.handleChange}
                 // handleBlur={formik.handleBlur}
                 mode={1}
              />
            </div> */}
           
        
          </div>

        </form>
        </>
       )}
      </div>
    </section>
  )
}

export default FundExpForm
