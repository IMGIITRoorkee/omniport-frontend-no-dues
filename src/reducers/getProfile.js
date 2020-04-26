import { GET_PROFILE } from "../constants/actions";

const getProfile = (state = { isFetching: true, data: {} }, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return { data: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default getProfile;
