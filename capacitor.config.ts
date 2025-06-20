
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.5fbbf5e1201940169c97e90762c03298',
  appName: 'kabul-scout-hub',
  webDir: 'dist',
  server: {
    url: 'https://5fbbf5e1-2019-4016-9c97-e90762c03298.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16a34a',
      showSpinner: false
    }
  }
};

export default config;
