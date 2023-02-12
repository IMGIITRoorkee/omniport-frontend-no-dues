import axios from "axios";

import { GET_NO_DUES_SUBSCRIBER_LIST } from "../constants/actions";

import { subscriberListApi } from "../urls";

export const getNoDuesSubscriberList = (page, start, end) => {
  return (dispatch) => {
    axios.get(`${subscriberListApi()}?page=${page}&start=${start}&end=${end}`).then((res) => {
      dispatch({
        type: GET_NO_DUES_SUBSCRIBER_LIST,
        payload: res.data,
      });
    });
  };
};
