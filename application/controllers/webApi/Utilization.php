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
		$result_data = $this->Master->f_select('td_utilization', 'approval_no,certificate_no,certificate_date,certificate_path,annexture_certi,issued_by,issued_to,remarks,is_final,certi_type', $where, NULL);
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
					   'b.block_id = f.block_id' => NULL,'1 group by b.admin_approval_dt,b.scheme_name,sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,a.certi_type'=>NULL);
		
		$result_data = $this->Master->f_select('td_utilization a,td_admin_approval b,md_sector c,md_fin_year d,md_district e,md_block f', 'b.admin_approval_dt,b.scheme_name,c.sector_desc as sector_name,d.fin_year,b.project_id,e.dist_name,f.block_name,a.approval_no,a.certi_type', $where, NULL);

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
		$file_fields = ['certificate_path','annexture_certi'];
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
			'certi_type' => $this->input->post('certi_type'),
			'certificate_path' => $upload_paths['certificate_path'],
			'annexture_certi' => $upload_paths['annexture_certi'],
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
			'file_paths' => $upload_paths
		]);
	}

	public function utlization_single_data() {
		$where = [];
		$approval_no = $this->input->post('approval_no') ?? null;
		$certificate_no = $this->input->post('certificate_no') ?? null;
	
		
		$where['approval_no'] = $approval_no;
		$where['certificate_no'] = $certificate_no;
	
		$result_data = $this->Master->f_select('td_utilization', 'approval_no,certificate_no,certificate_date,certificate_path,annexture_certi,issued_by,issued_to,remarks,is_final,certi_type', $where, 1);
	
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
		$file_fields = ['certificate_path','annexture_certi'];
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('modified_by', 'Modified By', 'required');
	//	$this->form_validation->set_rules('issued_by', 'Issued By', 'required');
	//	$this->form_validation->set_rules('issued_to', 'Issued To', 'required');
	//	$this->form_validation->set_rules('certificate_date', 'Certificate date', 'required');
		
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
			'certi_type' => $this->input->post('certi_type'),
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
		if (!empty($upload_paths['annexture_certi'])) {
			$data['annexture_certi'] = $upload_paths['annexture_certi'];
		}
		
	
		// Define where condition for update
		$where = [
			'approval_no' => $this->input->post('approval_no'),
			'certificate_no' => $this->input->post('certificate_no')
		];
	
		// Update data in the database
		$this->Master->f_edit('td_utilization', $data, $where);
	
		echo json_encode([
			'status' => 1,
			'message' => 'Utilization updated successfully!'
		]);
	  }
	}
	public function getProjListForPcr(){

		  $sql = "select approval_no,project_id FROM td_admin_approval where approval_no not in (select approval_no from td_proj_comp_report)";
		  $result_data = $this->db->query($sql)->result();
		  $response = (!empty($result_data)) 
		  ? ['status' => 1, 'message' => array_merge($result_data)] 
		  : ['status' => 0, 'message' => 'No data found'];
		  $this->output
		  ->set_content_type('application/json')
		  ->set_output(json_encode($response));
	}

	public function projCompCertiReq() {
		
		$approval_no = $this->input->post('approval_no');
	
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
            t.wo_value,t.e_nit_no,
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
		$actualdtres = (!empty($actualdtres) && $actualdtres[0]->actual_date_comp != '0000-00-00') 
    ? $actualdtres[0]->actual_date_comp 
    : null;
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

	public function dtprojforUtil() {
		
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$approval_no = $this->input->post('approval_no') ;
				$sql = "SELECT 
				b.scheme_name, 
				c.sector_desc AS sector_name, 
				d.fin_year, 
				b.project_id, 
				e.dist_name, 
				f.block_name, 
				g.agency_name
			FROM td_admin_approval b
			INNER JOIN md_sector c ON b.sector_id = c.sl_no
			INNER JOIN md_fin_year d ON b.fin_year = d.sl_no
			INNER JOIN md_district e ON b.district_id = e.dist_code
			INNER JOIN md_block f ON b.block_id = f.block_id
			INNER JOIN md_proj_imp_agency g ON b.impl_agency = g.id
			WHERE b.approval_no = $approval_no";
			$result_data = $this->db->query($sql)->result();
			$select = 'sum(sch_amt) fund_rece_sch_amt,sum(cont_amt) fund_rece_cont_amt ,sum(sch_amt)+
			sum(cont_amt) as fund_recv_tot_amt';
			$where = array('approval_no ' => $this->input->post('approval_no'));			   			
			$res_fund = $this->Master->f_select('td_fund_receive',$select, $where, 0);
			$select1 = 'sum(sch_amt) expen_sch_amt,sum(cont_amt) expen_cont_amt ,sum(sch_amt)+
			sum(cont_amt) as expen_tot_amt';
			$res_expense = $this->Master->f_select('td_expenditure',$select1, $where, 0);
		
			$response = (!empty($res_fund)) 
			? ['status' => 1, 'message' => array_merge($result_data,$res_fund,$res_expense)] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
	} 

	public function uticertificatesave() {

	    $this->form_validation->set_rules('sl_no', 'sl_no', 'required');
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('certi_type', 'certi_type', 'required');
		$this->form_validation->set_rules('recv_sche_amt', 'recv_sche_amt', 'required|numeric');
		$this->form_validation->set_rules('recv_cont_amt', 'recv_cont_amt', 'required|numeric');
		$this->form_validation->set_rules('fin_year', 'fin_year', 'required');
		$this->form_validation->set_rules('scheme_name', 'scheme_name', 'required');
		$this->form_validation->set_rules('created_by', 'created_by', 'required');

		// Array field validations
		//var_dump($_POST['exp_letter_dt']);die();
		// $exp_letter_dt = $this->input->post('exp_letter_dt');
		// $exp_amt = $this->input->post('exp_amt');

		// if (is_array($exp_letter_dt) && is_array($exp_amt)) {
		// 	foreach ($exp_letter_dt as $index => $value) {
		// 		$this->form_validation->set_rules(
		// 			"exp_letter_dt[$index]",
		// 			"Expenditure Letter Date (Row " . ($index + 1) . ")",
		// 			'required'
		// 		);
		// 		$this->form_validation->set_rules(
		// 			"exp_amt[$index]",
		// 			"Expenditure Amount (Row " . ($index + 1) . ")",
		// 			'required|numeric'
		// 		);
		// 	}
		// }
		
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$sl_no = $this->input->post('sl_no') ;
			if (!empty($sl_no) && $sl_no > 0) {
				$data = [
					'approval_no' => $this->input->post('approval_no'),
					'certi_type' => $this->input->post('certi_type'),
					'recv_sche_amt' => $this->input->post('recv_sche_amt'),
					'recv_cont_amt'  => $this->input->post('recv_cont_amt'),
					'fin_year' => $this->input->post('fin_year'),
					'scheme_name' => $this->input->post('scheme_name'),
					'margin_bal' => $this->input->post('margin_bal'),
					'bal_amt' => $this->input->post('bal_amt'),
					'vide_no' => $this->input->post('vide_no'),
					'vide_dt' => $this->input->post('vide_dt'),
					'next_year' => $this->input->post('next_year'),
					'modified_by' => $this->input->post('created_by'),
					'modified_at' => date('Y-m-d h:i:s'),
				];
				
				$where = ['sl_no' => $sl_no];
				$id = $this->Master->f_edit('td_utilization_certificate', $data, $where);
				
				$this->db->where(['utilization_certi_slno'=>$sl_no]);
				$this->db->delete('td_expenditure_cntg_rmrks');

				$batch_data = [];
				//if($id > 0){
					$exp_letter_dt = $this->input->post('exp_letter_dt'); // will return array value
					$exp_amt = $this->input->post('exp_amt');   // will return array value
				    // Step 2: Insert new remarks
					$batch_data = [];
					if (is_array($exp_letter_dt) && is_array($exp_amt)) {
						$count = count($exp_letter_dt);
					
						for ($i = 0; $i < $count; $i++) {
							$batch_data[] = [
								'approval_no' => $this->input->post('approval_no'),
								'utilization_certi_slno' => $sl_no,
								'exp_letter_dt' => $exp_letter_dt[$i] ?? null,
								'exp_amt' => $exp_amt[$i] ?? null,
								// remove cont_rmrks_sl_no if not used
							];
						}
					
						if (!empty($batch_data)) {
							$this->db->insert_batch('td_expenditure_cntg_rmrks', $batch_data);
						}
					}
			    //}
				$response = (!empty($id)) 
				? ['status' => 1, 'message' => 'Updated Successfully'] 
				: ['status' => 0, 'message' => 'Something went wrong'];	
				$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));

			}else{
				$data = [
					'approval_no' => $this->input->post('approval_no'),
					'certi_type' => $this->input->post('certi_type'),
					'recv_sche_amt' => $this->input->post('recv_sche_amt'),
					'recv_cont_amt'  => $this->input->post('recv_cont_amt'),
					'fin_year' => $this->input->post('fin_year'),
					'scheme_name' => $this->input->post('scheme_name'),
					'margin_bal' => $this->input->post('margin_bal'),
					'bal_amt' => $this->input->post('bal_amt'),
					'vide_no' => $this->input->post('vide_no'),
					'vide_dt' => $this->input->post('vide_dt'),
					'next_year' => $this->input->post('next_year'),
					'created_by' => $this->input->post('created_by'),
					'created_at' => date('Y-m-d h:i:s'),
				];
	
				$id = $this->Master->f_insert('td_utilization_certificate', $data);

				if($id > 0){
					$exp_data_json = $this->input->post('exp_letter_dt');
                    $exp_data = json_decode($exp_data_json, true); 
				    // Step 2: Insert new remarks
					$batch_data = [];
					if (is_array($exp_data)) {
						foreach ($exp_data as $row) {
							$batch_data[] = [
								'approval_no' => $this->input->post('approval_no'),
								'utilization_certi_slno' => $id,
								'exp_letter_dt' => $row['input1'] ?? null, // input1 = exp_letter_dt
								'exp_amt' => $row['input2'] ?? null         // input2 = exp_amt
							];
						}
					
						if (!empty($batch_data)) {
							$this->db->insert_batch('td_utilizationcerti_funddtls', $batch_data);
						}
					}
			    }

				$response = (!empty($id)) 
				? ['status' => 1, 'message' => 'Added Successfully'] 
				: ['status' => 0, 'message' => 'Something went wrong'];	
				$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
			}
	    }
	}

	public function getcertificateData() {
		
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$approval_no = $this->input->post('approval_no');
			$sl_no = $this->input->post('sl_no');
			$select = 'a.approval_no,a.certi_type,a.recv_sche_amt,a.recv_cont_amt,
						a.margin_bal,a.fin_year,a.scheme_name,a.bal_amt,
						a.vide_no,a.vide_dt,a.next_year,b.project_id';
			$where = array('a.approval_no = b.approval_no' => NULL,'a.approval_no ' => $this->input->post('approval_no'),'a.sl_no' => $sl_no);			   			
			$result_data = $this->Master->f_select('td_utilization_certificate a,td_admin_approval b',$select, $where, 1);
			$select1 = 'exp_letter_dt,exp_amt';
			$where1 = array('utilization_certi_slno' => $sl_no);	
			$result_data1 = $this->Master->f_select('td_utilizationcerti_funddtls',$select1, $where1, 0);
			$result_exp_from_certificate = $this->Master->f_select('td_utilizationcerti_funddtls',array('sum(exp_amt) as tot_exp_amt'), $where1, 1);
			$result_data->tot_exp_amt = $result_exp_from_certificate->tot_exp_amt;
		
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => $result_data,'fund_dtls'=>$result_data1]
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
	}
	public function certificatlist() {

			$select = 'a.sl_no,a.approval_no,b.project_id,a.recv_sche_amt,a.recv_cont_amt,a.fin_year,a.scheme_name';
			$where = array('a.approval_no = b.approval_no' => NULL );			   			
			$result_data = $this->Master->f_select('td_utilization_certificate a,td_admin_approval b',$select, $where, 0);
		   
			$response = (!empty($result_data)) 
			? ['status' => 1, 'message' => array_merge($result_data)] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
	}
	
	public function dtforannexture() {
		
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		
		if($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$approval_no = $this->input->post('approval_no') ;
				$sql = "SELECT 
				a.project_id,a.scheme_name,
				a.admin_approval_dt,(a.sch_amt + a.cont_amt) as total_amt,
				e.dist_name,c.amt_put_to_tender
			FROM td_admin_approval a
			INNER JOIN md_district e ON a.district_id = e.dist_code
			INNER JOIN td_tender c ON c.approval_no = a.approval_no
			WHERE a.approval_no = $approval_no  AND c.tender_date = (
				SELECT MAX(tender_date)
				FROM td_tender
				WHERE approval_no = $approval_no
			)";

			$result_data = $this->db->query($sql)->row();
			$select = '(sum(sch_amt)+
			sum(cont_amt)) as fund_recv_tot_amt';
			$where = array('approval_no ' => $this->input->post('approval_no'));			   			
			$res_fund = $this->Master->f_select('td_fund_receive',$select, $where, 1);

			$allotment_no_dt = $this->Master->f_select('td_fund_receive', array("GROUP_CONCAT(CONCAT(allot_order_no, ', dt ', DATE_FORMAT(allot_order_dt, '%d-%m-%Y')) SEPARATOR ' and ') AS allotment_no_and_dt"), array('approval_no' => $this->input->post('approval_no')), 1);
			//** */  Get Data from utilization certificate list   ***// 
			$sch_fund = $this->Master->f_select('td_utilization_certificate a,td_utilizationcerti_funddtls b','ifnull(sum(exp_amt),0) as payment_made', array('a.sl_no = b.utilization_certi_slno'=>NULL,'certi_type'=> 'S','a.approval_no'=>$this->input->post('approval_no')), 1);
			$cont_fund = $this->Master->f_select('td_utilization_certificate a,td_utilizationcerti_funddtls b','ifnull(sum(exp_amt),0) as cont_amt', array('a.sl_no = b.utilization_certi_slno'=>NULL,'certi_type'=> 'C','a.approval_no'=>$this->input->post('approval_no')), 1);


			$result_data->fund_recv_tot_amt = $res_fund->fund_recv_tot_amt;
			$result_data->allotment_no_and_dt = $allotment_no_dt->allotment_no_and_dt;
			$result_data->payment_made = $sch_fund->payment_made;
			$result_data->cont_amt = $cont_fund->cont_amt;
			$response = (!empty($res_fund)) 
			? ['status' => 1, 'message' => $result_data] 
			: ['status' => 0, 'message' => 'No data found'];
			$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
		}
	} 

	public function annexturesave() {

	    $this->form_validation->set_rules('sl_no', 'sl_no', 'required');
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
		$this->form_validation->set_rules('district', 'district', 'required');
		$this->form_validation->set_rules('scheme', 'scheme', 'required');
		$this->form_validation->set_rules('admin_approval_no', 'admin_approval_no', 'required');
		$this->form_validation->set_rules('adm_approval_dt', 'adm_approval_dt', 'required');
		$this->form_validation->set_rules('admin_approval_amt', 'admin_approval_amt', 'required');
		$this->form_validation->set_rules('tender_amt', 'tender_amt', 'required');
		$this->form_validation->set_rules('fund_recv_allot_no', 'fund_recv_allot_no', 'required');
		$this->form_validation->set_rules('fund_recv_amt', 'fund_recv_amt', 'required');
		$this->form_validation->set_rules('payment_made', 'payment_made', 'required');
		$this->form_validation->set_rules('claim', 'claim', 'required');
		$this->form_validation->set_rules('contingency', 'contingency', 'required');
		$this->form_validation->set_rules('net_claim', 'net_claim', 'required');
		$this->form_validation->set_rules('physical_progress', 'physical_progress', 'required');
		$this->form_validation->set_rules('remarks', 'remarks', 'required');
		$this->form_validation->set_rules('created_by', 'created_by', 'required');

		if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$sl_no = $this->input->post('sl_no') ;
			if (!empty($sl_no) && $sl_no > 0) {
				$data = [
					'district' => $this->input->post('district'),
					'scheme' => $this->input->post('scheme'),
					'admin_approval_no'  => $this->input->post('admin_approval_no'),
					'adm_approval_dt' => $this->input->post('adm_approval_dt'),
					'tender_amt' => $this->input->post('tender_amt'),
					'fund_recv_allot_no' => $this->input->post('fund_recv_allot_no'),
					'fund_recv_amt' => $this->input->post('fund_recv_amt'),
					'payment_made' => $this->input->post('payment_made'),
					'claim' => $this->input->post('claim'),
					'contingency' => $this->input->post('contingency'),
					'shematic'=> $this->input->post('shematic'),
					'net_claim' => $this->input->post('net_claim'),
					'claim' => $this->input->post('claim'),
					'physical_progress' => $this->input->post('physical_progress'),
					'remarks' => $this->input->post('remarks'),
					'modified_by' => $this->input->post('created_by'),
					'modified_at' => date('Y-m-d h:i:s'),
				];
				
				$where = ['sl_no' => $sl_no,'approval_no' => $this->input->post('approval_no')];
				$id = $this->Master->f_edit('td_uti_annexure', $data, $where);
	
				$response = (!empty($id)) 
				? ['status' => 1, 'message' => 'Updated Successfully'] 
				: ['status' => 0, 'message' => 'Something went wrong'];	
				$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));

			}else{
				$data = [
					'approval_no' => $this->input->post('approval_no'),
					'district' => $this->input->post('district'),
					'scheme' => $this->input->post('scheme'),
					'admin_approval_no'  => $this->input->post('admin_approval_no'),
					'adm_approval_dt' => $this->input->post('adm_approval_dt'),
					'admin_approval_amt' => $this->input->post('admin_approval_amt'),
					'tender_amt' => $this->input->post('tender_amt'),
					'fund_recv_allot_no' => $this->input->post('fund_recv_allot_no'),
					'fund_recv_amt' => $this->input->post('fund_recv_amt'),
					'payment_made' => $this->input->post('payment_made'),
					'claim' => $this->input->post('claim'),
					'contingency' => $this->input->post('contingency'),
					'net_claim' => $this->input->post('net_claim'),
					'claim' => $this->input->post('claim'),
					'physical_progress' => $this->input->post('physical_progress'),
					'remarks' => $this->input->post('remarks'),
					'created_by' => $this->input->post('created_by'),
					'created_at' => date('Y-m-d h:i:s'),
				];
	
				$id = $this->Master->f_insert('td_uti_annexure', $data);

				$response = (!empty($id)) 
				? ['status' => 1, 'message' => 'Added Successfully'] 
				: ['status' => 0, 'message' => 'Something went wrong'];	
				$this->output
			->set_content_type('application/json')
			->set_output(json_encode($response));
			}
	    }
	}

	public function GetannextureData() {
		$this->form_validation->set_rules('sl_no', 'sl_no', 'required');
		$this->form_validation->set_rules('approval_no', 'Approval No', 'required');
	   if ($this->form_validation->run() == FALSE) {
			echo json_encode([
				'status' => 0,
				'message' => validation_errors()
			]);
		}else{
			$where = null;
        if ($this->input->post('approval_no') > 0 && $this->input->post('sl_no') > 0) {
			$where = array('approval_no' => $this->input->post('approval_no'),'sl_no' => $this->input->post('sl_no'));
		}
		$select = 'sl_no,approval_no,district,scheme,admin_approval_no,adm_approval_dt,admin_approval_amt,tender_amt,fund_recv_allot_no,fund_recv_amt,payment_made,claim,contingency,net_claim,physical_progress,remarks';
		$result_data = $this->Master->f_select('td_uti_annexure',$select, $where, 0);
	   
		$response = (!empty($result_data)) 
		? ['status' => 1, 'message' => array_merge($result_data)] 
		: ['status' => 0, 'message' => 'No data found'];
		$this->output
		->set_content_type('application/json')
		->set_output(json_encode($response));
		}
    }

	               
	
	
}
