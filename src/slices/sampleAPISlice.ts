// import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { apiSlice } from "./apiSlice";

type apiResponse = string;

const sampleAPISlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAPIData: builder.query<apiResponse, {}>({
      query: () => `api.json`,
      // queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
      //   const result = await fetchWithBQ(`api.json`);
      //   return result.data
      //     ? { data: result.data as apiResponse }
      //     : { error: result.error as FetchBaseQueryError };
      // },
      // transformResponse: (responseData: apiResponse) => {
      //   return responseData;
      // },
    }),
    // updateAPIData: builder.mutation<apiResponse, {}>({
    //   query: ({}) => ({ url: "", method: "PATCH", body: {} }),
    // }),
  }),
  overrideExisting: false,
});

export const {
  useGetAPIDataQuery,
  // useUpdateAPIDataMutation
} = sampleAPISlice;
