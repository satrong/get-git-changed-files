import { bash } from './bash'

type TFileInfo = {
  type: 'added' | 'copied' | 'deleted' | 'modified' | 'renamed';
  filepath: string;
}

const mapped = {
  'A': 'added',
  'C': 'copied',
  'D': 'deleted',
  'M': 'modified',
  'R': 'renamed'
} as const

function strLineToArr (str: string) {
  return str.trim().split('\n').filter(Boolean)
}

/**
 * 根据 commit id 获取文件变动列表
 */
export async function getFilesByCommitId (commitId: string, cwd: string) {
  // Added (A), Copied (C), Deleted (D), Modified (M), Renamed (R)
  const result = await bash('git', ['diff-tree', '--no-commit-id', '--name-status', '--diff-filter=ACDMR', '-r', commitId], cwd)

  return strLineToArr(result).map(el => {
    const [type, filepath] = el.split(/\s+/) as [keyof typeof mapped, string]
    return { type: mapped[type], filepath }
  })
}

/**
 * 根据日期获取文件变动列表
 */
export async function getFilesByDate ({ since, util, cwd }: { since: string; util?: string; cwd: string }) {
  const args = ['log', '--oneline', '--format=%H', `--since=${since}`]
  if (util) args.push(`--util=${util}`)
  const result = await bash('git', args, cwd)
  const commitIds = strLineToArr(result).reverse()

  const store = new Map<string, TFileInfo>()

  for (const commitId of commitIds) {
    const files = await getFilesByCommitId(commitId, cwd)
    for (const file of files) {
      store.set(file.filepath, file)
    }
  }
  return Array.from(store.values())
}
