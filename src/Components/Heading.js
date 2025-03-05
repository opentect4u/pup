import React from 'react'
import BtnComp from './BtnComp'
import { use } from 'react'
import { useNavigate } from 'react-router-dom'
import { LeftOutlined } from '@ant-design/icons'

function Heading({title,button}) {
const navigate = useNavigate()
  return (
    <div className='flex gap-2 items-center mb-3'>
        {button === 'Y' ? <BtnComp title={<LeftOutlined className='text-sm' />} onClick={()=>navigate(-1)} width="1/6" rounded="rounded-full" />:null}
    <h2 class=" text-lg capitalize font-semibold text-blue-900 dark:text-white">
    {title}
   </h2>
   
   </div>
  )
}

export default Heading
