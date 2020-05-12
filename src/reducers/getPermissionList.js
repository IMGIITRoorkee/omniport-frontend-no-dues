import {
  GET_PERMISSION_LIST,
  UPDATE_PERMISSION_STATUS,
  GET_PERMISSION_FILTER_REQUEST,
  UPDATE_PERMISSION_STATUS_REQUEST,
} from "../constants/actions";

const getPermissions = (
  state = { isFetching: true, data: [], isChanging: false },
  action
) => {
  switch (action.type) {
    case UPDATE_PERMISSION_STATUS_REQUEST:
      return {
        ...state,
        isChanging: true,
      };
    case GET_PERMISSION_FILTER_REQUEST:
      return {
        isFetching: true,
      };
    case GET_PERMISSION_LIST:
      return {
        ...state,
        isChanging: false,
        isFetching: false,
        data: action.payload,
      };
    case UPDATE_PERMISSION_STATUS:
      return {
        ...state,
        isChanging: false,
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
