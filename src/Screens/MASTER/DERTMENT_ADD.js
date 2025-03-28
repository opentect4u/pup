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

const initialValues = { add_sector: "" };

const validationSchema = Yup.object({
  add_sector: Yup.string().required("Department is Required"),
});

function DERTMENT_ADD() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [sectorDropList, setSectorDropList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSector, setEditingSector] = useState(null); // New state for editing
  const [editingStatus, setEditingStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  

  const fetchSectorDropdownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/department`, {}, {
        headers: { auth_key },
      });

      console.log(response?.data?.message, 'gggggggggggg');
      
      if (response?.data?.status > 0) {
        setTableDataList(response?.data?.message);
        setSectorDropList(response?.data?.message);
      } else {
        setTableDataList([]);
        setSectorDropList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
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
    
    fetchSectorDropdownOption();
  }, []);

  const addSector = async () => {
    setLoading(true);
      
    const formData = new FormData();
    // Append each field to FormData
    formData.append("dept_name", formik.values.add_sector);
    formData.append("sl_no", 0);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append("modified_by", '');

//     sl_no,
// dept_name, (input fileld)
// created_by,
// modified_by
    
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/deptSave`, 
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
            fetchSectorDropdownOption()
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

  const updateSector = async () => {
    setLoading(true);

    const formData = new FormData();
          // Append each field to FormData
    formData.append("dept_name", formik.values.add_sector);
    formData.append("sl_no", editingSector.sl_no);
    formData.append("created_by", '');
    formData.append("modified_by", userDataLocalStore.user_id);

          console.log(formData, 'ggggggggggg', editingSector, 'llll', formik.values.add_sector);
          
        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/deptSave`, 
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
            setEditingStatus(false)
            fetchSectorDropdownOption()
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
    // if(editingStatus)

    if(editingStatus === false){
      addSector();
    }

    if(editingStatus === true){
      updateSector();
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
      data?.sector_desc?.toLowerCase().includes(value)
    );
    setSectorDropList(filteredData);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(sectorDropList.length / rowsPerPage);
  const currentTableData = sectorDropList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (data) => {
    console.log(data, 'sector');
    setEditingStatus(true)
    setEditingSector(data);
    formik.setFieldValue("add_sector", data?.dept_name);
  };

  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <Heading title={editingStatus ? "Edit Department" : "Add Department"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Add Department"
                    type="text"
                    label="Add Department"
                    name="add_sector"
                    formControlName={formik.values.add_sector}
                    handleChange={formik.handleChange}
                    handleBlur={formik.handleBlur}
                    mode={1}
                  />
                  {formik.errors.add_sector && formik.touched.add_sector && (
                    <VError title={formik.errors.add_sector} />
                  )}
                </div>
                <div className="sm:col-span-8 flex justify-left gap-1 mt-6">
                  <BtnComp
                    type="submit"
                    title={editingStatus === true ? "Update" : "Submit"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      setEditingStatus(false);
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
                setEditingSector(null);
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
                  <h2 className="text-xl font-bold text-white">Sector</h2>
                  <input
                    type="text"
                    className="ml-auto bg-blue-950 border text-white text-sm rounded-lg p-2"
                    placeholder="Search by Sector"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>

                <MasterTableCommon
                currentTableData={currentTableData}
                currentPage={currentPage}
                rowsPerPage={rowsPerPage}
                handleEdit={handleEdit}
                sectorDropList={sectorDropList}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
                masterName='department'
                />




              </div>
            </Spin>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DERTMENT_ADD;
