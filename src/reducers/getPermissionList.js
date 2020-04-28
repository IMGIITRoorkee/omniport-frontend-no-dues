import { GET_PERMISSION_LIST } from "../constants/actions";

const getPermissions = (state = { isFetching: true, data: [] }, action) => {
  switch (action.type) {
    case GET_PERMISSION_LIST:
      return {
        isFetching: false,
        data: action.payload,
      };
    default:
      return state;
  }
};

export default getPermissions;
