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
		//$where = array('approval_no' => $approval_no,'order by payment_no ASC'); 
	//	$result_data = $this->Master->f_select('td_expenditure', 'payment_no,approval_no,payment_date,payment_to,sch_amt,cont_amt,sch_remark,cont_remark', $where, NULL);
		$result_data = $this->db->query("SELECT 
										e.approval_no,
										e.payment_no,
										e.payment_date,
										e.payment_to,
										e.sch_amt,
										e.cont_amt,
										e.sch_remark,
										e.created_by,
										e.created_at,
										GROUP_CONCAT(r.cont_rmrks ORDER BY r.cont_rmrks SEPARATOR ', ') AS cont_remark
									FROM td_expenditure e
									LEFT JOIN td_expenditure_cntg_rmrks c 
										ON e.approval_no = c.approval_no 
										AND e.payment_no = c.payment_no
									LEFT JOIN md_cont_remarks r 
										ON c.cont_rmrks_sl_no = r.sl_no
									WHERE e.approval_no = $approval_no  
									GROUP BY e.approval_no,
											e.payment_no,
											e.payment_date,
											e.payment_to,
											e.sch_amt,
											e.cont_amt,
											e.sch_remark,
											e.created_by,
											e.created_at")->result();
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'OPERATION_STATUS' => 'add'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }
	
	public function expense_list() {
		
		// $where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		//                'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
		// 			   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,a.payment_no,a.payment_date'=>NULL);
		
		// $result_data = $this->Master->f_select('td_expenditure a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,a.payment_no,a.payment_date', $where, NULL);

		$result_data = $this->db->query("SELECT a.admin_approval_dt, a.scheme_name,
		a.project_id,a.sch_amt,a.cont_amt,a.approval_no,
		b.sector_desc AS sector_name,c.fin_year,g.agency_name,
		d.payment_no,d.payment_date,d.edit_flag,
		GROUP_CONCAT(DISTINCT e.dist_name ORDER BY e.dist_name SEPARATOR ', ') AS dist_name,
		GROUP_CONCAT(DISTINCT f.block_name ORDER BY f.block_name SEPARATOR ', ') as block_name
		FROM td_admin_approval a
		INNER JOIN md_sector b ON a.sector_id = b.sl_no
		INNER JOIN md_fin_year c ON a.fin_year = c.sl_no
		INNER JOIN td_expenditure d ON a.approval_no = d.approval_no
		INNER JOIN td_admin_approval_dist pd ON a.approval_no = pd.approval_no
		JOIN md_district e ON pd.dist_id = e.dist_code 
		JOIN td_admin_approval_block pb ON a.approval_no = pb.approval_no
		JOIN md_block f ON pb.block_id = f.block_id 
		INNER JOIN md_proj_imp_agency g ON a.impl_agency = g.id 
		group by a.admin_approval_dt, 
		a.scheme_name,d.edit_flag,
		a.project_id,a.sch_amt,a.cont_amt,a.approval_no,
		b.sector_desc,d.payment_no,d.payment_date,
		c.fin_year,g.agency_name")->result();


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
			'created_by' => $this->input->post('created_by'),
			'created_at' => date('Y-m-d h:i:s'),
		];
		
		$id = $this->db->insert('td_expenditure', $data);
		$cont_remark_str = $this->input->post('cont_remark');
		$cont_remark = !empty($cont_remark_str) ? explode(',', $cont_remark_str) : [];

		if (!empty($cont_remark)) {
			$batch_data = [];
			foreach ($cont_remark as $value) {
				$batch_data[] = [
					'approval_no' => $this->input->post('approval_no'),
					'payment_no' => $app_res_data[0]->payment_no,
					'payment_date' => $this->input->post('payment_date'),
					'cont_rmrks_sl_no' => trim($value) // Trim to remove extra spaces
				];
			}
			if (!empty($batch_data)) {
				$this->db->insert_batch('td_expenditure_cntg_rmrks', $batch_data);
			}
		}
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
	
		$result_data = $this->Master->f_select('td_expenditure', 'approval_no,payment_no,payment_date,payment_to,sch_amt,cont_amt,sch_remark', $where, 1);
		$cont_remark_data = $this->Master->f_select('td_expenditure_cntg_rmrks', 'cont_rmrks_sl_no', array('approval_no' => $this->input->post('approval_no'), 'payment_no' => $this->input->post('payment_no')), NULL);
		$cont_remark = array_map(function($row) {
			return $row->cont_rmrks_sl_no;
		}, $cont_remark_data);
		
		// Convert to JSON format (if needed)
		$json_format = $cont_remark;
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data, 'cont_remark' => $json_format] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function expense_edit() {

		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('modified_by', 'Modified By', 'required');
		$this->form_validation->set_rules('payment_no', 'Payment No', 'required');
		$this->form_validation->set_rules('payment_date', 'Payment Date', 'required');

		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		} else {
			// Prepare data for update in `td_expenditure`
			$data = [
				'payment_to' => $this->input->post('payment_to'),
				'sch_amt' => $this->input->post('sch_amt'),
				'cont_amt' => $this->input->post('cont_amt'),
				'sch_remark' => $this->input->post('sch_remark'),
				'edit_flag' => 'N',
				'modified_by' => $this->input->post('modified_by'),
				'modified_at' => date('Y-m-d H:i:s')
			];

			// Define WHERE condition for update
			$where = [
				'approval_no' => $this->input->post('approval_no'),
				'payment_no' => $this->input->post('payment_no'),
				'payment_date' => $this->input->post('payment_date'),
			];

			// Update the main table `td_expenditure`
			$res = $this->Master->f_edit('td_expenditure', $data, $where);

			// Handle multi-select `cont_remark` update in `td_expenditure_cntg_rmrks`
			$cont_remark_str = $this->input->post('cont_remark');
			$cont_remark = !empty($cont_remark_str) ? explode(',', $cont_remark_str) : [];

			if (!empty($cont_remark)) {
				// Step 1: Delete old remarks for the given `approval_no` and `payment_no`
				$this->db->where($where);
				$this->db->delete('td_expenditure_cntg_rmrks');

				// Step 2: Insert new remarks
				$batch_data = [];
				foreach ($cont_remark as $value) {
					$batch_data[] = [
						'approval_no' => $this->input->post('approval_no'),
						'payment_no' => $this->input->post('payment_no'),
						'payment_date' => $this->input->post('payment_date'),
						'cont_rmrks_sl_no' => trim($value) // Trim spaces
					];
				}

				if (!empty($batch_data)) {
					$this->db->insert_batch('td_expenditure_cntg_rmrks', $batch_data);
				}
			}

			if ($res > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'Updated successfully!'
				]);
			} else {
				echo json_encode([
					'status' => 0,
					'message' => 'Something Went Wrong!'
				]);
			}
		}
			
	}
	
	
}
