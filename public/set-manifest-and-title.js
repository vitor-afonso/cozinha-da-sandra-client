// import capitalizeAppName from '../src/utils/app.utils';

const manifestData = {
  name: 'My Online Food Store',
  short_name: 'Online Store',
  icons: [
    {
      src: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      src: '/android-chrome-256x256.png',
      sizes: '256x256',
      type: 'image/png',
    },
  ],
  theme_color: '#ffffff',
  background_color: '#816E94',
  display: 'standalone',
  description: 'Snacks para todos os gostos e ocasiões com opção de entrega e take-away.',
};

//Get app name and set it to the manifest name keys
const APP_NAME = 'A Cozinha da Sandra';
manifestData.name = APP_NAME;
manifestData.short_name = APP_NAME;

const manifestTag = document.createElement('link');
const titleTag = document.createElement('title');
titleTag.innerText = APP_NAME;

manifestTag.rel = 'manifest';
manifestTag.href = URL.createObjectURL(new Blob([JSON.stringify(manifestData)], { type: 'application/json' }));

console.log('manifest href =>', manifestTag.href);
document.head.appendChild(manifestTag);
document.head.appendChild(titleTag);
