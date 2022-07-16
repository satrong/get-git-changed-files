import { spawn } from 'child_process'

export async function bash (command: string, args: string[] = [], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ls = spawn(command, args, { cwd });
    let msg = ''
    let err = ''

    ls.stdout.on('data', data => {
      msg += data
    })

    ls.stderr.on('data', data => {
      err += data
    })

    ls.on('close', (code) => {
      if (code === 0) {
        resolve(msg);
      } else {
        reject(new Error(err));
      }
    });
  });
}
