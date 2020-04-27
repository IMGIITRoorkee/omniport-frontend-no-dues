import axios from "axios";

import { toast } from "react-semantic-toasts";

import { OPTIONS_SELECT_HOSTEL, UPLOAD_ID_CARD } from "../constants/actions";
import { bhawanOptionsApi, BhawanUploadApi } from "../urls";

import { getCookie } from "formula_one/src/utils";

export const getHostelOptions = () => {
  return (dispatch) => {
    axios
      .options(bhawanOptionsApi())
      .then((res) => {
        dispatch({
          type: OPTIONS_SELECT_HOSTEL,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const uploadHostelDetails = (hostels) => {
  let headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    axios
      .post(BhawanUploadApi(), { residences: hostels }, { headers: headers })
      .then((res) => {
        dispatch({
          type: UPLOAD_ID_CARD,
          payload: res.data,
        });
        toast({
          type: "success",
          title: "Successfully uploaded Hostel Details.",
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
