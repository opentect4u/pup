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
		$json_data = file_get_contents("php://input");
		$data = json_decode($json_data, true);
		$where = array();
		$dist_id = $data['dist_id'] ?? null;
		if ($dist_id > 0) {
			$where = array_merge($where, ['dist_id' => $dist_id]); 
		}
		$data = $this->Master->f_select('md_block', NULL, $where, NULL);
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
	
		$this->form_validation->set_rules('dist_id', 'District ', 'required');
		$this->form_validation->set_rules('block_id', 'Block', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$where = array('dist_id' => $this->input->post('dist_id'));
			$result_data = $this->Master->f_select('md_police_station', array('id','ps_name',), $where, NULL);
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	   }
	}
	public function get_gp() {
	
		$this->form_validation->set_rules('dist_id', 'District ', 'required');
		$this->form_validation->set_rules('block_id', 'Block', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$where = array('dist_id' => $this->input->post('dist_id'),'block_id' => $this->input->post('block_id'));
			$result_data = $this->Master->f_select('md_gp', array('gp_id','gp_name',), $where, NULL);
			
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	   }
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

	
}
