
import { url } from "../Assets/Addresses/BaseUrl";

export const useCSRFToken = async () => {
  const response = async ()=>{
    try {
    const res = await fetch(url + "index.php/login/get_csrf", {
      credentials: "include",
    });
    const data = await res.json();
    console.log(data, "CSRF Data");

    return {
      name: data.csrf_token_name,
      value: data.csrf_token_value,
    };
  } catch (err) {
    console.error("Failed to fetch CSRF token", err);
    return null;
  }
  }

  return {
    response
  }
};
