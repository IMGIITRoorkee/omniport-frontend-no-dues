import axios from "axios";

import { GET_NO_DUES_SUBSCRIBER_LIST } from "../constants/actions";

import { subscriberListApi } from "../urls";

export const getNoDuesSubscriberList = (page, start, end, enrolment_no) => {
  return (dispatch) => {
    axios.get(`${subscriberListApi()}?page=${page}&start=${start}&end=${end}&enrolment_no=${enrolment_no}`)
    .then((res) => {
        dispatch({
          type: GET_NO_DUES_SUBSCRIBER_LIST,
          payload: res.data,
        });
    });
  };
};
