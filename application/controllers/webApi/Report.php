<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Report extends CI_Controller {

	public function __construct() {
        parent::__construct();
		header("Access-Control-Allow-Origin: *"); // Allow all domains
        header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow specific methods
        header("Access-Control-Allow-Headers: Content-Type");
		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			exit;
		} 
		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $response = array(
                'status' => false,
                'message' => 'Only POST method is allowed'
            );
            echo json_encode($response);
            exit;
        }
        $this->validate_auth_key();
    }

	private function validate_auth_key() {
        $auth_key = $this->input->get_request_header('auth_key'); // Get from header
        $valid_key = AUTH_KEY; // Store securely in .env or database
        if ($auth_key !== $valid_key) {
            $response = array(
                'status' => false,
                'message' => 'Unauthorized access'
            );
            echo json_encode($response);
            exit; // Stop execution
        }
    }

	public function proj_dtl_finyearwise() {
		
		$fin_year = $this->input->post('fin_year');
	// 	$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,a.admin_approval,a.vetted_dpr,
	// 	                b.invite_auth,
	// 					b.tender_date,b.tender_notice,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
	// 					c.sector_desc AS sector_name,
	// 	                d.fin_year, e.dist_name, 
	// 					f.block_name,g.agency_name,
	// 					h.account_head as account_head_name,
	// 					i.fund_type as source_of_fund,
	// 					sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
	// 					FROM td_admin_approval a 
	// 					JOIN md_sector c ON a.sector_id = c.sl_no 
	// 					JOIN md_fin_year d ON a.fin_year = d.sl_no 
	// 					JOIN md_district e ON a.district_id = e.dist_code 
	// 					JOIN md_block f ON a.block_id = f.block_id 
	// 					JOIN md_proj_imp_agency g ON a.impl_agency = g.id
	// 					LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
	// 					LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
	// 					JOIN md_account h ON h.sl_no = a.account_head 
	// 					JOIN md_fund i ON i.sl_no = a.fund_id
	// 					LEFT JOIN td_tender b ON b.approval_no = a.approval_no 
	// 					AND b.tender_date = (
	// 						SELECT MAX(t2.tender_date) 
	// 						FROM td_tender t2 
	// 						WHERE t2.approval_no = a.approval_no
	// 					)
	// 				    WHERE a.fin_year = '".$fin_year."'  GROUP BY 
    // a.approval_no, a.admin_approval_dt, a.scheme_name,a.project_submit,b.tender_date,b.tender_notice,c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,h.account_head,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx";

	$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,a.admin_approval,a.vetted_dpr,
						c.sector_desc AS sector_name,
		                d.fin_year, e.dist_name, 
						f.block_name,g.agency_name,
						h.account_head as account_head_name,
						i.fund_type as source_of_fund,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						JOIN md_sector c ON a.sector_id = c.sl_no 
						JOIN md_fin_year d ON a.fin_year = d.sl_no 
						JOIN md_district e ON a.district_id = e.dist_code 
						JOIN md_block f ON a.block_id = f.block_id 
						JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						JOIN md_account h ON h.sl_no = a.account_head 
						JOIN md_fund i ON i.sl_no = a.fund_id
					    WHERE a.fin_year = '".$fin_year."'  GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name,a.project_submit,c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,h.account_head";
	    $result_data = $this->db->query($sql)->result();
		if($fin_year == ''){
			$response = ['status' => 0, 'message' => 'Please provide financial year'];
			
		}else{
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		}
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function tender_list() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
	
		$where['approval_no'] = $approval_no;
		$result_data = $this->Master->f_select('td_tender','sl_no,tender_date,tender_notice,invite_auth,mat_date,tender_status,wo_date,wo_copy,wo_value,comp_date_apprx,amt_put_to_tender,dlp,add_per_security,emd,date_of_refund', $where, 0);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	public function progress_list() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
		$where['approval_no'] = $approval_no;
		$result_data = $this->Master->f_select('td_progress','visit_no,progress_percent,pic_path,lat,long,address,created_at', $where, 0);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	public function fundrelease() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
		$where['approval_no'] = $approval_no;
		$result_data = $this->Master->f_select('td_fund_receive','receive_no,receive_date,received_by,instl_amt,allotment_no,sch_amt,cont_amt', $where, 0);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	public function expenditure() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
		$where['approval_no'] = $approval_no;
		$result_data = $this->Master->f_select('td_expenditure','payment_no,payment_date,payment_to,sch_amt,cont_amt,sch_remark,cont_remark', $where, 0);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	public function utilization() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
		$where['approval_no'] = $approval_no;
		$result_data = $this->Master->f_select('td_utilization','certificate_no,certificate_date,certificate_path,issued_by,issued_to,remarks,is_final', $where, 0);
		$final_pic = $this->Master->f_select('td_proj_final_pic','certificate_no,final_pic', $where, 0);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'final_pic' => $final_pic] 
			: ['status' => 0, 'message' => 'No data found'];
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function graphical_data_finyearwise(){
		$fin_year = $this->input->post('fin_year');
		$sql = "select count(*) as number_of_project ,b.sector_desc as sector_name from td_admin_approval a,md_sector b where a.sector_id = b.sl_no and a.fin_year = '".$fin_year."' group by a.sector_id";
		$result_data = $this->db->query($sql)->result();
		$sql_acchead = "select count(*) as number_of_project ,b.account_head as account_head from td_admin_approval a,md_account b where a.account_head = b.sl_no and a.fin_year = '".$fin_year."' group by a.account_head";
		$resacc_data = $this->db->query($sql_acchead)->result();
		$sql_dist = "select count(*) as number_of_project ,b.dist_name as dist_name from td_admin_approval a,md_district b where a.district_id = b.dist_code and a.fin_year = '".$fin_year."' group by a.district_id";
		$resdist_data = $this->db->query($sql_dist)->result();
		$sql_impagency = "select count(*) as number_of_project ,b.agency_name as agency_name from td_admin_approval a,md_proj_imp_agency b where a.impl_agency = b.id and a.fin_year = '".$fin_year."' group by a.impl_agency";
		$resimpagency_data = $this->db->query($sql_impagency)->result();
		$sql_expenditure = "select sum(a.sch_amt) + sum(a.cont_amt) as total_amt,b.project_id from td_expenditure a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id";
		$res_expenditure = $this->db->query($sql_expenditure)->result();
		$sql_progress = "select sum(a.progress_percent) as progress_percent,b.project_id from td_progress a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id";
		$res_progress = $this->db->query($sql_progress)->result();
		$sql_fund = "select sum(a.instl_amt) as instl_amt , sum(a.sch_amt) as sch_amt,sum(a.cont_amt) as cont_amt,b.project_id from td_fund_receive a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id";
		$res_fund = $this->db->query($sql_fund)->result();
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'sectorwise' => $result_data,'accountwise' => $resacc_data,'distwise' => $resdist_data,'impagencywise' => $resimpagency_data,'progress' => $res_progress,'fund' => $res_fund,'expenditure' => $res_expenditure] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	public function graphical_data_finyearwise1(){
		$fin_year = $this->input->post('fin_year');
		$sql = "select count(*) as number_of_project ,b.sector_desc as sector_name from td_admin_approval a,md_sector b where a.sector_id = b.sl_no and a.fin_year = '".$fin_year."' group by a.sector_id";
		$result_data = $this->db->query($sql)->result();
		$sql_acchead = "select count(*) as number_of_project ,b.account_head as account_head from td_admin_approval a,md_account b where a.account_head = b.sl_no and a.fin_year = '".$fin_year."' group by a.account_head";
		$resacc_data = $this->db->query($sql_acchead)->result();
		$sql_dist = "select count(*) as number_of_project ,b.dist_name as dist_name from td_admin_approval a,md_district b where a.district_id = b.dist_code and a.fin_year = '".$fin_year."' group by a.district_id";
		$resdist_data = $this->db->query($sql_dist)->result();
		$sql_impagency = "select count(*) as number_of_project ,b.agency_name as agency_name from td_admin_approval a,md_proj_imp_agency b where a.impl_agency = b.id and a.fin_year = '".$fin_year."' group by a.impl_agency";
		$resimpagency_data = $this->db->query($sql_impagency)->result();
		$sql_expenditure = "select sum(a.sch_amt) as sch_amt,sum(a.cont_amt) as cont_amt,b.project_id from td_expenditure a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id";
		$res_expenditure = $this->db->query($sql_expenditure)->result();
		$sql_progress = "select sum(a.progress_percent) as progress_percent,b.project_id from td_progress a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id";
		$res_progress = $this->db->query($sql_progress)->result();
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'sectorwise' => $result_data,'accountwise' => $resacc_data,'distwise' => $resdist_data,'impagencywise' => $resimpagency_data,'expenditure' => $res_expenditure,'progress' => $res_progress] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function proj_dtl_accwise() {
		
		$account_head = $this->input->post('account_head_id');
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,a.admin_approval,a.vetted_dpr,
						c.sector_desc AS sector_name,
		                d.fin_year, e.dist_name, 
						f.block_name,g.agency_name,
						h.account_head as account_head_name,
						i.fund_type as source_of_fund,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						JOIN md_sector c ON a.sector_id = c.sl_no 
						JOIN md_fin_year d ON a.fin_year = d.sl_no 
						JOIN md_district e ON a.district_id = e.dist_code 
						JOIN md_block f ON a.block_id = f.block_id 
						JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						JOIN md_account h ON h.sl_no = a.account_head 
						JOIN md_fund i ON i.sl_no = a.fund_id
					    WHERE a.account_head = '".$account_head."'  GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name,a.project_submit,c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,h.account_head";
	    $result_data = $this->db->query($sql)->result();
		if($account_head == ''){
			$response = ['status' => 0, 'message' => 'Required Field Missing'];
		}else{
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		}
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	
	public function proj_dtl_sectorwise() {
		
		$sector_id = $this->input->post('sector_id');
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,
		                b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
						c.sector_desc AS sector_name,
		                d.fin_year, e.dist_name, 
						f.block_name,g.agency_name,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						INNER JOIN md_sector c ON a.sector_id = c.sl_no 
						INNER JOIN md_fin_year d ON a.fin_year = d.sl_no 
						INNER JOIN md_district e ON a.district_id = e.dist_code 
						INNER JOIN md_block f ON a.block_id = f.block_id 
						INNER JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						LEFT JOIN td_tender b ON b.approval_no = a.approval_no 
						AND b.tender_date = (
							SELECT MAX(t2.tender_date) 
							FROM td_tender t2 
							WHERE t2.approval_no = a.approval_no
						)
					    WHERE a.sector_id = '".$sector_id."'  GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name, c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx";
	    $result_data = $this->db->query($sql)->result();
		if($sector_id == ''){
			$response = ['status' => 0, 'message' => 'Required Field Missing'];
			
		}else{
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		}
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }
	public function proj_dtl_distblock() {
		
		$dist = $this->input->post('dist_id');
		$block = $this->input->post('block_id');
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,
		                b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
						c.sector_desc AS sector_name,
		                d.fin_year, e.dist_name, 
						f.block_name,g.agency_name,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						INNER JOIN md_sector c ON a.sector_id = c.sl_no 
						INNER JOIN md_fin_year d ON a.fin_year = d.sl_no 
						INNER JOIN md_district e ON a.district_id = e.dist_code 
						INNER JOIN md_block f ON a.block_id = f.block_id 
						INNER JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						LEFT JOIN td_tender b ON b.approval_no = a.approval_no 
						AND b.tender_date = (
							SELECT MAX(t2.tender_date) 
							FROM td_tender t2 
							WHERE t2.approval_no = a.approval_no
						)
					    WHERE a.district_id = '".$dist."' AND a.block_id = '".$block."' GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name, c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx";
	    $result_data = $this->db->query($sql)->result();
		if($dist == '' || $block == ''){
			$response = ['status' => 0, 'message' => 'Required Field Missing'];
			
		}else{
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		}
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function proj_dtl_impagency() {
		
		$impl_agency = $this->input->post('impl_agency');
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,
		                b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
						c.sector_desc AS sector_name,
		                d.fin_year, e.dist_name, 
						f.block_name,g.agency_name,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						INNER JOIN md_sector c ON a.sector_id = c.sl_no 
						INNER JOIN md_fin_year d ON a.fin_year = d.sl_no 
						INNER JOIN md_district e ON a.district_id = e.dist_code 
						INNER JOIN md_block f ON a.block_id = f.block_id 
						INNER JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						INNER JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						INNER JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						LEFT JOIN td_tender b ON b.approval_no = a.approval_no 
						AND b.tender_date = (
							SELECT MAX(t2.tender_date) 
							FROM td_tender t2 
							WHERE t2.approval_no = a.approval_no
						)
					    WHERE a.impl_agency = '".$impl_agency."' GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name, c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx";
	    $result_data = $this->db->query($sql)->result();
		if($impl_agency == ''){
			$response = ['status' => 0, 'message' => 'Required Field Missing'];
			
		}else{
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		}
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	
	
}
