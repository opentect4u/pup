<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Expense extends CI_Controller {

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
        $auth_key = $this->input->get_request_header('auth_key');
		//$auth_key = $_SERVER['HTTP_AUTH_KEY']; // Get from header // Get from header
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


	public function get_added_expense_list() {
		
		$approval_no = $this->input->post('approval_no') ;
		$where = array('approval_no' => $approval_no,'order by payment_no ASC'); 
		$result_data = $this->Master->f_select('td_expenditure', 'payment_no,approval_no,payment_date,payment_to,sch_amt,cont_amt,sch_remark,cont_remark', $where, NULL);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'OPERATION_STATUS' => 'add'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }
	
	public function expense_list() {
		
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no'=>NULL);
		
		$result_data = $this->Master->f_select('td_expenditure a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no', $where, NULL);

		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/fund/']);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }


    // ****************************  Fund Formalities  *******************   //
	public function expense_add() {
	    $app_res_data = $this->Master->f_select('td_expenditure','IFNULL(MAX(payment_no), 0) + 1 AS payment_no',array('approval_no'=>$this->input->post('approval_no')),NULL,1);
		$data = [
			'approval_no' => $this->input->post('approval_no'),
			'payment_no' => $app_res_data[0]->payment_no,
			'payment_date' => $this->input->post('payment_date'),
			'payment_to' => $this->input->post('payment_to'),
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'sch_remark' => $this->input->post('sch_remark'),
			'cont_remark' => $this->input->post('cont_remark'),
			'created_by' => $this->input->post('created_by'),
			'created_at' => date('Y-m-d h:i:s'),
		];
	
		$id = $this->db->insert('td_expenditure', $data);
	    if($id){
			echo json_encode([
				'status' => 1,
				'data' => 'Data Added successfully!',
			]);
		}else{
			echo json_encode([
				'status' => 0,
				'data' => 'SomeThing Went Wrong!',
			]);
		}
	}

	public function expense_single_data() {
		$where = [];

		$where['approval_no'] = $this->input->post('approval_no');
		$where['payment_no'] = $this->input->post('payment_no');
		$where['payment_date'] = $this->input->post('payment_date');
	
		$result_data = $this->Master->f_select('td_expenditure', '*', $where, 1);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function expense_edit() {
	
		// Prepare data array for update
		$data = [
			'payment_to' => $this->input->post('payment_to'),
			'payment_date'=> $this->input->post('payment_date'),
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'sch_remark' => $this->input->post('sch_remark'),
			'cont_remark' => $this->input->post('cont_remark'),
			'modified_by' => $this->input->post('modified_by'),
			'modified_at' => date('Y-m-d H:i:s')
		];
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no'),
			'payment_no' => $this->input->post('payment_no'),
		];
	
		// Update data in the database
		$this->Master->f_edit('td_expenditure', $data, $where);
	
		echo json_encode([
			'status' => true,
			'message' => 'Fund updated successfully!'
		]);
	}
	

	
	
}
