import axios from "axios";

import { toast } from "react-semantic-toasts";

import { getCookie } from "formula_one/src/utils";

import {
  GET_PERMISSION_LIST,
  UPDATE_PERMISSION_STATUS,
  GET_PERMISSION_DETAIL,
  ADD_COMMENT_PERMISSION,
  GET_PERMISSION_FILTER_REQUEST,
} from "../constants/actions";
import {
  permissionListApi,
  permissionDetailApi,
  permissionCommentApi,
  permissionListFilterApi,
  MassApprovalApi,
} from "../urls";

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

export const getPermissionFilter = (filter) => {
  return (dispatch) => {
    dispatch({
      type: GET_PERMISSION_FILTER_REQUEST,
    });
    axios
      .get(permissionListFilterApi(filter))
      .then((res) => {
        dispatch({
          type: GET_PERMISSION_LIST,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const getPermissionDetail = (permissionId) => {
  return (dispatch) => {
    axios
      .get(permissionDetailApi(permissionId))
      .then((res) => {
        dispatch({
          type: GET_PERMISSION_DETAIL,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const massUpdateStatus = (enrolmentList, newStatus) => {
  let headers = {
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    axios
      .post(
        MassApprovalApi(),
        { enrolment_numbers: enrolmentList, status: newStatus },
        { headers: headers }
      )
      .then((res) => {
        toast({
          type: "success",
          title: "Successfully updated status",
          description: `Total changes requested: ${res.data.total} \nTotal Successful request: ${res.data.success} \nTotal failed request: ${res.data.failed} `,
          animation: "fade up",
          icon: "thumbs up",
          time: 2000,
        });
      })
      .catch((err) => {
        console.log("error", err);
        toast({
          type: "error",
          title: "Some error occurred, please try again",
          description: err.response.data.error,
          animation: "fade up",
          icon: "frown outline",
          time: 4000,
        });
      });
  };
};

export const changeStatusDetails = (new_status, permissionId) => {
  let headers = {
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    axios
      .patch(
        permissionDetailApi(permissionId),
        { status: new_status },
        { headers: headers }
      )
      .then((res) => {
        dispatch({
          type: UPDATE_PERMISSION_STATUS,
          payload: { status: new_status, permissionId },
        });
        toast({
          type: "success",
          title:
            new_status === "req"
              ? "You have successfully requested."
              : "Permission Approved",
          animation: "fade up",
          icon: "thumbs up",
          time: 4000,
        });
      })
      .catch((err) => {
        console.log("error", err);
        toast({
          type: "error",
          title: "Some error occurred, please try again",
          description: err.response.data.error,
          animation: "fade up",
          icon: "frown outline",
          time: 4000,
        });
      });
  };
};

export const commentOnPermission = (permissionId, attachment, text) => {
  let headers = {
    "Content-Type": "multipart/form-data",
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    let formData = new FormData();
    formData.append("permission_id", permissionId);
    formData.append("text", text);
    if (attachment !== null) {
      formData.append("attachment", attachment);
    }
    axios
      .post(permissionCommentApi(), formData, { headers: headers })
      .then((res) => {
        dispatch({
          type: ADD_COMMENT_PERMISSION,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response);
        toast({
          type: "error",
          title: "Some error occurred, please try again",
          description: err.response.data.error,
          animation: "fade up",
          icon: "frown outline",
          time: 4000,
        });
      });
  };
};
