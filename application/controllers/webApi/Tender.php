<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Tender extends CI_Controller {

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

	public function tender_list() {
		
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no'=>NULL);
		
		$result_data = $this->Master->f_select('td_tender a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no', $where, NULL);

		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/fund/']);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	


    // ****************************  Tender Formalities  *******************   //
	public function tend_add() {
	
		$upload_paths = []; // Store file paths
	
		// Load Upload Library
		$this->load->library('upload');
		// File fields to process
		$file_fields = ['tender_notice', 'wo_copy'];
	    $app_res_data = $this->Master->f_select('td_tender','IFNULL(MAX(sl_no), 0) + 1 AS sl_no',NULL,1);
		
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/tender/'; // Folder to store files
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
			'approval_no' => $this->input->post('approval_no'),
			'sl_no' => $app_res_data->sl_no,
			'tender_date' => $this->input->post('tender_date'),
			'tender_notice' => $upload_paths['tender_notice'],
			'invite_auth' => $this->input->post('invite_auth'),
			'mat_date' => $this->input->post('mat_date'),
			'wo_date' => $this->input->post('wo_date'),
			'wo_copy' => $upload_paths['wo_copy'],
			'wo_value' => $this->input->post('wo_value'),
			'comp_date_apprx' => $this->input->post('comp_date_apprx'),
			'created_by' => 'test',
			'created_at' => date('Y-m-d h:i:s'),
		];
	
		$id = $this->db->insert('td_tender', $data);
	    if($id){
			echo json_encode([
				'status' => 1,
				'data' => 'Files uploaded successfully!',
				'file_paths' => $upload_paths
			]);
		}else{
			echo json_encode([
				'status' => 0,
				'data' => 'Something Went Wrong',
				'file_paths' => $upload_paths
			]);
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

	public function tender_single_data() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
		$sl_no = $this->input->post('sl_no');
	   
		$where['approval_no'] = $approval_no;
		$where['sl_no'] = $sl_no;
		
	
		$result_data = $this->Master->f_select('td_tender', '*', $where, 1);
	
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	public function tender_list_proj() {
		$where = [];
		$approval_no = $this->input->post('approval_no');
	
		$where['approval_no'] = $approval_no;
		$result_data = $this->Master->f_select('td_tender', '*', $where, 0);
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function tend_edit() {
		$upload_paths = []; // Store file paths
	
		// Load Upload Library
		$this->load->library('upload');
	
		// File fields to process
		$file_fields = ['tender_notice', 'wo_copy'];
	
		// Fetch the existing record (to retain old file names if no new file is uploaded)
		$app_res_data = $this->Master->f_select('td_tender', '*', [
			'approval_no' => $this->input->post('approval_no'),
			'sl_no' => $this->input->post('sl_no')
		], 1);
	
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/tender/'; // Folder to store files
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
			'tender_date' => $this->input->post('tender_date'),
			'invite_auth' => $this->input->post('invite_auth'),
			'mat_date' => $this->input->post('mat_date'),
			'wo_date' => $this->input->post('wo_date'),
			'wo_value' => $this->input->post('wo_value'),
			'comp_date_apprx' => $this->input->post('comp_date_apprx'),
			'modified_by' => $this->input->post('updated_by'),
			'modified_at' => date('Y-m-d H:i:s')
		];
	
		// Conditionally add file fields if they exist in $upload_paths
		if (!empty($upload_paths['tender_notice'])) {
			$data['tender_notice'] = $upload_paths['tender_notice'];
		}
		if (!empty($upload_paths['wo_copy'])) {
			$data['wo_copy'] = $upload_paths['wo_copy'];
		}
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no'),
			'sl_no' => $this->input->post('sl_no')
		];
	
		// Update data in the database
		$this->Master->f_edit('td_tender', $data, $where);
	
		echo json_encode([
			'status' => true,
			'message' => 'Tender updated successfully!',
			'file_names' => $upload_paths
		]);
	}

	public function progress_list() {
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'b.impl_agency = g.id' => NULL);
		$where2 = array('a.approval_no = b.approval_no' => NULL);			   
		$approval_no = $this->input->post('approval_no');
		$project_id  = $this->input->post('project_id');
		$where3 = array('a.approval_no = b.approval_no' => NULL);	
		if ($project_id > 0) {
			$where = array_merge($where, ['b.project_id' => $project_id]); 
			$where2 = array_merge($where2, ['b.project_id' => $project_id]);
			$where3 = array_merge($where3, ['a.project_id' => $project_id]);
		}
		if ($approval_no > 0) {
			$where = array_merge($where, ['b.approval_no' => $approval_no]); 
			$where2 = array_merge($where2, ['b.approval_no' => $approval_no]);
			$where3 = array_merge($where3, ['a.approval_no' => $approval_no]);
		}
		
		$result_data = $this->Master->f_select('td_progress a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f,md_proj_imp_agency g,td_tender h', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,g.agency_name', array_merge($where, ['1 limit 1' => NULL]), NULL);
		$image_data = $this->Master->f_select('td_progress a,td_admin_approval b', 'a.approval_no,a.visit_no,a.progress_percent,a.pic_path,a.created_by as visit_by,a.created_at as visit_dt,a.address', array_merge($where2, ['1 limit 6' => NULL]), NULL);
		$wo_date = $this->Master->f_select('td_admin_approval a,td_tender b', 'b.wo_date', array_merge($where3,['1 order by b.tender_date desc limit 1'=>NULL]), NULL);
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => array_merge($result_data,$wo_date),'prog_img'=>$image_data,'OPERATION_STATUS' => 'edit','folder_name'=>'uploads/progress_image/'] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function prog_ls() {
		
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no'=>NULL);
		
		$result_data = $this->Master->f_select('td_progress a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no', $where, NULL);

		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/fund/']);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	
}
