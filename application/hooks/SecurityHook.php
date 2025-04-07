<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class SecurityHook {
   
    public function validate_input() {
        $CI =& get_instance();
        $data = $_POST; // Get all POST data
       
        foreach ($data as $key => $value) {
            if ($this->contains_script($value)) {
                // Stop execution and return an error response
                header('Content-Type: application/json');
                echo json_encode(['status' => 0, 'message' => 'Invalid input detected!']);
                exit; // Stop further execution
            }
        }
      //  log_message('error', var_dump($data)); // Log message to check if hook runs

        // Stop process to test
       // die("Hook executed successfully!");
    }

    private function contains_script($input) {
        if (is_array($input)) {
            foreach ($input as $value) {
                if ($this->contains_script($value)) {
                    return true;
                }
            }
        } else {
            // Detect script tags or JavaScript event handlers
            if (preg_match('/<script.*?>.*?<\/script>/is', $input) || 
                preg_match('/on\w+=["\'].*?["\']/i', $input)) {
                return true;
            }
        }
        return false;
    }
}
