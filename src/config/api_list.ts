import { BASE_URL } from './base_url';

export const ADDRESSES = {
  LOGIN: `${BASE_URL}/mobileApi/Login/login`,
  FETCH_PROJECTS_LIST: `${BASE_URL}/mobileApi/Api/projectlist`,
  PROJECT_PROGRESS_UPDATE: `${BASE_URL}/mobileApi/Api/progress_update`,
  PROJECT_OFFLINE_UPDATE: `${BASE_URL}/mobileApi/Api/progress_update_sync`,
  FETCH_PROJECT_PROCESS: `${BASE_URL}/mobileApi/Api/progress_list`,
  FETCH_PROJECT_RANGE: `${BASE_URL}/mobileApi/Api/projectrange`,
  FETCH_PROGRESS_DONE: `${BASE_URL}/mobileApi/Api/progress_list`,
};
