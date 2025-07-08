

import { url } from "../Assets/Addresses/BaseUrl";


export const getCSRFToken = async (navigate) => {
  const res = await fetch(url + 'index.php/login/get_csrf', {
    credentials: "include" // allows receiving the CSRF cookie
  });
  const data = await res.json();

  if(data.csrf_token_value === null) {
    // localStorage.removeItem("user_dt");
    // navigate('/')
  }

  return {
    name: data.csrf_token_name,
    value: data.csrf_token_value
  };
};
