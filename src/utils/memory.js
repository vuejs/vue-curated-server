
export function listFactory (keyField = 'id') {
  const list = {
    items: [],

    clear () {
      list.items.length = 0
    },

    set (item) {
      const index = list.getIndex(item[keyField])
      if (index !== -1) {
        list.items.splice(index, 1, item)
      } else {
        list.items.push(item)
      }
    },

    put (items) {
      items.forEach(item => list.set(item))
    },

    get (key) {
      return list.items.find(i => i[keyField] === key)
    },

    getIndex (key) {
      return list.items.findIndex(i => i[keyField] === key)
    },

    remove (key) {
      const index = list.getIndex(key)
      if (index !== -1) {
        list.items.splice(index, 1)
      }
    },

    reset (items) {
      list.clear()
      list.items.push(...items)
    },

    forEach (cb) {
      list.items.forEach(cb)
    },
  }
  return list
}
