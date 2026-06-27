export const curry = (fn) => {
  if (typeof fn !== 'function') {
    throw new TypeError('curry expects a function')
  }

  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...nextArgs) => curried(...args, ...nextArgs)
  }
}
