import { GET_PROFILE, UPLOAD_ID_CARD } from "../constants/actions";

const getProfile = (state = { isFetching: true, data: {} }, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return { data: action.payload, isFetching: false };
    case UPLOAD_ID_CARD:
      return { data: action.payload, isFetching: false };
    default:
      return state;
  }
};

export default getProfile;
