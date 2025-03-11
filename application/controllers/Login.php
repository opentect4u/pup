<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller {

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

	public function login() {
		if($_SERVER['REQUEST_METHOD']=="POST"){
            //  $pass  = 123;
			// echo password_hash($pass, PASSWORD_DEFAULT); die();
			$user_id 	= $_POST['user_id'];
			$user_pw 	= $_POST['user_pwd'];
			$result     = $this->Master->f_select('td_user',array('user_status','pass'),array('user_id'=>$user_id,'user_status'=>'A'),1);
			if($result){
			if($result->user_status=='A'){
			$match	 		= password_verify($user_pw,$result->pass);
			if($match){
				$result    = $this->Master->f_select('td_user',array('user_id','user_type','name','user_status'),array('user_id'=>$user_id),1);
				$response = (!empty($result)) 
			? ['status' => 1, 'message' => $result] 
			: ['status' => 0, 'message' => 'No data found'];
	
				$this->output
					->set_content_type('application/json')
					->set_output(json_encode($response));

			}else{
						$response = ['status' => 0, 'message' => 'Password Not Match'];
						$this->output
							->set_content_type('application/json')
							->set_output(json_encode($response));
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
