// vscode references
import { IPackageDependency } from "../definitions/iPackageDependency";

export function extractPackageDependenciesFromJson(
  json: string, filterPropertyNames: Array<string>
): Array<IPackageDependency> {
  const jsonErrors = [];
  const jsonParser = require("jsonc-parser");
  const jsonTree = jsonParser.parseTree(json, jsonErrors);
  if (!jsonTree || jsonTree.children.length === 0 || jsonErrors.length > 0) return [];
  return extractFromNodes(jsonTree.children, filterPropertyNames);
}

export function extractFromNodes(topLevelNodes, includePropertyNames: string[]): IPackageDependency[] {
  const collector = [];

  topLevelNodes.forEach(
    function (node) {
      const [keyEntry, valueEntry] = node.children;
      if (includePropertyNames.includes(keyEntry.value) === false) return;
      collectDependencyNodes(valueEntry.children, null, '', collector);
    }
  )

  return collector
}

function collectDependencyNodes(nodes, parentKey, filterName: string, collector = []) {
  nodes.forEach(
    function (node) {
      const [keyEntry, valueEntry] = node.children;

      if (valueEntry.type == "string" &&
        (filterName.length === 0 || keyEntry.value === filterName)) {
        const dependencyLens = createFromProperty(parentKey || keyEntry, valueEntry);
        collector.push(dependencyLens);
      } else if (valueEntry.type == "object") {
        collectDependencyNodes(valueEntry.children, keyEntry, 'version', collector)
      }
    }
  )
}

function createFromProperty(keyEntry, valueEntry): IPackageDependency {
  const nameRange = {
    start: keyEntry.offset,
    end: keyEntry.offset,
  }

  // +1 and -1 to be inside quotes
  const versionRange = {
    start: valueEntry.offset + 1,
    end: valueEntry.offset + valueEntry.length - 1,
  }

  const packageInfo = {
    name: keyEntry.value,
    version: valueEntry.value
  }

  return {
    nameRange,
    versionRange,
    packageInfo
  }
}
