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
        // $headers = $this->input->request_headers();
		// $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

		// if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
		// 	$token = $matches[1];
		// 	$user = $this->User_model->get_user_by_token($token);
		// 	if ($user) {
		// 		$this->user = $user;
		// 		return;
		// 	}
		// }

		// http_response_code(401);
		// header('Content-Type: application/json');
		// echo json_encode([
		// 	'status' => 0,
		// 	'error_code' => 401,
		// 	'message' => 'Unauthorized or Token Expired'
		// ]);
		// exit;
		$this->load->helper('pdf');
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
			$res_fin_data = $this->db->query('select fin_year FROM md_fin_year where sl_no="'.$fin_year.'"')->row();
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'fin_year_name' => $res_fin_data->fin_year] 
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
		$sql = "select count(*) as number_of_project,b.sector_desc as sector_name from td_admin_approval a,md_sector b where a.sector_id = b.sl_no and a.fin_year = '".$fin_year."' group by a.sector_id";
		$result_data = $this->db->query($sql)->result();
		$sql_acchead = "select count(*) as number_of_project ,a.scheme_name,b.account_head as account_head from td_admin_approval a,md_account b where a.account_head = b.sl_no and a.fin_year = '".$fin_year."' group by a.account_head,a.scheme_name";
		$resacc_data = $this->db->query($sql_acchead)->result();
		$sql_dist = "select count(*) as number_of_project ,b.dist_name as dist_name from td_admin_approval a,md_district b where a.district_id = b.dist_code and a.fin_year = '".$fin_year."' group by a.district_id";
		$resdist_data = $this->db->query($sql_dist)->result();
		$sql_impagency = "select count(*) as number_of_project ,b.agency_name as agency_name from td_admin_approval a,md_proj_imp_agency b where a.impl_agency = b.id and a.fin_year = '".$fin_year."' group by a.impl_agency";
		$resimpagency_data = $this->db->query($sql_impagency)->result();
		$sql_expenditure = "select sum(a.sch_amt) + sum(a.cont_amt) as total_amt,b.scheme_name,b.project_id from td_expenditure a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id,b.scheme_name";
		$res_expenditure = $this->db->query($sql_expenditure)->result();
		$sql_progress = "select sum(a.progress_percent) as progress_percent,b.scheme_name,b.project_id from td_progress a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id,b.scheme_name";
		$res_progress = $this->db->query($sql_progress)->result();
		$sql_fund = "select sum(a.instl_amt) as instl_amt , sum(a.sch_amt) as sch_amt,sum(a.cont_amt) as cont_amt,b.scheme_name,b.project_id from td_fund_receive a,td_admin_approval b where a.approval_no = b.approval_no and b.fin_year = '".$fin_year."' group by b.project_id,b.scheme_name";
		$res_fund = $this->db->query($sql_fund)->result();

		$sql_fund_release_espense = "SELECT 
						f.project_id,
						f.scheme_name,
						IFNULL(f.fund_release, 0) AS fund_release,
						IFNULL(e.fund_expense, 0) AS fund_expense
					FROM 
						(SELECT 
							b.project_id,
							b.scheme_name,
							SUM(a.sch_amt) + SUM(a.cont_amt) AS fund_release
						FROM td_fund_receive a
						JOIN td_admin_approval b ON a.approval_no = b.approval_no
						WHERE b.fin_year = '".$fin_year."'
						GROUP BY b.project_id, b.scheme_name) f
					LEFT JOIN 
						(SELECT 
							b.project_id,
							b.scheme_name,
							SUM(a.sch_amt) + SUM(a.cont_amt) AS fund_expense
						FROM td_expenditure a
						JOIN td_admin_approval b ON a.approval_no = b.approval_no
						WHERE b.fin_year = '".$fin_year."'
						GROUP BY b.project_id, b.scheme_name) e
					ON f.project_id = e.project_id AND f.scheme_name = e.scheme_name";

        $res_fund_release_espense = $this->db->query($sql_fund_release_espense)->result();

		if($fin_year == ''){
			$response = ['status' => 0, 'message' => 'Please provide financial year'];
			
		}else{
			$res_fin_data = $this->db->query('select fin_year FROM md_fin_year where sl_no="'.$fin_year.'"')->row();
			$response = (!empty($result_data)) 
			? ['status' => 1, 'sectorwise' => $result_data,'accountwise' => $resacc_data,'distwise' => $resdist_data,'impagencywise' => $resimpagency_data,'progress' => $res_progress,'fund_expenditure'=>$res_fund_release_espense,'fund' => $res_fund,'expenditure' => $res_expenditure] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
	}
    /////       ***** Project Detail Report Accountwise *****     /////
	public function proj_dtl_finawith() {
		$con = '';
		$fin_year = $this->input->post('fin_year');
		$account_head = $this->input->post('account_head_id');
		$sector_id = $this->input->post('sector_id');
		$dist = $this->input->post('dist_id');
		$block = $this->input->post('block_id');
		$impl_agency = $this->input->post('impl_agency');
		$acc_head_name = ''; $sector_name = '';$dist_name = '';$block_name = '';$agency_name = '';
		
		if ($account_head > 0) {
			$con .= " AND a.account_head = '".$account_head."'";
			$acc_head_name .= $this->db->query('select account_head FROM md_account where sl_no="'.$account_head.'"')->row()->account_head;
		}

		if ($sector_id > 0) {
			$con .= " AND a.sector_id = '".$sector_id."'";
			$sector_name .= $this->db->query('select sector_desc FROM md_sector where sl_no="'.$sector_id.'"')->row()->sector_desc;
		}
		if ($dist > 0) {
			$con .= " AND pd.district_id = '".$dist."'";
			$dist_name .= $this->db->query('select dist_name FROM md_district where dist_code="'.$dist.'"')->row()->dist_name;
		}

		if ($block > 0) {
			$con .= " AND pb.block_id = '".$block."'";	
			$block_name .= $this->db->query('select block_name FROM md_block where block_id="'.$block.'"')->row()->block_name;
		}

		if ($impl_agency > 0) {
			$con .= " AND a.impl_agency = '".$impl_agency."'";
			$agency_name .= $this->db->query('select agency_name FROM md_proj_imp_agency where id="'.$impl_agency.'"')->row()->agency_name;	
		}
        if($account_head > 0  || $sector_id > 0 || $dist > 0 || $block > 0 || $impl_agency > 0){
	    $sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.project_submit as project_submitted_by,a.admin_approval,a.vetted_dpr,
						c.sector_desc AS sector_name,
		                d.fin_year,
						GROUP_CONCAT(DISTINCT e.dist_name ORDER BY e.dist_name SEPARATOR ', ') as dist_name,
						GROUP_CONCAT(DISTINCT f.block_name ORDER BY f.block_name SEPARATOR ', ') as block_name,
						g.agency_name,
						h.account_head as account_head_name,
						i.fund_type as source_of_fund,
						sum(fr.instl_amt) as fr_instl_amt,sum(fr.sch_amt) as fr_sch_amt,sum(fr.cont_amt) as fr_cont_amt,sum(exp.sch_amt) as exp_sch_amt,sum(exp.cont_amt) as exp_cont_amt
						FROM td_admin_approval a 
						JOIN md_sector c ON a.sector_id = c.sl_no 
						JOIN md_fin_year d ON a.fin_year = d.sl_no 
						JOIN td_admin_approval_dist pd ON a.approval_no = pd.approval_no
                        JOIN md_district e ON pd.dist_id = e.dist_code 
						JOIN td_admin_approval_block pb ON a.approval_no = pb.approval_no
						JOIN md_block f ON pb.block_id = f.block_id 
						JOIN md_proj_imp_agency g ON a.impl_agency = g.id
						LEFT JOIN td_fund_receive fr ON fr.approval_no = a.approval_no
						LEFT JOIN td_expenditure exp ON exp.approval_no = a.approval_no 
						JOIN md_account h ON h.sl_no = a.account_head 
						JOIN md_fund i ON i.sl_no = a.fund_id
					    WHERE a.fin_year = '".$fin_year."' $con GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name,a.project_submit,c.sector_desc,d.fin_year, a.project_id, g.agency_name,h.account_head";
	   // echo $sql;
	    $result_data = $this->db->query($sql)->result();
				if($fin_year == ''){
					$response = ['status' => 0, 'message' => 'Please provide Required Field'];
					
				}else{
					$res_fin_data = $this->db->query('select fin_year FROM md_fin_year where sl_no="'.$fin_year.'"')->row();
					$response = (!empty($result_data)) 
					? ['status' => 1, 'message' => $result_data,'fin_year_name' => $res_fin_data->fin_year,'account_head_name' => $acc_head_name,'sector_name' => $sector_name,'dist_name' => $dist_name,'block_name' => $block_name,'agency_name' => $agency_name] 
					: ['status' => 0, 'message' => 'No data found'];
				}
		}else{	
			$response = ['status' => 0, 'message' => 'Please provide Required Field'];
		}
		
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function proj_dtls_dist_block_ps_gp() {
		$con = '';
		$dist = $this->input->post('dist_id');
		$block = $this->input->post('block_id');
		$ps = $this->input->post('ps_id');
		$gp = $this->input->post('gp_id');
	    $dist_name = '';$block_name = '';$ps_name = '';$gp_name = '';

		if ($dist > 0) {
			$con .= " AND pd.dist_id = '".$dist."'";
		}

		if ($block > 0) {
			$con .= " AND pb.block_id = '".$block."'";	
			
		}
		if($ps > 0) {
			$con .= " AND ps.ps_id = '".$ps."'";
		}
		if($gp > 0) {
			$con .= " AND gp.gp_id = '".$gp."'";
		}

        if($dist > 0 || $block > 0 || $ps > 0 || $gp > 0){
	    $sql = "SELECT a.approval_no,a.admin_approval_dt,a.scheme_name,a.project_id,a.edit_flag,
		a.project_submit as project_submitted_by,c.sector_desc AS sector_name,
		                d.fin_year,
						GROUP_CONCAT(DISTINCT e.dist_name ORDER BY e.dist_name SEPARATOR ', ') as dist_name,
						GROUP_CONCAT(DISTINCT f.block_name ORDER BY f.block_name SEPARATOR ', ') as block_name,
						h.account_head as account_head_name
						FROM td_admin_approval a 
						JOIN md_sector c ON a.sector_id = c.sl_no 
						JOIN md_fin_year d ON a.fin_year = d.sl_no 
						JOIN td_admin_approval_dist pd ON a.approval_no = pd.approval_no
                        JOIN md_district e ON pd.dist_id = e.dist_code 
						JOIN md_account h ON h.sl_no = a.account_head
						LEFT JOIN td_admin_approval_block pb ON a.approval_no = pb.approval_no
						LEFT JOIN md_block f ON pb.block_id = f.block_id 
						LEFT JOIN td_admin_approval_ps ps ON a.approval_no = ps.approval_no
						LEFT JOIN td_admin_approval_gp gp ON a.approval_no = gp.approval_no
					    WHERE 1 $con GROUP BY 
    a.approval_no, a.admin_approval_dt, a.scheme_name,a.project_submit,c.sector_desc,d.fin_year,a.project_id, h.account_head";
	    $result_data = $this->db->query($sql)->result();
				$response = (!empty($result_data)) 
				? ['status' => 1, 'message' => $result_data] 
				: ['status' => 0, 'message' => 'No data found'];
		}else{	
			$response = ['status' => 0, 'message' => 'Please provide Required Field'];
		}
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function graphical_data_finawith(){
		
		$con = '';
		$fin_year = $this->input->post('fin_year');
		$account_head = $this->input->post('account_head_id');
		$sector_id = $this->input->post('sector_id');
		$dist = $this->input->post('dist_id');
		$block = $this->input->post('block_id');
		$impl_agency = $this->input->post('impl_agency');

		if ($account_head > 0) {
			$con .= " AND a.account_head = '".$account_head."'";
		}

		if ($sector_id > 0) {
			$con .= " AND a.sector_id = '".$sector_id."'";
		}
		if ($dist > 0) {
			$con .= " AND a.district_id = '".$dist."'";
		}

		if ($block > 0) {
			$con .= " AND a.block_id = '".$block."'";	
		}

		if ($impl_agency > 0) {
			$con .= " AND a.impl_agency = '".$impl_agency."'";	
		}
		if($account_head > 0  || $sector_id > 0 || $dist > 0 || $block > 0 || $impl_agency > 0){
		$sql = "select count(*) as number_of_project,b.sector_desc as sector_name from td_admin_approval a,md_sector b where a.sector_id = b.sl_no and a.fin_year = '".$fin_year."' $con group by a.sector_id";
		$result_data = $this->db->query($sql)->result();
		$sql_acchead = "select count(*) as number_of_project ,b.account_head as account_head from td_admin_approval a,md_account b where a.account_head = b.sl_no and a.fin_year = '".$fin_year."' $con group by a.account_head";
		$resacc_data = $this->db->query($sql_acchead)->result();
		$sql_dist = "select count(*) as number_of_project ,b.dist_name as dist_name from td_admin_approval a,md_district b where a.district_id = b.dist_code and a.fin_year = '".$fin_year."' $con group by a.district_id";
		$resdist_data = $this->db->query($sql_dist)->result();
		$sql_impagency = "select count(*) as number_of_project ,b.agency_name as agency_name from td_admin_approval a,md_proj_imp_agency b where a.impl_agency = b.id and a.fin_year = '".$fin_year."' $con group by a.impl_agency";
		$resimpagency_data = $this->db->query($sql_impagency)->result();
		$sql_progress = "select sum(b.progress_percent) as progress_percent,a.scheme_name,a.project_id from td_progress b,td_admin_approval a where a.approval_no = b.approval_no and a.fin_year = '".$fin_year."' $con group by a.project_id,a.scheme_name";
		$res_progress = $this->db->query($sql_progress)->result();
		
		$sql_fund_release_espense = "SELECT 
						f.project_id,
						f.scheme_name,
						IFNULL(f.fund_release, 0) AS fund_release,
						IFNULL(e.fund_expense, 0) AS fund_expense
					FROM 
						(SELECT 
							a.project_id,
							a.scheme_name,
							SUM(b.sch_amt) + SUM(b.cont_amt) AS fund_release
						FROM td_fund_receive b
						JOIN td_admin_approval a ON a.approval_no = b.approval_no
						WHERE a.fin_year = '".$fin_year."' $con
						GROUP BY a.project_id, a.scheme_name) f
					LEFT JOIN 
						(SELECT 
							a.project_id,
							a.scheme_name,
							SUM(b.sch_amt) + SUM(b.cont_amt) AS fund_expense
						FROM td_expenditure b
						JOIN td_admin_approval a ON a.approval_no = b.approval_no
						WHERE a.fin_year = '".$fin_year."' $con
						GROUP BY a.project_id, a.scheme_name) e
					ON f.project_id = e.project_id AND f.scheme_name = e.scheme_name";

        $res_fund_release_espense = $this->db->query($sql_fund_release_espense)->result();
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'sectorwise' => $result_data,'accountwise' => $resacc_data,'distwise' => $resdist_data,'impagencywise' => $resimpagency_data,'progress' => $res_progress,'fund_expenditure'=>$res_fund_release_espense] 
			: ['status' => 0, 'message' => 'No data found'];
		}else{	
			$response = ['status' => 0, 'message' => 'Please provide Required Field'];
		}
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function projetc_status_list(){

		$report_type = $this->input->post('report_type');
		if($report_type == 3){
			$sql ="SELECT a.scheme_name,a.project_id, a.approval_no,e.sector_desc AS sector_name, 
						  f.fin_year,b.comp_date_apprx,
						  GROUP_CONCAT(DISTINCT dist.dist_name ORDER BY dist.dist_name SEPARATOR ', ') AS dist_name,
						   GROUP_CONCAT(DISTINCT blk.block_name ORDER BY blk.block_name SEPARATOR ', ') AS block_name
							FROM td_admin_approval a
							JOIN td_tender b ON a.approval_no = b.approval_no
							JOIN td_progress c ON b.approval_no = c.approval_no
							JOIN td_proj_comp_report d ON c.approval_no = d.approval_no
							JOIN md_sector e ON a.sector_id = e.sl_no
							JOIN md_fin_year f ON a.fin_year = f.sl_no

							-- Join for districts
							LEFT JOIN td_admin_approval_dist adist ON a.approval_no = adist.approval_no
							LEFT JOIN md_district dist ON adist.dist_id = dist.dist_code

							-- Join for blocks
							LEFT JOIN td_admin_approval_block ablock ON a.approval_no = ablock.approval_no
							LEFT JOIN md_block blk ON ablock.block_id = blk.block_id

							WHERE c.proj_comp_status = 1
							GROUP BY 
								a.scheme_name, 
								a.project_id, 
								a.approval_no, 
								e.sector_desc, 
								f.fin_year, 
								b.comp_date_apprx";	
           $result_data = $this->db->query($sql)->result();	
		}else if($report_type == 2){
               $sql ="SELECT 
							a.scheme_name, 
							a.project_id, 
							a.approval_no, 
							e.sector_desc AS sector_name, 
							f.fin_year,
							b.comp_date_apprx,
							GROUP_CONCAT(DISTINCT dist.dist_name ORDER BY dist.dist_name SEPARATOR ', ') AS dist_name,
							GROUP_CONCAT(DISTINCT blk.block_name ORDER BY blk.block_name SEPARATOR ', ') AS block_name
						FROM td_admin_approval a
						JOIN td_tender b ON a.approval_no = b.approval_no
						JOIN td_progress c ON b.approval_no = c.approval_no
						JOIN md_sector e ON a.sector_id = e.sl_no
						JOIN md_fin_year f ON a.fin_year = f.sl_no

						-- Join for multiple districts
						LEFT JOIN td_admin_approval_dist adist ON a.approval_no = adist.approval_no
						LEFT JOIN md_district dist ON adist.dist_id = dist.dist_code

						-- Join for multiple blocks
						LEFT JOIN td_admin_approval_block ablock ON a.approval_no = ablock.approval_no
						LEFT JOIN md_block blk ON ablock.block_id = blk.block_id

						WHERE NOT EXISTS (
							SELECT 1 
							FROM td_progress p 
							WHERE p.approval_no = c.approval_no 
							AND p.proj_comp_status = 1
						)
						GROUP BY a.approval_no, a.scheme_name, a.project_id, e.sector_desc, f.fin_year, b.comp_date_apprx
						";	
			$result_data = $this->db->query($sql)->result();				
	   }else{
		 $sql ="SELECT 
					a.scheme_name, 
					a.project_id, 
					a.approval_no, 
					e.sector_desc AS sector_name, 
					f.fin_year,
					b.comp_date_apprx,
					GROUP_CONCAT(DISTINCT dist.dist_name ORDER BY dist.dist_name SEPARATOR ', ') AS dist_name,
					GROUP_CONCAT(DISTINCT blk.block_name ORDER BY blk.block_name SEPARATOR ', ') AS block_name
				FROM td_admin_approval a
				JOIN td_tender b ON a.approval_no = b.approval_no
				JOIN td_progress c ON b.approval_no = c.approval_no
				JOIN md_sector e ON a.sector_id = e.sl_no
				JOIN md_fin_year f ON a.fin_year = f.sl_no

				-- Join for multiple districts
				LEFT JOIN td_admin_approval_dist adist ON a.approval_no = adist.approval_no
				LEFT JOIN md_district dist ON adist.dist_id = dist.dist_code

				-- Join for multiple blocks
				LEFT JOIN td_admin_approval_block ablock ON a.approval_no = ablock.approval_no
				LEFT JOIN md_block blk ON ablock.block_id = blk.block_id
				
				WHERE NOT EXISTS (
					SELECT 1 
					FROM td_proj_comp_report r 
					WHERE r.approval_no = a.approval_no
				)
				GROUP BY a.approval_no, a.scheme_name, a.project_id, e.sector_desc, f.fin_year, b.comp_date_apprx
				" ;
          $result_data = $this->db->query($sql)->result();	
	    }
	
	
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}

	}
	
}
