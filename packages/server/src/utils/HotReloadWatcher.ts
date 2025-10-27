/**
 * 热重载监听器
 */

import chokidar, { type FSWatcher } from 'chokidar'
import { resolve } from 'path'

interface HotReloadWatcherOptions {
  files: string[]
  onChange: () => void | Promise<void>
}

/**
 * 热重载监听器类
 */
export class HotReloadWatcher {
  private watcher?: FSWatcher
  private patterns: string[]
  private onChange: () => void | Promise<void>
  private debounceTimer?: NodeJS.Timeout

  constructor(options: HotReloadWatcherOptions) {
    this.patterns = options.files
    this.onChange = options.onChange
  }

  /**
   * 启动监听
   */
  start(): void {
    if (this.watcher) {
      return
    }

    this.watcher = chokidar.watch(this.patterns, {
      cwd: process.cwd(),
      ignoreInitial: true,
      ignored: ['**/node_modules/**', '**/.git/**'],
    })

    this.watcher.on('all', (event, path) => {
      console.log(`[HotReload] ${event}: ${path}`)
      this.debounceChange()
    })

    console.log('[HotReload] Watching for changes...')
  }

  /**
   * 防抖变化
   */
  private debounceChange(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.onChange()
    }, 300)
  }

  /**
   * 停止监听
   */
  stop(): void {
    if (this.watcher) {
      this.watcher.close()
      this.watcher = undefined
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
      this.debounceTimer = undefined
    }

    console.log('[HotReload] Stopped watching')
  }

  /**
   * 是否正在监听
   */
  isWatching(): boolean {
    return !!this.watcher
  }
}

