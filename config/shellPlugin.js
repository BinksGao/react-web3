const { spawn, exec } = require('child_process')
const os = require('os')

class ShellPlugin {
  // 读取配置
  constructor (options = { command: [] }) {
    this.options = options
  }
  apply (compiler) {
    compiler.plugin('after-emit', (compilation, callback) => {
      const { command } = this.options
      if (command.length) {
        for (const c of command) {
          this.parseCommands(c)
        }
      }
      callback()
    })
  }

  // TODO - 非 window 平台命令行暂未做兼容
  // 解析脚本: http://nodejs.cn/api/child_process.html#child_process_child_process_exec_command_options_callback
  parseCommands (command) {
    if (os.platform() === 'win32') {
      this.handleStdout(exec(command, this.handleError))
    }
  }

  // 处理输出
  handleStdout (cp) {
    cp.stdout.pipe(process.stdout)
    cp.stderr.pipe(process.stdout)
  }

  // 处理错误
  handleError (error, stdout, stderr) {
    if (error) throw error
  }
}

module.exports = ShellPlugin
