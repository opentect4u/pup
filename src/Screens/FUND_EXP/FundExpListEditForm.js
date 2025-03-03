import React, { useEffect, useState } from 'react'
import TDInputTemplate from '../../Components/TDInputTemplate'
import BtnComp from '../../Components/BtnComp'
import Heading from '../../Components/Heading'
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import VError from '../../Components/VError';
import axios from 'axios';
import { auth_key, url, folder_fund } from '../../Assets/Addresses/BaseUrl';
import { Message } from '../../Components/Message';
import { FilePdfOutlined } from '@ant-design/icons';

const initialValues = {
  exp_text: '',
  sch_amt_one: '',
  cont_amt_one: '',
};



const validationSchema = Yup.object({
  exp_text: Yup.string().required('Expenditure is Required'),
  sch_amt_one: Yup.string().required('Schematic Amount is Required'),
  cont_amt_one: Yup.string().required('Contigency Amount is Required'),

  // exp_text: Yup.string(),
  // al1_pdf: Yup.string(),
  // sch_amt_one: Yup.string(),
  // cont_amt_one: Yup.string(),

});


function FundExpListEditForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  const payment_no = location.state?.payment_no || "";
  const payment_date = location.state?.payment_date || "";

  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  // const [folderName, setFolderName] = useState('');
  const [filePreview, setFilePreview] = useState(null);

  useEffect(()=>{
      console.log('receive_date>>', payment_no, 'loadFormData', 'receive_no>>', payment_date,  'approval_no>>', params?.id);
    }, [])

    


    const loadFormData = async () => {
      // setLoading(true); // Set loading state
      // const cread = {
      //   approval_no: params?.id,
      //   receive_no: receive_no,
      //   receive_date: receive_date,
      // }

      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("payment_no", payment_no);
      formData.append("payment_date", payment_date); // Ensure this is a file if applicable
  
      try {
        const response = await axios.post(
          url + 'index.php/webApi/Expense/expense_single_data',
          formData, 
          {
            headers: {
              'auth_key': auth_key,
            },
          }
        );

        console.log("loadFormData___", response.data.message);
  
        // const totalAmount = Number(response.data.message.sch_amt) + Number(response.data.message.cont_amt);
        // fetchBlockdownOption__load(response?.data?.message?.district_id, response?.data?.message?.block_id)
        setValues({
          // approval_no: response.data.message.approval_no,
          exp_text: response.data.message.payment_to,
          sch_amt_one: response.data.message.sch_amt,
          cont_amt_one: response.data.message.cont_amt,

        })
  
        console.log(formValues, "loadFormData", response); // Log the actual response data
        // setSourceFundDropList(response.data.message)
      } catch (error) {
        console.error("Error fetching data:", error); // Handle errors properly
      }
  
    };

    const saveFormData = async () => {
      // setLoading(true); // Set loading state
    
      const formData = new FormData();
  
      formData.append("approval_no", params?.id);
      formData.append("payment_no", payment_no);
      formData.append("payment_date", payment_date);
      formData.append("payment_to", formik.values.exp_text);
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("created_by", "SSS Name Modified By");

    
      console.log("FormData:", formData);
  
      try {
        const response = await axios.post(
          `${url}index.php/webApi/Expense/expense_edit`,
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
        loadFormData()
        // formik.resetForm();
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
    // fundAddedList()
    loadFormData()
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
       
       
        <>
       <Heading title={"Expenditure  Edit"} button={'Y'}/>
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

           
           
        
          </div>

        </form>
        </>
      
      </div>
    </section>
  )
}

export default FundExpListEditForm
