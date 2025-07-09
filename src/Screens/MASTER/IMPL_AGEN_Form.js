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
import { getLocalStoreTokenDts } from "../../CommonFunction/getLocalforageTokenDts";
import { useNavigate } from "react-router-dom";

const initialValues = { agency_name: "" };

const validationSchema = Yup.object({
  agency_name: Yup.string().required("Implementing Agency is Required"),
});

function IMPL_AGEN_Form() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [agencyDropList, setAgencyDropList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAgency, setEditingAgency] = useState(null); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  const navigate = useNavigate()

  const fetchAgencyDropdownOption = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/impagency`, 
        formData, 
      {
        headers: { 
          auth_key,
          'Authorization': `Bearer ` + tokenValue?.token,
         },
      });

      
      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setAgencyDropList(response?.data?.message);
      } else {
        setTableDataList([]);
        setAgencyDropList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      
      localStorage.removeItem("user_dt");
      navigate('/')
    } finally {
      setLoading(false);
    }
  };



  const addAgency = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("agency_name", formik.values.agency_name);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/impAdd`, 
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
            fetchAgencyDropdownOption()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          Message("error", response?.data?.message);
          }

        
  
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
          
      localStorage.removeItem("user_dt");
      navigate('/')
        }

  };

  const updateAgency = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);
    const formData = new FormData();
          // Append each field to FormData
    formData.append("agency_name", formik.values.agency_name);
    formData.append("id", editingAgency.id);
    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token
          
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/impedit`, 
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
            fetchAgencyDropdownOption()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          }
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
          
      localStorage.removeItem("user_dt");
      navigate('/')
        }

  };


  

  const onSubmit = (values) => {
    // if(editingAgency)
    if(editingAgency === null){
      addAgency();
    }

    if(editingAgency != null){
      updateAgency();
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
      data?.agency_name?.toLowerCase().includes(value)
    );
    setAgencyDropList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(agencyDropList.length / rowsPerPage);
  const currentTableData = agencyDropList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (agency) => {
    
    setEditingAgency(agency);
    formik.setFieldValue("agency_name", agency?.agency_name);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

    fetchAgencyDropdownOption();
  }, []);


  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <Heading title={editingAgency ? "Edit Implementing Agency" : "Add Implementing Agency"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Add Implementing Agency"
                    type="text"
                    label="Add Implementing Agency"
                    name="agency_name"
                    formControlName={formik.values.agency_name}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.agency_name && formik.touched.agency_name && (
                    <VError title={formik.errors.agency_name} />
                  )}
                </div>
                <div className="sm:col-span-8 flex justify-left gap-1 mt-6">
                  <BtnComp
                    type="submit"
                    title={editingAgency ? "Update" : "Submit"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      setEditingAgency(null);
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
                setEditingAgency(null);
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
                  <h2 className="text-xl font-bold text-white">Implementing Agency</h2>
                  <input
                    type="text"
                    className="ml-auto bg-blue-950 border text-white text-sm rounded-lg p-2"
                    placeholder="Search By Implementing Agency"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <MasterTableCommon
                currentTableData={currentTableData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                handleEdit={handleEdit}
                sectorDropList={agencyDropList}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
                masterName='implementing'
                />

                



              </div>
            </Spin>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IMPL_AGEN_Form;
