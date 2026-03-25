"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "venn_api_key";

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setApiKeyState(stored);
    } catch (e) {
      console.warn("Could not read API key from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveApiKey = useCallback((key: string) => {
    try {
      const trimmed = key.trim();
      if (trimmed) {
        window.localStorage.setItem(STORAGE_KEY, trimmed);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
      setApiKeyState(trimmed);
    } catch (e) {
      console.warn("Could not save API key to localStorage:", e);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setApiKeyState("");
    } catch (e) {
      console.warn("Could not clear API key:", e);
    }
  }, []);

  const hasKey = isLoaded && apiKey.length > 0;

  // Mask key for display: show first 8 + last 4 chars
  const maskedKey =
    apiKey.length > 12
      ? `${apiKey.slice(0, 8)}${"•".repeat(Math.min(apiKey.length - 12, 20))}${apiKey.slice(-4)}`
      : apiKey
      ? "•".repeat(apiKey.length)
      : "";

  return { apiKey, maskedKey, hasKey, isLoaded, saveApiKey, clearApiKey };
}
