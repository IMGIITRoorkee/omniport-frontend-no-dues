import appConfig from "../config.json";

// Frontend Urls

// Base URL
export function urlBaseView() {
  return `${appConfig.baseUrl}`;
}

// Home
export function urlHomeView() {
  return `${urlBaseView()}`;
}

export function urlPermissionView(id) {
  return `${urlHomeView()}/permission/${id}`;
}

export function urlSubscriberDetail() {
  return `${urlHomeView()}/subscriber`
}

export function urlSearchedSubscriber(enrollmentNo) {
  return `${urlSubscriberDetail()}/?enrolment_number=${enrollmentNo}`
}

// Backend Urls

// Base API URL
export function urlBaseApi() {
  return `/api/no_dues`;
}

// Get APIs
export function profileApi() {
  return `${urlBaseApi()}/profile/`;
}

export function bhawanOptionsApi() {
  return `${BhawanUploadApi()}`;
}

export function permissionListApi() {
  return `${urlBaseApi()}/permission`;
}

export function permissionListFilterApi(filter, enrolment_number="") {
  return `${permissionListApi()}/?status=${filter}&search=${enrolment_number}`;
}

export function permissionDetailApi(id) {
  return `${urlBaseApi()}/permission/${id}/`;
}

export function permissionCommentApi() {
  return `${urlBaseApi()}/comment/`;
}

export function subscriberListApi() {
  return `${urlBaseApi()}/subscriber/`;
}

export function subscriberDetailApi(enrollmentNo) {
  return `${subscriberListApi()}${enrollmentNo}`;
}

export function downloadSubscriberData(year) {
  return `${subscriberListApi()}?download=xlsx&&year=${year}`;
}

export function downloadGreencardHolderData() {
  return `${subscriberListApi()}?download=xlsx&&nodue=true`;
}

// Post APIs
export function IdentityUploadApi() {
  return `${profileApi()}`;
}

export function MassApprovalApi() {
  return `${urlBaseApi()}/update_status/`;
}

export function BhawanUploadApi() {
  return `${urlBaseApi()}/select_authorities/`;
}

