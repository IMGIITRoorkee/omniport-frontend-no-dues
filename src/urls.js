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

export function permissionListFilterApi(filter) {
  return `${permissionListApi()}/?status=${filter}`;
}

export function permissionDetailApi(id) {
  return `${urlBaseApi()}/permission/${id}/`;
}

export function permissionCommentApi() {
  return `${urlBaseApi()}/comment/`;
}

export function subscriberDetailApi(enrollmentNo) {
  return `${urlBaseApi()}/subscriber/${enrollmentNo}`;
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
