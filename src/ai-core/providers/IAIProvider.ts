// SPRINT 5.0 / FEATURE 002.1: Gemini Integration Foundation - Provider Interfaces
// Clean architecture contracts for AI Providers.
// Prepares RepMind AI for future real AI/LLM integration without cloud or real API requests yet.

export type AIConnectionStatus = 'connected' | 'not_connected' | 'testing';

export type GeminiModelId =
  | 'gemini-2.5-flash'
  | 'gemini-2.5-pro'
  | 'gemini-1.5-flash'
  | 'gemini-1.5-pro'
  | string;

export interface AIModelConfig {
  apiKey: string;
  model: GeminiModelId;
  temperature: number;
  maxOutputTokens: number;
}

export interface AIGenerateOptions {
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
}

export interface AITransactionResult {
  success: boolean;
  text?: string;
  error?: string;
  tokensUsed?: number;
  latencyMs?: number;
  providerName: string;
}

export interface AIConnectionTestResult {
  connected: boolean;
  status: AIConnectionStatus;
  message: string;
  latencyMs?: number;
  timestamp?: string;
  modelTested?: string;
}

export interface IAIProvider {
  /** Provider display name */
  readonly name: string;
  /** Unique provider identifier */
  readonly id: string;

  /** Get current connection status */
  getStatus(): AIConnectionStatus;

  /** Test the connection foundation with current configuration */
  testConnection(): Promise<AIConnectionTestResult>;

  /** Get current provider configuration */
  getConfig(): AIModelConfig;

  /** Update provider configuration and persist locally */
  updateConfig(newConfig: Partial<AIModelConfig>): void;

  /** Securely store or update the API Key in local storage */
  setApiKey(apiKey: string): void;

  /** Clear stored API Key from local storage */
  clearApiKey(): void;

  /**
   * Reusable generation interface contract for future sprints.
   * Currently returns offline foundation ready response without cloud calls.
   */
  generateText(prompt: string, options?: AIGenerateOptions): Promise<AITransactionResult>;
}
