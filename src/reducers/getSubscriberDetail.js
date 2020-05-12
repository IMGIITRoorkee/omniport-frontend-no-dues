import {
  GET_SUBSCRIBER_DETAIL,
  GET_SUBSCRIBER_DETAIL_REQUEST,
  GET_SUBSCRIBER_DETAIL_ERROR,
} from "../constants/actions";

const getSubscriberDetail = (
  state = { isFetching: true, data: {}, hasError: false },
  action
) => {
  switch (action.type) {
    case GET_SUBSCRIBER_DETAIL_REQUEST:
      return { ...state, isFetching: true };
    case GET_SUBSCRIBER_DETAIL_ERROR:
      return { ...state, hasError: true };
    case GET_SUBSCRIBER_DETAIL:
      return { data: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default getSubscriberDetail;
