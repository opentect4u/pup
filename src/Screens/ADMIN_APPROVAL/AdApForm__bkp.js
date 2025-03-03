import React, { useEffect, useState } from "react";
import TDInputTemplate from "../../Components/TDInputTemplate";
import BtnComp from "../../Components/BtnComp";
import Heading from "../../Components/Heading";
import axios from "axios";
import { url, auth_key } from "../../Assets/Addresses/BaseUrl";
import VError from "../../Components/VError";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { Select } from "antd";


const initialValues = {
  scheme_name: '',
  sector_name: '',
  fin_yr: '',
  schm_amt: '',
  cont_amt: '',
  tot_amt: '',
  admin_appr_pdf: '',
  proj_id: '',
  head_acc: '',
  dt_appr: '',
  proj_sub_by: '',
  proj_imp_by: '',
  dis: '',
  block: '',
  vet_dpr_pdf: '',
  src: '',
};

const validationSchema = Yup.object({
  // filterOption: Yup.string().required('Please select either District or Range'),
  // select_district: Yup.string().when('filterOption', {
  //   is: 'district', // If filterOption is 'range'
  //   then: () => Yup.string().required('Select District is Required'),
  //   otherwise: () => Yup.string(), // Not required otherwise
  // }),
  // select_range: Yup.string().when('filterOption', {
  //   is: 'range', // If filterOption is 'district'
  //   then: () => Yup.string().required('Select Range is Required'),
  //   otherwise: () => Yup.string(), // Not required otherwise
  // }),

  scheme_name: '',
  // sector_name: '',
  // fin_yr: '',
  schm_amt: '',
  cont_amt: '',
  tot_amt: '',
  admin_appr_pdf: '',
  proj_id: '',
  head_acc: '',
  dt_appr: '',
  proj_sub_by: '',
  proj_imp_by: '',
  dis: '',
  block: '',
  vet_dpr_pdf: '',
  src: '',



  // scheme_name: Yup.string().required('Scheme name is Required'),
  sector_name: Yup.string().required('Sector is Required'),
  fin_yr: Yup.string().required('Financial Year is Required'),
  // schm_amt: Yup.string().required('Schematic Amount is Required'),
  // cont_amt: Yup.string().required('Contigency Amount is Required'),
  // tot_amt: Yup.string().required('Total Amount is Required'),
  // admin_appr_pdf: Yup.string().required('Administrative Approval(G.O) is Required'),
  // proj_id: Yup.string().required('Project ID is Required'),
  // head_acc: Yup.string().required('Head Account is Required'),
  // dt_appr: Yup.string().required('Date of administrative approval is Required'),
  // proj_sub_by: Yup.string().required('Project Submitted By is Required'),
  // proj_imp_by: Yup.string().required('Project implemented By is Required'),
  // dis: Yup.string().required('District is Required'),
  // block: Yup.string().required('Block is Required'),
  // vet_dpr_pdf: Yup.string().required('Vetted DPR is Required'),
  // src: Yup.string().required('Source of Fund is Required'),

  
});



function AdApForm() {
// axios.defaults.baseURL = url;
// axios.defaults.headers.common['AuthKey'] = 'c299cf0ae55db8193eb2d3116';
// axios.defaults.headers.common['Content-Type'] = 'application/json';
const [sectorDropList, setSectorDropList] = useState([]);
const [financialYear, setFinancialYear] = useState([]);



const fetchSectorDropdownOption = async () => {
  try {
    const response = await axios.post(
      url + 'index.php/webApi/Mdapi/sector',
      {}, // Empty body
      {
        headers: {
          'auth_key': auth_key,
        },
      }
    );

    // console.log("Response Data:", response.data.message); // Log the actual response data
    setSectorDropList(response.data.message)
  } catch (error) {
    console.error("Error fetching data:", error); // Handle errors properly
  }
};

const fetchsetFinancialYeardownOption = async () => {
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

    console.log("Response Data:", response.data.message); // Log the actual response data
    setFinancialYear(response.data.message)
  } catch (error) {
    console.error("Error fetching data:", error); // Handle errors properly
  }
};

 useEffect(()=>{
  // axios.post(url+'index.php/webApi/Mdapi/sector', {},
  //   {headers: { 
  //   'auth_key': auth_key, 
  // }}).then(res=>console.log(res))
  fetchSectorDropdownOption()
  fetchsetFinancialYeardownOption()

 },[])



 const onSubmit = (values) => {
  console.log(values, 'valuesvaluesvaluesvaluesvalues');
  
  // navigation('/search', { state: values});
  // alert('go')
};

 const formik = useFormik({
  // initialValues:formValues,
  initialValues,
  onSubmit,
  validationSchema,
  enableReinitialize: true,
  validateOnMount: true,
});

const sectorList = [
  { sl_no: "1", sector_desc: "State Plan" },
  { sl_no: "2", sector_desc: "Capex" },
  { sl_no: "3", sector_desc: "RIDF" },
  { sl_no: "4", sector_desc: "Others" }
];




  return (
    <section class="bg-white p-5 dark:bg-gray-900">
      <div class="py-5 mx-auto w-full lg:py-5">
       <Heading title={'Document Details'} button={'Y'}/>
       <form onSubmit={formik.handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-12 sm:gap-6">
            <div class="sm:col-span-12">
              <TDInputTemplate
                type="text"
                placeholder="Scheme name goes here..."
                label="Enter scheme name"
                name="scheme_name"
                formControlName={formik.values.scheme_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.scheme_name && formik.touched.scheme_name && (
              <VError title={formik.errors.scheme_name} />
              )}
            </div>
            <div class="sm:col-span-6">
              {/* <TDInputTemplate
                placeholder="Choose Sector"
                type="text"
                label="Sector"
                name="sector_name"
                formControlName={formik.values.sector_name}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              /> */}

          <label for="sector_name" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Sector</label>
          <Select
          placeholder="Choose Sector"
          value={formik.values.sector_name || undefined} // Ensure default empty state
          onChange={(value) => {
          formik.setFieldValue("sector_name", value)
          console.log(value, 'ggggggggggggggggggg');
          }}
          onBlur={formik.handleBlur}
          style={{ width: "100%" }}
          >
          <Select.Option value="" disabled> Choose Sector </Select.Option>
          {sectorDropList.map(sector => (
          <Select.Option key={sector.sl_no} value={sector.sl_no}>
          {sector.sector_desc}
          </Select.Option>
          ))}
          </Select>

            {/* sectorDropList */}
            {/* {JSON.stringify(sectorDropList, null, 2)} */}

          {formik.errors.sector_name && formik.touched.sector_name && (
          <VError title={formik.errors.sector_name} />
          )}
            </div>
            <div class="sm:col-span-6">
              {/* <TDInputTemplate
                placeholder="Choose Financial Year"
                type="text"
                label="Financial Year"
                name="fin_yr"
                formControlName={formik.values.fin_yr}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              /> */}
              <label for="fin_yr" class="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">Sector</label>
              <Select
              placeholder="Choose Sector"
              value={formik.values.fin_yr || undefined} // Ensure default empty state
              onChange={(value) => {
              formik.setFieldValue("fin_yr", value)
              console.log(value, 'ggggggggggggggggggg');
              }}
              onBlur={formik.handleBlur}
              style={{ width: "100%" }}
              >
              <Select.Option value="" disabled> Choose Financial Year </Select.Option>
              {financialYear.map(data => (
              <Select.Option key={data.sl_no} value={data.sl_no}>
              {data.fin_year}
              </Select.Option>
              ))}
              </Select>

              {formik.errors.fin_yr && formik.touched.fin_yr && (
              <VError title={formik.errors.fin_yr} />
              )}
            </div>
          <div className="sm:col-span-12 text-blue-900 text-md font-bold mt-3 -mb-2">
            Amount of administrative approval
          </div>
          <div class="sm:col-span-4">
              <TDInputTemplate
                 placeholder="Schematic amount goes here..."
                 type="number"
                 label="Schematic Amount"
                 name="schm_amt"
                formControlName={formik.values.schm_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.schm_amt && formik.touched.schm_amt && (
              <VError title={formik.errors.schm_amt} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Contigency amount goes here..."
                type="number"
                label="Contigency Amount"
                name="cont_amt"
                formControlName={formik.values.cont_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.cont_amt && formik.touched.cont_amt && (
              <VError title={formik.errors.cont_amt} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Total amount goes here..."
                type="number"
                label="Total Amount"
                name="tot_amt"
                formControlName={formik.values.tot_amt}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.tot_amt && formik.touched.tot_amt && (
              <VError title={formik.errors.tot_amt} />
              )}
            </div>
            <hr className="sm:col-span-12"/>

            {/* <div class="sm:col-span-8">
              <TDInputTemplate
                placeholder="Administrative Approval"
                type="text"
                label="Administrative Approval"
                name="admin_appr"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div> */}
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Administrative Approval(G.O)"
                type="file"
                label="Administrative Approval(G.O)"
                name="admin_appr_pdf"
                formControlName={formik.values.admin_appr_pdf}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.admin_appr_pdf && formik.touched.admin_appr_pdf && (
              <VError title={formik.errors.admin_appr_pdf} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Choose Project ID"
                type="text"
                label="Project ID"
                name="proj_id"
                formControlName={formik.values.proj_id}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.proj_id && formik.touched.proj_id && (
              <VError title={formik.errors.proj_id} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Choose Head Account"
                type="text"
                label="Head Account"
                name="head_acc"
                formControlName={formik.values.head_acc}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              />
              {formik.errors.head_acc && formik.touched.head_acc && (
              <VError title={formik.errors.head_acc} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Date of administrative approval"
                type="date"
                label="Date of administrative approval"
                name="dt_appr"
                formControlName={formik.values.dt_appr}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.dt_appr && formik.touched.dt_appr && (
              <VError title={formik.errors.dt_appr} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label="Project Submitted By"
                name="proj_sub_by"
                formControlName={formik.values.proj_sub_by}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.proj_sub_by && formik.touched.proj_sub_by && (
              <VError title={formik.errors.proj_sub_by} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Name goes here..."
                type="text"
                label="Project implemented By"
                name="proj_imp_by"
                formControlName={formik.values.proj_imp_by}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.proj_imp_by && formik.touched.proj_imp_by && (
              <VError title={formik.errors.proj_imp_by} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Choose District"
                type="text"
                label="District"
                name="dis"
                formControlName={formik.values.dis}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              />
              {formik.errors.dis && formik.touched.dis && (
              <VError title={formik.errors.dis} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Choose Block"
                type="text"
                label="Block"
                name="block"
                formControlName={formik.values.block}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              />
              {formik.errors.block && formik.touched.block && (
              <VError title={formik.errors.block} />
              )}
            </div>
            {/* <div class="sm:col-span-8">
              <TDInputTemplate
                placeholder="Vetted DPR"
                type="text"
                label="Vetted DPR"
                name="vet_dpr"
                // formControlName={formik.values.email}
                // handleChange={formik.handleChange}
                // handleBlur={formik.handleBlur}
                mode={1}
              />
            </div> */}
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Vetted DPR"
                type="file"
                label="Vetted DPR"
                name="vet_dpr_pdf"
                formControlName={formik.values.vet_dpr_pdf}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={1}
              />
              {formik.errors.vet_dpr_pdf && formik.touched.vet_dpr_pdf && (
              <VError title={formik.errors.vet_dpr_pdf} />
              )}
            </div>
            <div class="sm:col-span-4">
              <TDInputTemplate
                placeholder="Choose Source of Fund"
                type="text"
                label="Source of Fund"
                name="src"
                formControlName={formik.values.src}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
                mode={2}
              />
              {formik.errors.src && formik.touched.src && (
              <VError title={formik.errors.src} />
              )}
            </div>
        <div className="sm:col-span-12 flex justify-center gap-4 mt-4">
         <BtnComp title={'Reset'}  type="reset" onClick={()=>{}} width={'w-1/6'} bgColor={'bg-white'} color="text-blue-900" border={'border-2 border-blue-900'}/>
         {/* <button type="submit">Search</button> */}
         <BtnComp type={'submit'} title={'Submit'} onClick={()=>{}} width={'w-1/6'} bgColor={'bg-blue-900'}/>
         </div>
          </div>

        </form>
      </div>
    </section>
  );
}

export default AdApForm;
