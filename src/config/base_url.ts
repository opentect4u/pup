const UAT = false;

const BASE_URL = UAT
  ? `http://192.168.1.60/back-end/index.php`
  : `https://pup.opentech4u.co.in/pup/index.php`;

export { UAT, BASE_URL };
