# Table of contents <a id="top"></a>

- [Introduction](#introduction)
- [Running the CLI](#runningCli)
- [Available scripts](#scriptsAvailable)
- [Settings](#settings)
- [Data sharing between micro-frontends(MFEs) and shell app](#dataSharing)
- [Useful features](#usefulFeatures)
- [Todos](#todos)

<a id="introduction"></a>
# Create MFA App

Bootstrap your micro front-end (MFE) using the starter App. The starter app comes bundle with shared component micro front-end and sample navigation.

The starter app is un-opinionated and is bare minimum scaffold to run an application using module federation approach.

It will create and initialize your micro front-end starter app in the specified folders, ready to user and available for further customization.

There are two main option on the CLI, which let the software about the type of application you want to create.

```
> Bootstrap MFE platform. Includes 
    1. Shell App 
    2. Shared components app 
    3. MFE app

> Add new MFE to platform
```

#### Bootstrap MFE platform
This option will create three separate apps, as listed above and integrates with the shell app. This option is used to create a new project.

#### Add new MFE to platform
This option will scaffold a new micro front-end app that can be added to already existing shell generated in previous step.

> [Go to top](#top)

<a id="runningCli"></a>

## Running the CLI (Command line interface)
```
> npx create-mfa-app
```

Running the command will create three directories (shell-container, shared-components, micro-frontend-app) inside the `workspace` folder (names would be based on your entered inputs). Inside these directories, it will generate the initial project structure and install the transitive dependencies.

```

micro-frontend-app
|-- node_modules
|-- public
  |-- index.html
|-- src
  |-- components
      |-- Header.jsx
      |-- header.scss
  |-- const
      |-- routes.jsx
  |-- core
      |-- App.jsx
      |-- AppRoutes.jsx
      |-- bootstrap.jsx
      |-- index.scss
      |-- setupApp.jsx
  |-- pages
      |-- home
          |-- index.jsx
  |-- appRoutesComponentConfig.js
  |-- exposedComponentsList.js
  |-- index.js
|-- .babelrc
|-- .browserlistrc
|-- .eslintrc.js
|-- .gitignore
|-- package-lock.json
|-- package.json
|-- webpack.config.js

```

No configuration or complicated folder structure, only the files you need to build your app. Once the installation is done, you can open your project folders.

```
> cd workspace/micro-frontend-app
```

> [Go to top](#top)

<a id="scriptsAvailable"></a>

## Available scripts

Inside the newly created project, you can run some built-in commands:

### `npm start` or `yarn start`

Runs the app in development mode
- Shell container: http://localhost:6001
- Micro front-end app: http://localhost:6003

### `npm lint` or `yarn lint`

Run the eslinting to static type checking

### `npm build` or `yarn build`

Builds the app for production to the build folder. It bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes which ensures files are not cached.

> [Go to top](#top)

<a id="scriptsAvailable"></a>

## Settings

Consider updating the following configuration based on your application requirements.

**1)Free Port**
A free port is required to run the newly added micro front-end. You can specify this while adding a new micro front-end app through the command line interface (CLI). In case you want to change the port, you can configure the new port by specifying in the package.json file of the respective micro front-end app.

**2)Application routes**
`{micro front-end app}/src/const/routes.jsx` is the configuration file to share micro front-end app routes with the shell to register them as platoform routes.

***Adding a new route***
Add a new entry to `defaultRoutes` array in `{micro front-end app}/src/const/routes.jsx`  like below:
```
{ path: "payments/about", element: <About /> },
```

**2)Config service**
The shell-container app makes an XHR call to fetch information about micro front-end apps to register, such as remoteName and the URL.

Adding/Removing micro front-end can be done through the config service. This doesn't require shell-container or any micro front-end app re-deployment.

You can refer sample config service response in `{shell-container}/public/config.json`.

To showcase the file is served through the public folder of the shell-container app. You can create a separate endpoint API for the same and update the url in line no. 12 of `{shell-container}/src/core/setupApp.jsx` file.

> [Go to top](#top)

<a id="dataSharing"></a>

## Data sharing

The scaffold app use React Context API to share data between micro front-end and shell-container apps.

The context is common and craete in the shared component MFE. You can refere `{shared-component}/src/components/contextProvider.js`

Any new context data can be added and shared throughout the platform by adding into the shared component file.

> [Go to top](#top)

<a id="usefulFeatures"></a>

## Useful features
**Less to research**
The bootstrap CLI will come bundled with powers to get you started on the day 1

**Using opensource, no lock in**
Under the hood, we use Webpack, Babel, ESlint, and other amazing projects to power your app. This will help you to extend and customized the configuration based on your project needs.

**Shared component micro-frontend**
The scaffold is bundled with a shared component micro-frontend (MFE). The shared component MFE allows you to consume reusable components across different micro front-end from a single source. So, when you need to update a component, you would only require to update and deploy shared components micro front-end. Other micro front-end would always ensured to get the latest version unlike consuming as node package.

**Data sharing**
Common mechanism to share data between micro front-ends and shell container app.

**Testing Support**
ESLint pre-configure with the generated templates.

# Contact me
I would love to get your feedback. Small or big any feedback is welcome. Please drop a not to me on my email id: rahul.smile@gmail.com

### Thank you 
- Rahul Ranjan