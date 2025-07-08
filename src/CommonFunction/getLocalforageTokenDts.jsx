import localforage from "localforage";

export const getLocalStoreTokenDts = async (navigate) => {
  try {
    
    const value = await localforage.getItem("tokenDetails");
    console.log("token_store_", value);
    return value; // return the token so it can be used wherever needed
  } catch (err) {
    console.error("Read error:", err);
    // localStorage.removeItem("user_dt");
    // navigate('/')
    return null;
  }
};



