import localforage from "localforage";

export const getLocalStoreTokenDts = async (navigate) => {
  try {
    
    const value = await localforage.getItem("tokenDetails");
    console.log("token_store_", value?.token, 'true', value?.expires_at);

    if(value?.token && value?.expires_at){

    } else {
      localStorage.removeItem("user_dt");
      navigate('/')
    }

    return value; // return the token so it can be used wherever needed
  } catch (err) {
    console.error("Read error:", err);
    console.log("token_store_", err, 'false');
    localStorage.removeItem("user_dt");
    navigate('/')
    return null;
  }
};



