import {
  GET_PERMISSION_DETAIL,
  ADD_COMMENT_PERMISSION,
  UPDATE_PERMISSION_STATUS,
} from "../constants/actions";

const getPermissionDetail = (
  state = { isFetching: true, data: {} },
  action
) => {
  switch (action.type) {
    case GET_PERMISSION_DETAIL:
      return { data: action.payload, isFetching: false };
    case UPDATE_PERMISSION_STATUS:
      return {
        ...state,
        data: {
          ...state.data,
          status: action.payload.status,
        },
      };
    case ADD_COMMENT_PERMISSION:
      return {
        isFetching: false,
        data: {
          ...state.data,
          comments: [...state.data.comments, action.payload],
        },
      };
    default:
      return state;
  }
};

export default getPermissionDetail;
