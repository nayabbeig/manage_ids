import path from "../router/paths";
import { clearAuthData, getLocalToken, setAuthData } from "./auth.helper";
import { authInstance } from "./auth.interceptors";

const api = (endpoint) => path.api.auth.root + endpoint;
const authEndpoints = path.api.auth;

export async function verify(token) {
  return await authInstance
    .post(api(authEndpoints.verifyEmail), { token })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      return err.response;
    });
}

export async function resendVerification(token) {
  try {
    const data = await authInstance.post(
      api(authEndpoints.resendVerificationToken),
      { token }
    );
    return data;
  } catch (err) {
    return err?.response;
  }
}

export async function getUserContent() {
  return await authInstance.get("/test/user");
}

export async function verifyEmail(token) {
  try {
    const response = await verify(token);
    if (response.data.error) {
      return response.data;
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function createAccount(email, password, firstName, lastName) {
  try {
    const response = await authInstance
      .post(api(authEndpoints.register), {
        email,
        password,
        firstName,
        lastName,
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        return error.response;
      });

    if (response.data.error) {
      return response.data;
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function login({ username, password }) {
  try {
    const response = await authInstance
      .post(api(authEndpoints.login), {
        identifier: username,
        password,
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err.response;
      });
    const data = response.data;
    setAuthData(data);
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function signOut() {
  try {
    const token = getLocalToken();
    if (!token) {
      throw "Unable to logout! Something went wrong";
    }
    const response = await authInstance.post(api(authEndpoints.logout), {
      data: { token },
    });
    if (response.status === 200 || response.status === 204) {
      clearAuthData();
    }
    return response;
  } catch (err) {
    console.error(err);
  }
}
