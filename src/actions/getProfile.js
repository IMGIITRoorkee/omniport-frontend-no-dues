import axios from "axios";

import { GET_PROFILE } from "../constants/actions";
import { profileApi } from "../urls";

export const getProfile = () => {
  return (dispatch) => {
    axios
      .get(profileApi())
      .then((res) => {
        dispatch({
          type: GET_PROFILE,
          payload: res.data,
        });
      })
  };
};
