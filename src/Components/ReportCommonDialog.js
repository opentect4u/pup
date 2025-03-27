// CommonDialog.jsx
import React from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import Column from 'antd/es/table/Column';
import { FilePdfOutlined, PrinterOutlined, FileExcelOutlined } from "@ant-design/icons";
import { proj_final_pic, url } from "../Assets/Addresses/BaseUrl";
import { Image } from 'antd';

const ReportCommonDialog = ({
  visible,
  onHide,
  title,
  data,
  columns,
  printHandler,
  exportHandler,
  additionalContent,
  final_pic,
  width = "100vw",
  maxWidth = "1200px"
}) => {
  return (
    <Dialog
      header={
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <div>
            <button onClick={printHandler} className="downloadXL">
              <PrinterOutlined /> Print
            </button>
            <button onClick={exportHandler} className="downloadXL">
              <FileExcelOutlined /> Download
            </button>
          </div>
        </div>
      }
      visible={visible}
      style={{ width, maxWidth }}
      onHide={onHide}
      dismissableMask={true}
    >
      <DataTable
        value={data?.map((item, i) => [{ ...item, id: i }]).flat()}
        selectionMode="checkbox"
        tableStyle={{ minWidth: "50rem" }}
        dataKey="id"
        tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st"
      >
        {columns.map((column, index) => (
          <Column
            key={index}
            field={column.field}
            header={column.header}
            body={column.body}
          />
        ))}
      </DataTable>

      {/* {imgData}
      {JSON.stringify(imgData, null, 2)} */}

      {final_pic?.length > 0 && (
          <div class="w-full p-4 text-left bg-white border border-gray-200 rounded-lg shadow-sm sm:p-0 dark:bg-gray-800 dark:border-gray-700 mt-5 mb-5 shadow-xl">
            <div class="flex flex-col justify-between p-4 leading-normal">
              <h5 class="mb-2 text-sm font-bold text-gray-900 dark:text-white">Utilization Certificate Final Photo</h5>

              <div className="place-content-left flex items-left gap-4">
                <Image width={80} className="mr-3" src={url + proj_final_pic + final_pic[0]?.final_pic} />
              </div>
            </div>
          </div>
        )}
      
      {additionalContent && additionalContent}
    </Dialog>
  );
};

export default ReportCommonDialog;