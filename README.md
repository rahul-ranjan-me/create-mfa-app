# Table of contents <a id="top"></a>

- [Introduction](#introduction)
- [Running the CLI](#runningCli)
- [Available scripts](#scriptsAvailable)
- [Settings](#settings)
- [Data sharing between micro-frontends(MFEs) and shell app](#dataSharing)
- [Exposing widgets components](#widgetComponents)
- [Useful features](#usefulFeatures)

<a id="introduction"></a>
# Create MFA App

Bootstrap your micro front-end (MFE) using the starter App. The starter app comes with a shared micro-front end and an example of navigation.

The starter app is not opinionated and is the minimum scaffolding to run an application using the Webpack module federation approach.

It will create and initialize your micro front-end startup application into the specified folders, user-ready and available for further customization.

There are two main options on the CLI, which let the software about the type of application you want to create.

```
> Bootstrap MFE platform. Includes 
    1. Shell App 
    2. Shared components app 
    3. MFE app

> Add new MFE to platform
```

#### Bootstrap MFE platform
This option will create three separate applications, as described above, and integrate them into the shell application. It can be used during the creation of a new project.

#### Add new MFE to the platform
This option will build a new micro-front-end application that can be added to a shell already generated in the previous step.

#### Template source repos:
- Shell container: [git@github.com:rahul-ranjan-me/mfe-shell-app.git](https://github.com/rahul-ranjan-me/mfe-shell-app)
- Shared components: [git@github.com:rahul-ranjan-me/mfe-shared-components.git](https://github.com/rahul-ranjan-me/mfe-shared-components)
- Micro front-end application: [git@github.com:rahul-ranjan-me/mfe-app.git](https://github.com/rahul-ranjan-me/mfe-app)

> [Go to top](#top)

<a id="runningCli"></a>

## Running the CLI (Command line interface)
```
> npx create-mfa-app
```

Executing the command will create three directories (shell-container, shared-components, micro-frontend-app) in the 'workspace' folder (the names would be based on your entries). It will generate the initial project structure and install the transitive dependencies within those directories.

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

No complicated configuration or folder structure, only the files you need to construct your application. Once the installation is complete, you may open your project files.

```
> cd workspace/micro-frontend-app
```

> [Go to top](#top)

<a id="scriptsAvailable"></a>

## Available scripts

Within the newly created project, you can execute a few embedded commands:

### `npm start` or `yarn start`

Runs the app in development mode
- Shell container: http://localhost:6001
- Micro front-end app: http://localhost:6003

### `npm lint` or `yarn lint`

Run the eslinting to static type checking

### `npm build` or `yarn build`

Build the application for production into the 'dist' folder. It bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include the hashes which ensure files are not cached.

> [Go to top](#top)

<a id="scriptsAvailable"></a>

## Settings

Consider updating the following configuration in accordance with your application requirements.

**1) Free Port**

A free port is necessary to execute the newly added micro front-end. You can specify this when adding a new microfront-end application through the Command Line Interface (CLI). In the event that you want to modify the port, you can configure the new port by specifying in the package.json file of the respective micro-front-end application.

**2) Application routes**

`{micro front-end app}/src/const/routes.jsx` is the configuration file for sharing micro front-end application routes with the shell to register them as platform routes.

***Adding a new route***

Add a new entry to `defaultRoutes` array in `{micro front-end app}/src/const/routes.jsx` like below:
```
{ path: "payments/about", element: <About /> },
```

**3) Config service**

The shell-container application makes an XHR call to retrieve information on the micro-front-end applications to be recorded, such as remoteName and the URL.

Micro front-end addition/deletion can be done through the configuration service. This doesn't require shell container or any micro front-end app re-deployment.

You can refer sample configuration service response in `{shell-container}/public/config.json`.

To display the file is served via the public folder of the shell-container application. You can create a separate endpoint API for the same and update the URL in line no. 12 of `{shell-container}/src/core/setupApp.jsx` file.

> [Go to top](#top)

<a id="dataSharing"></a>

## Data sharing

The Scaffold application uses the React Context API to share data across micro front-end and shell-container applications.

The context is common and is created through the shared component of the micro front-end. You can refer `{shared-component}/src/components/contextProvider.js`

Any new data can be added to the context and shared across the platform by adding in the shared component global context file.

> [Go to top](#top)

<a id="widgetComponents"></a>

## Exposing widgets components

Sometimes, instead of exposing the whole app as a micro front-end, you also want to expose a particular widget/component that can be built and exposed by one micro front-end app and re-used by other micro front-ends easily.

### Exposing a widget as module federated component
Create your component as a typical React component. In order to expose this component, we just need to add this component information in two files on the respective micro front-end application.

1) `{micro front-end app}/src/appRoutesComponentConfig.js` 

    Add an entry just like ` "./header": "./src/components/Header",` component to `allComponents` object is added on the line no. 4

2) `{micro front-end app}/src/exposedComponentsList.js`

    Add an entry just like `'./header'` to `componentsArray` on the line no. 1

### Consuming the component
Now that we have exposed a component from our micro front-end app, we want to consume the same in other micro front-end apps.

In order to consume a module federated widget, we have created a special component `MFAComponentLoader` that you can export from the shared component micro front-end like below.


```
import { MFAComponentLoader } from "shared/Components";
```

and consume the exposed component anywhere in your application by calling the component below

```
 <MFAComponentLoader componentName="./header" />
```

An example of the same is created for you and placed under `{shell-container app}/src/pages/Home.jsx`


> [Go to top](#top)

<a id="usefulFeatures"></a>

## Useful features
**Less to research**

The Create-mfa-app CLI will come with abilities to help you start on day 1.

**Using opensource, no lock in**

Under the hood, we use Webpack, Babel, ESlint, and other amazing projects to fuel your application. This will allow you to expand and customize the setup according to your project needs.

**Shared component micro-frontend**

The scaffolding is delivered with a micro front-end shared component (MFE). The MFE shared component lets you consume reusable components from a single source through different micro front-ends. So when you need to update a component, all you need to do is update and deploy shared micro-front-end components. Other micro front-end would always be guaranteed to get the latest version in contrast to consuming as a node package.

**Data sharing**

Common mechanisms to share data between micro front-ends and shell container app.

**Testing Support**

ESLint pre-configured with the generated application.

## ToDos
- Add Jest, Cypress, ESLint as an option while configuring the project
- Consuming shared components URL in apps through the configuration service

# Credit
Zack Jackson and the team for coming up with Webpack 5 module federation solution.

# Contact me

I would love to get your feedback. Small or big any feedback is welcome. Please drop me a note to me on my email id: rahul.smile@gmail.com

### Thank you 

- Rahul Ranjan