import { combineReducers } from "redux";
import getProfile from "./getProfile";
import getHostelOptions from "./getHostelOptions";
import getPermissionList from "./getPermissionList";
import getPermissionDetail from "./getPermissionDetail";

const rootReducers = combineReducers({
  getProfile,
  getHostelOptions,
  getPermissionList,
  getPermissionDetail
});

export default rootReducers;
