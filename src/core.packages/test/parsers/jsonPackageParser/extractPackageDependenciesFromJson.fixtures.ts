export default {

  "extractDependencyEntries": {

    "test": {

      "dependencies": {
        "Package1": "1.0.0",
        "Package2": "github:repo/project#semver:1.2.3",
        "Package3": "*",
        "ComplexPackage1": {
          "version": "1.2.3"
        }
      },

      "scripts": {
        "script1": "run me",
      }
    },

    "expected": [
      {
        "nameRange": {
          "start": 17,
          "end": 17
        },
        "versionRange": {
          "start": 29,
          "end": 34
        },
        "packageInfo": {
          "name": "Package1",
          "version": "1.0.0"
        }
      },
      {
        "nameRange": {
          "start": 36,
          "end": 36
        },
        "versionRange": {
          "start": 48,
          "end": 80
        },
        "packageInfo": {
          "name": "Package2",
          "version": "github:repo/project#semver:1.2.3"
        }
      },
      {
        "nameRange": {
          "start": 82,
          "end": 82
        },
        "versionRange": {
          "start": 94,
          "end": 95
        },
        "packageInfo": {
          "name": "Package3",
          "version": "*"
        }
      },
      {
        "nameRange": {
          "start": 97,
          "end": 97
        },
        "versionRange": {
          "start": 127,
          "end": 132
        },
        "packageInfo": {
          "name": "ComplexPackage1",
          "version": "1.2.3"
        }
      }
    ]

  }

}