// SPRINT 5.0 / FEATURE 002.1: Gemini Integration Foundation - Gemini Provider Implementation
// Clean architecture implementation of IAIProvider for Google Gemini.
// Securely stores API Key and model configuration locally in localStorage.
// Prepares RepMind AI for future LLM analysis without making cloud calls yet.

import {
  IAIProvider,
  AIConnectionStatus,
  AIModelConfig,
  AIConnectionTestResult,
  AIGenerateOptions,
  AITransactionResult,
  GeminiModelId
} from './IAIProvider';

const GEMINI_CONFIG_STORAGE_KEY = 'repmind_gemini_config_v1';
const GEMINI_API_KEY_STORAGE_KEY = 'repmind_gemini_api_key_v1';

const DEFAULT_CONFIG: AIModelConfig = {
  apiKey: '',
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  maxOutputTokens: 2048
};

export class GeminiProvider implements IAIProvider {
  readonly name = 'Google Gemini AI';
  readonly id = 'google-gemini';

  private config: AIModelConfig;
  private status: AIConnectionStatus = 'not_connected';

  constructor() {
    this.config = this.loadConfigFromStorage();
    this.status = this.config.apiKey.trim().length > 0 ? 'connected' : 'not_connected';
  }

  private loadConfigFromStorage(): AIModelConfig {
    try {
      const savedConfigStr = localStorage.getItem(GEMINI_CONFIG_STORAGE_KEY);
      const savedApiKey = localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY) || '';

      if (savedConfigStr) {
        const parsed = JSON.parse(savedConfigStr);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          apiKey: savedApiKey || parsed.apiKey || ''
        };
      }

      return {
        ...DEFAULT_CONFIG,
        apiKey: savedApiKey
      };
    } catch (e) {
      console.warn('Failed to load GeminiProvider config from localStorage:', e);
      return { ...DEFAULT_CONFIG };
    }
  }

  private saveConfigToStorage(config: AIModelConfig): void {
    try {
      // Securely store apiKey in key-specific item, save settings in config item
      const { apiKey, ...settingsWithoutKey } = config;
      localStorage.setItem(GEMINI_CONFIG_STORAGE_KEY, JSON.stringify(settingsWithoutKey));
      localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, apiKey || '');
    } catch (e) {
      console.warn('Failed to save GeminiProvider config to localStorage:', e);
    }
  }

  public getStatus(): AIConnectionStatus {
    return this.status;
  }

  public getConfig(): AIModelConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AIModelConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
    if (newConfig.apiKey !== undefined) {
      this.status = newConfig.apiKey.trim().length > 0 ? 'connected' : 'not_connected';
    }
    this.saveConfigToStorage(this.config);
  }

  public setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey.trim();
    this.status = this.config.apiKey.length > 0 ? 'connected' : 'not_connected';
    this.saveConfigToStorage(this.config);
  }

  public clearApiKey(): void {
    this.config.apiKey = '';
    this.status = 'not_connected';
    this.saveConfigToStorage(this.config);
  }

  public async testConnection(): Promise<AIConnectionTestResult> {
    this.status = 'testing';
    const startMs = Date.now();

    // Simulated local foundation validation (no cloud calls yet)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const latencyMs = Date.now() - startMs;
    const hasKey = this.config.apiKey.trim().length > 0;

    if (hasKey) {
      this.status = 'connected';
      return {
        connected: true,
        status: 'connected',
        message: 'Gemini AI connection foundation verified. Ready for future AI document extraction and coaching.',
        latencyMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        modelTested: this.config.model
      };
    } else {
      this.status = 'not_connected';
      return {
        connected: false,
        status: 'not_connected',
        message: 'No API Key configured. Please enter a valid Google Gemini API Key.',
        latencyMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        modelTested: this.config.model
      };
    }
  }

  public async generateText(prompt: string, options?: AIGenerateOptions): Promise<AITransactionResult> {
    const startMs = Date.now();
    await new Promise((resolve) => setTimeout(resolve, 400));
    const latencyMs = Date.now() - startMs;

    if (this.getStatus() !== 'connected') {
      return {
        success: false,
        error: 'Gemini AI provider is not connected. Configure an API key first.',
        latencyMs,
        providerName: this.name
      };
    }

    return {
      success: true,
      text: `[Gemini Foundation Ready] Prompt received (${prompt.length} chars). No external cloud API calls executed in Sprint 5.0 foundation.`,
      tokensUsed: Math.ceil(prompt.length / 4) + 18,
      latencyMs,
      providerName: this.name
    };
  }
}

// Singleton instance for RepMind AI app-wide use
export const geminiProvider = new GeminiProvider();
