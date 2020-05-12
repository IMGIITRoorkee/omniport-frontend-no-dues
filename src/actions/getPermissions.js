import axios from "axios";

import { toast } from "react-semantic-toasts";

import { getCookie } from "formula_one/src/utils";

import {
  GET_PERMISSION_LIST,
  UPDATE_PERMISSION_STATUS,
  GET_PERMISSION_DETAIL,
  ADD_COMMENT_PERMISSION,
  ADD_COMMENT_PERMISSION_REQUEST,
  GET_PERMISSION_FILTER_REQUEST,
  UPDATE_PERMISSION_STATUS_REQUEST,
} from "../constants/actions";
import {
  permissionListApi,
  permissionDetailApi,
  permissionCommentApi,
  permissionListFilterApi,
  MassApprovalApi,
} from "../urls";

import { AppropriateStatusName } from "../components/Verifier/permission";

export const getPermissionList = () => {
  return (dispatch) => {
    axios.get(permissionListApi()).then((res) => {
      dispatch({
        type: GET_PERMISSION_LIST,
        payload: res.data,
      });
    });
  };
};

export const getPermissionFilter = (filter, enrolment_numbers = "") => {
  return (dispatch) => {
    if (enrolment_numbers === "") {
      dispatch({
        type: GET_PERMISSION_FILTER_REQUEST,
      });
    }
    axios
      .get(permissionListFilterApi(filter, enrolment_numbers))
      .then((res) => {
        dispatch({
          type: GET_PERMISSION_LIST,
          payload: res.data,
        });
      });
  };
};

export const getPermissionDetail = (permissionId) => {
  return (dispatch) => {
    axios.get(permissionDetailApi(permissionId)).then((res) => {
      dispatch({
        type: GET_PERMISSION_DETAIL,
        payload: res.data,
      });
    });
  };
};

export const massUpdateStatus = (enrolmentList, newStatus) => {
  let headers = {
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    dispatch({
      type: UPDATE_PERMISSION_STATUS_REQUEST,
    });
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
          title: `${AppropriateStatusName(new_status)} successful`,
          animation: "fade up",
          icon: "thumbs up",
          time: 4000,
        });
      })
      .catch((err) => {
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

export const commentOnPermission = (
  permissionId,
  attachment,
  text,
  mark_reported = false
) => {
  let headers = {
    "Content-Type": "multipart/form-data",
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    let formData = new FormData();
    formData.append("permission_id", permissionId);
    formData.append("text", text);
    if(mark_reported) {
        formData.append("mark_reported", mark_reported);
    }
    if (attachment !== null) {
      formData.append("attachment", attachment);
    }

    if (mark_reported) {
      dispatch({
        type: UPDATE_PERMISSION_STATUS_REQUEST,
      });
    } else {
      dispatch({
        type: ADD_COMMENT_PERMISSION_REQUEST,
      });
    }

    axios
      .post(permissionCommentApi(), formData, { headers: headers })
      .then((res) => {
        if (mark_reported) {
          dispatch({
            type: UPDATE_PERMISSION_STATUS,
            payload: { status: "rep", permissionId },
          });
        } else {
          dispatch({
            type: ADD_COMMENT_PERMISSION,
            payload: res.data,
          });
        }
      })
      .catch((err) => {
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
