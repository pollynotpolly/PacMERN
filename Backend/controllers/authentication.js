// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getToken = () => {
  return window.localStorage.getItem("token")
}

export const login = async (email, password) => {
  const payload = {
    email: email,
    password: password,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  const response = await fetch(`${BACKEND_URL}/tokens`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    let data = await response.json();
    const session = {
      token: data.token,
      user: data.user,
    };
    return session;
  } else {
    const errorData = await response.json();
    throw new Error(
      errorData.message ||
        `Received status ${response.status} when logging in. Expected 201`
    );
  }
};

export const signup = async (name, email, password, profileImage) => {
  const payload = {
    name: name,
    email: email,
    password: password,
    profileImage: profileImage,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  let response = await fetch(`${BACKEND_URL}/users`, requestOptions);

  // docs: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/201
  if (response.status === 201) {
    return;
  } else {
    const errorData = await response.json(); // added to add custom error message from back-end, for exp the unique user error message
    throw new Error(
      errorData.message || `Received status ${response.status} when signing up. Expected 201` // if custom error message exists then that gets used
    );
  }
};
