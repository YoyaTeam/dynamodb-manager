export default {
  isEmpty(obj) {
    return typeof obj === 'undefined' || obj === null || obj === '' || obj.length === 0
  },
  isNotEmpty(obj) {
    return !this.isEmpty(obj)
  },
  clone(obj) {
    // Handle the 3 simple types, and null or undefined or function
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    // Handle Date
    if (obj instanceof Date) {
      var date = new Date()
      date.setTime(obj.getTime())
      return date
    }
    // Handle Array or Object
    if (obj instanceof Array | obj instanceof Object) {
      var dest = (obj instanceof Array) ? [] : {}
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) {
          dest[attr] = this.clone(obj[attr])
        }
      }
      return dest
    }
    throw new Error("Unable to clone obj! Its type isn't supported.")
  }
}
