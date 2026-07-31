// SPRINT 5.0 / FEATURE 002.1 & MVP: AI Configuration Screen & System Settings
// Clean architecture UI for configuring Google Gemini AI Foundation, Theme, Language, and About RepMind AI.
// Securely stores the API Key locally without external cloud calls yet.

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Key,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Globe,
  Palette,
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';
import { geminiProvider, AIModelConfig, AIConnectionTestResult, GeminiModelId } from '../../ai-core/providers';

interface AIConfigurationSectionProps {
  onClose?: () => void;
}

export const AIConfigurationSection: React.FC<AIConfigurationSectionProps> = ({ onClose }) => {
  const [config, setConfig] = useState<AIModelConfig>(() => geminiProvider.getConfig());
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => geminiProvider.getConfig().apiKey);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<AIConnectionTestResult | null>(null);
  const [isSavedToast, setIsSavedToast] = useState<boolean>(false);

  // Settings for MVP localization and theme readiness
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'clinical'>('light');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');

  useEffect(() => {
    // Sync initial state from provider
    const current = geminiProvider.getConfig();
    setConfig(current);
    setApiKeyInput(current.apiKey);
  }, []);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    geminiProvider.updateConfig({
      apiKey: apiKeyInput.trim(),
      model: config.model,
      temperature: config.temperature,
      maxOutputTokens: config.maxOutputTokens
    });
    setConfig(geminiProvider.getConfig());
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  const handleTestConnection = async () => {
    // Ensure input is synced to provider before testing
    geminiProvider.updateConfig({ apiKey: apiKeyInput.trim() });
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await geminiProvider.testConnection();
      setTestResult(result);
      setConfig(geminiProvider.getConfig());
    } catch (err) {
      console.error('Connection test failed:', err);
      setTestResult({
        connected: false,
        status: 'not_connected',
        message: 'Failed to execute foundation test. Please verify local configuration.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearApiKey = () => {
    geminiProvider.clearApiKey();
    setApiKeyInput('');
    setConfig(geminiProvider.getConfig());
    setTestResult(null);
  };

  const isConnected = geminiProvider.getStatus() === 'connected';

  return (
    <div className="space-y-6 text-left">
      {/* Toast confirmation */}
      {isSavedToast && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl text-xs font-extrabold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Gemini AI Configuration & Settings securely stored locally!</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded uppercase">MVP Ready</span>
        </div>
      )}

      {/* HEADER CARD */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-3xl p-6 shadow-xl border border-blue-400/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-blue-200 text-[10px] font-black uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-amber-300" />
              <span>Feature 002.1 • Gemini Integration Foundation</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>Google Gemini AI Configuration</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </h2>
            <p className="text-xs text-blue-100/90 leading-relaxed max-w-2xl">
              Prepare RepMind AI for intelligence extraction. API keys are encrypted and stored locally on your device. No cloud transmission occurs during foundation mode.
            </p>
          </div>

          {/* Connection Status Badge */}
          <div className="shrink-0 flex items-center gap-2">
            <div className={`px-4 py-2 rounded-2xl border font-black text-xs flex items-center gap-2 shadow-sm ${
              isConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              {isConnected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600" />
              )}
              <span>{isConnected ? 'Connected' : 'Not Connected'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* FORM: GEMINI API KEY & MODEL SETTINGS */}
      <form onSubmit={handleSaveConfig} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Gemini API Key & Model Parameters</span>
          </h3>

          {/* API Key Input Row */}
          <div className="space-y-1.5">
            <label htmlFor="gemini-api-key-input" className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
              <span>Google Gemini API Key</span>
              <span className="text-[11px] text-slate-400 font-semibold">Stored strictly in local storage</span>
            </label>
            <div className="relative">
              <input
                id="gemini-api-key-input"
                type={showApiKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy... (Enter your Google Gemini API Key)"
                className="w-full pl-3.5 pr-24 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/70"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  title={showApiKey ? 'Hide API Key' : 'Show API Key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="px-2 py-1 text-[10px] font-extrabold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Obtain a key from Google AI Studio. Your key never leaves this browser device.
            </p>
          </div>

          {/* Model Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="gemini-model-select" className="text-xs font-extrabold text-slate-800">
                AI Model Target
              </label>
              <select
                id="gemini-model-select"
                value={config.model}
                onChange={(e) => setConfig({ ...config, model: e.target.value as GeminiModelId })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (High Reasoning)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy Fast)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy Pro)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gemini-temp-slider" className="text-xs font-extrabold text-slate-800 flex items-center justify-between">
                <span>Temperature</span>
                <span className="font-black text-blue-600">{config.temperature}</span>
              </label>
              <input
                id="gemini-temp-slider"
                type="range"
                min="0.0"
                max="1.0"
                step="0.1"
                value={config.temperature}
                onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>Precise (0.0)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="gemini-tokens-select" className="text-xs font-extrabold text-slate-800">
                Max Output Tokens
              </label>
              <select
                id="gemini-tokens-select"
                value={config.maxOutputTokens}
                onChange={(e) => setConfig({ ...config, maxOutputTokens: parseInt(e.target.value, 10) })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1024">1024 Tokens (Fast Briefs)</option>
                <option value="2048">2048 Tokens (Standard)</option>
                <option value="4096">4096 Tokens (Extended Summary)</option>
                <option value="8192">8192 Tokens (Max Document Analysis)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons & Test Connection */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-2 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing Connection...' : 'Test Connection'}</span>
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save AI Configuration</span>
          </button>
        </div>

        {/* Test Result Display Box */}
        {testResult && (
          <div className={`p-4 rounded-2xl border text-xs space-y-1 ${
            testResult.connected
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center justify-between font-extrabold">
              <span className="flex items-center gap-1.5">
                {testResult.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span>{testResult.connected ? 'Connection Verified' : 'Connection Incomplete'}</span>
              </span>
              {testResult.latencyMs && (
                <span className="text-[10px] font-bold opacity-80">
                  Latency: {testResult.latencyMs} ms
                </span>
              )}
            </div>
            <p className="text-xs font-semibold leading-relaxed">{testResult.message}</p>
            {testResult.timestamp && (
              <p className="text-[10px] text-slate-500 pt-0.5">
                Tested at {testResult.timestamp} • Model: {testResult.modelTested}
              </p>
            )}
          </div>
        )}
      </form>

      {/* SECTION: MVP THEME & LANGUAGE LOCALIZATION SETTINGS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-blue-600" />
          <span>UI Appearance & Language Localization (MVP)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>Theme Preference</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['light', 'dark', 'clinical'] as const).map((thm) => (
                <button
                  key={thm}
                  type="button"
                  onClick={() => setSelectedTheme(thm)}
                  className={`py-2 rounded-xl text-xs font-extrabold capitalize border transition-all ${
                    selectedTheme === thm
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {thm === 'clinical' ? 'Clinical Light' : thm}
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800">
              Language (Localization Ready)
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en-US">English (US) - Default</option>
              <option value="en-UK">English (UK)</option>
              <option value="es-ES">Español (España & LATAM)</option>
              <option value="fr-FR">Français (France & Canada)</option>
              <option value="de-DE">Deutsch (Germany & Swiss)</option>
              <option value="ar-SA">العربية (Arabic Healthcare)</option>
              <option value="ja-JP">日本語 (Japanese Pharma)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION: ABOUT REPMIND AI v1.0 MVP */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-blue-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center font-black text-white shadow-md">
              RM
            </div>
            <div>
              <h3 className="text-base font-black text-white">RepMind AI v1.0 MVP</h3>
              <p className="text-xs font-extrabold text-blue-300">Be Ready Before You Go</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">
            Stable MVP Build
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          RepMind AI is the intelligent field execution platform designed for biopharmaceutical and medical sales representatives. Utilizing offline-first local storage and modular AI coaching, RepMind AI empowers representatives to prepare scientific arguments, handle clinical objections, and execute high-impact physician detailing visits with complete confidence.
        </p>

        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
          <span>Architecture: React 19 • TypeScript • Tailwind CSS • LocalStorage Engine</span>
          <span>© 2026 RepMind AI • All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
};
