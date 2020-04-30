import { GET_SUBSCRIBER_DETAIL } from "../constants/actions";

const getSubscriberDetail = (
  state = { isFetching: true, data: {} },
  action
) => {
  switch (action.type) {
    case GET_SUBSCRIBER_DETAIL:
      return { data: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default getSubscriberDetail;
