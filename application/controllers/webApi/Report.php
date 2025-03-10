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
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,c.sector_desc AS sector_name, d.fin_year, a.project_id,e.dist_name, 
						f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						JOIN md_sector c ON a.sector_id = c.sl_no 
						JOIN md_fin_year d ON a.fin_year = d.sl_no 
						JOIN md_district e ON a.district_id = e.dist_code 
						JOIN md_block f ON a.block_id = f.block_id 
						JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						LEFT JOIN td_tender b ON b.approval_no = a.approval_no 
						AND b.tender_date = (
							SELECT MAX(t2.tender_date) 
							FROM td_tender t2 
							WHERE t2.approval_no = a.approval_no
						)
					    WHERE a.fin_year = '".$fin_year."'  GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name, c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx";
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

	public function proj_dtl_accwise() {
		
		$account_head = $this->input->post('account_head_id');
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,c.sector_desc AS sector_name, d.fin_year, a.project_id,e.dist_name, 
						f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
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
					    WHERE a.account_head = '".$account_head."'  GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name, c.sector_desc,d.fin_year, a.project_id, e.dist_name,f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx";
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
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,c.sector_desc AS sector_name, d.fin_year, a.project_id,e.dist_name, 
						f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
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
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,c.sector_desc AS sector_name, d.fin_year, a.project_id,e.dist_name, 
						f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
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
		$sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,c.sector_desc AS sector_name, d.fin_year, a.project_id,e.dist_name, 
						f.block_name,g.agency_name,b.invite_auth,b.mat_date,b.wo_date,b.wo_copy,b.wo_value,b.comp_date_apprx,
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
