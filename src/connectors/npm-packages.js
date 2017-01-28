
import * as Npm from '../providers/npm'

export async function getRangeDownloads (packageName, range) {
  if (packageName) {
    return Npm.getRangeDownloads(packageName, range)
  }
}
