import React, { useEffect, useRef, useState } from "react";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { DatabaseOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, folder_admin, folder_certificate, folder_fund, folder_progresImg, folder_tender, proj_final_pic, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import { Select, Spin } from "antd";
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import ReportGraph from "../../Components/ReportGraph";

const initialValues = {
  fin_yr: '',
};



const validationSchema = Yup.object({
  fin_yr: Yup.string().required('Financial Year is Required'),
});


function Financial_Report_Graph() {
  const [loading, setLoading] = useState(false);
  const [financialYearDropList, setFinancialYearDropList] = useState([]);

  const [sectorwiseData, setSectorwiseData] = useState(() => []);
  const [accountwiseData, setAccountwiseData] = useState(() => []);
  const [districtwiseData, setDistrictwiseData] = useState(() => []);
  const [implementwiseData, setImplementwiseData] = useState(() => []);
  const [fundwiseData, setFundwiseData] = useState(() => []);
  const [progresswiseData, setProgresswiseData] = useState(() => []);
  const [financeYear_submit, setFinanceYear_submit] = useState("");
  const params = useParams();
  const navigate = useNavigate()
  const [selectedYear, setSelectedYear] = useState("");



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

      setFinancialYearDropList(response.data.message)
      if (params?.id > 0) {
        setSelectedYear(params?.id); // Set first year as default (modify if needed)
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };


  useEffect(()=>{
        fetchFinancialYeardownOption()
  }, [])




  const showReport = async (params)=>{
    setLoading(true);
    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("fin_year", params > 0 ? params : formik.values.fin_yr);
    setFinanceYear_submit(formik.values.fin_yr)

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

      
      if(response?.data?.status > 0){
        setLoading(false);
        setDistrictwiseData(response?.data?.distwise)
        setSectorwiseData(response?.data?.sectorwise)
        setAccountwiseData(response?.data?.accountwise)
        setImplementwiseData(response?.data?.impagencywise)
        // setFundwiseData(response?.data?.fund)
        setFundwiseData(response?.data?.fund_expenditure)
        setProgresswiseData(response?.data?.progress)
        // test(data_pai)
      }

      if(response?.data?.status < 1){
        setLoading(false);
        setSectorwiseData([])
        setAccountwiseData([])
        setDistrictwiseData([])
        setImplementwiseData([])
        setFundwiseData([])
        setProgresswiseData([])
      }
    } catch (error) {
      setLoading(false);
      Message("error", "Error Submitting Form:");
      console.error("Error submitting form:", error);
    }
    

  }


  useEffect(()=>{
    if(params?.id > 0){
      showReport(params?.id)
    }
  }, [])


  const onSubmit = (values) => {
      showReport()
    };
  
    const formik = useFormik({
      // initialValues:formValues,
      // initialValues,
      initialValues: { fin_yr: selectedYear },
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
              showSearch
                placeholder="Choose Financial Year"
                value={formik.values.fin_yr || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("fin_yr", value)
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
                } // Search
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
    onClick={() => { navigate(`/home/report/financial-report/${financeYear_submit == "" ? params?.id: financeYear_submit || params?.id}`); }} 
    > <DatabaseOutlined /> Data View </button>
             
            </div>
          </div>

        </form>
        {/* {JSON.stringify(financeYear_submit, null, 2)} /// {JSON.stringify(params?.id, null, 2)} */}
           
                    {/*  */}
                      <>
                      <Spin
                      indicator={<LoadingOutlined spin />}
                      size="large"
                      className="text-gray-500 dark:text-gray-400"
                      spinning={loading}
                      >
                      {sectorwiseData.length > 0 &&(
                      <>
                      <ReportGraph 
                      reportName = {'finance'}
                      sectorwiseData={sectorwiseData} 
                      accountwiseData={accountwiseData}
                      districtwiseData={districtwiseData}
                      implementwiseData={implementwiseData}
                      progresswiseData={progresswiseData}
                      fundwiseData={fundwiseData}
                      />
                      </>
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
