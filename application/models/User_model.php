<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model {

        public function store_token($data)
        {
            return $this->db->insert('td_auth_tokens', $data);
        }

        public function get_user_by_token($token)
        {
            $now = date('Y-m-d H:i:s');
            $this->db->select('td_user.*');
            $this->db->from('td_auth_tokens');
            $this->db->join('td_user', 'td_user.user_id = td_auth_tokens.user_id');
            $this->db->where('td_auth_tokens.token', $token);
            $this->db->where('td_auth_tokens.expires_at >=', $now); // only valid tokens
            $query = $this->db->get();
            return $query->row();
        }
    
}