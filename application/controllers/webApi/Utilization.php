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
		$result_data = $this->Master->f_select('td_utilization', 'approval_no,certificate_no,certificate_date,certificate_path,issued_by,issued_to,remarks,is_final', $where, NULL);
		$final_pic = $this->Master->f_select('td_proj_final_pic', 'final_pic', $where, NULL);
		$query = $this->db->get_where('td_utilization', ['approval_no' => $this->input->post('approval_no'),'is_final'=>'Y']);
		if($query->num_rows() == 0) {
              $project_status = 'OPEN';
		}else{
			$project_status = 'CLOSE';
		}
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'final_pic'=>$final_pic,'project_status'=>$project_status,'OPERATION_STATUS' => 'add'] 
			: ['status' => 0, 'message' => 'No data found','project_status'=>'OPEN'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function utlization_list() {
		
		$where = array('a.approval_no = b.approval_no' => NULL,'b.sector_id = c.sl_no' => NULL,
		               'b.fin_year = d.sl_no' => NULL,'b.district_id = e.dist_code' => NULL,
					   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no'=>NULL);
		
		$result_data = $this->Master->f_select('td_utilization a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no', $where, NULL);

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
				$config['max_size']      = 20480; // Max file size (2MB)
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
			'certificate_date' => $this->input->post('certificate_date'),
			'certificate_path' => $upload_paths['certificate_path'],
			'issued_by' => $this->input->post('issued_by'),
			'issued_to' => $this->input->post('issued_to'),
			'remarks'  => $this->input->post('remarks'),
			'is_final' => $this->input->post('is_final'),
			'created_by' => $this->input->post('created_by'),
			'created_at' => date('Y-m-d h:i:s'),
		];
	
		$this->db->insert('td_utilization', $data);


		if($this->input->post('is_final') == 'Y'){
		$upload_path = [];
			$file_fiel = ['final_pic'];
		
			foreach ($file_fiel as $field) {
				if (!empty($_FILES[$field]['name'])) {
					$config['upload_path']   = './uploads/proj_final_pic/'; // Folder to store files
					$config['allowed_types'] = 'jpg|jpeg|png';  // Image only
					$config['max_size']      = 20480; // Max file size (2MB)
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
					$upload_path[$field] = $fileData['file_name'];
				} else {
					$upload_path[$field] = null; // No file uploaded
				}
			}
			
			// Insert into database
			$data = [
				'approval_no' => $this->input->post('approval_no'),
				'certificate_no' => $app_res_data->certificate_no,
				'final_pic' => $upload_path['final_pic'],
			];
			$this->db->insert('td_proj_final_pic', $data);
	   }
		echo json_encode([
			'status' => 1,
			'data' => 'Files uploaded successfully!',
			'file_paths' => $upload_path
		]);
	}

	public function utlization_single_data() {
		$where = [];
		$approval_no = $this->input->post('approval_no') ?? null;
		$certificate_no = $this->input->post('certificate_no') ?? null;
	
		
		$where['approval_no'] = $approval_no;
		$where['certificate_no'] = $certificate_no;
	
		$result_data = $this->Master->f_select('td_utilization', 'approval_no,certificate_no,certificate_date,certificate_path,issued_by,issued_to,remarks,is_final', $where, 1);
	
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
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('modified_by', 'Modified By', 'required');
		$this->form_validation->set_rules('issued_by', 'Issued By', 'required');
		$this->form_validation->set_rules('issued_to', 'Issued To', 'required');
		$this->form_validation->set_rules('certificate_date', 'Certificate date', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
	
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/certificate/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 20480; // Max file size (2MB)
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
			} 
		}
		// Prepare data array for update
		$data = [
			'certificate_date' => $this->input->post('certificate_date'),
			'issued_by' => $this->input->post('issued_by'),
			'issued_to' => $this->input->post('issued_to'),
			'remarks'  => $this->input->post('remarks'),
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

	public function projCompCertiReq() {
		
		$approval_no = $this->input->post('approval_no');
		// $where = ['a.approval_no = b.approval_no' => NULL,'a.approval_no' => $approval_no];
		// $result_data = $this->db->query('SELECT 
		// 							b.admin_approval_dt, 
		// 							b.scheme_name, 
		// 							c.sector_desc AS sector_name, 
		// 							d.fin_year, 
		// 							b.project_id, 
		// 							e.dist_name, 
		// 							f.block_name, 
		// 							a.approval_no, 
		// 							g.agency_name
		// 						FROM td_admin_approval b 
		// 						LEFT JOIN td_progress a ON a.approval_no = b.approval_no 
		// 						INNER JOIN md_sector c ON b.sector_id = c.sl_no 
		// 						INNER JOIN md_fin_year d ON b.fin_year = d.sl_no 
		// 						INNER JOIN md_district e ON b.district_id = e.dist_code 
		// 						INNER JOIN md_block f ON b.block_id = f.block_id 
		// 						INNER JOIN md_proj_imp_agency g ON b.impl_agency = g.id 
		// 						WHERE b.approval_no = "'.$approval_no.'" LIMIT 1')->result();
		// $wo_date = $this->Master->f_select('td_admin_approval a,td_tender b', 'b.wo_date,b.amt_put_to_tender,b.wo_value,b.comp_date_apprx as stipulated_dt', array_merge($where,['1 order by b.tender_date desc limit 1'=>NULL]), NULL);

		$sql = "SELECT 
            b.admin_approval_dt, 
            b.scheme_name, 
            c.sector_desc AS sector_name, 
            d.fin_year, 
            b.project_id, 
            e.dist_name, 
            f.block_name, 
            g.agency_name,
            t.wo_date,
            t.amt_put_to_tender,
            t.wo_value,
            t.comp_date_apprx AS stipulated_dt
        FROM td_admin_approval b
        LEFT JOIN td_progress a ON a.approval_no = b.approval_no
        INNER JOIN md_sector c ON b.sector_id = c.sl_no
        INNER JOIN md_fin_year d ON b.fin_year = d.sl_no
        INNER JOIN md_district e ON b.district_id = e.dist_code
        INNER JOIN md_block f ON b.block_id = f.block_id
        INNER JOIN md_proj_imp_agency g ON b.impl_agency = g.id
        LEFT JOIN (
            SELECT *
            FROM td_tender
            WHERE approval_no = $approval_no
            ORDER BY tender_date DESC
            LIMIT 1
        ) t ON t.approval_no = b.approval_no
        WHERE b.approval_no = $approval_no
        LIMIT 1";
        $result_data = $this->db->query($sql)->result();
		$actualdtres = $this->Master->f_select('td_progress', 'actual_date_comp', array('approval_no'=>$approval_no,'1 order by visit_no desc limit 1'=>NULL), NULL);
		
		$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'comp_date_actual'=>$actualdtres] 
			: ['status' => 0, 'message' => 'No data found'];
	
		$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
    }

	public function pcrcertificateadd() {
	    
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('contractor_name_dtls', 'contractor_name_dtls', 'required');
		$this->form_validation->set_rules('fin_year', 'fin_year', 'required');
		$this->form_validation->set_rules('scheme_name', 'scheme_name', 'required');
		$this->form_validation->set_rules('e_nit_no', 'e_nit_no', 'required');
		$this->form_validation->set_rules('work_order_dtl', 'work_order_dtl', 'required');
		$this->form_validation->set_rules('work_order_dt', 'work_order_dt', 'required');
		$this->form_validation->set_rules('amt_put_totender', 'amt_put_totender', 'required');
		$this->form_validation->set_rules('work_order_value', 'work_order_value', 'required');
		$this->form_validation->set_rules('stipulated_dt_comp', 'stipulated_dt_comp', 'required');
		$this->form_validation->set_rules('actual_dt_com', 'actual_dt_com', 'required');
		$this->form_validation->set_rules('gross_value', 'gross_value', 'required');
		$this->form_validation->set_rules('final_value', 'final_value', 'required');
		$this->form_validation->set_rules('remarks', 'remarks', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
				$data = [
					'approval_no' => $this->input->post('approval_no'),
					'contractor_name_dtls' => $this->input->post('contractor_name_dtls'),
					'fin_year' => $this->input->post('fin_year'),
					'scheme_name' => $this->input->post('scheme_name'),
					'e_nit_no' => $this->input->post('e_nit_no'),
					'work_order_dtl' => $this->input->post('work_order_dtl'),
					'work_order_dt'  => $this->input->post('work_order_dt'),
					'amt_put_totender' => $this->input->post('amt_put_totender'),
					'work_order_value' => $this->input->post('work_order_value'),
					'stipulated_dt_comp'  => $this->input->post('stipulated_dt_comp'),
					'actual_dt_com' => $this->input->post('actual_dt_com'),
					'gross_value' => $this->input->post('gross_value'),
					'final_value'  => $this->input->post('final_value'),
					'remarks' => $this->input->post('remarks'),
					'created_by' => $this->input->post('created_by'),
					'created_at' => date('Y-m-d h:i:s'),
				];
	
				$id = $this->db->insert('td_proj_comp_report', $data);

				$response = (!empty($id)) 
				? ['status' => 1, 'message' => 'Added Successfully'] 
				: ['status' => 0, 'message' => 'No data found'];	
				$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	    }
	}

	
	public function projCompCertilist() {
		
		$select = 'a.approval_no,b.project_id,a.contractor_name_dtls,a.fin_year,a.scheme_name,a.e_nit_no,a.work_order_dtl,a.work_order_dt,a.amt_put_totender,a.work_order_value,
		           a.stipulated_dt_comp,a.actual_dt_com,a.gross_value,a.final_value,a.remarks,a.upload_status,a.pcr_certificate';
	    $where = array('a.approval_no = b.approval_no' => NULL);			   			
		
		$result_data = $this->Master->f_select('td_proj_comp_report a,td_admin_approval b',$select, $where, NULL);
		$response = (!empty($result_data)) 
		? ['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/pcr/'] 
		: ['status' => 0, 'message' => 'No data found'];
		$this->output
		->set_content_type('application/json')
		->set_output(json_encode($response));
	 
	}
	public function projCompCertiSingledata() {

		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$select = 'a.approval_no,b.project_id,a.contractor_name_dtls,a.fin_year,a.scheme_name,a.e_nit_no,a.work_order_dtl,a.work_order_dt,a.amt_put_totender,a.work_order_value,
					a.stipulated_dt_comp,a.actual_dt_com,a.gross_value,a.final_value,a.remarks,a.upload_status,a.pcr_certificate';
			$where = array('a.approval_no = b.approval_no' => NULL,'a.approval_no' => $this->input->post('approval_no'));			   			
			$result_data = $this->Master->f_select('td_proj_comp_report a,td_admin_approval b',$select, $where, 1);
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'folder_name'=>'uploads/pcr/'] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
	 
	}

	public function pcrUpload() {
		$upload_paths = []; // Store file paths
	
		// Load Upload Library
		$this->load->library('upload');
		// File fields to process
		$file_fields = ['pcr_certificate'];
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('upload_by', 'upload_by', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
	
		foreach ($file_fields as $field) {
			if (!empty($_FILES[$field]['name'])) {
				$config['upload_path']   = './uploads/pcr/'; // Folder to store files
				$config['allowed_types'] = 'pdf'; // Allow only PDFs
				$config['max_size']      = 20480; // Max file size (2MB)
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
			} 
		}
		// Prepare data array for update
		$data = [
			'pcr_certificate' => $upload_paths['pcr_certificate'],
			'upload_status' => '1',
			'upload_by' => $this->input->post('upload_by'),
			'upload_at' => date('Y-m-d H:i:s')
		];
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no')
		];
		// Update data in the database
		$this->Master->f_edit('td_proj_comp_report', $data, $where);
	
		echo json_encode([
			'status' => true,
			'message' => 'updated successfully!'
		]);
	  }
	}
	
	
}
