import { combineReducers } from "redux";
import getProfile from "./getProfile";
import getHostelOptions from "./getHostelOptions";
import getPermissionList from "./getPermissionList";
import getPermissionDetail from "./getPermissionDetail";
import getSubscriberDetail from "./getSubscriberDetail";

const rootReducers = combineReducers({
  getProfile,
  getHostelOptions,
  getPermissionList,
  getPermissionDetail,
  getSubscriberDetail,
});

export default rootReducers;
