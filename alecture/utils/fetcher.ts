import axios, { AxiosError } from "axios";

const fetcher = (url: string) =>
  axios
    ?.get(url, {
      withCredentials: true,
    })
    .then((response) => response?.data)
    .catch((error) => {
      console.log(error);

      return error.response.data;
    });
// .catch (error) {
//   const err = error as AxiosError;
//   console.log(err.response?.data);
// }
export default fetcher;
