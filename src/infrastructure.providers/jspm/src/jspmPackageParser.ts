import { IPackageDependency, extractFromNodes } from 'core.packages'

export function extractPackageDependenciesFromJson(
  json: string,
  filterPropertyNames: Array<string>
): Array<IPackageDependency> {
  const jsonParser = require("jsonc-parser");

  const jsonErrors = [];
  const jsonTree = jsonParser.parseTree(json, jsonErrors);
  if (!jsonTree || jsonTree.children.length === 0 || jsonErrors.length > 0) return [];

  const children = jsonTree.children;
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    const [keyEntry, valueEntry] = node.children;
    if (keyEntry.value === 'jspm') {
      return extractFromNodes(valueEntry.children, filterPropertyNames);
    }
  }

  return [];
}