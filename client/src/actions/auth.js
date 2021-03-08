import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
} from "../actions/types";
import { setAlert } from "./alert";
import axios from "axios";
import setAuthToken from "../utills/setAuthToken";

export const loadUser = () => async (dispatch) => {
  console.log("called lod user");
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const register = ({ name, email, password }) => async (dispatch) => {
  console.log("into register");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post("/api/users", body, config);
    console.log("response", res);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    const errors = error.response.data.errors;
    console.log(error.response);
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};
