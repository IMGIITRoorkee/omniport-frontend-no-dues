import {
  GET_SUBSCRIBER_DETAIL,
  GET_SUBSCRIBER_DETAIL_REQUEST,
} from "../constants/actions";

const getSubscriberDetail = (
  state = { isFetching: true, data: {} },
  action
) => {
  switch (action.type) {
    case GET_SUBSCRIBER_DETAIL_REQUEST:
      return { isFetching: true };
    case GET_SUBSCRIBER_DETAIL:
      return { data: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default getSubscriberDetail;
