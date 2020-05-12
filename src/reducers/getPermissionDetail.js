import {
  GET_PERMISSION_DETAIL,
  ADD_COMMENT_PERMISSION,
  UPDATE_PERMISSION_STATUS,
  ADD_COMMENT_PERMISSION_REQUEST,
} from "../constants/actions";

const getPermissionDetail = (
  state = { isFetching: true, data: {}, isCommenting: false },
  action
) => {
  switch (action.type) {
    case ADD_COMMENT_PERMISSION_REQUEST:
      return { ...state, isCommenting: true };
    case GET_PERMISSION_DETAIL:
      return { ...state, data: action.payload, isFetching: false };
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
        ...state,
        isFetching: false,
        data: {
          ...state.data,
          comments: [...state.data.comments, action.payload],
        },
        isCommenting: false,
      };
    default:
      return state;
  }
};

export default getPermissionDetail;
