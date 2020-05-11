import axios from "axios";

import { toast } from "react-semantic-toasts";

import {
  GET_SUBSCRIBER_DETAIL,
  GET_SUBSCRIBER_DETAIL_REQUEST,
} from "../constants/actions";

import { subscriberDetailApi } from "../urls";

export const getSubscriberdetail = (enrollmentNo) => {
  return (dispatch) => {
    dispatch({
      type: GET_SUBSCRIBER_DETAIL_REQUEST,
    });
    axios
      .get(subscriberDetailApi(enrollmentNo))
      .then((res) => {
        dispatch({
          type: GET_SUBSCRIBER_DETAIL,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_SUBSCRIBER_DETAIL_REQUEST,
        });
        toast({
          type: "error",
          title: "Some error occurred, please try again",
          description: err.response.data.detail,
          animation: "fade up",
          icon: "frown outline",
          time: 4000,
        });
      });
  };
};
