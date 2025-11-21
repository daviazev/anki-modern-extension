# AnkiModern Extension

A beautiful, modern dark theme for AnkiWeb with customizable color schemes and sync capabilities.

## 🎯 Current Status: MVP Mode

**Authentication:** Mock (localStorage)  
**Storage:** chrome.storage.sync  
**Firebase:** Ready but not active (will be enabled post-MVP)

📖 See [MVP_SUMMARY.md](./MVP_SUMMARY.md) for complete information about MVP mode.

## 🚀 Quick Start

### Development

First, run the development server:

```bash
pnpm dev
# or
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit Plasmo Documentation](https://docs.plasmo.com/)

### Testing

1. Build the extension: `pnpm build`
2. Load `build/chrome-mv3-prod` in Chrome
3. Click "Sign in with Google" (mock login)
4. Navigate to ankiweb.net to see themes

📖 Full testing guide: [MVP_TESTING_GUIDE.md](./MVP_TESTING_GUIDE.md)

## 📦 Production Build

Run the following:

```bash
pnpm build
# or
npm run build
```

This creates a production bundle in `build/chrome-mv3-prod`.

## 📚 Documentation

- **[MVP_SUMMARY.md](./MVP_SUMMARY.md)** - Overview of MVP mode and changes
- **[MVP_TESTING_GUIDE.md](./MVP_TESTING_GUIDE.md)** - How to test the extension
- **[FIREBASE_MIGRATION_PLAN.md](./FIREBASE_MIGRATION_PLAN.md)** - Future Firebase migration plan
- **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - OAuth setup (for future use)
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

## 🏗️ Architecture

### MVP Mode (Current)
- **Auth:** Mock login (localStorage)
- **Storage:** chrome.storage.sync
- **Sync:** Local only

### Production Mode (Future)
- **Auth:** Firebase Auth + Google OAuth
- **Storage:** Firestore
- **Sync:** Cloud + Multi-device

## 🔄 Migration to Firebase

When MVP is complete and tested:

1. Publish extension to Chrome Web Store (get permanent Extension ID)
2. Configure OAuth in Google Cloud Console
3. Follow [FIREBASE_MIGRATION_PLAN.md](./FIREBASE_MIGRATION_PLAN.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Test thoroughly
4. Submit a pull request

## 📝 License

[Add your license here]

## 🙏 Acknowledgments

Built with [Plasmo Framework](https://docs.plasmo.com/)
