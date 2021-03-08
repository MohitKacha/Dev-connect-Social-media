import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

const auth = (state = initialState, action) => {
  console.log("default", action);
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };
    case REGISTER_SUCCESS:
      console.log("into reducer -register sucess");
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_FAIL:
      localStorage.removeItem("token");
      return {
        ...state,
        ...payload,
        isAuthenticated: false,
        loading: false,
      };
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      console.log("default", action);
      return state;
  }
};

export default auth;
