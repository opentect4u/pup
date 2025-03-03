<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Utilization extends CI_Controller {

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
	public function get_added_utlization_list() {
		
		$approval_no = $this->input->post('approval_no') ;
		$where = array('approval_no' => $approval_no); 
		$result_data = $this->Master->f_select('td_utilization', 'approval_no,certificate_no,certificate_date,certificate_path,issued_by,issued_to', $where, NULL);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'OPERATION_STATUS' => 'add','folder_name'=>'uploads/fund/'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function utlization_list() {
		
		//$where = array('approval_no'=>$this->input->post('approval_no'));
		$result_data = $this->Master->f_select('td_utilization', 'approval_no,certificate_no,certificate_date,certificate_path,issued_by,issued_to', NULL, NULL);
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/fund/']);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }


    // ****************************  Fund Formalities  *******************   //
	public function utlization_add() {
	
		$upload_paths = []; // Store file paths
		// Load Upload Library
		$this->load->library('upload');
		// File fields to process
		$file_fields = ['certificate_path'];
	    $app_res_data = $this->Master->f_select('td_utilization','IFNULL(MAX(certificate_no), 0) + 1 AS certificate_no',array('approval_no'=>$this->input->post('approval_no')),1);
		
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/certificate/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 2048; // Max file size (2MB)
				$config['encrypt_name']  = TRUE; // Encrypt filename for security
	
				$this->upload->initialize($config); // Initialize config for each file
	
				if (!$this->upload->do_upload($field)) {
					echo json_encode([
						'status' => false,
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
			'certificate_no' => $app_res_data->certificate_no,
			'certificate_date' => date('Y-m-d'),
			'certificate_path' => $upload_paths['certificate_path'],
			'issued_by' => $this->input->post('issued_by'),
			'issued_to' => $this->input->post('issued_to'),
			'created_by' => $this->input->post('created_by'),
			'created_at' => date('Y-m-d h:i:s'),
		];
	
		$this->db->insert('td_utilization', $data);
	
		echo json_encode([
			'status' => 1,
			'data' => 'Files uploaded successfully!',
			'file_paths' => $upload_paths
		]);
	}

	public function utlization_single_data() {
		$where = [];
		$approval_no = $this->input->post('approval_no') ?? null;
		$certificate_no = $this->input->post('certificate_no') ?? null;
	
		
		$where['approval_no'] = $approval_no;
		$where['certificate_no'] = $certificate_no;
	
		$result_data = $this->Master->f_select('td_utilization', '*', $where, 1);
	
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function utlization_edit() {
		$upload_paths = []; // Store file paths
	
		// Load Upload Library
		$this->load->library('upload');
	
		// File fields to process
		$file_fields = ['certificate_path'];
	
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/certificate/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 2048; // Max file size (2MB)
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
			'issued_by' => $this->input->post('issued_by'),
			'issued_to' => $this->input->post('issued_to'),
			'modified_by' => $this->input->post('modified_by'),
			'modified_at' => date('Y-m-d H:i:s')
		];
	
		// Conditionally add file fields if they exist in $upload_paths
		if (!empty($upload_paths['certificate_path'])) {
			$data['certificate_path'] = $upload_paths['certificate_path'];
		}
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no'),
			'certificate_no' => $this->input->post('certificate_no')
		];
	
		// Update data in the database
		$this->Master->f_edit('td_utilization', $data, $where);
	
		echo json_encode([
			'status' => true,
			'message' => 'Utilization updated successfully!'
		]);
	}

	
	
}
