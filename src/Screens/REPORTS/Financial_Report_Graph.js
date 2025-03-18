import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { DatabaseOutlined, EditOutlined, EyeOutlined, FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, folder_admin, folder_certificate, folder_fund, folder_progresImg, folder_tender, proj_final_pic, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import { Select, Spin } from "antd";
import { DataTable } from 'primereact/datatable';
import Column from 'antd/es/table/Column';
import { Toast } from "primereact/toast"
// import { Tooltip } from 'react-tooltip'
import { Tooltip as ReactTooltip } from "react-tooltip";
import { Dialog } from "primereact/dialog";
import { Image } from 'antd';
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { color } from "framer-motion";
import BarChartComponent from "../../Components/BarChartComponent";
import PieChartComponent from "../../Components/PieChartComponent";
import ProgressBarChart from "../../Components/ProgressBarChart";

const initialValues = {
  fin_yr: '',
};



const validationSchema = Yup.object({
  fin_yr: Yup.string().required('Financial Year is Required'),
});


function Financial_Report_Graph() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(() => []);
  const [financialYearDropList, setFinancialYearDropList] = useState([]);

  const [sectorwiseData, setSectorwiseData] = useState(() => []);
  const [accountwiseData, setAccountwiseData] = useState(() => []);
  const [districtwiseData, setDistrictwiseData] = useState(() => []);
  const [implementwiseData, setImplementwiseData] = useState(() => []);
  const [expwiseData, setExpwiseData] = useState(() => []);
  const [fundwiseData, setFundwiseData] = useState(() => []);
  const [progresswiseData, setProgresswiseData] = useState(() => []);
  
  const navigate = useNavigate()



  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/fin_year',
        {}, // Empty body
        {
          headers: {
            'auth_key': auth_key,
          },
        }
      );

      // console.log("Response Data:", response.data.message); // Log the actual response data
      setFinancialYearDropList(response.data.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };


  useEffect(()=>{
        fetchFinancialYeardownOption()
  }, [])


  const data_pai = [
    {
      number_of_project: "1",
      dist_name: "PURULIA"
    },
    {
      number_of_project: "5",
      dist_name: "Kolkata"
    },
    {
      number_of_project: "3",
      dist_name: "Haora"
    },
  ];


  const showReport = async ()=>{
    setLoading(true);
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("fin_year", formik.values.fin_yr);
    console.log(formData, 'formData');

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Report/graphical_data_finyearwise`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key // Important for FormData
          },
        }
      );

      console.log(response?.data, 'xxxxxxxxxxxxxxxx', formData);
      
      if(response?.data?.status > 0){
        setLoading(false);
        setDistrictwiseData(response?.data?.distwise)
        setSectorwiseData(response?.data?.sectorwise)
        setAccountwiseData(response?.data?.accountwise)
        setImplementwiseData(response?.data?.impagencywise)
        setExpwiseData(response?.data?.expenditure)
        setFundwiseData(response?.data?.fund)
        setProgresswiseData(response?.data?.progress)
        // test(data_pai)
      }

      if(response?.data?.status < 1){
        setLoading(false);
        setSectorwiseData([])
        setAccountwiseData([])
        setDistrictwiseData([])
        setImplementwiseData([])
        setExpwiseData([])
        setFundwiseData([])
        setProgresswiseData([])
      }
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }
    

  }

  // var x=0;
  
  // const test = (data)=>{
  //   var x=0;
  //   data.map((item)=>{ x += Number(item.number_of_project) })
  //   console.log(x, 'uuuu');
  // }


  const onSubmit = (values) => {
      // console.log(values, 'credcredcredcredcred', formik.values.scheme_name);
      showReport()
    };
  
    const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues,
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      validateOnMount: true,
    });


    const data_2 = [
      {
        sector_name: "Road Test",
        number_of_project: 3,
      },
    ];
  
    




  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          {/* <div className="col-span-1"> */}
          {/* <Heading title={editingAccountHead ? "Edit Account Head" : "Add Account Head"} button="N" /> */}
            <Heading title={"Financial Yearwise Report"} button="N" />

            <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

          <div class="sm:col-span-4">
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Financial Year</label>
              <Select
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                  // console.log(value, 'ggggggggggggggggggg');
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
              >
                <Select.Option value="" disabled> Choose Financial Year </Select.Option>
                {financialYearDropList?.map(data => (
                  <Select.Option key={data.sl_no} value={data.sl_no}>
                    {data.fin_year}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.fin_yr && formik.touched.fin_yr && (
                <VError title={formik.errors.fin_yr} />
              )}
            </div>

            <div className="sm:col-span-8 flex justify-left gap-4 mt-6">
            <BtnComp type={'submit'} title={'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
              <BtnComp title={'Reset'} type="reset" 
              onClick={() => { 
                formik.resetForm();
              }}
              width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
           

    <button type="button" class="text-blue-700 bg-blue-900 hover:text-white border border-blue-700 hover:bg-blue-800 
              font-medium rounded-lg text-sm px-3 py-1.8 text-center 
              me-2 mb-0 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
              dark:focus:ring-blue-800 ml-auto"
    onClick={() => { navigate(`/home/report/financial-report/`); }} 
    > <DatabaseOutlined /> Data View </button>
             
            </div>
          </div>

        </form>
        {/* {JSON.stringify(reportData[0], null, 2)} */}
           
                    {/*  */}
                      <>
                      <Spin
                      indicator={<LoadingOutlined spin />}
                      size="large"
                      className="text-gray-500 dark:text-gray-400"
                      spinning={loading}
                      >
                      {sectorwiseData.length > 0 &&(
                      
                      <div className="grid gap-4 sm:grid-cols-12 sm:gap-6 mt-10">
                        
                      <div className="sm:col-span-6">

                      
                      <BarChartComponent  data={sectorwiseData} title_page={'Sector Wise'} title_Barchart={'Number Of Project'} key_name_1={'number_of_project'} key_name_2={'sector_name'} bar_name={'Sector'} />
                      
                      </div>

                      <div className="sm:col-span-6">
                      
                      <BarChartComponent  data={accountwiseData} title_page={'Account Head Wise'} title_Barchart={'Number Of Project'} key_name_1={'number_of_project'} key_name_2={'account_head'} bar_name={'Account Head'} />
                      
                      </div>

                      <div className="sm:col-span-6">
                      
                      <PieChartComponent data={districtwiseData} title_page={'District Wise Project'}/>
                      
                      </div>

                      <div className="sm:col-span-6">
                      
                      <BarChartComponent  data={implementwiseData} title_page={'Implementing Agency Wise'} title_Barchart={'Implementing Agency'} key_name_1={'number_of_project'} key_name_2={'agency_name'} bar_name={'Implementing Agency'} />
                    
                      </div>

                      <div className="sm:col-span-6">
                      
                      <BarChartComponent  data={fundwiseData} title_page={'Fund Wise'} title_Barchart={'Fund'} key_name_1={'instl_amt'} key_name_2={'project_id'} bar_name={'Fund'} />
                    
                      </div>

                      <div className="sm:col-span-6">
                      
                      <ProgressBarChart  data={progresswiseData} title_page={'Progress Wise'} title_Barchart={'Progress'} key_name_1={'progress_percent'} key_name_2={'project_id'} bar_name={'Progress'} />
                    
                      </div>

                      <div className="sm:col-span-6">
                      
                      <BarChartComponent  data={expwiseData} title_page={'Expenditure Wise'} title_Barchart={'Expenditure'} key_name_1={'total_amt'} key_name_2={'project_id'} bar_name={'Expenditure'} />
                    
                      </div>


                      </div>
                      )}

                      </Spin>
                      </>
                    {/* )} */}
           
                     
          {/* </div> */}

          
        </div>
      </div>
    </section>
  );
}

export default Financial_Report_Graph;
