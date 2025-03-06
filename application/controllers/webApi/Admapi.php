<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admapi extends CI_Controller {

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

	public function adm_appr_add() {
	
		$upload_paths = []; // Store file paths
		// Load Upload Library
		$this->load->library('upload');
		// File fields to process
		$file_fields = ['admin_approval', 'vetted_dpr'];

		$query = $this->db->get_where('td_admin_approval', ['project_id' => $this->input->post('project_id')]);
		if($query->num_rows() == 0) {

	    $app_res_data = $this->Master->f_select('td_admin_approval','IFNULL(MAX(approval_no), 0) + 1 AS approval_no',NULL,1);
		
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 8048; // Max file size (2MB)
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
			'approval_no' => $app_res_data->approval_no,
			'scheme_name' => $this->input->post('scheme_name'),
			'sector_id' => $this->input->post('sector_id'),
			'fin_year' => $this->input->post('fin_year'),
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'admin_approval' => $upload_paths['admin_approval'], // Store file path in DB
			'vetted_dpr' => $upload_paths['vetted_dpr'], // Store file path in DB
			'project_id' => $this->input->post('project_id'),
			'account_head' => $this->input->post('account_head'),
			'admin_approval_dt' => $this->input->post('admin_approval_dt'),
			'project_submit' => $this->input->post('project_submit'),
			'impl_agency' => $this->input->post('impl_agency'),
			'district_id' => $this->input->post('district_id'),
			'block_id' => $this->input->post('block_id'),
			'fund_id' => $this->input->post('fund_id'),
			'created_by'=> $this->input->post('created_by'),
			'created_at'=> date('Y-m-d h:i:s'),
		];
	
		$this->db->insert('td_admin_approval', $data);
	
		echo json_encode([
			'status' => 1,
			'message' => 'successfully!'
		]);
	   }else{
			echo json_encode([
				'status' => 0,
				'message' => 'Project ID Already Exist'
			]);
	   }
	}

	
	public function adm_appr_edit() {
		$upload_paths = []; // Store file paths
		// Load Upload Library
		$this->load->library('upload');
	
		// File fields to process
		$file_fields = ['admin_approval', 'vetted_dpr'];
		$query = $this->db->get_where('td_admin_approval', ['project_id' => $this->input->post('project_id')]);
		if($query->num_rows() == 0) {
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 8048; // Max file size (2MB)
				$config['encrypt_name']  = TRUE; // Encrypt filename for security
	
				$this->upload->initialize($config); // Initialize config for each file
				if (!$this->upload->do_upload($field)) {
					echo json_encode([
						'status' => false,
						'message' => "Error uploading {$field}: " . $this->upload->display_errors()
					]);
					return;
				}
	
				// Store uploaded file path and name
				$fileData = $this->upload->data();
				$upload_paths[$field] = $fileData['file_name']; // Store only filename
			}
		}
	
		// Prepare data array for update
		$data = [
			'scheme_name' => $this->input->post('scheme_name'),
			'sector_id' => $this->input->post('sector_id'),
			'fin_year' => $this->input->post('fin_year'),
			'sch_amt' => $this->input->post('sch_amt'),
			'cont_amt' => $this->input->post('cont_amt'),
			'project_id' => $this->input->post('project_id'),
			'account_head' => $this->input->post('account_head'),
			'admin_approval_dt' => $this->input->post('admin_approval_dt'),
			'project_submit' => $this->input->post('project_submit'),
			'impl_agency' => $this->input->post('impl_agency'),
			'district_id' => $this->input->post('district_id'),
			'block_id' => $this->input->post('block_id'),
			'fund_id' => $this->input->post('fund_id'),
			'modified_by'=> $this->input->post('modified_by'),
			'modified_at'=> date('Y-m-d H:i:s'),
		];
	
		// Conditionally add file fields if they exist in $upload_paths
		if (!empty($upload_paths['admin_approval'])) {
			$data['admin_approval'] = $upload_paths['admin_approval'];
		}
		if (!empty($upload_paths['vetted_dpr'])) {
			$data['vetted_dpr'] = $upload_paths['vetted_dpr'];
		}
	
		// Define where condition for update
		$where = ['approval_no' => $this->input->post('approval_no')]; // Ensure correct record update
	
		// Update data in the database
		$this->Master->f_edit('td_admin_approval', $data, $where);
			if ($this->db->affected_rows() > 0) {
		
			echo json_encode([
				'status' => 1,
				'message' => 'Edited successfully!',
				'file_names' => $upload_paths // Return filenames in response
			]);
			}else{
				
			echo json_encode([
				'status' => 0,
				'message' => 'Some Thing Went Wrong!',
			]);
			}
		
	    }else{
			echo json_encode([
				'status' => 0,
				'message' => 'Project ID Already Exist'
			]);
	    }
	}
		

	public function adm_approv_list() {
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
		$fin_year = $data['fin_year'] ?? null;
		$dist_id = $data['dist_id'] ?? null;

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
		if ($fin_year > 0) {
			$where = array_merge($where, ['a.fin_year' => $fin_year]); 
		}
		if ($dist_id > 0) {
			$where = array_merge($where, ['a.district_id' => $dist_id]); 
		}
		
		$result_data = $this->Master->f_select('td_admin_approval a ,md_sector b ,md_account c', 'a.approval_no,a.admin_approval_dt,a.scheme_name,b.sector_desc as sector_name,(a.sch_amt+a.cont_amt) as tot_amt,a.project_id,c.account_head ', $where, NULL);
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function adm_by_approval_no() {
		$json_data = file_get_contents("php://input");
		$data = json_decode($json_data, true);
		$where = array();
        // Check if JSON decoding was successful
		if (!$data) {
			echo json_encode([
				'status' => false,
				'message' => 'Invalid JSON data'
			]);
			return;
		}
		$approval_no = $data['approval_no'] ?? null;
	
		
		if ($approval_no > 0) {
			$where = array_merge($where, ['a.approval_no' => $approval_no]); 
		}
		
		$result_data = $this->Master->f_select('td_admin_approval a ', '*', $where, 1);
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	public function get_approval_no() {
		
		$result_data = $this->Master->f_select('td_admin_approval', 'approval_no,project_id', NULL, 0);
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	
}
