/**
 * プロンプトからタグを分解する機能
 */

/**
 * プロンプトからタグを抽出して分解する
 * @param prompt 入力プロンプト（生成されたものまたはファイル名一覧）
 * @returns 分解されたタグの配列（重複除去・ソート済み）
 */
export function parseTagsFromPrompt(prompt: string): string[] {
  if (!prompt.trim()) {
    return []
  }

  // 1. ファイル名部分を削除（,数字_数字.jpgパターン）
  let cleanedPrompt = prompt.replace(/,[\d\-_]+\.jpg/g, '')
  console.log("cleanedPrompt");
  console.log(cleanedPrompt);

  // 2. タグ毎に分解（カンマ + 任意の空白で分割）
  const tagParts = cleanedPrompt.split(/,\s*/).filter(part => part.trim().length > 0)

  // 3. 各タグから重みを削除
  const tagsWithoutWeights = tagParts.map(tag => removeWeightFromTag(tag.trim()))

  // 4. エスケープを削除
  const unescapedTags = tagsWithoutWeights.map(tag => removeEscapes(tag))

  // 5. アンダーバーを空白に変換
  const normalizedTags = unescapedTags.map(tag => convertUnderscoreToSpace(tag))

  // 6. 重複削除とソート
  const uniqueTags = Array.from(new Set(normalizedTags.filter(tag => tag.length > 0)))
  
  return uniqueTags.sort()
}

/**
 * タグから重みを削除
 * 例: "(tag_name:0.8)" -> "tag_name", "(tag_name_0.6)" -> "tag_name"
 */
function removeWeightFromTag(tag: string): string {
  // パターン1: (tag:weight) 形式
  const colonMatch = tag.match(/^\((.+):[\d.]+\)$/)
  if (colonMatch) {
    return colonMatch[1]
  }

  // パターン2: (tag_weight) 形式
  const underscoreMatch = tag.match(/^\((.+)_[\d.]+\)$/)
  if (underscoreMatch) {
    return underscoreMatch[1]
  }

  // 括弧がある場合は除去
  if (tag.startsWith('(') && tag.endsWith(')')) {
    return tag.slice(1, -1)
  }

  return tag
}

/**
 * エスケープ文字を削除
 * _(を(に、_)を)に変換
 */
function removeEscapes(tag: string): string {
  return tag
    .replace(/_\(/g, '(')
    .replace(/_\)/g, ')')
}

/**
 * アンダーバーを空白に変換
 */
function convertUnderscoreToSpace(tag: string): string {
  return tag.replace(/_/g, ' ')
}

/**
 * 候補タグもアンダーバー変換して比較用に正規化
 */
export function normalizeCandidateTag(tag: string): string {
  return convertUnderscoreToSpace(tag.trim())
}

/**
 * 候補タグから使用済みタグを除外して未使用タグを抽出
 */
export function extractUnusedTags(candidateTags: string[], usedTags: string[]): string[] {
  const normalizedUsedTags = usedTags.map(tag => tag.toLowerCase().trim())
  
  return candidateTags.filter(candidateTag => {
    const normalizedCandidate = normalizeCandidateTag(candidateTag).toLowerCase().trim()
    return !normalizedUsedTags.includes(normalizedCandidate)
  }).sort()
}

/**
 * 複数のタググループの候補タグを結合
 */
export function combineTagGroups(tagGroups: { tags: string[] }[]): string[] {
  const allTags = tagGroups.flatMap(group => group.tags)
  const uniqueTags = Array.from(new Set(allTags.filter(tag => tag.trim().length > 0)))
  return uniqueTags.sort()
}