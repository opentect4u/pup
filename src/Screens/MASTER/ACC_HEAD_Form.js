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

const initialValues = { account_head: "" };

const validationSchema = Yup.object({
  account_head: Yup.string().required("Account Head List is Required"),
});

function ACC_HEAD_Form() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [accountHeadDropList, setAccountHeadDropList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingAccountHead, setEditingAccountHead] = useState(null); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user_dt");
    if (userData) {
    setUserDataLocalStore(JSON.parse(userData))
    } else {
    setUserDataLocalStore([])
    }

  }, []);

  const fetchAccountHeadDropdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/head_of_acc`, {}, {
        headers: { auth_key },
      });

      console.log(response?.data, 'ggggggggggggg');
      
      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setAccountHeadDropList(response?.data?.message);
      } else {
        setTableDataList([]);
        setAccountHeadDropList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  const addAccountHead = async () => {
    setLoading(true);
      
    const formData = new FormData();
    // Append each field to FormData
    formData.append("account_head", formik.values.account_head);
    formData.append("created_by", userDataLocalStore.user_id);
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/accAdd`, 
          formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response?.data?.status, 'ggggggggggg');
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            fetchAccountHeadDropdownOption()
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

  const updateAccountHead = async () => {
    setLoading(true);

    const formData = new FormData();
          // Append each field to FormData
          formData.append("account_head", formik.values.account_head);
          formData.append("sl_no", editingAccountHead.sl_no);
          formData.append("modified_by", userDataLocalStore.user_id);

          console.log(formData, 'ggggggggggg', editingAccountHead, 'llll', formik.values.account_head);
          
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/accedit`, 
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                'auth_key': auth_key // Important for FormData
              },
            }
          );

          console.log(response?.data, 'tttttttttttttttt');
          
  
          if(response?.data?.status > 0) {
            Message("success", "Updated successfully.");
            setLoading(false);
            formik.resetForm();
            fetchAccountHeadDropdownOption()
          }
  
          if(response?.data?.status < 1) {
          setLoading(false);
          }
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };


  

  const onSubmit = (values) => {
    console.log(editingAccountHead === null, 'ggggggggggg - yyyyyyyyyy', editingAccountHead != null);
    // if(editingAccountHead)
    if(editingAccountHead === null){
      addAccountHead();
    }

    if(editingAccountHead != null){
      updateAccountHead();
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
      data?.account_head?.toLowerCase().includes(value)
    );
    setAccountHeadDropList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(accountHeadDropList.length / rowsPerPage);
  const currentTableData = accountHeadDropList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (accountHead) => {
    console.log(accountHead, 'sector');
    
    setEditingAccountHead(accountHead);
    formik.setFieldValue("account_head", accountHead?.account_head);
  };

  useEffect(() => {
    fetchAccountHeadDropdownOption();
  }, []);


  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <Heading title={editingAccountHead ? "Edit Account Head" : "Add Account Head"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Add Account Head"
                    type="text"
                    label="Add Account Head"
                    name="account_head"
                    formControlName={formik.values.account_head}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.account_head && formik.touched.account_head && (
                    <VError title={formik.errors.account_head} />
                  )}
                </div>
                <div className="sm:col-span-8 flex justify-left gap-1 mt-6">
                  <BtnComp
                    type="submit"
                    title={editingAccountHead ? "Update" : "Submit"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      setEditingAccountHead(null);
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
                setEditingAccountHead(null);
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
                  <h2 className="text-xl font-bold text-white">Account Head List</h2>
                  <input
                    type="text"
                    className="ml-auto bg-blue-950 border text-white text-sm rounded-lg p-2"
                    placeholder="Search By Account Head List"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <MasterTableCommon
                currentTableData={currentTableData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                handleEdit={handleEdit}
                sectorDropList={accountHeadDropList}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
                masterName='account'
                />




              </div>
            </Spin>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ACC_HEAD_Form;
