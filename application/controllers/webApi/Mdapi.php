<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Mdapi extends CI_Controller {

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

    public function sector() {
		$data = $this->Master->f_select('md_sector', array('sl_no','sector_desc'), NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function fin_year() {
		$data = $this->Master->f_select('md_fin_year', NULL, NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function head_of_acc() {
		$data = $this->Master->f_select('md_account', array('sl_no','account_head'), NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function dist() {
		$data = $this->Master->f_select('md_district', NULL, NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function block() {
		
		$data = $this->Master->f_select('md_block', NULL, NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function block_filter() {
		$dist_list = $this->input->post('dist_list');
		if(!empty($dist_list)) {
			$dist_array = array_filter(
				explode(',', $dist_list),
				function ($value) {
					return is_numeric($value);
				}
			);
			if (count($dist_array) > 0) {
				$dist_ids = implode(',', $dist_array);
				$where = array('dist_id in(' . $dist_ids . ')' => NULL);
				$data = $this->Master->f_select('md_block', NULL, $where, NULL);
				if (!empty($data)) {
					echo json_encode(['status' => 1, 'message' => $data]);
				} else {
					echo json_encode(['status' => 0, 'message' => 'No data found']);
				}
			} else {
				echo json_encode(['status' => 0, 'message' => 'Invalid district list']);
			}
		} else {
			echo json_encode(['status' => 0, 'message' => 'Please select at least one district']);
		}
    }

	public function blockSave() {
		$sl_no = $this->input->post('sl_no');
		$dist_id = trim($this->input->post('dist_id'));
		$block_name = trim($this->input->post('block_name'));	
		$user = $this->input->post('created_by');

		// Check if block name is empty
		if ($block_name == '' || $user == '' || $sl_no == '') {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}

		// Check if block name already exists (excluding the current record in case of edit)
		$query = $this->db->get_where('md_block', ['dist_id' => $dist_id, 'block_name' => $block_name]);
		if ($query->num_rows() > 0 ) {
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exists'
			]);
			return;
		}
	
		if (!empty($sl_no) && $sl_no > 0) {
			// **Edit Mode**
			$data = [
				'dist_id' => $dist_id,
				'block_name' => $block_name,
				'modified_by' => $user,
				'modified_at' => date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $sl_no];
	
			$id = $this->Master->f_edit('md_block', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// **Add Mode**
			$data = [
				'dist_id' => $dist_id,
				'block_name' => $block_name,
				'created_by' => $user,
				'created_at' => date('Y-m-d h:i:s')
			];
	
			$id = $this->Master->f_insert('md_block', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}
	
		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}

	public function agencySave() {

		// Set validation rules
		$this->form_validation->set_rules('agency_id', 'Agency ID', 'required');
		$this->form_validation->set_rules('agency_name', 'Agency Name', 'required');
		$this->form_validation->set_rules('ph_no', 'Phone Number', 'required');
		$this->form_validation->set_rules('address', 'Address', 'required');
		$this->form_validation->set_rules('gst_no', 'GST Number', 'required');
		$this->form_validation->set_rules('created_by', 'Created By', 'required');
		// Optional fields (uncomment if needed)
		// $this->form_validation->set_rules('reg_no', 'Registration Number', 'required');
		// $this->form_validation->set_rules('pan_no', 'PAN Number', 'required');
		// $this->form_validation->set_rules('acc_no', 'Account Number', 'required');
		// $this->form_validation->set_rules('ifs_code', 'IFSC Code', 'required');

		// Check validation
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}

		// Get input values
		$agency_id    = $this->input->post('agency_id');
		$agency_name  = $this->input->post('agency_name');

		// Check for duplicate agency name (excluding same record during update)
		$this->db->where('agency_name', $agency_name);
		if (!empty($agency_id)) {
			$this->db->where('agency_id !=', $agency_id);
		}
		$query = $this->db->get('md_agency');

		if ($query->num_rows() > 0) {
			echo json_encode([
				'status' => 0,
				'message' => 'Agency already exists'
			]);
			return;
		}

		// Prepare data array
		$data = [
			'agency_name' => $agency_name,
			'ph_no'       => $this->input->post('ph_no'),
			'address'     => $this->input->post('address'),
			'gst_no'      => $this->input->post('gst_no'),
			'pan_no'      => $this->input->post('pan_no'),
			'acc_no'      => $this->input->post('acc_no'),
			'ifs_code'    => $this->input->post('ifs_code'),
			'reg_no'      => $this->input->post('reg_no')
		];

		if (!empty($agency_id) && $agency_id > 0) {
			// Edit Mode
			$data['modified_by'] = $this->input->post('created_by');
			$data['modified_at'] = date('Y-m-d H:i:s');
			$where = ['agency_id' => $agency_id];

			$id = $this->Master->f_edit('md_agency', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// Add Mode
			$data['created_by'] = $this->input->post('created_by');
			$data['created_at'] = date('Y-m-d H:i:s');

			$id = $this->Master->f_insert('md_agency', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}

		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}
    public function agencyList() {
		$this->form_validation->set_rules('agency_id', 'Agency ID', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}
		$where = $this->input->post('agency_id') > 0 ? array('agency_id' => $this->input->post('agency_id')) : array();
		$data = $this->Master->f_select('md_agency', array('agency_id','agency_name','ph_no','address','reg_no','gst_no','pan_no','acc_no','ifs_code'), $where, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }


	public function sof() {
		$data = $this->Master->f_select('md_fund', array('sl_no','fund_type',), NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function impagency() {
		$data = $this->Master->f_select('md_proj_imp_agency', array('id','agency_name',), NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	public function get_ps() {
			$result_data = $this->Master->f_select('md_police_station', array('id','ps_name',), NULL, NULL);
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}

	public function get_ps_filter() {
		$dist_list = $this->input->post('dist_list');
		if(!empty($dist_list)) {
			$dist_array = array_filter(
				explode(',', $dist_list),
				function ($value) {
					return is_numeric($value);
				}
			);
		
			if (count($dist_array) > 0) {
				$dist_ids = implode(',', $dist_array);
				$where = array('dist_id in(' . $dist_ids . ')' => NULL);
				$result_data = $this->Master->f_select('md_police_station', array('id','ps_name',), $where, NULL);
				if (!empty($result_data)) {
					echo json_encode(['status' => 1, 'message' => $result_data]);
				} else {
					echo json_encode(['status' => 0, 'message' => 'No data found']);
				}
			} else {
				echo json_encode(['status' => 0, 'message' => 'Invalid district list']);
			}
		} else {
			echo json_encode(['status' => 0, 'message' => 'Please select at least one district']);
		}
	}
	public function psSave() {
		$sl_no = $this->input->post('sl_no');
		$dist_id = trim($this->input->post('dist_id'));
		$ps_name = trim($this->input->post('ps_name'));	
		$user = $this->input->post('created_by');

		// Check if police station name is empty
		if ($ps_name == '' || $user == '' || $sl_no == '') {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}

		// Check if police station name already exists (excluding the current record in case of edit)
		$query = $this->db->get_where('md_police_station', ['dist_id' => $dist_id, 'ps_name' => $ps_name]);
		if ($query->num_rows() > 0 ) {
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exists'
			]);
			return;
		}
	
		if (!empty($sl_no) && $sl_no > 0) {
			// **Edit Mode**
			$data = [
				'dist_id' => $dist_id,
				'ps_name' => $ps_name,
				'modified_by' => $user,
				'modified_at' => date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $sl_no];
	
			$id = $this->Master->f_edit('md_police_station', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// **Add Mode**
			$data = [
				'dist_id' => $dist_id,
				'ps_name' => $ps_name,
				'created_by' => $user,
				'created_at' => date('Y-m-d h:i:s')
			];
	
			$id = $this->Master->f_insert('md_police_station', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}
	
		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}
	public function get_gp() {
			$result_data = $this->Master->f_select('md_gp', array('gp_id','gp_name',), NULL, NULL);
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
			
	}
	public function get_gp_filter() {
		$block_id = $this->input->post('block_id');
		if(!empty($block_id)) {
			//$block_array = array_filter(explode(',', $block_id));
			$block_array = array_filter(
				explode(',', $block_id),
				function ($value) {
					return is_numeric($value);
				}
			);
			if (count($block_array) > 0) {
				$block_iss = implode(',', $block_array);
				$where = array('block_id in(' . $block_iss . ')' => NULL);
				$result_data = $this->Master->f_select('md_gp', array('gp_id','gp_name',), $where, NULL);
				if (!empty($result_data)) {
					echo json_encode(['status' => 1, 'message' => $result_data]);
				} else {
					echo json_encode(['status' => 0, 'message' => 'No data found']);
				}
			} else {
				echo json_encode(['status' => 0, 'message' => 'Invalid block list']);
			}
		} else {
			echo json_encode(['status' => 0, 'message' => 'Please select at least one block']);
		}
		  
	}
    ///    ***************   GET CALL LIST API FOR MASTER DATA ************* //  
	public function get_call() {
			$result_data = $this->Master->f_select('md_call', array('call_id','call_name'), NULL, NULL);
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
			
	}

	public function gpSave() {
		$sl_no = $this->input->post('sl_no');
		$dist_id = trim($this->input->post('dist_id'));
		$block_id = trim($this->input->post('block_id'));
		$gp_name = trim($this->input->post('gp_name'));	
		$user = $this->input->post('created_by');

		// Check if block name is empty
		if ($block_id == '' || $user == '' || $sl_no == '' || $gp_name == '' || $dist_id < 1 || $dist_id == '') {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}
	
		if (!empty($sl_no) && $sl_no > 0) {
			// **Edit Mode**
			$data = [
				'dist_id' => $dist_id,
				'block_id' => $block_id,
				'gp_name' => $gp_name
			//	'modified_by' => $user,
			//	'modified_at' => date('Y-m-d h:i:s')
			];
			$where = ['gp_id' => $sl_no];
	
			$id = $this->Master->f_edit('md_gp', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// **Add Mode**
			$data = [
				'dist_id' => $dist_id,
				'block_id' => $block_id,
				'gp_name' => $gp_name,
				//'created_by' => $user,
				//'created_at' => date('Y-m-d h:i:s')
			];

			$id = $this->Master->f_insert('md_gp', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}
	
		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}
	public function projSubmitBy() {
		
		$result_data = $this->Master->f_select('md_proj_submit_by', array('sl_no','proj_submit_by',), NULL, NULL);
		$response = (!empty($result_data)) 
		? ['status' => 1, 'message' => $result_data] 
		: ['status' => 0, 'message' => 'No data found'];
		$this->output
		->set_content_type('application/json')
		->set_output(json_encode($response));
	 
	}

	public function contRmrks() {
		
		$result_data = $this->Master->f_select('md_cont_remarks', array('sl_no','cont_rmrks',), NULL, NULL);
		$response = (!empty($result_data)) 
		? ['status' => 1, 'message' => $result_data] 
		: ['status' => 0, 'message' => 'No data found'];
		$this->output
		->set_content_type('application/json')
		->set_output(json_encode($response));
	 
	}
	//////// *************    API FOR FUND MASTER  ************* ////////
	public function fundAdd() {
		$query = $this->db->get_where('md_fund', ['fund_type' => trim($this->input->post('fund_type'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('fund_type') == '' || $this->input->post('created_by') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Fund Type,Created by is Required'
				]);
				return;
			}
			$data = [
				'fund_type' => $this->input->post('fund_type'),
				'created_by'=> $this->input->post('created_by'),
				'created_at'=> date('Y-m-d h:i:s')
			];
		
			$id = $this->Master->f_insert('md_fund', $data);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'successfully!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Fund Type Already Exist'
			]);
		}
	}
	public function fundedit() {
		$query = $this->db->get_where('md_fund', ['fund_type' => trim($this->input->post('fund_type'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('fund_type') == '' || $this->input->post('modified_by') == '' || $this->input->post('sl_no') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Fund Type,modified_by, Sl no is Required'
				]);
				return;
			}
			$data = [
				'fund_type' => $this->input->post('fund_type'),
				'modified_by'=> $this->input->post('modified_by'),
				'modified_at'=> date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $this->input->post('sl_no')];
		
			$id = $this->Master->f_edit('md_fund', $data ,$where);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'success!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}
    //////// *************    API FOR Implementing Agency  ************* ////////
	public function impAdd() {
		$query = $this->db->get_where('md_proj_imp_agency', ['agency_name' => trim($this->input->post('agency_name'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('agency_name') == '' || $this->input->post('created_by') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Required Missing'
				]);
				return;
			}
			$data = [
				'agency_name' => $this->input->post('agency_name'),
				'created_by'=> $this->input->post('created_by'),
				'created_at'=> date('Y-m-d h:i:s')
			];
		
			$id = $this->Master->f_insert('md_proj_imp_agency', $data);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'successfully!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}
	public function impedit() {
		$query = $this->db->get_where('md_proj_imp_agency', ['agency_name' => trim($this->input->post('agency_name'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('agency_name') == '' || $this->input->post('modified_by') == '' || $this->input->post('id') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Required Missing'
				]);
				return;
			}
			$data = [
				'agency_name' => $this->input->post('agency_name'),
				'modified_by'=> $this->input->post('modified_by'),
				'modified_at'=> date('Y-m-d h:i:s')
			];
			$where = ['id' => $this->input->post('id')];
		
			$id = $this->Master->f_edit('md_proj_imp_agency', $data ,$where);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'success!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}
	//////// *************    API FOR Sector  ************* ////////
	public function secAdd() {
		$query = $this->db->get_where('md_sector', ['sector_desc' => trim($this->input->post('sector_desc'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('sector_desc') == '' || $this->input->post('created_by') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Required Missing'
				]);
				return;
			}
			$data = [
				'sector_desc' => $this->input->post('sector_desc'),
				'created_by'=> $this->input->post('created_by'),
				'created_at'=> date('Y-m-d h:i:s')
			];
		
			$id = $this->Master->f_insert('md_sector', $data);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'successfully!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}
	public function secedit() {
		$query = $this->db->get_where('md_sector', ['sector_desc' => trim($this->input->post('sector_desc'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('sector_desc') == '' || $this->input->post('modified_by') == '' || $this->input->post('sl_no') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Required Missing'
				]);
				return;
			}
			$data = [
				'sector_desc' => $this->input->post('sector_desc'),
				'modified_by'=> $this->input->post('modified_by'),
				'modified_at'=> date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $this->input->post('sl_no')];
		
			$id = $this->Master->f_edit('md_sector', $data ,$where);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'success!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}

	//////// *************    API FOR Sector  ************* ////////
	public function accAdd() {
		$query = $this->db->get_where('md_account', ['account_head' => trim($this->input->post('account_head'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('account_head') == '' || $this->input->post('created_by') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Required Missing'
				]);
				return;
			}
			$data = [
				'account_head' => $this->input->post('account_head'),
				'created_by'=> $this->input->post('created_by'),
				'created_at'=> date('Y-m-d h:i:s')
			];
		
			$id = $this->Master->f_insert('md_account', $data);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'successfully!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}
	public function accedit() {
		$query = $this->db->get_where('md_account', ['account_head' => trim($this->input->post('account_head'))]);
		if($query->num_rows() == 0) {
			if($this->input->post('account_head') == '' || $this->input->post('modified_by') == '' || $this->input->post('sl_no') == '') {
				echo json_encode([
					'status' => 0,
					'message' => 'Required Missing'
				]);
				return;
			}
			$data = [
				'account_head' => $this->input->post('account_head'),
				'modified_by'=> $this->input->post('modified_by'),
				'modified_at'=> date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $this->input->post('sl_no')];
		
			$id = $this->Master->f_edit('md_account', $data ,$where);
			if($id > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'success!'
				]);
			}else{
					echo json_encode([
						'status' => 0,
						'message' => 'Something Went Wrong'
					]);
			}
		}else{
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exist'
			]);
		}
	}

	//////// *************    API FOR Department  ************* ////////
	public function department() {
		$data = $this->Master->f_select('md_department', array('sl_no','dept_name'), NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }
	public function deptSave() {
		$sl_no = $this->input->post('sl_no');
		$dept_name = trim($this->input->post('dept_name'));
		$user = $this->input->post('modified_by') ?: $this->input->post('created_by');
	
		// Check if department name is empty
		if ($dept_name == '' || $user == '' || $sl_no == '') {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}
	
		// Check if department name already exists (excluding the current record in case of edit)
		$query = $this->db->get_where('md_department', ['dept_name' => $dept_name]);
		if ($query->num_rows() > 0 ) {
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exists'
			]);
			return;
		}
	
		if (!empty($sl_no) && $sl_no > 0) {
			// **Edit Mode**
			$data = [
				'dept_name' => $dept_name,
				'modified_by' => $user,
				'modified_at' => date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $sl_no];
	
			$id = $this->Master->f_edit('md_department', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// **Add Mode**
			$data = [
				'dept_name' => $dept_name,
				'created_by' => $user,
				'created_at' => date('Y-m-d h:i:s')
			];
	
			$id = $this->Master->f_insert('md_department', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}
	
		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}
	
	public function designation() {
		$data = $this->Master->f_select('md_designation', array('sl_no','desig_name'), NULL, NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	public function desigSave() {
		$sl_no = $this->input->post('sl_no');
		$desig_name = trim($this->input->post('desig_name'));
		$user = $this->input->post('modified_by') ?: $this->input->post('created_by');
	
		// Check if department name is empty
		if ($desig_name == '' || $user == '' || $sl_no == '') {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}
	
		// Check if department name already exists (excluding the current record in case of edit)
		$query = $this->db->get_where('md_designation', ['desig_name' => $desig_name]);
		if ($query->num_rows() > 0 ) {
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exists'
			]);
			return;
		}
	
		if (!empty($sl_no) && $sl_no > 0) {
			// **Edit Mode**
			$data = [
				'desig_name' => $desig_name,
				'modified_by' => $user,
				'modified_at' => date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $sl_no];
	
			$id = $this->Master->f_edit('md_designation', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// **Add Mode**
			$data = [
				'desig_name' => $desig_name,
				'created_by' => $user,
				'created_at' => date('Y-m-d h:i:s')
			];
	
			$id = $this->Master->f_insert('md_designation', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}
		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}
	public function projsubbysave() {
		$sl_no = $this->input->post('sl_no');
		$proj_submit_by = trim($this->input->post('proj_submit_by'));
		$user = $this->input->post('modified_by') ?: $this->input->post('created_by');
	
		// Check if department name is empty
		if ($proj_submit_by == '' || $user == '' || $sl_no == '') {
			echo json_encode([
				'status' => 0,
				'message' => 'Required fields missing'
			]);
			return;
		}
	
		// Check if department name already exists (excluding the current record in case of edit)
		$query = $this->db->get_where('md_proj_submit_by', ['proj_submit_by' => $proj_submit_by]);
		if ($query->num_rows() > 0 ) {
			echo json_encode([
				'status' => 0,
				'message' => 'Already Exists'
			]);
			return;
		}
	
		if (!empty($sl_no) && $sl_no > 0) {
			// **Edit Mode**
			$data = [
				'proj_submit_by' => $proj_submit_by,
				'modified_by' => $user,
				'modified_at' => date('Y-m-d h:i:s')
			];
			$where = ['sl_no' => $sl_no];
	
			$id = $this->Master->f_edit('md_proj_submit_by', $data, $where);
			$message = ($id > 0) ? 'Updated Successfully!' : 'Something Went Wrong';
		} else {
			// **Add Mode**
			$data = [
				'proj_submit_by' => $proj_submit_by,
				'created_by' => $user,
				'created_at' => date('Y-m-d h:i:s')
			];
	
			$id = $this->Master->f_insert('md_proj_submit_by', $data);
			$message = ($id > 0) ? 'Added Successfully!' : 'Something Went Wrong';
		}
		// Send JSON response
		echo json_encode([
			'status' => ($id > 0) ? 1 : 0,
			'message' => $message
		]);
	}
	public function editpermission() {
		$this->form_validation->set_rules('project_id', 'project_id', 'required');
		$this->form_validation->set_rules('approval_no', 'approval_no', 'required');
		$this->form_validation->set_rules('operation_type', 'operation_type', 'required');
		$this->form_validation->set_rules('operation_module', 'operation_module', 'required');
		$this->form_validation->set_rules('edit_flag', 'edit_flag', 'required');
		$this->form_validation->set_rules('created_by', 'created_by', 'required');
		
		if($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$insert = 0;$give_permission = 0;
			$data = array('edit_flag'=>$this->input->post('edit_flag'));
			if($this->input->post('operation_module')=='AA'){
				$give_permission = $this->Master->f_edit('td_admin_approval', $data, ['approval_no' => $this->input->post('approval_no')]);
			}else if($this->input->post('operation_module')=='TD'){
				$give_permission = $this->Master->f_edit('td_tender', $data, ['approval_no' => $this->input->post('approval_no')]);
			}else if($this->input->post('operation_module')=='FR'){
				$give_permission = $this->Master->f_edit('td_fund_receive', $data, ['approval_no' => $this->input->post('approval_no')]);
			}else if($this->input->post('operation_module')=='EXP'){
				$give_permission = $this->Master->f_edit('td_expenditure', $data, ['approval_no' => $this->input->post('approval_no')]);
			}else if($this->input->post('operation_module')=='UC'){
				$give_permission = $this->Master->f_edit('td_utilization', $data, ['approval_no' => $this->input->post('approval_no')]);
			}else if($this->input->post('operation_module')=='PCR'){
				$give_permission = $this->Master->f_edit('td_proj_comp_report', $data, ['approval_no' => $this->input->post('approval_no')]);
			}

			$log_entry_data = array(
				'approval_no' => $this->input->post('approval_no'),
				'operation_type' => $this->input->post('operation_type'),
				'operation_module'=> $this->input->post('operation_module'),
				'operation' => 'Edit Permission',
				'created_by'=> $this->input->post('created_by'),
				'created_at'=> date('Y-m-d h:i:s')
			);
			
			if($give_permission > 0){
				 $insert = $this->Master->f_insert('td_log', $log_entry_data);
			}
			
			if($insert > 0) {
				echo json_encode([
					'status' => 1,
					'message' => 'Successfully!'
				]);
			} else {
				echo json_encode([
					'status' => 0,
					'message' => 'Fail'
				]);
			}
	    }
	}

	
}
