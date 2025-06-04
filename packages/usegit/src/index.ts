// Re-export all types and hooks
export * from './useGit';

// Core hooks
export * from './core/useBranch';
export * from './core/useCommit';
export * from './core/useDiff';
export * from './core/useHooks';
export * from './core/useLog';
export * from './core/useMerge';
export * from './core/useRemote';
export * from './core/useStatus';  // This will export both useGitStatus and GitStatusEntry
export * from './core/useStage';
export * from './core/useStash';
export * from './core/useTag';
export * from './core/useWorktree';

// Export types for easier access
export type { GitCommandResult, UseGitReturn } from './useGit';
export type { GitStatusEntry } from './core/useStatus';
