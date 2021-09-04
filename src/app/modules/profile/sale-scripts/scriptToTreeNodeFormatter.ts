import { TreeNode } from 'primeng/api';
import { ScriptShortView } from 'src/app/_models/script-short-view';

function sortItems(a: TreeNode, b: TreeNode) {
  if (a.type && !b.type) {
    return Number(a.key) - Number(b.key);
  }
  return Number(b.key) - Number(a.key);
}

function genTree(node: TreeNode, scripts: ScriptShortView[]): TreeNode {
  const parentId = Number(node.key);
  const items = scripts.filter((script) => script.parentFolderId === parentId);
  const children: TreeNode[] = [];
  items.forEach((item) => {
    const itemFormatted: TreeNode = {
      key: `${item.id}`,
      label: item.name,
    };
    if (!item.isFolder) {
      itemFormatted.type = 'script';
    }
    children.push(itemFormatted);
    children.sort(sortItems);
  });
  // eslint-disable-next-line no-param-reassign
  node.children = children;
  node.children.forEach((child) => {
    genTree(child, scripts);
  });
  return node;
}

export function scriptToTreeNodeFormatter(scripts: ScriptShortView[]): TreeNode[] {
  const node: TreeNode[] = [];
  scripts.forEach((script) => {
    const item: TreeNode = {
      key: `${script.id}`,
      label: script.name,
    };
    if (!script.isFolder) {
      item.type = 'script';
    }
    if (!script.parentFolderId) {
      node.push(item);
    }
  });
  node.sort(sortItems);
  node.forEach((item) => {
    genTree(item, scripts);
  });
  return node;
}
