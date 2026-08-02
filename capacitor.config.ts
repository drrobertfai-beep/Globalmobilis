import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.globalmobilis.app',
  appName: 'Global Mobilis',
  webDir: 'dist/client',
  server: {
    url: 'https://globalmobilis.com',
    cleartext: false,
  },
};

export default config;
