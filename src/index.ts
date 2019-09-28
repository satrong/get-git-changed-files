const { exec, execSync } = require('child_process');
const path = require('path');
const readline = require('readline');

class Git {
    gitRoot: string;

    constructor(gitRoot: string) {
        this.gitRoot = gitRoot;
    }

    /**
     * 根据commitid获取变动的文件
     * @param commitid commit id
     */
    async getCommits(commitid: string) {
        const stdout = await this.command(`cd ${this.gitRoot}`, `git diff-tree --no-commit-id --name-status --diff-filter=ACDMR -r ${commitid}`);
        const files = stdout.split(/\n/).map((el: string) => el.split(/\s+/));
        console.log(files)
    }

    command(...args: any): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(args.join(' && '), (error: Error, stdout: string) => {
                if (error) return reject(error);
                resolve(stdout.trim());
            });
        });
    }
}

// 不传commitid，则获取所有文件
// function getChangedFiles(gitPath: string, commitid: string) {
//     return new Promise((resolve, reject) => {
//         const cmd = commitid ? `cd ${gitPath} && git diff-tree --no-commit-id --name-status --diff-filter=ACDMR -r ${commitid}` : 'git ls-files';
//         exec(cmd, (error: Error, stdout: string) => {
//             if (error) return reject(error);
//             const files = stdout.trim().split(/\n/).map((el: string) => el.split(/\s+/));
//             resolve(files);
//         });
//     });
// }

// (async () => {
//     const gitPath = path.join(__dirname, '../appstore/appstore-api')
//     const files = await getChangedFiles(gitPath, 'e0e51616e320c1bf9f7706c336f682f7d7a1b06f');
//     console.log(files);
//     console.log(execSync(`cd ${gitPath} && git log --oneline`, { encoding: 'utf8' }));
// })();

new Git(path.join(__dirname, '../../appstore/appstore-api')).getCommits('e0e51616e320c1bf9f7706c336f682f7d7a1b06f');