import axios from "axios";
import { toast } from "react-semantic-toasts";

import { ADD_HOSTEL_AUTHORITIES } from "../constants/actions";
import { BhawanAddApi } from "../urls";

import { getCookie } from "formula_one/src/utils";

export const addHostelAuthorities = () => {
  let headers = {
    "Content-Type": "application/json",
    "X-CSRFToken": getCookie("csrftoken"),
  };

  return (dispatch) => {
    axios
      .post(
        BhawanAddApi(),
        {},
        { headers: headers }
      )
      .then((res) => {
        dispatch({
          type: ADD_HOSTEL_AUTHORITIES,
          payload: res.data,
        });
        toast({
          type: "success",
          title: "You are now eligible to add authorities",
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
