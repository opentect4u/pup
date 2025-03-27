// PdfViewerDialog.jsx
import React from "react";
import { Dialog } from "primereact/dialog";

const ReportPDFViewerDialog = ({ visible, onHide, title, pdfUrl }) => {
  return (
    <Dialog
      header={title}
      visible={visible}
      style={{ width: "70vw", maxWidth: "800px" }}
      onHide={onHide}
      dismissableMask={true}
    >
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="500px"
          title={title}
        ></iframe>
      )}
    </Dialog>
  );
};

export default ReportPDFViewerDialog;