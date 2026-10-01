/**
 * 필수사항 메세지(memo)는 기존에 평문으로 저장되어 있고, 에디터는 Slate JSON 문자열을 만든다.
 * 유저페이지의 EditorViewer 가 두 형식을 모두 처리하므로 저장 형식만 여기서 맞춰준다.
 */

const collectText = (nodes: any[]): string =>
  nodes
    .map((node) =>
      typeof node?.text === "string"
        ? node.text
        : Array.isArray(node?.children)
        ? collectText(node.children)
        : ""
    )
    .join("");

/** 목록 컬럼·툴팁처럼 서식 없이 보여줘야 하는 곳을 위한 평문 변환. */
export const toMemoPreview = (memo?: string | null): string => {
  if (!memo) return "";

  try {
    const parsed = JSON.parse(memo);
    if (Array.isArray(parsed)) {
      return parsed
        .map((node) => collectText([node]))
        .join("\n")
        .trim();
    }
  } catch {
    /* 평문 memo */
  }

  return memo;
};

/**
 * 저장된 memo 를 useEditor 초기값으로 변환. 평문은 줄 단위로 문단을 만든다.
 * 공지·쪽지 템플릿처럼 `JSON.parse(...)` 를 그대로 넘기면 평문 memo 에서 예외가 나므로 감싼다.
 */
export const toEditorContent = (memo?: string | null): any[] | undefined => {
  if (!memo) return undefined;

  try {
    const parsed = JSON.parse(memo);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* 평문 memo — 아래에서 변환 */
  }

  return memo.split("\n").map((line) => ({
    type: "paragraph",
    children: [{ text: line }],
  }));
};

/**
 * useEditor 의 value 는 편집 전에는 배열, 편집 후에는 JSON 문자열이라 저장 시 문자열로 통일한다.
 * 내용이 비어 있으면 빈 문단 JSON 대신 "" 를 반환해야 유저페이지에서 빈 필수사항 박스가 뜨지 않는다.
 */
export const toMemoString = (value: unknown): string => {
  let content: any = value;

  if (typeof content === "string") {
    if (!content.trim()) return "";
    try {
      content = JSON.parse(content);
    } catch {
      return content; // 이미 평문이면 그대로 저장
    }
  }

  if (!Array.isArray(content) || content.length === 0) return "";

  const hasText = collectText(content).trim().length > 0;
  const hasImage = JSON.stringify(content).includes('"type":"image"');
  if (!hasText && !hasImage) return "";

  // useEditor 는 초기값을 빈 문단 뒤에 붙이므로, 열었다 저장할 때마다 첫 줄이 비어 늘어난다
  const trimmed = [...content];
  while (trimmed.length > 1 && collectText([trimmed[0]]) === "") trimmed.shift();

  return JSON.stringify(trimmed);
};
