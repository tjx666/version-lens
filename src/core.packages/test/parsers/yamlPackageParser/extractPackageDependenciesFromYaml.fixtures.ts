export default {

  "extractDependencyEntries": {

    "test": `
name: newtify
version: 1.2.3
description: >-
  Have you been turned into a newt?  Would you like to be?
  This package can help. It has all of the
  newt-transmogrification functionality you have been looking
  for.
homepage: https://example-pet-store.com/newtify
documentation: https://example-pet-store.com/newtify/docs
environment:
  sdk: '>=2.0.0 <3.0.0'
dependencies:
  efts: ^2.0.4
  http: # black with comments
  transmogrify:
    version: ^0.4.0 # complex version with comments
`,

    "expected": [
      {
        "nameRange": {
          "start": 376,
          "end": 376
        },
        "versionRange": {
          "start": 382,
          "end": 388
        },
        "packageInfo": {
          "name": "efts",
          "version": "^2.0.4"
        }
      },
      {
        "nameRange": {
          "start": 391,
          "end": 391
        },
        "versionRange": {
          "start": 397,
          "end": 397
        },
        "packageInfo": {
          "name": "http",
          "version": ""
        }
      },
      {
        "nameRange": {
          "start": 421,
          "end": 421
        },
        "versionRange": {
          "start": 448,
          "end": 486
        },
        "packageInfo": {
          "name": "transmogrify",
          "version": "^0.4.0"
        }
      }
    ]

  }

}