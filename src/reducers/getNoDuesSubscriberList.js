import { GET_NO_DUES_SUBSCRIBER_LIST } from "../constants/actions";

const getNoDuesSubscribers = (
  state = { isFetching: true, data: [] },
  action
) => {
  switch (action.type) {
    case GET_NO_DUES_SUBSCRIBER_LIST:
      return { data: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default getNoDuesSubscribers
