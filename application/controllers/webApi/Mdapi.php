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

	

	
}
