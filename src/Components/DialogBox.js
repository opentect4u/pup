import React from 'react'
import { Button, Modal } from 'antd';
function DialogBox({isModalOpen,handleOk,handleCancel,flag}) {

  
   
  return (
    <Modal title={flag==1?"Warning!":""} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
    {flag==1 && <p>Are you sure you want to sign out?</p>}
  </Modal>
  )
}

export default DialogBox
