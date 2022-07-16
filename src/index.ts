import path from 'node:path'
import fs from 'node:fs/promises'
import { getFilesByDate } from './git'

export * from './git'

type OverrideOptions = {
  /** 代码提交的开始时间 */
  since: string;
  /** 代码提交的截止时间 */
  util?: string;
  /** 目标 git 仓库的根目录 */
  gitDir: string;
  /** 获取文件变动列表后，需要将变动的文件同步到的目录 */
  syncDestDir: string;
  /** 在更新 syncDestDir 中的文件之前，处理路径 */
  transformFilePath?: (filePath: string) => string;
}

/**
 * 获取指定时间段内的文件变动列表，并将变动的文件同步到指定目录
 */
export async function override (options: OverrideOptions) {
  const files = await getFilesByDate({
    since: options.since,
    util: options.util,
    cwd: options.gitDir
  })

  for (const file of files) {
    const filePath = options.transformFilePath ? options.transformFilePath(file.filepath) : file.filepath
    const destPath = path.join(options.syncDestDir, filePath)

    if (file.type === 'deleted') {
      await fs.rm(destPath, { force: true })
    } else {
      await fs.copyFile(path.join(options.gitDir, file.filepath), destPath)
    }
  }
}
