import axios from "axios";
import path from "../features/router/paths";
// import apiInstance from "../axios/authSlice";
// import { getHost } from "../config/configApi";
// import { getAuthData } from "../user/userSlice";
const apiInstance = axios;

const gallery = path.host + "/upload/files";
const galleryUpload = path.host + "/upload";

export async function fetchGallery(id) {
  const url = gallery + (id || "");
  const { data } = await apiInstance.get(url);

  return data.map((d) => {
    const { _id, ...rest } = d;
    return { id: _id, ...rest };
  });
}

export async function upload(formData) {
  const url = galleryUpload;
  const { data } = await apiInstance.post(url, formData);
  const { _id, ...rest } = data;
  return { id: _id, ...rest };
}

export async function removeImage(id) {
  const url = gallery + "/" + id;
  const { data } = await apiInstance.delete(url);
  return data;
}
