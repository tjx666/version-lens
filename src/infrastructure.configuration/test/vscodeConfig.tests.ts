import { VsCodeConfig } from 'infrastructure.configuration'
import { IVsCodeWorkspace } from 'infrastructure.configuration';

import { VsCodeWorkspaceStub } from './stubs/vsCodeWorkspaceStub';

const assert = require('assert')
const { mock, instance, when } = require('ts-mockito');

let workspaceMock: IVsCodeWorkspace;

export const VsCodeFrozenConfigTests = {

  beforeAll: () => {
    workspaceMock = mock(VsCodeWorkspaceStub);
  },

  "get": {

    "accesses frozen repo after first call": () => {
      const testSection = 'testsection'
      const testKey = 'some_property';
      let expectedFrozenValue = 'test value';

      when(workspaceMock.getConfiguration(testSection))
        .thenReturn({
          get: section => expectedFrozenValue
        })

      // get hot value
      const cut = new VsCodeConfig(instance(workspaceMock), testSection);
      const first = cut.get(testKey);
      assert.equal(first, expectedFrozenValue)

      // change value
      when(workspaceMock.getConfiguration(testSection)).thenReturn('hot value')

      // should still return frozen value
      const actualFrozen = cut.get(testKey);

      assert.equal(actualFrozen, expectedFrozenValue)
    },

    "returns hot value after defrost is called": () => {
      const testSection = 'testsection'
      const testKey = 'some_property';
      let initialValue = 'test value';

      when(workspaceMock.getConfiguration(testSection))
        .thenReturn({
          get: section => initialValue
        })

      // get hot value
      const cut = new VsCodeConfig(instance(workspaceMock), testSection);
      const first = cut.get(testKey);
      assert.equal(first, initialValue)

      // change expected hot value
      const expectedHotValue = 'hot value';
      when(workspaceMock.getConfiguration(testSection))
        .thenReturn({
          get: section => expectedHotValue
        })

      // should return hot value
      cut.defrost();
      const actualFrozen = cut.get(testKey);

      assert.equal(actualFrozen, expectedHotValue)
    }

  }

}