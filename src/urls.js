import appConfig from "../config.json";

// Frontend Urls

// Base URL
export function urlBaseView() {
  return `${appConfig.BaseUrl}`;
}

// Home
export function urlHomeView() {
  return `${urlBaseView()}`;
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
    return `${BhawanUploadApi()}`
}

// Post APIs
export function IdentityUploadApi() {
    return `${profileApi()}`
}

export function BhawanUploadApi() {
    return `${urlBaseApi()}/select_authorities/`
}
