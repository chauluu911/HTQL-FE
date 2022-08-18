import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FlatNode, TreeNode } from '@shared/models/tree.model';
import { NzTreeFlatDataSource, NzTreeFlattener } from 'ng-zorro-antd/tree-view';

@Component({
  selector: 'mb-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit, OnChanges {
  @Input() data: TreeNode[] = [];
  @Output() clickNode = new EventEmitter<TreeNode>();

  private transformer = (node: TreeNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level,
    id: node.id,
  });
  // tslint:disable-next-line:member-ordering
  selectListSelection = new SelectionModel<FlatNode>();

  // tslint:disable-next-line:member-ordering
  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  // tslint:disable-next-line:member-ordering
  treeFlattener = new NzTreeFlattener(
    this.transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  // tslint:disable-next-line:member-ordering
  dataSource = new NzTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.setData(this.data);
    this.treeControl.expandAll();
  }

  ngOnInit(): void {}

  hasChild = (_: number, node: FlatNode): boolean => node.expandable;
  handleClickNode(node: TreeNode) {
    this.clickNode.emit(node);
  }
}
