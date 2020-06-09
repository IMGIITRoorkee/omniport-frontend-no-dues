import { OPTIONS_SELECT_HOSTEL } from "../constants/actions";

const getHostelOptions = (
  state = { isFetching: true, residenceOptions: [], messOptions: [] },
  action
) => {
  switch (action.type) {
    case OPTIONS_SELECT_HOSTEL:
      return {
        messOptions: action.payload.messOptions,
        residenceOptions: action.payload.residenceOptions,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default getHostelOptions;
