import { combineReducers } from "redux";
import getProfile from "./getProfile";
import getHostelOptions from "./getHostelOptions";
import getPermissionList from "./getPermissionList";

const rootReducers = combineReducers({
  getProfile,
  getHostelOptions,
  getPermissionList,
});

export default rootReducers;
