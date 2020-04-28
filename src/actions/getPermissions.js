import axios from "axios";

import { toast } from "react-semantic-toasts";

import { GET_PERMISSION_LIST } from "../constants/actions";
import { permissionListApi } from "../urls";

export const getPermissionList = () => {
  return (dispatch) => {
    axios
      .get(permissionListApi())
      .then((res) => {
        dispatch({
          type: GET_PERMISSION_LIST,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};
