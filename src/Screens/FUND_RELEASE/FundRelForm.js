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
import { FilePdfOutlined } from '@ant-design/icons';

const initialValues = {
  receipt_first: '',
  al1_pdf: '',
  sch_amt_one: '',
  cont_amt_one: '',
};



const validationSchema = Yup.object({
  receipt_first: Yup.string().required('Receipt is Required'),
  al1_pdf: Yup.string().required('Allotment Order No. is Required'),
  sch_amt_one: Yup.string().required('Schematic Amount is Required'),
  cont_amt_one: Yup.string().required('Contigency Amount is Required'),

  // receipt_first: Yup.string(),
  // al1_pdf: Yup.string(),
  // sch_amt_one: Yup.string(),
  // cont_amt_one: Yup.string(),

});


function FundRelForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  // const sl_no = location.state?.sl_no || "";
  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  const [folderName, setFolderName] = useState('');

  useEffect(()=>{
      console.log(operation_status, 'loadFormData', 'kkkk', params?.id);
    }, [])

    
    const fundAddedList = async () => {
      // setLoading(true); // Set loading state
    
      
      const formData = new FormData();
      formData.append("approval_no", params?.id);
  
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

        console.log("FormData_____", response?.data);

        if(response.data.status > 0){
          setFundStatus(response?.data?.message)
          setFolderName(response.data.folder_name)
        }

        if(response.data.status < 1){
          setFundStatus([])
        }
        // setLoading(false);
        // Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
      } catch (error) {
        // setLoading(false);
        Message("error", "Error Submitting Form:");
        console.error("Error submitting form:", error);
      }
  
    };

    const saveFormData = async () => {
      // setLoading(true); // Set loading state
    
      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("instl_amt", formik.values.receipt_first);
      formData.append("allotment_no", formik.values.al1_pdf); // Ensure this is a file if applicable
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("created_by", "SSS Name Created By");

  
    
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
       

        {fundStatus?.length > 0 &&(
          <>
          <Heading title={"Fund Receipt History"} button={'Y'}/>
          {fundStatus?.map((data, index) => ( 
          <div class="grid gap-0 sm:grid-cols-12 sm:gap-6 mb-5">
          <div class="sm:col-span-12">
          <h6 class="text-lg font-bold dark:text-white mb-0">{data?.receive_no == 1? 'First' : data?.receive_no == 2? 'Secound' : data?.receive_no == 3? 'Third' : 'Fourth'} installment Details</h6>
          </div>
               <div class="sm:col-span-3">
                 <TDInputTemplate
                   type="text"
                   label={data?.receive_no == 1? 'Receipt of first installment (Rs.)' : data?.receive_no == 2? 'Receipt of secound installment (Rs.)' : data?.receive_no == 3? 'Receipt of third installment (Rs.)' : 'Receipt of fourth installment (Rs.)'}
                   formControlName={data?.instl_amt}
                   mode={1}
                   disable={true}
                 />
                
               </div>
             
               <div class="sm:col-span-3">
                <label className='block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100'>Allotment Order No.</label>
                 
                 <a href={url + folderName + data?.allotment_no} target='_blank'>
                 <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
   
                
               </div>
               <div class="sm:col-span-3">
                 <TDInputTemplate
                   placeholder="Schematic Amount"
                   type="number"
                   label="Schematic Amount"
                  //  name="sch_amt_one"
                  formControlName={data?.sch_amt}
                   // formControlName={formik.values.sch_amt_one}
                   // handleChange={formik.handleChange}
                   // handleBlur={formik.handleBlur}
                   mode={1}
                 />
                 
               </div>
               <div class="sm:col-span-3">
                 <TDInputTemplate
                    placeholder="Contigency Amount"
                    type="number"
                    label="Contigency Amount"
                    // name="cont_amt_one"
                    formControlName={data?.cont_amt}
                   //  formControlName={formik.values.cont_amt_one}
                   //  handleChange={formik.handleChange}
                   //  handleBlur={formik.handleBlur}
                    mode={1}
                 />
                 
               </div>
           
             </div>
            ))}
          </>
        )}
       
       {fundStatus.length < 4 &&(
        <>
       <Heading title={"Fund Release/Receipt Details"} button={'N'}/>
       <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
            <div class="sm:col-span-3">
              <TDInputTemplate
                type="text"
                placeholder="Rs...."
                label="Receipt of first installment (Rs.)"
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
            </div>
            <div class="sm:col-span-3">
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
            <div class="sm:col-span-3">
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

export default FundRelForm
