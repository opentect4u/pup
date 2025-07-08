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

const initialValues = { add_sector: "" };

const validationSchema = Yup.object({
  add_sector: Yup.string().required("Sector is Required"),
});

function SECTOR_ADD_EDITForm() {
  const [loading, setLoading] = useState(false);
  const [tableDataList, setTableDataList] = useState([]);
  const [sectorDropList, setSectorDropList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSector, setEditingSector] = useState(null); // New state for editing
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate()

    const [userDataLocalStore, setUserDataLocalStore] = useState([]);
  
    useEffect(() => {
      const userData = localStorage.getItem("user_dt");
      if (userData) {
      setUserDataLocalStore(JSON.parse(userData))
      } else {
      setUserDataLocalStore([])
      }
  
    }, []);

  const fetchSectorDropdownOption = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

    try {
      const response = await axios.post(`${url}index.php/webApi/Mdapi/sector`, formData, {
        headers: { 
          auth_key,
          'Authorization': `Bearer ` + tokenValue?.token
         },
      });

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
    
    
    fetchSectorDropdownOption();
  }, []);

  const addSector = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("sector_desc", formik.values.add_sector);
    formData.append("created_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/secAdd`, 
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
            fetchSectorDropdownOption()
          }
  
          if(response?.data?.status < 1) {
          Message("error", response?.data?.message);
          setLoading(false);
          }

        
  
          
          
        } catch (error) {
          setLoading(false);
          Message("error", "Error Submitting Form:");
          console.error("Error submitting form:", error);
        }

  };

  const updateSector = async () => {
    setLoading(true);
    const tokenValue = await getLocalStoreTokenDts(navigate);

    const formData = new FormData();
    // Append each field to FormData
    formData.append("sector_desc", formik.values.add_sector);
    formData.append("sl_no", editingSector.sl_no);
    formData.append("modified_by", userDataLocalStore.user_id);
    formData.append(tokenValue?.csrfName, tokenValue?.csrfValue); // csrf_token

        try {
    
          const response = await axios.post( `${url}index.php/webApi/Mdapi/secedit`, 
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
    // if(editingSector)
    if(editingSector === null){
      addSector();
    }

    if(editingSector != null){
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

  const handleEdit = (sector) => {
    setEditingSector(sector);
    formik.setFieldValue("add_sector", sector?.sector_desc);
  };

  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <Heading title={editingSector ? "Edit Sector" : "Add Sector"} button="N" />
            <form onSubmit={formik.handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
                <div className="sm:col-span-4">
                  <TDInputTemplate
                    placeholder="Add Sector"
                    type="text"
                    label="Add Sector"
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
                    title={editingSector ? "Update" : "Submit"}
                    width="w-1/6"
                    bgColor="bg-blue-900"
                    onClick={() => { }}
                  />
                  <BtnComp
                    title="Reset"
                    type="reset"
                    onClick={() => {
                      formik.resetForm();
                      setEditingSector(null);
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
                masterName='sector'
                />



              </div>
            </Spin>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SECTOR_ADD_EDITForm;
