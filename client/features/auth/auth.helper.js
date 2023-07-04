export function setAuthData(data) {
  if (data.jwt) {
    window.localStorage.setItem("data", JSON.stringify(data));
  }
}

export function clearAuthData() {
  window.localStorage.removeItem("user");
}

export function getLocalUser() {
  try {
    const stringifiedUser = window.localStorage.getItem("data");
    return JSON.parse(stringifiedUser);
  } catch (e) {
    return null;
  }
}

export function getLocalToken() {
  const data = getLocalUser();
  return data?.jwt;
}

export function isUserLoggedIn() {
  const data = getLocalUser();
  const token = getLocalToken();
  return data && token;
}
