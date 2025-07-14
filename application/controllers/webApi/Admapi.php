<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Admapi extends CI_Controller {

	public function __construct() {
        parent::__construct();
		$this->load->helper('pdf');
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Methods: POST, OPTIONS");
		header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			exit;
		}

		if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
			echo json_encode(['status' => 0, 'message' => 'Only POST method allowed']);
			exit;
		}

		$headers = $this->input->request_headers();
		$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

		if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
			$token = $matches[1];
			$user = $this->User_model->get_user_by_token($token);
			if ($user) {
				$this->user = $user;
				return;
			}
		}

		http_response_code(401);
		header('Content-Type: application/json');
		echo json_encode([
			'status' => 0,
			'error_code' => 401,
			'message' => 'Unauthorized or Token Expired'
		]);
		exit;
	}

    public function check_pi() {
		$this->form_validation->set_rules('project_id', 'project_id', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$query = $this->db->get_where('td_admin_approval', ['project_id' => $this->input->post('project_id')]);
			
			if($query->num_rows() == 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'Project ID is available'
				]);
			} else {
				echo json_encode([
					'status' => 0,
					'message' => 'Project ID already exists'
				]);
			}
	    }
	}
	
	public function adm_appr_add() {

		$this->form_validation->set_rules('scheme_name', 'scheme_name', 'required');
		$this->form_validation->set_rules('sector_id', 'sector_id', 'required');
		$this->form_validation->set_rules('scheme_name', 'scheme_name', 'required');
		$this->form_validation->set_rules('fin_year', 'fin_year', 'required');
		$this->form_validation->set_rules('sch_amt', 'sch_amt', 'required');
		$this->form_validation->set_rules('cont_amt', 'cont_amt', 'required');
	    
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
                $sch_amt = $this->input->post('sch_amt');
				$cont_amt = $this->input->post('cont_amt');

				if ($cont_amt > (0.03 * $sch_amt)) {
					// Handle error: contribution amount exceeds 3% of scholarship amount
					$response = array(
						'status' => 0,
						'message' => 'Contingency amount cannot exceed 3% of the Schematic amount.'
					);
					echo json_encode($response);
					return;
				}else{

						$upload_paths = []; // Store file paths
						// Load Upload Library
						$this->load->library('upload');
						// File fields to process
						$file_fields = ['admin_approval', 'vetted_dpr'];
						// foreach ($file_fields as $field_name) {
					// 	if (!empty($_FILES[$field_name]['tmp_name'])) {
					// 		$tmp_path = $_FILES[$field_name]['tmp_name'];
					
					// 		if (validate_pdf_content_buffer($tmp_path) == 0) {
					// 			echo json_encode([
					// 				'status' => 0,
					// 				'message' => "Malicious content detected in file: $field_name"
					// 			]);
					// 			return; // Stop further processing
					// 		}
					// 	}
					// }

						$query = $this->db->get_where('td_admin_approval', ['project_id' => $this->input->post('project_id')]);
					    if($query->num_rows() == 0) {

							$app_res_data = $this->Master->f_select('td_admin_approval','IFNULL(MAX(approval_no), 0) + 1 AS approval_no',NULL,1);
							
							foreach ($file_fields as $field) {
								if (!empty($_FILES[$field]['name'])) {
									$config['upload_path']   = './uploads/'; // Folder to store files
									$config['allowed_types'] = 'pdf'; // Allow only PDFs
									$config['max_size']      = 1048576; // Max file size (1GB)
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
									$upload_paths[$field] = ''; // No file uploaded
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
								'project_submit_dtl' => $this->input->post('project_submit_dtl'),
								'impl_agency' => $this->input->post('impl_agency'),
							//	'district_id' => $this->input->post('district_id'),
							//	'block_id' => $this->input->post('block_id'),
								'fund_id' => $this->input->post('fund_id'),
							//	'ps_id' => $this->input->post('ps_id'),
							//	'gp_id' => $this->input->post('gp_id'),
								'jl_no' => $this->input->post('jl_no'),
								'mouza' => $this->input->post('mouza'),
								'dag_no' => $this->input->post('dag_no'),
								'khatian_no' => $this->input->post('khatian_no'),
								'dimension_type' => $this->input->post('dimension_type') ? $this->input->post('dimension_type') : '',
								'area' => $this->input->post('area'),
								'created_by'=> $this->input->post('created_by'),
								'created_at'=> date('Y-m-d h:i:s'),
							];
						
							$this->db->insert('td_admin_approval', $data);

							$district_id = $this->input->post('district_id');
							$district_id = !empty($district_id) ? explode(',', $district_id) : [];
							if (!empty($district_id)) {
								$batch_data = [];
								foreach ($district_id as $value) {
									$batch_data[] = [
										'approval_no' => $app_res_data->approval_no,
										'dist_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_dist', $batch_data);
								}
							}
							$block_id = $this->input->post('block_id');
							$block_id = !empty($block_id) ? explode(',', $block_id) : [];
							if (!empty($block_id)) {
								$batch_data = [];
								foreach ($block_id as $value) {
									$batch_data[] = [
										'approval_no' => $app_res_data->approval_no,
										'block_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_block', $batch_data);
								}
							}	
							$ps_id = $this->input->post('ps_id');
							$ps_id = !empty($ps_id) ? explode(',', $ps_id) : [];
							if (!empty($ps_id)) {
								$batch_data = [];
								foreach ($ps_id as $value) {
									$batch_data[] = [
										'approval_no' => $app_res_data->approval_no,
										'ps_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_ps', $batch_data);
								}
							}
							$gp_id = $this->input->post('gp_id');
							$gp_id = !empty($gp_id) ? explode(',', $gp_id) : [];
							if (!empty($gp_id)) {
								$batch_data = [];
								foreach ($gp_id as $value) {
									$batch_data[] = [
										'approval_no' => $app_res_data->approval_no,
										'gp_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_gp', $batch_data);
								}
							}
								
						
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
	     }
	}
	
	public function adm_appr_edit() {

		$this->form_validation->set_rules('scheme_name', 'scheme_name', 'required');
		$this->form_validation->set_rules('sector_id', 'sector_id', 'required');
		$this->form_validation->set_rules('fin_year', 'fin_year', 'required');
		$this->form_validation->set_rules('sch_amt', 'sch_amt', 'required');
		$this->form_validation->set_rules('cont_amt', 'cont_amt', 'required');
	    
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
			return;
		}else{
                $sch_amt = $this->input->post('sch_amt');
				$cont_amt = $this->input->post('cont_amt');

				if ($cont_amt > (0.03 * $sch_amt)) {
					// Handle error: contribution amount exceeds 3% of scholarship amount
					$response = array(
						'status' => 0,
						'message' => 'Contingency amount cannot exceed 3% of the Schematic amount.'
					);
					echo json_encode($response);
					return;
				}else{
					$upload_paths = []; // Store file paths
					// Load Upload Library
					$this->load->library('upload');
				
					// File fields to process
					$file_fields = ['admin_approval', 'vetted_dpr'];
					
					// foreach ($file_fields as $field_name) {
					// 	if (!empty($_FILES[$field_name]['tmp_name'])) {
					// 		$tmp_path = $_FILES[$field_name]['tmp_name'];
					
					// 		if (validate_pdf_content_buffer($tmp_path) == 0) {
					// 			echo json_encode([
					// 				'status' => 0,
					// 				'message' => "Malicious content detected in file: $field_name"
					// 			]);
					// 			return; // Stop further processing
					// 		}
					// 	}
					// }
					
					// $query = $this->db->get_where('td_admin_approval', ['project_id' => $this->input->post('project_id')]);
					// if($query->num_rows() == 0) {
					foreach ($file_fields as $field) {
						if (!empty($_FILES[$field]['name'])) {
							$config['upload_path']   = './uploads/'; // Folder to store files
							$config['allowed_types'] = 'pdf'; // Allow only PDFs
							$config['max_size']      = 1048576; // Max file size (2MB)
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
						'project_submit_dtl' => $this->input->post('project_submit_dtl'),
						'impl_agency' => $this->input->post('impl_agency'),
						//'district_id' => $this->input->post('district_id'),
						//'block_id' => $this->input->post('block_id'),
						'fund_id' => $this->input->post('fund_id'),
						//'ps_id' => $this->input->post('ps_id'),
						//'gp_id' => $this->input->post('gp_id'),
						'jl_no' => $this->input->post('jl_no'),
						'mouza' => $this->input->post('mouza'),
						'dag_no' => $this->input->post('dag_no'),
						'khatian_no' => $this->input->post('khatian_no'),
						'dimension_type' => $this->input->post('dimension_type') ? $this->input->post('dimension_type') : '',
						'area' => $this->input->post('area'),
						'edit_flag' => 'N',
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
					$res = $this->Master->f_edit('td_admin_approval', $data, $where);

					$district_id = $this->input->post('district_id');
					$district_id = !empty($district_id) ? explode(',', $district_id) : [];
					if (!empty($district_id)) {
						$this->db->where($where);
				        $this->db->delete('td_admin_approval_dist');
						$batch_data = [];
						foreach ($district_id as $value) {
							$batch_data[] = [
								'approval_no' => $this->input->post('approval_no'),
								'dist_id' => trim($value) // Trim to remove extra spaces
							];
						}
						if (!empty($batch_data)) {
							$this->db->insert_batch('td_admin_approval_dist', $batch_data);
						}
					}
					$block_id = $this->input->post('block_id');
							$block_id = !empty($block_id) ? explode(',', $block_id) : [];
							if (!empty($block_id)) {
								$this->db->where($where);
				               $this->db->delete('td_admin_approval_block');
								$batch_data = [];
								foreach ($block_id as $value) {
									$batch_data[] = [
										'approval_no' => $this->input->post('approval_no'),
										'block_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_block', $batch_data);
								}
							}	
							$ps_id = $this->input->post('ps_id');
							$ps_id = !empty($ps_id) ? explode(',', $ps_id) : [];
							if (!empty($ps_id)) {
								$this->db->where($where);
				        $this->db->delete('td_admin_approval_ps');
								$batch_data = [];
								foreach ($ps_id as $value) {
									$batch_data[] = [
										'approval_no' => $this->input->post('approval_no'),
										'ps_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_ps', $batch_data);
								}
							}
							$gp_id = $this->input->post('gp_id');
							$gp_id = !empty($gp_id) ? explode(',', $gp_id) : [];
							if (!empty($gp_id)) {
								$this->db->where($where);
				                $this->db->delete('td_admin_approval_gp');
								$batch_data = [];
								foreach ($gp_id as $value) {
									$batch_data[] = [
										'approval_no' => $this->input->post('approval_no'),
										'gp_id' => trim($value) // Trim to remove extra spaces
									];
								}
								if (!empty($batch_data)) {
									$this->db->insert_batch('td_admin_approval_gp', $batch_data);
								}
							}
						if($res > 0) {
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
				}
		}					

	}

	public function adm_approv_list() {
		$project_id = $this->input->post('project_id');
		$fin_year = $this->input->post('fin_year');
		$dist_id = $this->input->post('dist_id');
		$block_id = $this->input->post('block_id');
		$ps_id = $this->input->post('ps_id');
		$gp_id = $this->input->post('gp_id');
		$where = array('a.sector_id = b.sl_no' => NULL,'a.account_head = c.sl_no' => NULL);

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
		
		$result_data = $this->Master->f_select('td_admin_approval a ,md_sector b ,md_account c', 'a.approval_no,a.admin_approval_dt,a.scheme_name,b.sector_desc as sector_name,(a.sch_amt+a.cont_amt) as tot_amt,a.project_id,c.account_head,a.jl_no,a.mouza,a.dag_no,a.khatian_no,a.area,edit_flag', $where, NULL);
		//echo $this->db->last_query(); 
		if (!empty($result_data)) {
			echo json_encode(['status' => 1, 'message' => $result_data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	public function adm_by_approval_no() {
		$approval_no = $this->input->post('approval_no');
		$where = array();
        // Check if JSON decoding was successful
		if ($approval_no === null) {
			echo json_encode([
				'status' => 0,
				'message' => 'Missing approval_no'
			]);
			return;
		}
		$approval_no = $approval_no;
		
		if ($approval_no > 0) {
			$where = array_merge($where, ['a.approval_no' => $approval_no]); 
		}
		$dist_res = $this->Master->f_select('td_admin_approval_dist', 'dist_id', array('approval_no' => $approval_no), NULL);
		$dist_data = array_map(function($row) {
			return $row->dist_id;
		}, $dist_res);
		$block_res = $this->Master->f_select('td_admin_approval_block', 'block_id', array('approval_no' => $approval_no), NULL);
		$block_data = array_map(function($row) {
			return $row->block_id;
		}, $block_res);	
		$ps_res = $this->Master->f_select('td_admin_approval_ps', 'ps_id', array('approval_no' => $approval_no), NULL);
		$ps_data = array_map(function($row) {
			return $row->ps_id;
		}, $ps_res);
		$gp_res = $this->Master->f_select('td_admin_approval_gp', 'gp_id', array('approval_no' => $approval_no), NULL);
		$gp_data = array_map(function($row) {
			return $row->gp_id;
		}, $gp_res);
		
		$result_data = $this->Master->f_select('td_admin_approval a ', '*', $where, 1);
		$result_data->district_id = $dist_data;
		$result_data->block_id = $block_data;
		$result_data->ps_id = $ps_data;	
		$result_data->gp_id = $gp_data;
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
