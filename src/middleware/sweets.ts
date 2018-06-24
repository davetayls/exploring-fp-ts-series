
// First middleware
import { buildMiddleware, TMiddleware } from './middleware'

interface ISweets {
  isTakingPart: () => boolean,
  didEnjoy: () => boolean,
  numberOfSweets: () => number
}

const sweets: TMiddleware<ISweets, string> = (env, next) => context => {
  context += ` ate ${env.numberOfSweets()} sweets`
  return next(context)
}

// Second middleware
const enjoyed: TMiddleware<ISweets, string> = (env, next) => context => {
  if (env.didEnjoy()) {
    context += ' and enjoyed it.'
  } else {
    context += ' and stuck tongue out.'
  }
  return next(context)
}

// We can stop the middleware chain
// and return early if needed
const early: TMiddleware<ISweets, string> = (env, next) => context => {
  if (env.isTakingPart()) {
    return next(context)
  } else {
    return context + ' did not want to take part'
  }
}

const buildSweetsSentenceWith = buildMiddleware(
  early,
  sweets,
  enjoyed
)

// Apply the environment to the pipeline
export const getSweetsSentence = buildSweetsSentenceWith({
  isTakingPart: () => true,
  didEnjoy: () => true,
  numberOfSweets: () => 20
})
