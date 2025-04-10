export type ProjectStoreModel = {
  projectId: string;
  progress: number;
  'progress_pic[]': string[];
  lat: number;
  lng: number;
  locationAddress: string;
  actual_date_comp: string;
  remarks: string;
};
