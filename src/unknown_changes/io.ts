import { IO } from 'fp-ts/lib/IO'
import { readEnv } from '../lib/env'
import { fromNullable, option } from 'fp-ts/lib/Option'

/**
 * IO
 *
 * Use when
 * - You are not in control of an underlying value
 *
 * Example wrapping process.env
 */

const ioEnv = new IO(() => readEnv())
export const iLoveEditor =
  ioEnv
    .map((env) =>
      fromNullable(env.EDITOR)
        .map((s) => `I love ${s}`)
    )
