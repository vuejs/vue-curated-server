
import { launchApiEndpoint } from './endpoint'
import { updateDatasets } from './jobs/update'

const UPDATE_INTERVAL = process.env.UPDATE_INTERVAL || 5 * 60 * 1000

updateDatasets().then(() => {
  launchApiEndpoint()

  // Periodic update
  setInterval(updateDatasets, UPDATE_INTERVAL)

  // TODO GitHub web hooks
})
