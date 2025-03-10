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

	
}
