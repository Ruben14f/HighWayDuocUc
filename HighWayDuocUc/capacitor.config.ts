import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.duocuc.highway',
  appName: 'HighWayDuocUc',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    webContentsDebuggingEnabled: true
  }
};

export default config;
