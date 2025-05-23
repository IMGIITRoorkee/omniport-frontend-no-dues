import { GET_PROFILE, UPLOAD_ID_CARD, ADD_HOSTEL_AUTHORITIES } from "../constants/actions";

const getProfile = (state = { isFetching: true, data: {} }, action) => {
  switch (action.type) {
    case GET_PROFILE:
      return { data: action.payload, isFetching: false };
    case UPLOAD_ID_CARD:
      return { data: action.payload, isFetching: false };
    case ADD_HOSTEL_AUTHORITIES:
      return {isFetching: false, data: action.payload};
    default:
      return state;
  }
};

export default getProfile;
