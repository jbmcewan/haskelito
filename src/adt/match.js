import { curry } from '../combinators/curry.js'

export const match = curry((patterns, value) => {
  const tag = value?.tag

  if (tag && tag in patterns) return patterns[tag](value.value)
  if ('_' in patterns) return patterns._()

  throw new Error(`Pattern matching failed: unhandled tag '${tag}'`)
})

export const matchOrElse = curry((patterns, fallback, value) => {
  const tag = value?.tag

  if (tag && tag in patterns) return patterns[tag](value.value)
  return fallback(value)
})

export const matchExhaustive = curry((patterns, value) => {
  const tag = value?.tag

  if (tag && tag in patterns) return patterns[tag](value.value)

  throw new Error(`Pattern matching failed: unhandled tag '${tag}'`)
})
