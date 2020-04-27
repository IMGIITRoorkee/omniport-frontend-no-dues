import axios from "axios";
import { toast } from "react-semantic-toasts";

import { UPLOAD_ID_CARD } from "../constants/actions";
import { IdentityUploadApi } from "../urls";

import { getCookie } from "formula_one/src/utils";

export const uploadIDCard = (idCardFile) => {
  let headers = {
    "Content-Type": "multipart/form-data",
    "X-CSRFToken": getCookie("csrftoken"),
  };
  return (dispatch) => {
    let formData = new FormData();
    formData.append("id_card", idCardFile);
    axios
      .put(IdentityUploadApi(), formData, { headers: headers })
      .then((res) => {
        dispatch({
          type: UPLOAD_ID_CARD,
          payload: res.data,
        });
        toast({
          type: "success",
          title: "Successfully uploaded identity card.",
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
