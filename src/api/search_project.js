import axios from "axios";
import { backendUrl } from "./Url";

export function search_project(data) {
  return axios({
    url: backendUrl + `/project/query`, //后端的接口地址
    method: "post",
    data,
  })
}

export function get_project_by_id(id) {
  return axios({
    url: backendUrl + `/project/` + id + `/get`, //后端的接口地址
    method: "get"
  })
}

export function get_project_dependency(project_id, data) {
  return axios({
    url: backendUrl + `/project/` + project_id + `/dependency/query`, //后端的接口地址
    method: "post",
    data
  })
}
