# Rapid app development

**We are going to use:**

- [create-react-app](https://github.com/facebook/create-react-app) as a scaffold
- [lodash](https://lodash.com/docs/4.17.15) & [react-use](https://github.com/streamich/react-use) utility libraries
- [react-router](https://reacttraining.com/react-router/web/guides/quick-start) for routing
- [firebase](https://firebase.google.com/) & [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks) for data
- [react-hook-form](https://react-hook-form.com/api/) for forms
- [chakra-ui](https://chakra-ui.com/getting-started) & [emotion](https://emotion.sh/docs/emotion) for styling
- [react-fontawesome](https://fontawesome.com/how-to-use/on-the-web/using-with/react) for icons
- [vercel](https://vercel.com/) [cli](https://vercel.com/docs/v2/platform/deployments#vercel-cli) for deployment & hosting

## Setup

1. Create accounts in [Firebase](https://firebase.google.com/) and [Vercel](https://vercel.com/) if you haven't already done so.

1. Create a new project in the [Firebase console](https://console.firebase.google.com/).
   - Enable *Google Sign-in* under *Authentication*.
   - Enable *Firestore* in *test mode*.
      > *Tip: Test mode will open your database up to the public, which is great for rapid development. You will want to add rules before you launch.*

1. [Create a repository in Github](https://github.com/new) and check it out.

1. In terminal, from your project folder, initialize a new React app deployment in Vercel, and install our dependencies:
   ```
   $ npx now init create-react-app .
   $ yarn add @chakra-ui/core @emotion/core @emotion/styled @fortawesome/fontawesome-svg-core @fortawesome/pro-light-svg-icons @fortawesome/react-fontawesome emotion-theming firebase lodash now react-firebase-hooks react-hook-form react-router-dom react-use
   ```

1. In `package.json`, add handy deployment scripts:
   ```json
   "deploy": "now",
   "deploy:prod": "now --prod"
   ```
   
1. In terminal, start the local dev server:
   ```
   $ yarn dev
   ```

## Build

1. Copy the `src` folder into your project.
1. Duplicate the `firebaseConfig.template.js`, rename to `firebaseConfig.js`, and populate with values from your Firebase project. 

## Deploy
   
In terminal, deploy to production:
   ```
   $ yarn deploy:prod
   ```
