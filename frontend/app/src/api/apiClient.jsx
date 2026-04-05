import axios from "axios";
import Swal from "sweetalert2";
import environment from "../config/environment";
import setAuthorizationToken from "./setAuthToken";

const baseUrl = environment.api;

// ✅ Default JSON config
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

// ✅ Image upload config
const imageConfig = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

// ✅ Error handler
const handleError = (error, hideError = false) => {
  let message =
    error?.message ||
    error?.response?.data?.message ||
    "Something went wrong";

  // 🔴 Token expired / unauthorized
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  if (!hideError) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: message,
    });
  }
};

class ApiClient {
  // ✅ POST
  static async post(url, payload = {}, params = {}, base = "", hideError = false) {
    const fullUrl = base ? base + url : baseUrl + url;

    try {
      setAuthorizationToken(); // attach token

      const response = await axios.post(fullUrl, payload, {
        ...config,
        params,
      });

      return response.data;
    } catch (error) {
      handleError(error, hideError);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    }
  }

  // ✅ GET
  static async get(url, params = {}, base = "", hideError = false) {
    const fullUrl = base ? base + url : baseUrl + url;

    try {
      setAuthorizationToken();

      const response = await axios.get(fullUrl, {
        ...config,
        params,
      });

      return response.data;
    } catch (error) {
      handleError(error, hideError);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    }
  }

  // ✅ PUT
  static async put(url, payload = {}, base = "") {
    const fullUrl = base ? base + url : baseUrl + url;

    try {
      setAuthorizationToken();

      const response = await axios.put(fullUrl, payload, config);

      return response.data;
    } catch (error) {
      handleError(error);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    }
  }

  // ✅ PATCH
  static async patch(url, payload = {}, base = "", hideError = false) {
    const fullUrl = base ? base + url : baseUrl + url;

    try {
      setAuthorizationToken();

      const response = await axios.patch(fullUrl, payload, config);

      return response.data;
    } catch (error) {
      handleError(error, hideError);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    }
  }

  // ✅ DELETE
  static async delete(url, params = {}, base = "") {
    const fullUrl = base ? base + url : baseUrl + url;

    try {
      setAuthorizationToken();

      const response = await axios.delete(fullUrl, {
        ...config,
        params,
      });

      return response.data;
    } catch (error) {
      handleError(error);
      return {
        success: false,
        message: error?.response?.data?.message || "Request failed",
      };
    }
  }

  // ✅ FormData (Image Upload)
  static async postFormData(url, params = {}) {
    const fullUrl = baseUrl + url;

    try {
      setAuthorizationToken();

      const formData = new FormData();
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key]);
      });

      const response = await axios.post(fullUrl, formData, imageConfig);

      return response.data;
    } catch (error) {
      handleError(error);
      return {
        success: false,
        message: error?.response?.data?.message || "Upload failed",
      };
    }
  }

  // ✅ Common handler
  static allApi(url, params, method = "get") {
    switch (method) {
      case "get":
        return this.get(url, params);
      case "post":
        return this.post(url, params);
      case "put":
        return this.put(url, params);
      case "patch":
        return this.patch(url, params);
      case "delete":
        return this.delete(url, params);
      default:
        throw new Error("Unsupported method");
    }
  }
}

export default ApiClient;