import React, { useEffect, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import axios from "axios";
import { url, auth_key, folder_admin } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { Flex, Progress, Select, Spin } from "antd";
import { Message } from "../../Components/Message";
import { useNavigate, useParams } from "react-router"
import { CalendarOutlined, CheckCircleFilled, ClockCircleFilled, ClockCircleOutlined, CommentOutlined, FilePdfOutlined, LoadingOutlined } from "@ant-design/icons";
import { FaMapMarker } from "react-icons/fa";
import demoimg from "../../Assets/Images/demo.jpg";
import { Image } from 'antd';
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";


// const initialValues = {

// };

// const validationSchema = Yup.object({

// });

var date_ofCompletion = new Date('2025-04-10');
// 2025-04-11



function ProjectStatusDetails() {
  const params = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [projectId, setProjectId] = useState([]);
  const [getStatusData, setGetStatusData] = useState([]);
  const [getMsgData, setGetMsgData] = useState([]);
  const [folderName, setFolderName] = useState([]);



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

      setProjectId(response.data.message)
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }
  };

  const loadFormData = async (project_id) => {
    setLoading(true); // Set loading state
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();

    formData.append("approval_no", project_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Tender/progress_list',
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
        setGetStatusData(response?.data?.prog_img)
        setFolderName(response?.data?.folder_name)

      }

      if (response?.data.status < 1) {
        setLoading(false);
        setGetStatusData([])
        setGetMsgData([])
      }

    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error); // Handle errors properly
      
      localStorage.removeItem("user_dt");
      navigate('/')
    }

  };

  


  useEffect(() => {
    fetchProjectId()
  }, [])


  useEffect(()=>{
    if(params?.id > 0){
      loadFormData(params?.id)
    }
  }, [])

  


  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">
        <Heading title={'Progress Details'} button={'Y'} />
        <Spin
          indicator={<LoadingOutlined spin />}
          size="large"
          className="text-gray-500 dark:text-gray-400"
          spinning={loading}
        >

          
            <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">

              <div class="sm:col-span-4">


          {params?.id < 1 &&(
          <>
          <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Project ID</label>
          <Select
          placeholder="Choose Project ID"
          onChange={(value) => {
          loadFormData(value)
          }}
          style={{ width: "100%" }}
          >
          <Select.Option value="" disabled> Choose Project ID </Select.Option>
          {projectId.map(data => (
          <Select.Option key={data.project_id} value={data.project_id}>
          {data.project_id}
          </Select.Option>
          ))}
          </Select>
          </>
          
        )}
        {params?.id > 0 &&(
        <>
        {projectId.map((data) => (
        <div key={data.approval_no}>
        {data.approval_no === params?.id && (
        <>
        <TDInputTemplate
        type="text"
        label="Project ID"
        formControlName={data.project_id}
        mode={1}
        disabled={true}
        />
        </>
        )}
        </div>
        ))}
      
        </>
        )}

              </div>

              {/* {JSON.stringify(getMsgData[0], null, 2)} */}
              <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 -mb-2">
                Progress Details
              </div>
              

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="date"
                  label="Date of administrative approval"
                  formControlName={getMsgData[0]?.admin_approval_dt ? getMsgData[0]?.admin_approval_dt : '0000-00-00'}
                  mode={1}
                  disabled={true}
                />
                

              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Enter scheme name"
                  formControlName={getMsgData[0]?.scheme_name ? getMsgData[0]?.scheme_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>
              <div class="sm:col-span-4">


                

                <TDInputTemplate
                  type="text"
                  label="Enter Sector name"
                  formControlName={getMsgData[0]?.sector_name ? getMsgData[0]?.sector_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />


              </div>
              <div class="sm:col-span-4">
                

                <TDInputTemplate
                  type="text"
                  label="Financial Year"
                  formControlName={getMsgData[0]?.fin_year ? getMsgData[0]?.fin_year : '0000-00'}
                  mode={1}
                  disabled={true}
                />

              </div>

              <div class="sm:col-span-4">
                <TDInputTemplate
                  type="text"
                  label="Project implemented By"
                  formControlName={getMsgData[0]?.agency_name ? getMsgData[0]?.agency_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />
              </div>

              <div class="sm:col-span-4">

                
                <TDInputTemplate
                  type="text"
                  label="District"
                  formControlName={getMsgData[0]?.dist_name ? getMsgData[0]?.dist_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>
              <div class="sm:col-span-4">
                
                <TDInputTemplate
                  type="text"
                  label="Block"
                  formControlName={getMsgData[0]?.block_name ? getMsgData[0]?.block_name : 'No Data'}
                  mode={1}
                  disabled={true}
                />

              </div>

              <div class="sm:col-span-4">
                

              <TDInputTemplate
                  type="date"
                  label="Work Order Issued On"
                  formControlName={getMsgData[1]?.wo_date ? getMsgData[1]?.wo_date : '0000-00'}
                  mode={1}
                  disabled={true}
              />

              </div>
              {getStatusData.length > 0 && (
                <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 text-lg -mb-2">
                  Progress Status
                </div>
              )}

              <div class="sm:col-span-12">

               {/* {JSON.stringify(getStatusData, null, 2)}  */}
                
                 {/* // {JSON.stringify(folderName, null, 2)} */}

                {getStatusData?.map((data, index) => (
                  
                  
                  <>
                    {/* {cumulativeProgress = cumulativeProgress + parseInt(data?.progress_percent)} */}

                    <div class="w-full p-4 text-left bg-white border border-gray-200 rounded-lg shadow-sm sm:p-0 dark:bg-gray-800 dark:border-gray-700 mb-5 shadow-xl">
                      {/* <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="/docs/images/blog/image-4.jpg" alt=""/> */}

                      <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-0 text-sm font-bold text-gray-900 dark:text-white">Progress Status Phase {data?.visit_no}
                          <span className="text-xs bg-gray-700 text-white p-1 ml-5 rounded-md">Work Status {data?.progressive_percent}%</span> </h5>
                        <Flex gap="small" vertical>
                          <Progress percent={data?.progressive_percent} />
                          </Flex>
                        <p class="mb-3 font-normal items-center text-sm text-gray-700 dark:text-gray-400 flex">
                          <span className="flex items-center font-bold mr-1"><CalendarOutlined style={{ color: '#333', marginRight: 5, marginLeft: 3 }} /> Visit Date:</span> {data?.visit_dt}
                          <span className="flex items-center font-bold ml-3"><FaMapMarker style={{ color: '#333', marginRight: 3, marginLeft: 3 }} /> Visit By:</span> {data?.visit_by}
                          
                          {data?.address ? (
                          <>
                          <span className="flex items-center font-bold ml-3">
                          <FaMapMarker style={{ color: '#333', marginRight: 5, marginLeft: 3 }} />
                          Site Location:</span> {data.address}
                          </>
                          ) : (
                          'No Data'
                          )}
                        </p>
                        <div className="place-content-left flex items-left gap-4">
                          {/* {JSON.stringify(JSON.parse(data?.pic_path), null, 2)} */}
                          {JSON.parse(data?.pic_path)?.map((imgPath, index) => (
                            <>
                              <Image width={80} className="mr-3 lightBox_thum" src={url + folderName + imgPath} />
                            </>
                          ))}
                        </div>
                        
                        
                        {data?.proj_comp_status > 0 &&(
                          <>
                          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6 mb-5 mt-5 p-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">
                          <div class="sm:col-span-4">
                          <p class="mb-0 font-normal items-center text-sm flex mt-0">
                          <span className="flex items-center font-bold mr-1">
                          <CalendarOutlined className="dark:text-green-400" style={{marginRight: 5, marginLeft: 3 }} /> Actual Date of Completion:</span> 
                          {data?.actual_date_comp} 

                          </p>
                          </div>
                          <div class="sm:col-span-4">
                          <p class="mb-0 font-normal items-center text-sm flex mt-0">

                          <span className="flex items-center font-bold mr-1">
                          {/* <FaMapMarker style={{ color: '#3EB8BD', marginRight: 5, marginLeft: 3 }} />  */}
                          <CommentOutlined className="dark:text-green-400" style={{marginRight: 5, marginLeft: 3 }} /> Project Completion Remarks:</span> {data?.remarks}
                          </p>
                          </div>
                          </div>
                          </>
                        )}


              {data?.proj_comp_status > 0 &&(
              <>
              {new Date(data?.actual_date_comp).getTime() / 60000 > new Date(getMsgData[1]?.comp_date_apprx).getTime() / 60000 &&(
              <>
            <div class="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
            <div class="py-0 mr-3">
            <ClockCircleOutlined class="fill-current h-0 w-6 text-red-500 mr-0 text-xl" />
            </div>
            <div>
            <p class="font-bold">Oops! You Missed the Deadline! </p>
            <p class="text-sm">Submitted {Math.ceil((new Date(data?.actual_date_comp).getTime() - new Date(getMsgData[1]?.comp_date_apprx).getTime()) / (1000 * 60 * 60 * 24))} Day(s) Late</p>
            </div>
            </div>
            </div>
              </>
              )}

              {new Date(data?.actual_date_comp).getTime() / 60000 <= new Date(getMsgData[1]?.comp_date_apprx).getTime() / 60000 &&(
              <>

            <div class="bg-green-100 border-t-4 border-green-500 rounded-b text-green-900 px-4 py-3 shadow-md" role="alert">
            <div class="flex">
            <div class="py-0 mr-3">
            <CheckCircleFilled class="fill-current h-0 w-6 text-green-500 mr-0 text-xl" />
            </div>
            <div>
            <p class="font-bold">Project Delivered on Time. Great Job!  </p>
            <p class="text-sm">
            {(() => {
              const diffDays = Math.floor((new Date(getMsgData[1]?.comp_date_apprx).getTime() - new Date(data?.actual_date_comp).getTime()) / (1000 * 60 * 60 * 24));
              return diffDays === 0 
              ? " Submitted on the Same Day!"
              : ` Submitted ${diffDays} Day(s) early`;
              })()}
              </p>
            </div>
            </div>
            </div>

              </>
              )}
              </>
              )}

                      
                        
                      </div>
                    </div>
                  </>
                ))}


                {/* <Flex gap="small" vertical>
            <Progress percent={30} />
            <Progress percent={50} status="active" />
            <Progress percent={70} status="exception" />
            <Progress percent={100} />
            <Progress percent={50} showInfo={false} />
            </Flex> */}

              </div>





              {/* <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
              
              <BtnComp title={params?.id > 0 ? 'Reload' : 'Reset'} type="reset" 
              onClick={() => { 
                formik.resetForm();
              }}
              width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} />
              <BtnComp type={'submit'} title={params?.id > 0 ? 'Update' : 'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
            </div> */}
            </div>

          
        </Spin>
      </div>
    </section>
  );
}

export default ProjectStatusDetails;
