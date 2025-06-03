/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OPENAI_API_KEY: string;
	// สามารถเพิ่ม environment variables อื่นๆ ที่ใช้ในโปรเจคได้ที่นี่
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
