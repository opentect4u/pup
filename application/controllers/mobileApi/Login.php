<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

	public function __construct() {
        parent::__construct();
	
		header("Access-Control-Allow-Origin: *");
		header("Access-Control-Allow-Credentials: true");
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
		header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

		// Handle preflight request (OPTIONS)
		if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
			// No further processing needed
			exit;
		}

		$this->load->model('Master');

    }

	public function login() {
		if($_SERVER['REQUEST_METHOD']=="POST"){
            //  $pass  = 123;
			// echo password_hash($pass, PASSWORD_DEFAULT); die();
			$this->form_validation->set_rules('user_id', 'user_id ', 'required');
			$this->form_validation->set_rules('user_pwd', 'user_pwd', 'required');
			$this->form_validation->set_rules('login_type', 'login_type', 'required');
		
			if($this->form_validation->run() == FALSE) {
				echo json_encode([
					'status' => 0,
					'message' => validation_errors()
				]);
				return;
			}else{
					$user_id 	= $_POST['user_id'];
					$user_pw 	= $_POST['user_pwd'];
					$login_type = $this->input->post('login_type');
					$attempt = $this->db
							->where('user_id', $user_id)
							->get('td_login_attempts')
							->row();

					if ($attempt && $attempt->is_locked) {
					if (strtotime($attempt->lock_until) > time()) {
					$this->output
					->set_content_type('application/json')
					->set_output(json_encode(['status' => 0, 'message' => 'Account locked. Try again after ' . $attempt->lock_until]));
					return;
					} else {
					// Unlock user
					$this->db->where('user_id', $user_id)->delete('td_login_attempts');
					}
					}

					$result     = $this->Master->f_select('td_user',array('user_status','pass'),array('user_id'=>$user_id,'user_status'=>'A','user_type'=>'F'),1);
				
					if($result){
					if($result->user_status=='A'){
							
						$match	 		= password_verify($user_pw,$result->pass);
						if($match){
							$result    = $this->Master->f_select('td_user',array('user_id','user_type','name','user_status'),array('user_id'=>$user_id),1);
							$token = bin2hex(random_bytes(32));
							//$expires_at = date('Y-m-d H:i:s', strtotime('+2 hours')); // token valid for 2 hours
							$expires_at = date('Y-m-d H:i:s', strtotime('+5 minutes')); // token valid for 5 minutes

							$this->db->where('user_id', $result->user_id);
							$this->db->delete('td_auth_tokens'); // Or whatever table you're using
							$this->User_model->store_token([
								'user_id' => $result->user_id,
								'token' => $token,
								'created_at' => date('Y-m-d H:i:s'),
								'expires_at' => $expires_at,
								'ip_address' => $this->input->ip_address(),
								'user_agent' => $this->input->user_agent(),
							]);

							
							$response = (!empty($result)) 
						? ['status' => 1, 'message' => $result,'token' => $token,'expires_at' => $expires_at] 
						: ['status' => 0, 'message' => 'No data found'];
				
							$this->output
								->set_content_type('application/json')
								->set_output(json_encode($response));

						}else{

							$now = date('Y-m-d H:i:s');
							$attempt = $this->db->where('user_id', $user_id)->get('td_login_attempts')->row();

							if ($attempt) {
								$attempt_count = $attempt->attempt_count + 1;

								if ($attempt_count >= 5) {
									$lock_minutes = 15;
									$lock_until = date('Y-m-d H:i:s', strtotime("+$lock_minutes minutes"));

									$this->db->where('user_id', $user_id)->update('td_login_attempts', [
										'attempt_count' => $attempt_count,
										'is_locked' => 1,
										'lock_until' => $lock_until,
										'last_attempt' => $now
									]);

									$msg = 'Account locked for 15 minutes after too many failed attempts.';
								} else {
									$this->db->where('user_id', $user_id)->update('td_login_attempts', [
										'attempt_count' => $attempt_count,
										'last_attempt' => $now
									]);

									$msg = "Invalid password. Attempt $attempt_count of 5.";
								}
							} else {
								$this->db->insert('td_login_attempts', [
									'user_id' => $user_id,
									'ip_address' => $this->input->ip_address(),
									'attempt_count' => 1,
									'last_attempt' => $now
								]);

								$msg = 'Invalid password. Attempt 1 of 5.';
							}

							$this->output
								->set_content_type('application/json')
								->set_output(json_encode(['status' => 0, 'message' => $msg]));

						}
					}
					else{
						$response = ['status' => 0, 'message' => 'Invalid'];
						$this->output
							->set_content_type('application/json')
							->set_output(json_encode($response));
					}
					}
					else{
						$response = ['status' => 0, 'message' => 'User not Found'];
						$this->output
							->set_content_type('application/json')
							->set_output(json_encode($response));
					}
			}
	   }
    }

	
	
}
