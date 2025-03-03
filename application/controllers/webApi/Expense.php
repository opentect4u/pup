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


	public function get_added_expense_list() {
		
		$approval_no = $this->input->post('approval_no') ;
		$where = array('approval_no' => $approval_no); 
		$result_data = $this->Master->f_select('td_expenditure', 'approval_no,payment_no,payment_date,payment_to,sch_amt,cont_amt', $where, NULL);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'OPERATION_STATUS' => 'add'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function expense_list() {
		$result_data = $this->Master->f_select('td_expenditure', 'approval_no,payment_no,payment_date,payment_to,sch_amt,cont_amt', NULL, NULL);
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data]);
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
			'payment_date' => date('Y-m-d'),
			'payment_to' => $this->input->post('payment_to'),
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
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
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'modified_by' => $this->input->post('modified_by'),
			'modified_at' => date('Y-m-d H:i:s')
		];
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no'),
			'payment_no' => $this->input->post('payment_no'),
			'payment_date' => $this->input->post('payment_date')
		];
	
		// Update data in the database
		$this->Master->f_edit('td_expenditure', $data, $where);
	
		echo json_encode([
			'status' => true,
			'message' => 'Fund updated successfully!'
		]);
	}
	

	
	
}
