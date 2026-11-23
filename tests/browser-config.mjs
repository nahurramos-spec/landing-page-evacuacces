import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";

export function launchBrowser() {
  const windowsChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
  const executablePath = process.env.CHROME_PATH ||
    (process.platform === "win32" && existsSync(windowsChrome) ? windowsChrome : undefined);
  return chromium.launch({ executablePath, headless: true });
}
