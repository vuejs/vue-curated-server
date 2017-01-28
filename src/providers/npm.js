
import axios from 'axios'

const API_ENDPOINT = process.env.NPM_API_ENDPOINT || 'https://api.npmjs.org'

export function getRangeDownloads (packageName, range = 'last-month') {
  return axios.get(`${API_ENDPOINT}/downloads/range/${range}/${packageName}`)
  .then(response => response.data && response.data.downloads)
  .catch(error => {
    console.error(error)
  })
}
