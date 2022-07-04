import axios from "axios";
import { Fetcher } from "swr";

const fetcher: Fetcher = (url: string) =>
  axios
    ?.get(url, {
      withCredentials: true,
    })
    .then((response) => response?.data);
export default fetcher;
