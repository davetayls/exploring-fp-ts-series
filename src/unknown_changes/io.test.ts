import { SinonStub, stub } from 'sinon'
import * as env from '../lib/env'
import { equal } from 'assert'
import { iLoveEditor } from './io'

describe('io', function () {
  let envStub: SinonStub

  beforeEach(function () {
    envStub = stub(env, 'readEnv')
  })

  afterEach(function () {
    envStub.restore()
  })

  it('does not know what it likes', function () {
    envStub.returns({})
    equal(iLoveEditor.run(), 'I love webstorm')
  })

  it('should like webstorm', function () {
    envStub.returns({ EDITOR: 'webstorm' })
    equal(iLoveEditor.run(), 'I love webstorm')
  })

})
