import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { auth_key, url } from "../../Assets/Addresses/BaseUrl";
import FinancialReportTable from "../../Components/FinancialReportTable";
import FinancialReportForm from "../../Components/FinancialReportForm"; // You'll need to create this
import Heading from "../../Components/Heading";

function Financial_Report() {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [financialYearDropList, setFinancialYearDropList] = useState([]);
  const [financeYear_submit, setFinanceYear_submit] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  // State for column visibility
  const [showColumns, setShowColumns] = useState({
    showHeadAcc: false,
    showProSubBy: false,
    showProImpleBy: false,
    showAdmiApprovPdf: false,
    showVettedDPR: false,
    showScheAmt: false,
    showContiAmt: false,
    showTenderDtl: false,
    showProgresDtl: false,
    showFundDtl: false,
    showExpendDtl: false,
    showUtilizationDtl: false,
    showBlockName: false,
    visibleMenu: false
  });

  const formik = useFormik({
    initialValues: { fin_yr: params?.id || "" },
    validationSchema: Yup.object({
      fin_yr: Yup.string().required('Financial Year is Required'),
    }),
    onSubmit: (values) => {
      showReport(values.fin_yr);
    },
  });

  const fetchFinancialYeardownOption = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        url + 'index.php/webApi/Mdapi/fin_year',
        {},
        { headers: { 'auth_key': auth_key } }
      );
      setFinancialYearDropList(response.data.message);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const showReport = async (year) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("fin_year", year);
    setFinanceYear_submit(year);

    try {
      const response = await axios.post(
        `${url}index.php/webApi/Report/proj_dtl_finyearwise`,
        formData,
        { headers: { "Content-Type": "multipart/form-data", 'auth_key': auth_key } }
      );
      setReportData(response?.data?.status > 0 ? response.data.message : []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error submitting form:", error);
    }
  };

  const handleToggleColumn = (column, value) => {
    setShowColumns(prev => ({ ...prev, [column]: value }));
  };


  const testAray = {
    showHeadAcc:true
  }
  const handleShowAllColumns = () => {
    const newValue = !showColumns.showAll;
    const updatedColumns = {
      showHeadAcc: newValue,
      showProSubBy: newValue,
      showProImpleBy: newValue,
      showAdmiApprovPdf: newValue,
      showVettedDPR: newValue,
      showScheAmt: newValue,
      showContiAmt: newValue,
      showTenderDtl: newValue,
      showProgresDtl: newValue,
      showFundDtl: newValue,
      showExpendDtl: newValue,
      showUtilizationDtl: newValue,
      showBlockName: newValue,
      showAll: newValue
    };
    setShowColumns(prev => ({ ...prev, ...updatedColumns }));
  };

  const handleOpenModal = (file, folder, title) => {
    // Your modal opening logic
  };

  const handleOpenModalTable = (file, title, type) => {
    // Your modal table opening logic
  };

  useEffect(() => {
    fetchFinancialYeardownOption();
    if (params?.id) {
      showReport(params.id);
    }
  }, [params?.id]);

  return (
    <section className="bg-white p-5 dark:bg-gray-900">
      <div className="py-5 mx-auto w-full lg:py-5">
        <div className="grid grid-cols-1 gap-4">
          <Heading title={"Financial Yearwise Report"} button="N" />

          <FinancialReportForm 
            formik={formik}
            financialYearDropList={financialYearDropList}
            onGraphView={() => navigate(`/home/report/financial-report-graph/${financeYear_submit == "" ? params?.id : financeYear_submit}`)}
          />

          <FinancialReportTable
            loading={loading}
            reportData={reportData}
            financialYear={financeYear_submit || params?.id}
            showColumns={showColumns}
            onToggleColumn={handleToggleColumn}
            onShowAllColumns={handleShowAllColumns}
            onOpenModal={handleOpenModal}
            onOpenModalTable={handleOpenModalTable}
            testAray={testAray}
          />
        </div>
      </div>
    </section>
  );
}

export default Financial_Report;