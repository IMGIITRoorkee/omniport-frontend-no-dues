import axios from "axios";

import { GET_NO_DUES_SUBSCRIBER_LIST } from "../constants/actions";

import { subscriberListApi } from "../urls";

export const getNoDuesSubscriberList = () => {
  return (dispatch) => {
    axios.get(subscriberListApi()).then((res) => {
      dispatch({
        type: GET_NO_DUES_SUBSCRIBER_LIST,
        payload: res.data,
      });
    });
  };
};
