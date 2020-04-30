import {
  GET_PERMISSION_LIST,
  UPDATE_PERMISSION_STATUS,
  GET_PERMISSION_FILTER_REQUEST
} from "../constants/actions";

const getPermissions = (state = { isFetching: true, data: [] }, action) => {
  switch (action.type) {
    case GET_PERMISSION_FILTER_REQUEST:
      return {
        isFetching: true
      }
    case GET_PERMISSION_LIST:
      return {
        isFetching: false,
        data: action.payload,
      };
    case UPDATE_PERMISSION_STATUS:
      return {
        ...state,
        data: state.data.map((x) => {
          if (x.id === action.payload.permissionId) {
            return {
              ...x,
              status: action.payload.status,
            };
          }
          return x;
        }),
      };
    default:
      return state;
  }
};

export default getPermissions;
