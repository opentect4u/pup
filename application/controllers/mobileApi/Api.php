<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

	public function __construct() {
        parent::__construct();
		header("Access-Control-Allow-Origin: *"); // Allow all domains
        header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow specific methods
        header("Access-Control-Allow-Headers: Content-Type");
		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			exit;
		} 
		// if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        //     $response = array(
        //         'status' => false,
        //         'message' => 'Only POST method is allowed'
        //     );
        //     echo json_encode($response);
        //     exit;
        // }

		//   *********   Auth Token Validation    ********** //
		$headers = $this->input->request_headers();
		$authHeader = '';
		foreach ($headers as $key => $value) {
			if (strtolower($key) === 'authorization') {
				$authHeader = $value;
				break;
			}
		}
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $user = $this->User_model->get_user_by_token($token);

            if ($user) {
                $this->user = $user;
                return;
            }
        }
		$authorizeresponse = array(
			'status' => 0,
			'error_code' => 401,
			'message' => 'Unauthorized or Token Expired'
		);
        $this->output
            ->set_status_header(401)
            ->set_content_type('application/json')
            ->set_output(json_encode($authorizeresponse));
        exit;
     
    }
    // ******  Get project list by user_id *********   //
	public function projectlist() {
	    $this->form_validation->set_rules('user_id', 'user_id', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
		$user_id = $this->input->post('user_id');
		$result_data = $this->db->query("SELECT  a.scheme_name,a.project_id,a.approval_no
									FROM td_admin_approval a
									JOIN td_tender h ON a.approval_no = h.approval_no 
									JOIN td_user u ON u.id = h.assistant_eng_id
									WHERE u.user_id = '$user_id' AND h.tender_status= 'M' ")->result();
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));

		}
    }
	// ******  Get project progress detail *********   //
	public function projectrange() {
		  $this->form_validation->set_rules('project_id', 'project_id', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
		$result_data = $this->Master->f_select('td_progress_range', array('project_id','visit_no','work_per_st','work_per_end'), array('project_id'=>$this->input->post('project_id')), NULL);

		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
    }
    // ******  Progress Update of project using image and location *********   //
    public function progress_update(){

		  // Get client IP address
		  $client_ip = $this->input->ip_address();

		  // Log request headers
		  $headers = json_encode($this->input->request_headers());
	  
		  // Log POST data (excluding sensitive information)
		  $post_data = json_encode($this->input->post());
	  
		  // Log the timestamp
		  $timestamp = date('Y-m-d H:i:s');
	  
		  // Write log entry
		  $log_entry = "[{$timestamp}] IP: {$client_ip} | Headers: {$headers} | POST Data: {$post_data}" . PHP_EOL;
		  file_put_contents(APPPATH . 'logs/api_requests.log', $log_entry, FILE_APPEND);  
		
			$app_res_data = $this->Master->f_select('td_progress', 'IFNULL(MAX(visit_no), 0) + 1 AS visit_no', ['approval_no' => $this->input->post('approval_no')], 1);
		
			$upload_paths = []; // Store file names
		
			if (!empty($_FILES['progress_pic']['name'][0])) { // Check if files are uploaded
				$this->load->library('upload');
		
				$config['upload_path']   = './uploads/progress_image/';
				$config['allowed_types'] = 'jpg|jpeg|png';
				$config['max_size']      = 2048;
				$config['encrypt_name']  = TRUE;
		
				$filesCount = count($_FILES['progress_pic']['name']); // Count total files
		
				for ($i = 0; $i < $filesCount; $i++) {
					$_FILES['file']['name']     = $_FILES['progress_pic']['name'][$i];
					$_FILES['file']['type']     = $_FILES['progress_pic']['type'][$i];
					$_FILES['file']['tmp_name'] = $_FILES['progress_pic']['tmp_name'][$i];
					$_FILES['file']['error']    = $_FILES['progress_pic']['error'][$i];
					$_FILES['file']['size']     = $_FILES['progress_pic']['size'][$i];
		
					$this->upload->initialize($config);
		
					if ($this->upload->do_upload('file')) {
						$fileData = $this->upload->data();
						$upload_paths[] = $fileData['file_name']; // Store uploaded file names
					}
				}
			}
			// Fetch progress_percent as an array
			$progress_percent = $this->input->post('progress_percent');
		
			// Convert progress_percent & file paths into JSON before storing in the database
		
			$pic_path_json = json_encode($upload_paths);
		
			// Insert into database
			$data = [
				'approval_no'       => $this->input->post('approval_no'),
				'visit_no'          => $app_res_data->visit_no,
				'progress_percent'  => $progress_percent, // Store as JSON
				'progressive_percent' => $this->input->post('progressive_percent'), 
				'pic_path'          => $pic_path_json, // Store multiple image paths as JSON
				'lat'               => $this->input->post('lat'),
				'long'              => $this->input->post('long'),
				'address'           => $this->input->post('address'),
                'actual_date_comp'  => strlen($this->input->post('actual_date_comp')) > 9 ? $this->input->post('actual_date_comp'):null,
				'proj_comp_status'  =>strlen($this->input->post('actual_date_comp')) > 9 ? 1 : 0,
				'remarks'           => $this->input->post('remarks'),
				'created_by'        => $this->input->post('created_by'),
				'created_at'        => date('Y-m-d H:i:s'),
			];
		    
			$inserted = $this->db->insert('td_progress', $data);
		
			if ($inserted) {
				$response = [
					'status' => 1,
					'message' => 'Files uploaded successfully!',
					'file_paths' => $upload_paths
				];
			} else {
				$response = [
					'status' => 0,
					'message' => 'Something Went Wrong',
					'file_paths' => $upload_paths
				];
			}

			 // Log API response
			 $response_log = "[{$timestamp}] Response: " . json_encode($response) . PHP_EOL;
			 file_put_contents(APPPATH . 'logs/api_requests.log', $response_log, FILE_APPEND);
		 
			 echo json_encode($response);
	}
//     public function progress_update_sync()
//     {
// 	// Logging
// 		$client_ip = $this->input->ip_address();
// 		$headers = json_encode($this->input->request_headers());
// 		$post_data = $this->input->post();
// 		$timestamp = date('Y-m-d H:i:s');
// 		$log_entry = "[{$timestamp}] IP: {$client_ip} | Headers: {$headers} | POST Data: " . json_encode($post_data) . PHP_EOL;
// 		file_put_contents(APPPATH . 'logs/api_requests.log', $log_entry, FILE_APPEND);

// 		$response = [];

// 		$count = count($post_data['approval_no']); // How many records

// 		for ($i = 0; $i < $count; $i++) {

// 		// Get next visit number
// 		$app_res_data = $this->Master->f_select(
// 			'td_progress',
// 			'IFNULL(MAX(visit_no), 0) + 1 AS visit_no',
// 			['approval_no' => $post_data['approval_no'][$i]],
// 			1
// 		);

// 		// Handle progress_pic (file URIs, not real uploads)
// 		$upload_paths = [];

// 		if (isset($post_data['progress_pic'][$i])) {
// 			if (is_array($post_data['progress_pic'][$i])) {
// 				foreach ($post_data['progress_pic'][$i] as $pic_uri) {
// 					$upload_paths[] = basename($pic_uri); // Just keep file name
// 				}
// 			} else {
// 				$upload_paths[] = basename($post_data['progress_pic'][$i]);
// 			}
// 		}

// 		// Prepare insert data
// 		$data = [
// 			'approval_no'         => $post_data['approval_no'][$i],
// 			'visit_no'            => $app_res_data->visit_no,
// 			'progress_percent'    => $post_data['progress_percent'][$i],
// 			'progressive_percent' => $post_data['progressive_percent'][$i],
// 			'pic_path'            => json_encode($upload_paths),
// 			'lat'                 => $post_data['lat'][$i],
// 			'long'                => $post_data['long'][$i],
// 			'address'             => $post_data['address'][$i],
// 			'actual_date_comp'    => strlen($post_data['actual_date_comp'][$i]) > 9 ? $post_data['actual_date_comp'][$i] : null,
// 			'proj_comp_status'    => strlen($post_data['actual_date_comp'][$i]) > 9 ? 1 : 0,
// 			'remarks'             => $post_data['remarks'][$i],
// 			'created_by'          => $post_data['created_by'][$i],
// 			'created_at'          => $timestamp,
// 		];

// 		// Insert into DB
// 		$inserted = $this->db->insert('td_progress', $data);

// 		$response[] = [
// 			'approval_no' => $post_data['approval_no'][$i],
// 			'status'      => $inserted ? 1 : 0,
// 			'message'     => $inserted ? 'Inserted successfully' : 'Insert failed',
// 			'file_paths'  => $upload_paths
// 		];
// 	}

// 	// Log response
// 	$response_log = "[{$timestamp}] Response: " . json_encode($response) . PHP_EOL;
// 	file_put_contents(APPPATH . 'logs/api_requests.log', $response_log, FILE_APPEND);

// 	echo json_encode($response);
//    }

	// ******  Progress List of project *********   //
	public function progress_list() {
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,
					   'b.impl_agency = g.id' => NULL);
		$where2 = array('a.approval_no = b.approval_no' => NULL);			   
		$approval_no = $this->input->post('approval_no');
		if ($approval_no > 0) {
			$where = array_merge($where, ['b.approval_no' => $approval_no]); 
			$where2 = array_merge($where2, ['b.approval_no' => $approval_no]);
		}
		
		$result_data = $this->Master->f_select('td_progress a,td_admin_approval b,md_sector c,md_fin_year d,md_proj_imp_agency g,td_tender h', 'b.scheme_name,c.sector_desc as sector_name,b.project_id,a.approval_no', array_merge($where, ['1 limit 1' => NULL]), NULL);
		
		$image_data = $this->Master->f_select('td_progress a,td_admin_approval b', 'a.approval_no,a.visit_no,a.progress_percent,a.pic_path', array_merge($where2, ['1 limit 6' => NULL]), NULL);
		$progress_percent = $this->Master->f_select('td_progress', 'ifnull(sum(progress_percent),0) progress_percent', array('approval_no'=>$approval_no), 1);
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'prog_img'=>$image_data,'progress_percent'=>$progress_percent->progress_percent,'OPERATION_STATUS' => 'edit','folder_name'=>'uploads/progress_image/'] 
			: ['status' => 0, 'message' => 'No data found','progress_percent'=>$progress_percent->progress_percent];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }
}