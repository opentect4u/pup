import React, { useEffect, useRef, useState } from "react";
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
import { useNavigate } from 'react-router-dom'
import { useLocation, useParams } from 'react-router-dom';
import ReportGraph from "../../Components/ReportGraph";
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";

const initialValues = {
  fin_yr: '',
};



const validationSchema = Yup.object({
  fin_yr: Yup.string().required('Financial Year is Required'),
});


function District_Report_Graph() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(() => []);
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
  const [secoundField_submit, setSecoundField_submit] = useState("");
  const [thirdField_submit, setThirdField_submit] = useState("");
  const [headAccountDropList, setHeadAccountDropList] = useState([]);

  const [district_ID, setDistrict_ID] = useState([]);

  const [blockDropList, setBlockDropList] = useState(() => []);
  const [blockDropList_Load, setBlockDropList_Load] = useState(() => []);

  const location = useLocation();
  const secoundValue = location.state?.secoundValue || "";
  const thirdValue = location.state?.thirdValue || "";
  



  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/fin_year',
        formData, // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      setFinancialYearDropList(response.data.message)
      if (params?.id > 0) {
        setSelectedYear(params?.id); // Set first year as default (modify if needed)

        // setSecoundField_submit(secoundValue)
        // setThirdField_submit(thirdValue)


      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const fetchHeadAccountdownOption = async () => {
      setLoading(true);
      const tokenValue = await getLocalStoreTokenDts(navigate);

      const formData = new FormData();
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

      try {
        const response = await axios.post(
          url + 'index.php/webApi/Mdapi/dist',
          {}, // Empty body
          {
            headers: {
              'auth_key': auth_key,
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
  
        setHeadAccountDropList(response.data.message)

        if (params?.id > 0) {
          setSecoundField_submit(secoundValue)
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error); // Handle errors properly
        
      localStorage.removeItem("user_dt");
      navigate('/')
      }
    };

    const fetchBlockdownOption = async () => {
      const tokenValue = await getLocalStoreTokenDts(navigate);

      const formData = new FormData();
      formData.append('dist_id', district_ID);
      formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

      try {
        const response = await axios.post(
          url + 'index.php/webApi/Mdapi/block',
          // { dist_id: district_ID },
          formData,
          {
            headers: {
              'auth_key': auth_key,
              'Authorization': `Bearer ` + tokenValue?.token
            },
          }
        );
  
        setBlockDropList(response.data.message)

        if (params?.id > 0) {
          setThirdField_submit(thirdValue)
        }

      } catch (error) {
        console.error("Error fetching data:", error); // Handle errors properly
        
      localStorage.removeItem("user_dt");
      navigate('/')
      }
    };

    useEffect(() => {
      fetchBlockdownOption()
    }, [district_ID])

    
  const fetchBlockdownOption_viewChange = async (districtID) => {

    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append('dist_id', districtID);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/block',
        // { dist_id: districtID }, 
        formData,
        {
          headers: { 'auth_key': auth_key },
        }
      );
  
      setBlockDropList(response.data.message);
  
      // If thirdValue (block_id) exists, pre-select it
      if (thirdValue) {
        formik.setFieldValue("block", thirdValue);
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  useEffect(() => {
    if (thirdValue) {
      // formik.setFieldValue("block", thirdValue);
      fetchBlockdownOption_viewChange(secoundValue);
    }
  }, [thirdValue]); // Runs when thirdValue changes


  useEffect(()=>{
        fetchFinancialYeardownOption()
        fetchHeadAccountdownOption()
  }, [])




  const showReport = async (params)=>{
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
  
    // Append each field to FormData
    formData.append("fin_year", params > 0 ? params : formik.values.fin_yr);
    formData.append("account_head_id", 0);
    formData.append("sector_id", 0);
    formData.append("dist_id", secoundValue.length > 0 ? secoundValue : formik.values.head_acc);
    formData.append("block_id", thirdField_submit.length > 0 ? thirdValue : formik.values.block);
    formData.append("impl_agency", 0);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    setFinanceYear_submit(formik.values.fin_yr)
    setSecoundField_submit(formik.values.head_acc)
    setThirdField_submit(formik.values.block)


    try {
      const response = await axios.post(
        `${url}index.php/webApi/Report/graphical_data_finawith`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
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
      
      localStorage.removeItem("user_dt");
      navigate('/')
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

      // initialValues: { fin_yr: selectedYear, head_acc: secoundField_submit, block: thirdField_submit },
      initialValues: { fin_yr: financeYear_submit || selectedYear, head_acc: secoundField_submit || secoundValue, block: thirdField_submit || thirdValue },

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
            <Heading title={"District Wise  Report"} button="N" />

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

            <div class="sm:col-span-4">
              

              <label for="head_acc" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">District</label>
    

              <Select
              showSearch
                placeholder="Choose District"
                value={formik.values.head_acc || undefined} // Ensure default empty state
                onChange={(value) => {
                  formik.setFieldValue("head_acc", value)
                  setDistrict_ID(value)
                  formik.setFieldValue("block", "");
                  setBlockDropList([]);
                  setBlockDropList_Load([]);
                  
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
                } // Search
              >
                <Select.Option value="" disabled> Choose District </Select.Option>
                {headAccountDropList?.map(data => (
                  <Select.Option key={data.dist_code} value={data.dist_code}>
                    {data.dist_name}
                  </Select.Option>
                ))}
              </Select>

              {formik.errors.head_acc && formik.touched.head_acc && (
                <VError title={formik.errors.head_acc} />
              )}
            </div>

            <div class="sm:col-span-4">


              <label for="block" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Block</label>
              <Select
              showSearch
                placeholder="Choose Block"
                // value={formik.values.block || undefined} // Ensure default empty state
                value={blockDropList_Load[0]?.block_name ? blockDropList_Load[0]?.block_name : formik.values.block || thirdField_submit}
                onChange={(value) => {
                  formik.setFieldValue("block", value)
                }}
                onBlur={formik.handleBlur}
                style={{ width: "100%" }}
                optionFilterProp="children"
                filterOption={(input, option) => // Search
                option?.children?.toLowerCase().includes(input.toLowerCase()) // Search
                } // Search
              >
                <Select.Option value="" disabled> Choose Block </Select.Option>
                {blockDropList.map(data => (
                  <Select.Option key={data.block_id} value={data.block_id}>
                    {data.block_name}
                  </Select.Option>
                ))}
              </Select>
              {/* {JSON.stringify(blockDropList_Load[0]?.block_name, null, 2)} */}
              {formik.errors.block && formik.touched.block && (
                <VError title={formik.errors.block} />
              )}
            </div>

            <div className="sm:col-span-12 flex justify-left gap-4 mt-0">
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
          onClick={() => { navigate(`/home/report/district-report/${financeYear_submit == "" ? params?.id: financeYear_submit || params?.id}`, {
          state: {
          // ...data, // Spread existing rowData

          // secoundValue: secoundField_submit == "" ? secoundField_submit : secoundValue || secoundField_submit,
          // thirdValue: thirdField_submit == "" ? thirdField_submit : thirdValue || thirdField_submit, // Explicitly include approval_status
          secoundValue: secoundField_submit > 0 ? secoundField_submit : '',
          thirdValue: thirdField_submit > 0 ? thirdField_submit : '',

          },
      }); }} 
    > <DatabaseOutlined /> Data View </button>
             
            </div>
          </div>

        </form>

        {/* {JSON.stringify(thirdValue, null, 2)} /// {JSON.stringify(thirdField_submit, null, 2)} */}

           
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
                      reportName = {'district'}
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

export default District_Report_Graph;
