<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Fund extends CI_Controller {

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


	public function proj_approv_list() {
		$json_data = file_get_contents("php://input");
		$data = json_decode($json_data, true);
		$where = array('a.sector_id = b.sl_no' => NULL,'a.account_head = c.sl_no' => NULL);
        // Check if JSON decoding was successful
		if (!$data) {
			echo json_encode([
				'status' => false,
				'message' => 'Invalid JSON data'
			]);
			return;
		}
		$project_id = $data['project_id'] ?? null;
		$approval_no = $data['approval_no'] ?? null;

		if ($project_id === null) {
			echo json_encode([
				'status' => false,
				'message' => 'Missing project_id'
			]);
			return;
		}
		if ($project_id > 0) {
			$where = array_merge($where, ['a.project_id' => $project_id]); 
		}
		if ($approval_no > 0) {
			$where = array_merge($where, ['a.approval_no' => $approval_no]); 
		}
		
		$result_data = $this->Master->f_select('td_admin_approval a ,md_sector b ,md_account c', 'a.approval_no,a.scheme_name,b.sector_desc as sector_name,(a.sch_amt+a.cont_amt) as tot_amt,a.project_id,c.account_head ', $where, NULL);

		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'OPERATION_STATUS' => 'add'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }
	public function get_added_fund_list() {
		
		$approval_no = $this->input->post('approval_no') ;
		$where = array('approval_no' => $approval_no); 
		
		$result_data = $this->Master->f_select('td_fund_receive', 'receive_no,received_by,receive_date as isntl_date,instl_amt,allot_order_no,allot_order_dt,allotment_no,sch_amt,cont_amt', $where, NULL);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'OPERATION_STATUS' => 'add','folder_name'=>'uploads/fund/'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function fund_list() {
		
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,a.receive_no,a.receive_date'=>NULL);
		
		$result_data = $this->Master->f_select('td_fund_receive a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,a.receive_no,a.receive_date,a.allot_order_no,a.allot_order_dt', $where, NULL);

		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/fund/']);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	public function fund_added_list() {
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'b.impl_agency = g.id' => NULL);
		$where2 = array('a.approval_no = b.approval_no' => NULL);			   
		$approval_no = $this->input->post('approval_no');
		$project_id  = $this->input->post('project_id');
		
		if ($project_id > 0) {
			$where = array_merge($where, ['b.project_id' => $project_id]); 
			$where2 = array_merge($where2, ['b.project_id' => $project_id]);
		}
		if ($approval_no > 0) {
			$where = array_merge($where, ['b.approval_no' => $approval_no]); 
			$where2 = array_merge($where2, ['b.approval_no' => $approval_no]);
		}
		
		
		$result_data = $this->Master->f_select('td_progress a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f,md_proj_imp_agency g,td_tender h', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,g.agency_name', array_merge($where, ['1 limit 1' => NULL]), NULL);
		$image_data = $this->Master->f_select('td_progress a,td_admin_approval b', 'a.approval_no,a.visit_no,a.progress_percent,a.pic_path', array_merge($where2, ['1 limit 6' => NULL]), NULL);
		//$wo_date = $this->Master->f_select('td_tender', 'wo_date', $where2, NULL);
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'prog_img'=>$image_data,'OPERATION_STATUS' => 'edit','folder_name'=>'uploads/progress_image/'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function proj_sanc_amt() {
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
		$approval_no = $this->input->post('approval_no');
	    $where = array('approval_no' => $approval_no);
		$result_data = $this->Master->f_select('td_admin_approval', 'sch_amt,cont_amt', $where, 1);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
	}
    // ****************************  Fund Formalities  *******************   //
	public function fund_add() {
	
		$upload_paths = []; // Store file paths
	
		// Load Upload Library
		$this->load->library('upload');
		// File fields to process
		$file_fields = ['allotment_no'];
	    $app_res_data = $this->Master->f_select('td_fund_receive','IFNULL(MAX(receive_no), 0) + 1 AS receive_no',array('approval_no'=>$this->input->post('approval_no')),1);
		
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/fund/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 20480; // Max file size (2MB)
				$config['encrypt_name']  = TRUE; // Encrypt filename for security
	
				$this->upload->initialize($config); // Initialize config for each file
	
				if (!$this->upload->do_upload($field)) {
					echo json_encode([
						'status' => 0,
						'message' => "Error uploading {$field}: " . $this->upload->display_errors()
					]);
					return;
				}
	
				// Store uploaded file path
				$fileData = $this->upload->data();
				$upload_paths[$field] = $fileData['file_name'];
				//$upload_paths[$field] = 'uploads/' . $fileData['file_name'];
			} else {
				$upload_paths[$field] = null; // No file uploaded
			}
		}
	    
		// Insert into database
		$data = [
			'approval_no' => $this->input->post('approval_no'),
			'receive_no' => $app_res_data->receive_no,
			'receive_date' => $this->input->post('isntl_date'),
			'received_by' => $this->input->post('created_by'),
			'instl_amt' => $this->input->post('instl_amt'),
			'allot_order_no' => $this->input->post('allot_order_no'),
			'allot_order_dt' => $this->input->post('allot_order_dt'),
			'allotment_no' => $upload_paths['allotment_no'],
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'created_by' => $this->input->post('created_by'),
			'created_at' => date('Y-m-d h:i:s'),
		];
	
		$check = $this->db->insert('td_fund_receive', $data);
	    if($check){
		echo json_encode([
			'status' => 1,
			'data' => 'Added successfully!',
		]);
		}else{
			echo json_encode([
				'status' => 0,
				'data' => 'Some Thing Went Wrong!'
			]);
		}
	}

	public function fund_single_data() {
		$where = [];
		$approval_no = $this->input->post('approval_no') ?? null;
		$receive_no = $this->input->post('receive_no') ?? null;
		$receive_date = $this->input->post('receive_date') ?? null;
		
		$where['approval_no'] = $approval_no;
		$where['receive_no'] = $receive_no;
		$where['receive_date'] = $receive_date;
	
		$result_data = $this->Master->f_select('td_fund_receive', '*', $where, 1);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function fund_edit() {
		$upload_paths = []; // Store file paths
	
		// Load Upload Library
		$this->load->library('upload');
	
		// File fields to process
		$file_fields = ['allotment_no'];
	
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/fund/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 20480; // Max file size (2MB)
				$config['encrypt_name']  = TRUE; // Encrypt filename for security
	
				$this->upload->initialize($config); // Initialize config for each file
	
				if (!$this->upload->do_upload($field)) {
					echo json_encode([
						'status' => false,
						'message' => "Error uploading {$field}: " . $this->upload->display_errors()
					]);
					return;
				}
	
				// Store new file name
				$fileData = $this->upload->data();
				$upload_paths[$field] = $fileData['file_name'];
			} else {
				// Keep the existing filename if no new file is uploaded
				//$upload_paths[$field] = $this->input->post($field . '_name') ?? $app_res_data->$field;
			}
		}
	
		// Prepare data array for update
		$data = [
			'instl_amt' => $this->input->post('instl_amt'),
			'receive_date' => $this->input->post('isntl_date'),
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'allot_order_no' => $this->input->post('allot_order_no'),
			'allot_order_dt' => $this->input->post('allot_order_dt'),
			'modified_by' => $this->input->post('modified_by'),
			'modified_at' => date('Y-m-d H:i:s')
		];
	
		// Conditionally add file fields if they exist in $upload_paths
		if (!empty($upload_paths['allotment_no'])) {
			$data['allotment_no'] = $upload_paths['allotment_no'];
		}
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no'),
			'receive_no' => $this->input->post('receive_no'),
			'receive_date' => $this->input->post('receive_date')
		];
	
		// Update data in the database
		$this->Master->f_edit('td_fund_receive', $data, $where);
	
		echo json_encode([
			'status' => true,
			'message' => 'Fund updated successfully!'
		]);
	}
	

	
	
}
