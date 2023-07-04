// Need to use the React-specific entry point to allow generating React hooks
import { createApi } from "@reduxjs/toolkit/query/react";
import path from "../features/router/paths";
import axiosBaseQuery from "./customApi";

export const votersApi = createApi({
  reducerPath: "voter",
  baseQuery: axiosBaseQuery({
    baseUrl: path.api.voters.root,
  }),
  endpoints(builder) {
    return {
      getVoters: builder.query({
        query: ({ page = 1, pageSize = 22 } = {}) => ({
          url: `?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
          method: "get",
        }),
      }),
      getVotersByPanchayat: builder.query({
        query: ({ page = 1, pageSize = 22, panchayat, name, uid } = {}) => {
          return (
            panchayat && {
              url: `?filters[panchayat]=${panchayat}${
                name ? `&filters[$or][0][name][$contains]=${name}` : ""
              }${
                uid ? `&filters[$or][1][uid][$contains]=${uid}` : ""
              }&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
              method: "get",
            }
          );
        },
      }),
      getVotersByElection: builder.query({
        query: ({ page = 1, pageSize = 15, election, name, uid } = {}) => {
          return (
            election && {
              url: `?filters[election]=${election}${
                name ? `&filters[$or][0][name][$contains]=${name}` : ""
              }${
                uid ? `&filters[$or][1][uid][$contains]=${uid}` : ""
              }&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`,
              method: "get",
            }
          );
        },
      }),
      createVoter: builder.mutation({
        query: (data) => {
          return { url: "?populate=*", method: "post", data };
        },
      }),
      updateVoter: builder.mutation({
        query: (data) => {
          return { url: `/${data.id}?populate=*`, method: "put", data };
        },
      }),
      deleteVoter: builder.mutation({
        query: (data) => {
          return { url: `/${data.id}`, method: "delete" };
        },
      }),
    };
  },
});

export const {
  useGetVotersQuery,
  useGetVotersByPanchayatQuery,
  useGetVotersByElectionQuery,
  useCreateVoterMutation,
  useUpdateVoterMutation,
  useDeleteVoterMutation,
} = votersApi;
