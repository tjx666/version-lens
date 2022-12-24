import { Nullable } from 'core.generics';
import { IPackageDependency, TPackageDependencyRange } from 'core.packages';

export function createDependenciesFromXml(
  xml: string, includePropertyNames: Array<string>
): Array<IPackageDependency> {

  const xmldoc = require('xmldoc');
  let document = null

  try {
    document = new xmldoc.XmlDocument(xml);
  } catch {
    document = null;
  }

  if (!document) return [];
  return extractPackageLensDataFromNodes(document, xml, includePropertyNames);
}

function extractPackageLensDataFromNodes(
  topLevelNodes, xml: string, includePropertyNames: Array<string>
) {
  const collector = [];

  topLevelNodes.eachChild(
    function (node) {
      if (node.name !== "ItemGroup") return;
      node.eachChild(
        function (itemGroupNode) {
          if (includePropertyNames.includes(itemGroupNode.name) == false) return;
          const dependencyLens = createFromAttribute(itemGroupNode, xml);
          if (dependencyLens) collector.push(dependencyLens);
        }
      )
    }
  )

  return collector
}

function createFromAttribute(node, xml: string): IPackageDependency {
  const nameRange = {
    start: node.startTagPosition,
    end: node.startTagPosition,
  };

  // xmldoc doesn't report attribute ranges so this gets them manually
  const versionRange = getAttributeRange(node, ' version="', xml);
  if (versionRange === null) return null;

  const packageInfo = {
    name: node.attr.Include || node.attr.Update,
    version: node.attr.Version,
  }

  return {
    nameRange,
    versionRange,
    packageInfo,
  }
}

function getAttributeRange(
  node, attributeName: string, xml: string
): Nullable<TPackageDependencyRange> {
  const lineText = xml.substring(node.startTagPosition, node.position);

  let start = lineText.toLowerCase().indexOf(attributeName);
  if (start === -1) return null;
  start += attributeName.length

  const end = lineText.indexOf('"', start);

  return {
    start: node.startTagPosition + start,
    end: node.startTagPosition + end,
  };
}