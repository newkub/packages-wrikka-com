import { execa } from 'execa';

// Export interfaces directly
export interface GitCommandResult {
  stdout: string
  stderr: string
  exitCode: number
}

export interface UseGitReturn {
  execute: (args: string[]) => Promise<GitCommandResult>
  isGitRepo: () => Promise<boolean>
}

// Export the hook function
export function useGit(cwd: string): UseGitReturn {
  const execute = async (args: string[]): Promise<GitCommandResult> => {
    const result = await execa('git', args, { 
      stdio: 'pipe', 
      cwd, 
      reject: false 
    })

    const exitCode = result.exitCode ?? 0

    if (exitCode !== 0) {
      throw new Error(`Git command failed: ${result.stderr}`)
    }

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode
    }
  }

  const isGitRepo = async (): Promise<boolean> => {
    const { exitCode } = await execute(['rev-parse', '--is-inside-work-tree'])
    return exitCode === 0
  }

  return {
    execute,
    isGitRepo
  };
}

// Export default
export default useGit;
