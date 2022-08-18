export interface TreeNode {
  id: string;
  name: string;
  parentId: string;
  children?: TreeNode[];
}

export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  id: string;
}

export interface SelectNode {
  title: string;
  value: string;
  key: string;
  isLeaf: boolean;
  parentKey: string;
  children: SelectNode[];
}
