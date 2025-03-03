import React from 'react'
import { Button, Result } from 'antd';
function Result({code,message}) {
  return (
    <Result
    status={code}
    title={code}
    subTitle={message}
    extra={<Button type="primary">Back Home</Button>}
  />
  )
}

export default Result
