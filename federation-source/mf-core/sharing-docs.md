Federation Runtime#
TIP
Before reading this section, it is assumed that you have already understood:

The features and capabilities of Module Federation
The glossary of terms for Module Federation
How to consume and expose modules
Federation Runtime is one of the main features of the new version of Module Federation. It supports registering shared dependencies at runtime, dynamically registering and loading remote modules. To understand the design principles of Runtime, you can refer to: Why Runtime.

Install Dependencies#
npm add @module-federation/enhanced --save


API#
// You can use the runtime to load modules without depending on the build plugin
// When not using the build plugin, shared dependencies cannot be automatically configured
import { init, loadRemote } from '@module-federation/enhanced/runtime';

init({
  name: '@demo/app-main',
  remotes: [
    {
      name: "@demo/app1",
      // mf-manifest.json is a file type generated in the new version of Module Federation build tools, providing richer functionality compared to remoteEntry
      // Preloading depends on the use of the mf-manifest.json file type
      entry: "http://localhost:3005/mf-manifest.json",
      alias: "app1"
    },
    {
      name: "@demo/app2",
      entry: "http://localhost:3006/remoteEntry.js",
      alias: "app2"
    },
{
      name: "@demo/app4",
      entry: "http://localhost:3006/remoteEntry.mjs",
      alias: "app2",
      type: 'module' // tell federation its a certain format, like ESM module
    },
  ],
});

// Load using alias
loadRemote<{add: (...args: Array<number>)=> number }>("app2/util").then((md)=>{
  md.add(1,2,3);
});


init#
Type: init(options: InitOptions): void
Create a runtime instance, which can be called repeatedly, but only one instance exists. If you want to dynamically register remotes or plugins, use registerPlugins or registerRemotes
InitOptions:
type InitOptions = {
  // The name of the current consumer
  name: string;
  // The list of remote modules to depend on
  // When using the version content, it needs to be used with snapshot, which is still under construction
  remotes: Array<Remote>;
  // The list of dependencies that the current consumer needs to share
  // When using the build plugin, users can configure the dependencies to be shared in the build plugin, and the build plugin will inject the shared dependencies into the runtime sharing configuration
  // Shared must be manually passed in the version instance when passed at runtime because it cannot be directly passed at runtime.
  shared?: {
    [pkgName: string]: ShareArgs | ShareArgs[];
  };
  // Sharing strategy, which strategy will be used to decide whether to reuse the dependency
  shareStrategy?: 'version-first' | 'loaded-first';
};

type ShareArgs =
  | (SharedBaseArgs & { get: SharedGetter })
  | (SharedBaseArgs & { lib: () => Module });

type SharedBaseArgs = {
  version?: string;
  shareConfig?: SharedConfig;
  scope?: string | Array<string>;
  deps?: Array<string>;
  loaded?: boolean;
};

type SharedGetter = (() => () => Module) | (() => Promise<() => Module>);

type Remote = (RemotesWithEntry | RemotesWithVersion) & RemoteInfoCommon;

interface RemotesWithVersion {
  name: string;
  version: string;
};

interface RemotesWithEntry {
  name: string;
  entry: string;
};

interface RemoteInfoCommon {
  alias?: string;
  shareScope?: string;
  type?: RemoteEntryType;
  entryGlobalName?: string;
}

type RemoteEntryType =|'var'|'module'|'assign'|'assign-properties'|'this'|'window'|'self'|'global'|'commonjs'|'commonjs2'|'commonjs-module'| 'commonjs-static'|'amd'|'amd-require'|'umd'|'umd2'|'jsonp'|'system'| string;


loadRemote#
Type: loadRemote(id: string)

Used to load initialized remote modules. When used with the build plugin, it can be directly loaded through the native import("remote name/expose") syntax, and the build plugin will automatically convert it to loadRemote("remote name/expose") usage.

Example

import { init, loadRemote } from '@module-federation/enhanced/runtime';

init({
  name: '@demo/main-app',
  remotes: [
    {
      name: '@demo/app2',
      alias: 'app2',
      entry: 'http://localhost:3006/remoteEntry.js',
    },
  ],
});

// remoteName + expose
loadRemote('@demo/app2/util').then((m) => m.add(1, 2, 3));

// alias + expose
loadRemote('app2/util').then((m) => m.add(1, 2, 3));


loadShare#
Type: loadShare(pkgName: string, extraOptions?: { customShareInfo?: Partial<Shared>;resolver?: (sharedOptions: ShareInfos[string]) => Shared;})
Obtains the share dependency. When a "shared" dependency matching the current consumer exists in the global environment, the existing and eligible dependency will be reused first. Otherwise, it loads its own dependency and stores it in the global cache.
This API is usually not called directly by users but is used by the build plugin to convert its own dependencies.
type ShareInfos = {
  // The name of the dependency, basic information about the dependency, and sharing strategy
  [pkgName: string]: Shared[];
};

type Shared = {
  // The version of the shared dependency
  version: string;
  // Which modules are currently consuming this dependency
  useIn: Array<string>;
  // From which module does the shared dependency come?
  from: string;
  // Factory function to get the shared dependency instance. When no other existing dependencies, it will load its own shared dependencies.
  lib?: () => Module;
  // Sharing strategy, which strategy will be used to decide whether to reuse the dependency
  shareConfig: SharedConfig;
  // The scope where the shared dependency is located, the default value is default
  scope: Array<string>;
  // Function to retrieve the shared dependency instance.
  get: SharedGetter;
  // List of dependencies that this shared module depends on
  deps: Array<string>;
  // Indicates whether the shared dependency has been loaded
  loaded?: boolean;
  // Represents the loading state of the shared dependency
  loading?: null | Promise<any>;
  // Determines if the shared dependency should be loaded eagerly
  eager?: boolean;
};


Example
import { init, loadRemote, loadShare } from '@module-federation/enhanced/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

init({
  name: '@demo/main-app',
  remotes: [],
  shared: {
    react: {
      version: '17.0.0',
      scope: 'default',
      lib: () => React,
      shareConfig: {
        singleton: true,
        requiredVersion: '^17.0.0',
      },
    },
    'react-dom': {
      version: '17.0.0',
      scope: 'default',
      lib: () => ReactDOM,
      shareConfig: {
        singleton: true,
        requiredVersion: '^17.0.0',
      },
    },
  },
});

loadShare('react').then((reactFactory) => {
  console.log(reactFactory());
});


If has set multiple version shared, loadShare will return the loaded and has max version shared. The behavior can be controlled by set extraOptions.resolver:

import { init, loadRemote, loadShare } from '@module-federation/runtime';

init({
  name: '@demo/main-app',
  remotes: [],
  shared: {
    react: [
      {
        version: '17.0.0',
        scope: 'default',
        get: async ()=>() => ({ version: '17.0.0' }),
        shareConfig: {
          singleton: true,
          requiredVersion: '^17.0.0',
        },
      },
      {
        version: '18.0.0',
        scope: 'default',
        // pass lib means the shared has loaded
        lib: () => ({ version: '18.0.0' }),
        shareConfig: {
          singleton: true,
          requiredVersion: '^18.0.0',
        },
      },
    ],
  },
});

loadShare('react', {
   resolver: (sharedOptions) => {
      return (
        sharedOptions.find((i) => i.version === '17.0.0') ?? sharedOptions[0]
      );
  },
 }).then((reactFactory) => {
  console.log(reactFactory()); // { version: '17.0.0' }
});