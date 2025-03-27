import React from 'react'
import BarChartComponent from './BarChartComponent'
import ProgressBarChart from './ProgressBarChart'
import BarChartFundComponent from './BarChartFundComponent'
import PieChartComponent from './PieChartComponent'

function ReportGraph({
    reportName,
    sectorwiseData,
    accountwiseData,
    districtwiseData,
    implementwiseData,
    progresswiseData,
    fundwiseData
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-12 sm:gap-6 mt-10">
                        
                      <div className="sm:col-span-6">

                      
                      <BarChartComponent  data={sectorwiseData} title_page={'Sector Wise'} tooltip_name={'Number Of Projects'} title_Barchart={'Number Of Projects'} key_name_1={'number_of_project'} key_name_2={'sector_name'} bar_name={'Sector'} />
                      
                      </div>

                      <div className="sm:col-span-6">
                      
                      <BarChartComponent  data={accountwiseData} title_page={'Account Head Wise'} tooltip_name={'Number Of Projects'} title_Barchart={'Number Of Projects'} key_name_1={'number_of_project'} key_name_2={'account_head'} bar_name={'Account Head'} />
                      
                      </div>

                      <div className="sm:col-span-6">
                      
                      <PieChartComponent data={districtwiseData} title_page={'District Wise Project'}/>
                      
                      </div>

                      <div className="sm:col-span-6">
                      
                      <BarChartComponent  data={implementwiseData} title_page={'Implementing Agency Wise'} tooltip_name={'Number Of Projects'} title_Barchart={'Number Of Projects'} key_name_1={'number_of_project'} key_name_2={'agency_name'} bar_name={'Implementing Agency'} />
                    
                      </div>

                      <div className="sm:col-span-12">
                      
                      <ProgressBarChart  data={progresswiseData} title_page={'Progress Wise'} tooltip_name={'xxxxx'} title_Barchart={'Progress'} key_name_1={'progress_percent'} key_name_2={'project_id'} key_name_3={'scheme_name'} bar_name={'Progress'} />
                    
                      </div>

                      <div className="sm:col-span-12">
                      
                      <BarChartFundComponent  data={fundwiseData} title_page={'Fund Release/Receipt Vs Expenditure'} tooltip_name={'Rs'} title_Barchart={'Amount'} key_name_1={'fund_release'} key_name_2={'project_id'} key_name_3={'fund_expense'}  key_name_4={'scheme_name'} bar_name={'Fund'} />
                    
                      </div>

                      

                      {/* <div className="sm:col-span-12">
                      
                      <BarChartComponent  data={expwiseData} title_page={'Expenditure Wise'} tooltip_name={'Expenditure'} title_Barchart={'Amount'} key_name_1={'total_amt'} key_name_2={'project_id'} bar_name={'Expenditure'} />
                    
                      </div> */}


                      </div>
  )
}

export default ReportGraph