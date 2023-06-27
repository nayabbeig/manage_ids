// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import path from "../features/router/paths";
import axiosBaseQuery from "./customApi";

export const electionsApi = createApi({
  reducerPath: "election",
  baseQuery: axiosBaseQuery({
    baseUrl: path.api.elections.root,
  }),
  endpoints(builder) {
    return {
      getElections: builder.query({
        query: ({ page = 1, pageSize = 15 } = {}) => ({
          url: `?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
          method: "get",
        }),
      }),
      createElection: builder.mutation({
        query: (data) => {
          return { url: "/", method: "post", data };
        },
      }),
      updateElection: builder.mutation({
        query: (data) => {
          return { url: `/${data.id}`, method: "put", data };
        },
      }),
      deleteElection: builder.mutation({
        query: (data) => {
          return { url: `/${data.id}`, method: "delete" };
        },
      }),
    };
  },
});

export const {
  useGetElectionsQuery,
  useCreateElectionMutation,
  useUpdateElectionMutation,
  useDeleteElectionMutation,
} = electionsApi;
