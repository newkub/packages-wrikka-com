import { ref, type Ref } from 'vue';
import { execa } from 'execa';

// Export the interface directly
export interface GitStatusEntry {
  status: string;
  file: string;
}

// Export the hook function
export function useGitStatus() {
  const statusEntries: Ref<GitStatusEntry[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<Error | null> = ref(null);

  async function getStatus(cwd: string): Promise<GitStatusEntry[]> {
    loading.value = true;
    try {
      const { stdout } = await execa('git', ["status", "--porcelain"], { cwd });
      statusEntries.value = stdout
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const status = line.substring(0, 2);
          const file = line.substring(3);
          return { status, file };
        });
      return statusEntries.value;
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function isClean(cwd: string): Promise<boolean> {
    loading.value = true;
    try {
      const { stdout } = await execa('git', ["status", "--porcelain"], { cwd });
      return stdout.trim() === '';
    } catch (err) {
      error.value = err as Error;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return {
    status: statusEntries,
    loading,
    error,
    getStatus,
    isClean
  };
}

// Export default for backward compatibility
export default useGitStatus;