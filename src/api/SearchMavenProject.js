import { backendUrl } from './Url';
import axios from "axios";

const basePath = `/project/mvn/`
export function searchMavenProjectByVersion(projectId, version) {
    return axios({
        url: backendUrl + basePath + projectId + `/get/` + version,
        method: "get",
    })
}

export function searchMavenProjectById(projectId) {
    return axios({
        url: backendUrl + basePath + projectId + `/get`,
        method: "get",
        params: {},
    })
}