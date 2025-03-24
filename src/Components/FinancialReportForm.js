import React from "react";
import { Select } from "antd";
// import BtnComp from "../../Components/BtnComp";
// import VError from "../../Components/VError";
import { BarChartOutlined } from "@ant-design/icons";
import BtnComp from "./BtnComp";
import VError from "./VError";
import { useNavigate } from 'react-router-dom'

const FinancialReportForm = ({ 
  formik, 
  financialYearDropList,
  onGraphView 
}) => {

const navigate = useNavigate()
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-12 sm:gap-6">
        <div className="sm:col-span-4">
          <label htmlFor="fin_yr" className="block mb-2 text-sm capitalize font-bold text-slate-500 dark:text-gray-100">
            Financial Year
          </label>
          <Select
            showSearch
            placeholder="Choose Financial Year"
            value={formik.values.fin_yr || undefined}
            onChange={(value) => formik.setFieldValue("fin_yr", value)}
            onBlur={formik.handleBlur}
            style={{ width: "100%" }}
            optionFilterProp="children"
            filterOption={(input, option) => 
              option?.children?.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Select.Option value="" disabled>Choose Financial Year</Select.Option>
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
        me-0 mb-0 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 
        dark:focus:ring-blue-800 ml-auto"
        // onClick={() => { navigate(`/home/report/financial-report-graph/${financeYear_submit == "" ? params?.id : financeYear_submit}`) }}
        onClick={onGraphView}
        > <BarChartOutlined /> Graphical View</button>

        </div>
      </div>
    </form>
  );
};

export default FinancialReportForm;