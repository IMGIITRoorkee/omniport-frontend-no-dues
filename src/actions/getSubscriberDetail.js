import axios from "axios";

import { GET_SUBSCRIBER_DETAIL } from "../constants/actions";

import { subscriberDetailApi } from "../urls";

export const getSubscriberdetail = (enrollmentNo) => {
  return (dispatch) => {
    axios
      .get(subscriberDetailApi(enrollmentNo))
      .then((res) => {
        dispatch({
          type: GET_SUBSCRIBER_DETAIL,
          payload: res.data,
        });
      })
  };
};
