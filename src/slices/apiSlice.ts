import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "src/fixtures/" }),
  reducerPath: "api",
  endpoints: (builder) => ({}),
});
