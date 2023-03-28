import { backendUrl } from './Url'

export function getGraph(libId) {
  return fetch(`${backendUrl}/migration/mvn/graph/${libId}/get`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(resp => resp.json())
}

export function getDependencyInfo(libId) {
  return fetch(`${backendUrl}/project/mvn/lib/get/${libId}`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(resp => resp.json())
}

export function getLibInfo(libId) {
  return fetch(`${backendUrl}/library/mvn/${libId}/get`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(resp => resp.json())
}
