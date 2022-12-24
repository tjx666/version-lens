export default {

  "createDependenciesFromXml": {

    "test": `
    <Project>
    <ItemGroup>
        <PackageReference Include="Microsoft.Extensions.DependencyInjection.Abstractions" Version="2.0.0" />
        <PackageReference Include="Microsoft.Extensions.Logging.Abstractions" Version="2.0.1" />
        <PackageVersion Include="System.Text.Json" Version="4.7.2" />
    </ItemGroup>
</Project>
`,

    "expected": [
      {
        "nameRange": {
          "start": 35,
          "end": 35
        },
        "versionRange": {
          "start": 130,
          "end": 34
        },
        "packageInfo": {
          "name": "Microsoft.Extensions.DependencyInjection.Abstractions",
          "version": "2.0.0"
        }
      },
      {
        "nameRange": {
          "start": 144,
          "end": 144
        },
        "versionRange": {
          "start": 227,
          "end": 143
        },
        "packageInfo": {
          "name": "Microsoft.Extensions.Logging.Abstractions",
          "version": "2.0.1"
        }
      },
      {
        "nameRange": {
          "start": 241,
          "end": 241
        },
        "versionRange": {
          "start": 297,
          "end": 240
        },
        "packageInfo": {
          "name": "System.Text.Json",
          "version": "4.7.2"
        }
      }
    ]

  }

}