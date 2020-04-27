import { combineReducers } from "redux";
import getProfile from "./getProfile";
import getHostelOptions from "./getHostelOptions";

const rootReducers = combineReducers({
  getProfile,
  getHostelOptions
});

export default rootReducers;
