import { sortableKeys } from '@/scripts/DataSchema.js'
import { backendUrl } from './Url'

const queryPath = {
  // mavenProjectInfo: '/project/mvn/query',
  dependencyInfo: '/library/mvn/query'
}

export default function search(type, params, range, sort, reverse) {
  if (queryPath[type] === undefined) {
    throw new Error('unimplemented')
  }

  if (sortableKeys[type].indexOf(sort) === -1) {
    throw new Error(`'${sort}' is not sortable`)
  }

  const query = {
    startIndex: range[0],
    endIndex: range[1],
    sort,
    isReverse: reverse,
    ...params,
  }

  return fetch(`${backendUrl}${queryPath[type]}`, {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(resp => resp.json())
}
