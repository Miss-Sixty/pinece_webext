import type { BookmarkNode } from "../types";

// 点击导出按钮后，将数据处理为 JSON 格式
export default (treeData: BookmarkNode[] | undefined): void => {
  if (!treeData) return;
  const blob = new Blob([JSON.stringify(treeData, null, 2)]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pinece_${new Date().getTime()}.json`
  a.click();
  URL.revokeObjectURL(url);
};