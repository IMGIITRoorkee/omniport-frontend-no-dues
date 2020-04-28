import {
  GET_PERMISSION_DETAIL,
  ADD_COMMENT_PERMISSION,
} from "../constants/actions";

const getPermissionDetail = (
  state = { isFetching: true, data: {} },
  action
) => {
  switch (action.type) {
    case GET_PERMISSION_DETAIL:
      return { data: action.payload, isFetching: false };
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
