export type ProjectStoreModel = {
    projectId: string
    progress: number
    "progress_pic[]": string[],
    lat: number
    lng: number
    locationAddress: string
    actualDateOfCompletion: Date
    remarks: string
}