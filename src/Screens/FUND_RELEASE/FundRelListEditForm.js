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
import { FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

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


function FundRelListEditForm() {
  const params = useParams();
  const [formValues, setValues] = useState(initialValues);
  const location = useLocation();
  const operation_status = location.state?.operation_status || "add";
  const receive_no = location.state?.receive_no || "";
  const receive_date = location.state?.receive_date || "";
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const [fundStatus, setFundStatus] = useState(() => []);
  // const [folderName, setFolderName] = useState('');
  const [filePreview, setFilePreview] = useState(null);
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);

  useEffect(() => {

    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
    
  }, []);

    


    const loadFormData = async () => {
      setLoading(true); // Set loading state
      // const cread = {
      //   approval_no: params?.id,
      //   receive_no: receive_no,
      //   receive_date: receive_date,
      // }

      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("receive_no", receive_no);
      formData.append("receive_date", receive_date); // Ensure this is a file if applicable
  
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

        console.log("loadFormData", response.data.message);
        setLoading(false);
  
        // const totalAmount = Number(response.data.message.sch_amt) + Number(response.data.message.cont_amt);
        // fetchBlockdownOption__load(response?.data?.message?.district_id, response?.data?.message?.block_id)
        setValues({
          // approval_no: response.data.message.approval_no,
          receipt_first: response.data.message.instl_amt,
          al1_pdf: response.data.message.allotment_no,
          sch_amt_one: response.data.message.sch_amt,
          cont_amt_one: response.data.message.cont_amt,



          // approval_no,
          ///////// receive_no,
          ///////// receive_date
          // instl_amt,
          // allotment_no,
          // sch_amt,
          // cont_amt,
          // modified_by

        })
  
        console.log(formValues, "loadFormData", response); // Log the actual response data
        // setSourceFundDropList(response.data.message)
      } catch (error) {
        console.error("Error fetching data:", error); // Handle errors properly
      }
  
    };

    const saveFormData = async () => {
      setLoading(true); // Set loading state
    
      const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("approval_no", params?.id);
      formData.append("receive_no", receive_no);
      formData.append("receive_date", receive_date);
      formData.append("instl_amt", formik.values.receipt_first);
      formData.append("allotment_no", formik.values.al1_pdf); // Ensure this is a file if applicable
      formData.append("sch_amt", formik.values.sch_amt_one);
      formData.append("cont_amt", formik.values.cont_amt_one);
      formData.append("modified_by", userDataLocalStore.user_id);


  
    
      console.log("FormData:", formData);
  
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
    
        setLoading(false);
        Message("success", "Updated successfully.");
        // navigate(`/home/fund_release`);
        loadFormData()
        formik.resetForm();
      } catch (error) {
        setLoading(false);
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
       <Heading title={"Fund Release Instalment Edit"} button={'Y'}/>
       <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
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
          
            <div class="sm:col-span-3" style={{position:'relative'}}>
              
            <TDInputTemplate
            type="file"
            name="al1_pdf"
            placeholder="Allotment Order No."
            label="Allotment Order No."
            handleChange={(event) => {
            const file = event.currentTarget.files[0];
            if (file) {
            formik.setFieldValue("al1_pdf", file);
            setFilePreview(URL.createObjectURL(file)); // Create a preview URL
            }
            }}
            handleBlur={formik.handleBlur}
            mode={1}
            />

            {filePreview && (
            <a href={filePreview} target="_blank" rel="noopener noreferrer" style={{position:'absolute', top:37, right:10}}>
            <FilePdfOutlined style={{ fontSize: 22, color: "red" }} />
            </a>
            )}
            
            {/* {JSON.stringify(filePreview, null, 2)} */}
            {filePreview === null && (
            <a href={url + folder_fund + formValues.al1_pdf} target='_blank' style={{position:'absolute', top:37, right:10}}>
                 <FilePdfOutlined style={{fontSize:22, color:'red'}} /></a>
            )}

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

            
           
        
          </div>

        </form>
        </Spin>
        </>
      
      </div>
    </section>
  )
}

export default FundRelListEditForm
