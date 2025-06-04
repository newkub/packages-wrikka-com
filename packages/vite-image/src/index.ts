import type { PluginOption } from 'vite';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

interface ViteImageOptions {
  /**
   * Enable/disable the plugin
   * @default true
   */
  enabled?: boolean;
  
  /**
   * File patterns to include for processing
   * @default ['**\/*.{png,jpg,jpeg,gif,webp,svg,avif}']
   */
  include?: string | string[];
  
  /**
   * File patterns to exclude from processing
   * @default []
   */
  exclude?: string | string[];
  
  /**
   * Enable/disable image optimization
   * @default true
   */
  optimize?: boolean;
  
  /**
   * Quality level for image optimization (0-100)
   * @default 80
   */
  quality?: number;
}

export default function viteImage(userOptions: ViteImageOptions = {}): PluginOption {
  const options: Required<ViteImageOptions> = {
    enabled: true,
    include: ['**/*.{png,jpg,jpeg,gif,webp,svg,avif}'],
    exclude: [],
    optimize: true,
    quality: 80,
    ...userOptions,
  };

  if (!options.enabled) {
    return {
      name: 'vite-image',
      apply: 'build',
    };
  }

  return {
    name: 'vite-image',
    enforce: 'pre',
    
    configResolved(config) {
      if (config.command === 'serve') {
        console.log('Vite Image Plugin: Running in development mode');
      } else {
        console.log('Vite Image Plugin: Building for production');
      }
    },
    
    async load(_id) {
      // This is a placeholder for future optimization logic
      return null;
    },
    
    async transform(_, id) {
      // Handle image imports
      if (id.match(/\.(png|jpe?g|gif|webp|svg|avif)$/i)) {
        try {
          // Convert file URL to path if needed
          const filePath = id.startsWith('file://') ? fileURLToPath(id) : id;
          const fileName = filePath.split(/[\\/]/).pop() || 'image';
          const fileContent = await readFile(filePath);
          
          return {
            code: `export default import.meta.ROLLUP_FILE_URL_${this.emitFile({
              type: 'asset',
              name: fileName,
              source: fileContent,
            })}`,
            map: null,
          };
        } catch (error) {
          this.warn(`Failed to process image ${id}: ${error.message}`);
          return null;
        }
      }
      return null;
    },
  };
}

// Export the options type
export type { ViteImageOptions };
