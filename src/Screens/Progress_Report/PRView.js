import React, { useEffect, useState } from 'react'
import BtnComp from '../../Components/BtnComp'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import { useFormik } from "formik";
import TDInputTemplate from '../../Components/TDInputTemplate';
import VError from "../../Components/VError";
import Heading from '../../Components/Heading';
import { auth_key, url, folder_progresImg } from '../../Assets/Addresses/BaseUrl';
import axios from 'axios';
import { Message } from '../../Components/Message';
import { EditOutlined, EyeOutlined, LoadingOutlined, PlusCircleOutlined } from '@ant-design/icons';
import Radiobtn from '../../Components/Radiobtn';
import { DataTable } from "primereact/datatable"
import Column from 'antd/es/table/Column';
// import { Toast } from 'primereact/toast';
// import { omit } from "lodash";
import { Paginator } from "primereact/paginator"
import { motion } from "framer-motion"
import { Toast } from "primereact/toast"
import { Spin } from 'antd';

const options = [
  {
  	label: "Search By Project ID",
  	value: "T",
  },
  {
    label: "Search By Approval No.",
    value: "A",
  }
  
  
]

const initialValues = {
  tender_id: '',
  approval_no: '',
};



// const validationSchema = Yup.object().shape({
//     tender_id: Yup.string(),
//     approval_no: Yup.string(),
//   }).test(
//     "at-least-one-required", // Test name (can be anything)
//     "Either Scheme Name or Sector Name is required", // Error message
//     (values) => {
//       return values.tender_id || values.approval_no; // Ensures at least one field has a value
//     }
//   );

const validationSchema = Yup.object({

    radioOption: Yup.string(),
    tender_id: Yup.string(),
    approval_no: Yup.string(),


  // radioOption: Yup.string(),
  // tender_id: Yup.string().when('radioOption', {
  //   is: 'T',
  //   then: (schema) => schema.required('Tender ID is required'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),
  // approval_no: Yup.string().when('radioOption', {
  //   is: 'A',
  //   then: (schema) => schema.required('Approval No. is required'),
  //   otherwise: (schema) => schema.notRequired(),
  // }),

    
});  
  

function PRView() {
    
  const navigate = useNavigate()
  const [tenderListSearch, setTenderListSearch] = useState([]);
  const [radioType, setRadioType] = useState("T")
  const [currentPage, setCurrentPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selectedProducts, setSelectedProducts] = useState(null)
  const [OPERATION_STATUS, setOPERATION_STATUS] = useState('');
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    // let newValues = { ...formik.values, radioOption: value };
    if (radioType === "T") {
      console.log('fff', 'SSSSSSSSSSSSSSS');
      formik.resetForm();
      
    } else if (radioType === "A") {
      console.log('fff', 'RRRRRRRRRRRRRRR');
      formik.resetForm();
    }

  }, [radioType])


    const searchTenderList = async()=>{
      setLoading(true);
    // const cread = {
    //   project_id : formik.values.tender_id,
    //   approval_no : formik.values.approval_no
    // }

    const formData = new FormData();
  
      // // Append each field to FormData
      formData.append("project_id", formik.values.tender_id);
      formData.append("approval_no", formik.values.approval_no);

    console.log(formData, 'creadcreadcreadcreadcread');
    
    
    try {
    const response = await axios.post(
    url + 'index.php/webApi/Tender/progress_list',
    formData, // Empty body
    {
    headers: {
    'auth_key': auth_key,
    },
    }
    );

    if(response.data.status > 0){
      setTenderListSearch(response.data.message);
      setOPERATION_STATUS(response.data.OPERATION_STATUS);
      setLoading(false);
    } else {
      setTenderListSearch([])
      setOPERATION_STATUS('')
      setLoading(false);
    }
    console.log(response.data.OPERATION_STATUS, "Search_Data:", response.data, '...........', formData); // Log the actual response data
    
    } catch (error) {
    console.error("Error fetching data:", error); // Handle errors properly
    setLoading(false);
    }



    }



    const onSubmit = (values) => {
    //   console.log(values, 'credcredcredcredcred', formik);
    searchTenderList()
    };
  
    const formik = useFormik({
      // initialValues:formValues,
      initialValues,
    //   initialValues: +params.id > 0 ? formValues : initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });

    const onChange = (e) => {
      console.log("radio1 checked", e)
      setRadioType(e)
    }

    

    const onPageChange = (event) => {
      setCurrentPage(event.first)
      setRowsPerPage(event.rows)
    } 

    const handleSelectionChange = (e) => {
      // Update the selected products setPaymentDate
      console.log(e.value, "kkkkkkkkkkkkkkkkkkkk")
      // Perform any additional logic here, such as enabling a button or triggering another action
      setSelectedProducts(e.value)
      
    }

 return( 
 <section class="bg-slate-200 dark:bg-gray-900 p-3 sm:p-5">
    <div class="mx-auto max-w-screen-xl  ">

    <section class="bg-white p-5 dark:bg-gray-900 mb-8 rounded-md">
    <Heading title={'Search Progress Report'} button={'N'} />

          <Radiobtn
            name="radioOption"
						data={options}
						val={radioType}
						onChangeVal={(value) => {
							onChange(value)
						}}

            // onChangeVal={(value) => {
            //   let newValues = { ...formik.values, radioOption: value };
          
            //   // Remove tender_id if not "T"
            //   if (value !== "T") {
            //     newValues = omit(newValues, ["tender_id"]);
            //   }
          
            //   // Remove approval_no if not "A"
            //   if (value !== "A") {
            //     newValues = omit(newValues, ["approval_no"]);
            //   }
          
            //   formik.setValues(newValues);
            //   formik.setTouched({ tender_id: false, approval_no: false }); // Reset touch state
            // }}
					/>

    <form onSubmit={formik.handleSubmit}>
          {/* <div class="grid gap-4 sm:grid-cols-12 sm:gap-6"> */}
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
          {radioType === "T" ? (
            <div class="sm:col-span-6 search_field">
            <TDInputTemplate
              type="text"
              placeholder="Project ID goes here..."
              // label="Search By Tender ID"
              name="tender_id"
              formControlName={formik.values.tender_id}
              handleChange={formik.handleChange}
              handleBlur={formik.handleBlur}
              mode={1}
            />
            {formik.errors.tender_id && formik.touched.tender_id && (
              <VError title={formik.errors.tender_id} />
            )}
          </div>
          ) : radioType === "A" ? (
            <div class="sm:col-span-6 search_field">
              <TDInputTemplate
                placeholder="Approval No. goes here..."
                type="number"
                label="Search By Approval No."
                name="approval_no"
                formControlName={formik.values.approval_no}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.approval_no && formik.touched.approval_no && (
                <VError title={formik.errors.approval_no} />
              )}
            </div>
          ) : null}
            
            



            
           
            {/* <div className="sm:col-span-6 justify-left gap-4 mt-0"> */}

            <div class="sm:col-span-3">
            {/* <BtnComp type={'submit'} title={'Search'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} /> */}
            <BtnComp type={'submit'} title={'Search'} onClick={() => { }} width={'w-full'} bgColor={'bg-blue-900'} />
            </div>
            <div class="sm:col-span-3">
              <BtnComp title={'Reset'} type="reset" 
              onClick={() => { 
                formik.resetForm();
              }}
              width={'w-full'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
              
            </div>

            
          </div>

        </form>
    </section>
          <Spin
						indicator={<LoadingOutlined spin />}
						size="large"
						className="text-gray-500 dark:text-gray-400"
						spinning={loading}
					>
        <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
        <div class="flex flex-col bg-blue-900 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <h2 className='text-xl font-bold text-white'>Progress Report</h2>
                <div class="w-full md:w-1/2">
                      
                        <label for="simple-search" class="sr-only">Search</label>
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search" class="bg-blue-950 border border-blue-900 text-white text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required=""/>
                        </div>
                </div>
                {/* <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                   <BtnComp bgColor="bg-white" color="text-blue-900" title="Utilization Certificate List" onClick={()=>{navigate('uclist')}}/>
                </div> */}
            </div>
            <div class="overflow-x-auto">

            
            
            <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-slate-200 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-4 py-3">Scheme Name</th>
                            <th scope="col" class="px-4 py-3">Project ID</th>
                            <th scope="col" class="px-4 py-3">Progress Photo </th>
                            
                        </tr>
                    </thead>
                    <tbody>
                    
                    {tenderListSearch?.map((data, index) => ( 
                    <>
                    <tr class="border-b dark:border-gray-700">
                    <td scope="row" class="px-4 py-3">{data?.scheme_name}</td>
                    <td scope="row" class="px-4 py-3">{data?.project_id}</td>
                    <td scope="row" className="px-4 py-3 img_thum">
      {/* Convert pic_path string to an array */}
      {JSON.parse(data?.pic_path || "[]")?.map((image, imgIndex) => (
        <div className='img_wrap'><img key={imgIndex} src={url + folder_progresImg + image} alt="Thumbnail" width="50" height="50" className="m-1 rounded" /></div>
      ))}
    </td>
                    </tr>
                    </>
                    ))}

                       
                       
                    </tbody>
                </table>
            </div>
          
        </div>
        </Spin>
    </div>
    </section>
    ) 
  }
  
export default PRView
