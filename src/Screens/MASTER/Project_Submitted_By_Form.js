import React, { useEffect, useRef, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Message } from "../../Components/Message";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import axios from "axios";
import { auth_key, url } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import { Spin } from "antd";
import MasterTableCommon from "../../Components/MasterTableCommon";
import { useNavigate } from "react-router-dom";
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";

const initialValues = { proj_submit_by: "" };

const validationSchema = Yup.object({
  proj_submit_by: Yup.string().required("Project Submitted By is Required"),
});

function Project_Submitted_By_Form() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [fundDropList, setFundDropList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFund, setEditingFund] = useState(null); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const navigate = useNavigate()


  const fetchFundDropdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/sof`, {}, {
        headers: { auth_key },
      });

      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setFundDropList(response?.data?.message);
      } else {
        setTableDataList([]);
        setFundDropList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectSubmitData = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/projSubmitBy',
        formData , // Empty body
        {
          headers: {
            'auth_key': auth_key,
            'Authorization': `Bearer ` + tokenValue?.token
          },
        }
      );

      // setProjectSubBy(response?.data?.message)
      // setLoading(false);

      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setFundDropList(response?.data?.message);
        setLoading(false);
      } else {
        setTableDataList([]);
        setFundDropList([]);
        setLoading(false);
      }

    } catch (error) {
      console.error("Error fetching data:", error); // Handle errors properly
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }
    
    // fetchFundDropdownOption();
    fetchProjectSubmitData()
  }, []);

  const addFund = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("proj_submit_by", formik.values.proj_submit_by);
    formData.append("sl_no", 0);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/projsubbysave`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key,
                'Authorization': `Bearer ` + tokenValue?.token
              },
            }
          );

  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            // fetchFundDropdownOption()
            fetchProjectSubmitData()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          Message("error", response?.data?.message);
          }

        
  
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };

  const updateFund = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);
    const formData = new FormData();
          // Append each field to FormData
    formData.append("proj_submit_by", formik.values.proj_submit_by);
    formData.append("sl_no", editingFund.sl_no);
    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/projsubbysave`, 
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key,
                'Authorization': `Bearer ` + tokenValue?.token
              },
            }
          );

  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            // fetchFundDropdownOption()
            fetchProjectSubmitData()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          Message("error", response?.data?.message);
          }
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };


  

  const onSubmit = (values) => {
    // if(editingFund)
    if(editingFund === null){
      addFund();
    }

    if(editingFund != null){
      updateFund();
    }
    
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredData = tableDataList.filter((data) =>
      data?.proj_submit_by?.toLowerCase().includes(value)
    );
    setFundDropList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(fundDropList.length / rowsPerPage);
  const currentTableData = fundDropList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (data) => {
    setEditingFund(data);
    formik.setFieldValue("proj_submit_by", data?.proj_submit_by);
  };

  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <Heading title={editingFund ? "Edit Project Submitted By" : "Add Project Submitted By"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Add Project Submitted By"
                    type="text"
                    label="Add Project Submitted By Name"
                    name="proj_submit_by"
                    formControlName={formik.values.proj_submit_by}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.proj_submit_by && formik.touched.proj_submit_by && (
                    <VError title={formik.errors.proj_submit_by} />
                  )}
                </div>
                <div className="sm:col-span-8 flex justify-left gap-1 mt-6">
                  <BtnComp
                    type="submit"
                    title={editingFund ? "Update" : "Submit"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      setEditingFund(null);
                    }}
                    width="w-1/6"
                    bgColor="bg-white"
                    color="text-blue-900"
                    border="border-2 border-blue-900"
                  />

                {/* <BtnComp type={'submit'} title={'Submit'} onClick={() => { }} width={'w-1/6'} bgColor={'bg-blue-900'} />
                <BtnComp title={'Reset'} type="reset" 
                onClick={() => { 
                formik.resetForm();
                setEditingFund(null);
                }}
                width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'} /> */}
                
                </div>
              </div>
            </form>
          </div>

          <div className="col-span-1">
            <Spin spinning={loading}>
              <div className="bg-white relative shadow-md sm:rounded-lg overflow-hidden">
                <div className="flex items-center p-4 bg-blue-900">
                  <h2 className="text-xl font-bold text-white">Project Submitted By</h2>
                  <input
                    type="text"
                    className="ml-auto bg-blue-950 border text-white text-sm rounded-lg p-2"
                    placeholder="Search by Fund"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <MasterTableCommon
                currentTableData={currentTableData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                handleEdit={handleEdit}
                sectorDropList={fundDropList}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
                masterName='project'
                />
                



              </div>
            </Spin>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Project_Submitted_By_Form;
