import axios from "axios";
import { backendUrl } from "./Url";

export function search_repo(data) {
  return axios({
    url: backendUrl + `/repository/query`, //后端的接口地址
    method: "post",
    params: {},
    data,
  })
}

export function get_repo_by_id(id) {
  return axios({
    url: backendUrl + `/repository/` + id + `/get`, //后端的接口地址
    method: "get",
  })
}

export function get_repo_dependency(repo_id, data) {
  return axios({
    url: backendUrl + `/repository/` + repo_id + `/dependency/query`, //后端的接口地址
    method: "post",
    params: {},
    data
  })
}
