// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import path from "../features/router/paths";
import axiosBaseQuery from "./customApi";

export const panchayatsApi = createApi({
  reducerPath: "panchayat",
  baseQuery: axiosBaseQuery({
    baseUrl: path.api.panchayats.root,
  }),
  endpoints(builder) {
    return {
      getPanchayats: builder.query({
        query: ({ page = 1, pageSize = 25 } = {}) => ({
          url: `?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
          method: "get",
        }),
      }),
      getPanchayatNames: builder.query({
        query: ({ page = 1, pageSize = 25 } = {}) => ({
          url: `?pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
          method: "get",
        }),
        transformResponse: (response) => {
          return {
            data: response?.data?.map(({ id, attributes }) => ({
              id,
              ...attributes,
            })),
            meta: response.meta,
          };
        },
      }),
      createPanchayat: builder.mutation({
        query: (data) => {
          return { url: "/", method: "post", data };
        },
      }),
      updatePanchayat: builder.mutation({
        query: (data) => {
          return { url: `/${data._id}`, method: "put", data };
        },
      }),
      deletePanchayat: builder.mutation({
        query: (data) => {
          return { url: `/${data._id}`, method: "delete" };
        },
      }),
    };
  },
});

const DB_NAME = "panchayats";

const createPanchayat = async ({ name, pid }) =>
  await electronAPI.insertIntoDb(DB_NAME, { name, pid });

const updatePanchayat = async (filter = {}, data = {}) =>
  await electronApi.updatePanchayat(DB_NAME, filter, data);

const deletePanchayat = async (filter = {}) =>
  await electronApi.remvoveInDb(DB_NAME, filter);

const getPanchayats = async () => await electronApi.getDb(DB_NAME);

const findPanchayat = async (filter = {}) =>
  await electronApi.createDb(DB_NAME, filter);

export const {
  useGetPanchayatsQuery,
  useGetPanchayatNamesQuery,
  useCreatePanchayatMutation,
  useUpdatePanchayatMutation,
  useDeletePanchayatMutation,
} = panchayatsApi;
