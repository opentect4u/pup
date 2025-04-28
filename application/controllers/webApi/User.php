<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {

	public function __construct() {
        parent::__construct();
		header("Access-Control-Allow-Origin: *"); // Allow all domains
        header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow specific methods
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			http_response_code(200);
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

	public function userlist() {
		$data = $this->Master->f_select('td_user a,md_department b,md_designation c,md_district d', array('a.user_id','a.user_type','a.name','a.user_status','b.dept_name','c.desig_name','d.dist_name'), array('a.dept_id=b.sl_no'=>NULL,'a.desig_id=c.sl_no'=>NULL,'a.dist_id=d.dist_code'=>NULL), NULL);
		if (!empty($data)) {
			echo json_encode(['status' => 1, 'message' => $data]);
		} else {
			echo json_encode(['status' => 0, 'message' => 'No data found']);
		}
    }

	//////// *************    API FOR User Add  ************* ////////
	public function userAdd() {
		$this->form_validation->set_rules('name', 'Name', 'required|min_length[2]|max_length[100]');
		$this->form_validation->set_rules('user_type', 'User Type', 'required');
		$this->form_validation->set_rules('created_by', 'created_by', 'required');
		$this->form_validation->set_rules('user_id', 'user_id', 'required|min_length[3]');
		$this->form_validation->set_rules('dept_id', 'Department', 'required');
		$this->form_validation->set_rules('desig_id', 'Designation', 'required');
		$this->form_validation->set_rules('dist_id', 'District', 'required');
		$this->form_validation->set_rules('mobile', 'Phone', 'required|min_length[5]');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		} else {
			$query = $this->db->get_where('td_user', ['user_id' => trim($this->input->post('user_id'))]);
			if($query->num_rows() == 0) {
				$data = [
					'user_id' => $this->input->post('user_id'),
					'pass' => password_hash(1234, PASSWORD_DEFAULT),
					'user_type' => $this->input->post('user_type'),
					'name' => $this->input->post('name'),
					'dept_id' => $this->input->post('dept_id'),
					'desig_id' => $this->input->post('desig_id'),
					'dist_id' => $this->input->post('dist_id'),
					'mobile' => $this->input->post('mobile'),
					'email_id' => $this->input->post('email_id'),
					'user_status' => 'A',
					'created_by'=> $this->input->post('created_by'),
					'created_at'=> date('Y-m-d h:i:s')
				];
			
				$id = $this->Master->f_insert('td_user', $data);
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
	
	}
	public function userEdit() {
		$this->form_validation->set_rules('name', 'Name', 'required|min_length[2]|max_length[100]');
		$this->form_validation->set_rules('user_type', 'User Type', 'required');
		$this->form_validation->set_rules('reset_pass', 'Reset Pass Flag', 'required');
		$this->form_validation->set_rules('user_status', 'User Status', 'required');
		$this->form_validation->set_rules('dept_id', 'Department', 'required');
		$this->form_validation->set_rules('desig_id', 'Designation', 'required');
		$this->form_validation->set_rules('dist_id', 'District', 'required');
		$this->form_validation->set_rules('mobile', 'Phone', 'required|min_length[5]');
		$this->form_validation->set_rules('modified_by', 'modified_by', 'required');
		$this->form_validation->set_rules('user_id', 'user_id', 'required|min_length[3]');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		} else {
			$query = $this->db->get_where('td_user', ['user_id' => trim($this->input->post('user_id'))]);
		
			if($query->num_rows() == 1) {
				$data = [
					'user_type' => $this->input->post('user_type'),
					'name' => $this->input->post('name'),
					'dept_id' => $this->input->post('dept_id'),
					'desig_id' => $this->input->post('desig_id'),
					'dist_id' => $this->input->post('dist_id'),
					'mobile' => $this->input->post('mobile'),
					'email_id' => $this->input->post('email_id'),
					'user_status' => $this->input->post('user_status'),
					'modified_by'=> $this->input->post('modified_by'),
					'modified_at'=> date('Y-m-d h:i:s')
				];
				if($this->input->post('reset_pass') == 'Y') {
					$data = array_merge($data, ['pass' => password_hash(1234, PASSWORD_DEFAULT)]);
				}
			    $where = ['user_id' => $this->input->post('user_id')];
				
				$id = $this->Master->f_edit('td_user', $data,$where);
				
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
					'message' => 'User Not Exist'
				]);
			}
		}
	
	}
	public function changepass() {
		
		//$this->form_validation->set_rules('pass', 'User Pass', 'required');
		$this->form_validation->set_rules('pass', 'pass', 'callback_validate_password');
		$this->form_validation->set_rules('modified_by', 'created_by', 'required');
		$this->form_validation->set_rules('user_id', 'user_id', 'required|min_length[3]');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		} else {
			$result     = $this->Master->f_select('td_user',array('user_status','pass'),array('user_id'=>trim($this->input->post('user_id')),'user_status'=>'A'),1);
			$user_pw 	= $this->input->post('pass');
			$match	    = password_verify($user_pw,$result->pass);
			if($match){
				echo json_encode([
					'status' => 0,
					'message' => 'Old Password And New Password Can Not Be Same'
				]);
			}else{
			$query = $this->db->get_where('td_user', ['user_id' => trim($this->input->post('user_id'))]);
			if($query->num_rows() == 1) {
				$data = [
					'pass' => password_hash($this->input->post('pass'), PASSWORD_DEFAULT),
					'modified_by'=> $this->input->post('modified_by'),
					'modified_at'=> date('Y-m-d h:i:s')
				];
			
			    $where = ['user_id' => $this->input->post('user_id')];
				$id = $this->Master->f_edit('td_user', $data,$where);
				
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
					'message' => 'User Not Exist'
				]);
			}
		    }
		}
	}

	public function userdata() {
		
		$this->form_validation->set_rules('user_id', 'User ID', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		} else {
			$result     = $this->Master->f_select('td_user',array('*'),array('user_id'=>trim($this->input->post('user_id')),'user_status'=>'A'),1);
			if($result){
				echo json_encode([
					'status' => 1,
					'message' => $result
				]);
			}else{
				echo json_encode([
					'status' => 0,
					'message' => 'User Not Exist'
				]);
			}
		}
	}

	public function profileEdit() {
		$this->form_validation->set_rules('name', 'Name', 'required|min_length[2]|max_length[100]');
		$this->form_validation->set_rules('dept_id', 'Department', 'required');
		$this->form_validation->set_rules('desig_id', 'Designation', 'required');
		$this->form_validation->set_rules('dist_id', 'District', 'required');
		$this->form_validation->set_rules('mobile', 'Phone', 'required|min_length[5]');
		$this->form_validation->set_rules('modified_by', 'modified_by', 'required');
		$this->form_validation->set_rules('user_id', 'user_id', 'required|min_length[3]');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		} else {
			$query = $this->db->get_where('td_user', ['user_id' => trim($this->input->post('user_id'))]);
		
			if($query->num_rows() == 1) {
				$data = [
					'name' => $this->input->post('name'),
					'dept_id' => $this->input->post('dept_id'),
					'desig_id' => $this->input->post('desig_id'),
					'dist_id' => $this->input->post('dist_id'),
					'mobile' => $this->input->post('mobile'),
					'email_id' => $this->input->post('email_id'),
					'modified_by'=> $this->input->post('modified_by'),
					'modified_at'=> date('Y-m-d h:i:s')
				];
			    $where = ['user_id' => $this->input->post('user_id')];
				
				$id = $this->Master->f_edit('td_user', $data,$where);
				
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
					'message' => 'User Not Exist'
				]);
			}
		}
	
	}
	public function validate_password($password)
	{
		// Check for lowercase letter
		if (!preg_match('/[a-z]/', $password)) {
			$this->form_validation->set_message('validate_password', 'The {field} must contain at least one lowercase letter.');
			return FALSE;
		}
		
		// Check for uppercase letter
		if (!preg_match('/[A-Z]/', $password)) {
			$this->form_validation->set_message('validate_password', 'The {field} must contain at least one uppercase letter.');
			return FALSE;
		}

		// Check for number
		if (!preg_match('/[0-9]/', $password)) {
			$this->form_validation->set_message('validate_password', 'The {field} must contain at least one number.');
			return FALSE;
		}

		// Check for special character
		if (!preg_match('/[!@#$%^&*(),.?":{}|<>]/', $password)) {
			$this->form_validation->set_message('validate_password', 'The {field} must contain at least one special character.');
			return FALSE;
		}

		// Check for minimum length
		if (strlen($password) < 8) {
			$this->form_validation->set_message('validate_password', 'The {field} must be at least 8 characters long.');
			return FALSE;
		}

		// All checks passed
		return TRUE;
	}
	
}
