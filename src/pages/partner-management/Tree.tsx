import { PartnerTreeNode } from "@/api/partners/types";
import { Tag, Tree, TreeProps } from "antd";
import { DataNode } from "antd/es/tree";
import { CSSProperties, useMemo, useState } from "react";

interface Props {
  data: PartnerTreeNode[];
  selectedId?: number | null;
  onSelect: (node: PartnerTreeNode) => void;
}

interface PartnerDataNode extends DataNode {
  data: PartnerTreeNode;
  children?: PartnerDataNode[];
}

const titleStyle: CSSProperties = { display: "flex", alignItems: "center", gap: 6 };

// The selected row's background is the solid primary color (see the CSS block below),
// so the label, tag, and count all need an explicit light color here — they can't rely
// on antd's default (dark) text, which disappears against that background.
const nodeTitle = (node: PartnerTreeNode, isSelected: boolean) => (
  <span style={{ ...titleStyle, color: isSelected ? "#fff" : undefined }}>
    <span>{node.username === "master" ? node.displayName : `${node.displayName} (${node.username})`}</span>
    <Tag
      style={
        isSelected
          ? { marginInlineEnd: 0, color: "#fff", borderColor: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.15)" }
          : { marginInlineEnd: 0 }
      }
    >
      {node.roleKo}
    </Tag>
    <span style={{ fontSize: 12, color: isSelected ? "rgba(255,255,255,0.85)" : "var(--ant-color-text-tertiary)" }}>
      {node.memberCount.toLocaleString()} / {node.subtreeMemberCount.toLocaleString()}
    </span>
  </span>
);

const buildTreeData = (nodes: PartnerTreeNode[], selectedId?: number | null): PartnerDataNode[] =>
  nodes.map((node) => ({
    key: node.id,
    title: nodeTitle(node, node.id === selectedId),
    data: node,
    children: node.children?.length ? buildTreeData(node.children, selectedId) : undefined,
  }));

const collectKeys = (nodes: PartnerTreeNode[]): number[] =>
  nodes.flatMap((node) => [node.id, ...collectKeys(node.children ?? [])]);

const PartnerTree = ({ data, selectedId, onSelect }: Props) => {
  const treeData = useMemo(() => buildTreeData(data, selectedId), [data, selectedId]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(() => collectKeys(data));

  const handleSelect: TreeProps["onSelect"] = (_, info) => {
    const node = (info.node as unknown as PartnerDataNode).data;
    if (node) onSelect(node);
  };

  return (
    <>
      {/* .ant-tree-node-selected's background is the solid primary color by default
          here, not the usual light tint — force white title text (set inline above)
          to stay legible against it instead of the theme's default dark text. */}
      <style>{`
        .partner-tree .ant-tree-node-selected {
          background-color: var(--ant-color-primary) !important;
        }
        .partner-tree .ant-tree-node-content-wrapper:hover {
          background-color: var(--ant-color-primary-bg) !important;
        }
        .partner-tree .ant-tree-node-selected:hover {
          background-color: var(--ant-color-primary) !important;
        }
      `}</style>
      <Tree<PartnerDataNode>
        className="partner-tree"
        treeData={treeData}
        selectedKeys={selectedId != null ? [selectedId] : []}
        expandedKeys={expandedKeys}
        onExpand={(keys) => setExpandedKeys(keys)}
        onSelect={handleSelect}
        showLine
      />
    </>
  );
};

export default PartnerTree;
