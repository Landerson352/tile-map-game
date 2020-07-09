# Rapid app development

**We are going to use:**

- [github](https://github.com/new)* for code repository
- [create-react-app](https://github.com/facebook/create-react-app) as a scaffold
- [lodash](https://lodash.com/docs/4.17.15) & [react-use](https://github.com/streamich/react-use) utility libraries
- [react-router](https://reacttraining.com/react-router/web/guides/quick-start) for routing
- [firebase](https://firebase.google.com/)* & [react-firebase-hooks](https://github.com/CSFrequency/react-firebase-hooks) for data
- [react-hook-form](https://react-hook-form.com/api/) for forms
- [chakra-ui](https://chakra-ui.com/getting-started) & [emotion](https://emotion.sh/docs/emotion) for styling
- [react-fontawesome](https://fontawesome.com/how-to-use/on-the-web/using-with/react) for icons
- [vercel](https://vercel.com/)* [cli](https://vercel.com/docs/v2/platform/deployments#vercel-cli) for deployment & hosting

  > *Sign-up will be required for some services, if you don't already have an account. 

## Setup

1. [Create a project repository in Github](https://github.com/new) and check it out.

1. [Import your repository in Vercel](https://vercel.com/import/git)
   > Your code commits will auto-deploy to `staging`, and you can promote them to `production`.

1. Open a terminal in your project folder, initialize a new React app deployment in Vercel, and install our dependencies:
   ```
   $ npx create-react-app --template @landerson/cra-template-rad
   ```
   
1. Create a new project in the [Firebase console](https://console.firebase.google.com/).
   - Enable *Google Sign-in* under *Authentication*.
   - Enable *Firestore* in *test mode*. **(Turn this off eventually.)**

1. Duplicate the `firebaseConfig.template.js`, rename to `firebaseConfig.js`, and populate with values from your Firebase project.
   
1. In terminal, start the local dev server:
   ```
   $ yarn dev
   ``` 
