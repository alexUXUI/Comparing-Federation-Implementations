# Module Federation Compared to Native Federation

## Table of Contents

<details>

<summary>Content</summary>

1. [Introduction](#introduction)
2. [Federation Conceptual Framework](#federation-conceptual-framework)
3. [Resolution Layer](#1-resolution-layer)
    1. [Runtime Initialization Step](#1a-runtime-initialization-step)
        - Configurability
        - Independence
    2. [Code Resolution Step](#1b-code-resolution-step)
        - Initial Load Performance
    3. [Resolution Layer Real World Impact](#resolution-layer-real-world-impact)
4. [Integration Layer](#2-integration-layer)
    1. [Dependency Resolution Step](#2a-dependency-resolution-step)
        - Version Management
        - Sharing Strategy
    2. [Module Integration Step](#2b-module-integration-step)
        - Initialization Control
        - Scope Isolation
        - Error Handling
    3. [Integration Layer Real World Impact](#integration-layer-real-world-impact)
5. [Runtime Management Layer](#3-runtime-management-layer)
    1. [Runtime Control Step](#3a-runtime-control-step)
        - Module Loading
        - Lifecycle Management
        - Module Graph Management
    2. [Runtime Extension Step](#3b-runtime-extension-step)
        - Plugin Support
        - Error Handling
        - Real World Impact
        - Monitoring Capabilities
    3. [Runtime Management Layer Real World Impact](#runtime-management-layer-real-world-impact)
6. [Options Comparison](#options-comparison)
7. [Conclusion](#conclusion)

</details>

## Introduction

<details>

<summary>Introduction</summary>

Module Federation (MF) and Native Federation (NF) represent two distinct approaches to implementing the same concept of code federation. Each approach comes with its own strengths and weaknesses, making the choice between them highly dependent on the specific needs and requirements of the application.

To provide a structured comparison, we will analyze both approaches using the Federation Conceptual Framework, evaluating their strengths and weaknesses within a standardized model.

</details>

## Federation Conceptual Framework

<details>

<summary>Conceptual Framework</summary>

For the purposes of this document, the concept of Federation is organized into three distinct layers: Resolution, Integration, and Management.

Each layer consists of steps, which define the key processes within that layer.

Each step is measured by a set of Properties, which serve as meaningful points of comparison across different implementations of the same step.

In the following section, we will examine each layer in detail, breaking down its steps and analyzing their defining Properties to provide a structured comparison of Module Federation and Native Federation.

</details>

## 1) Resolution Layer

<details>

<summary>Resolution Layer</summary>

The Code Resolution Layer is the first step in the federation process, where the code is resolved and loaded into the consumer's runtime environment. This layer encompasses the following steps:

1.a) Runtime initialization: Configuring the runtime environment
1.b) Code Resolution: Loading remote modules into the consumer runtime

### 1.a) Runtime Initialization Step

Runtime initialization step is measured by along the following Properties:

- Configurability: The options for configuring the runtime
- Independence: Independent runtime support

| Initialization Step Properties               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Configurability | ❌ No support for runtime share scope configuration | ✅ can configure shared deps at runtime |
| Independence | ❌ No support for independent runtimes (by default) | ✅ supports independent runtimes |

#### Configurability Property

Module Federation [init](https://module-federation.io/guide/basic/runtime.html#init) enables runtime share scope configuration, which supports use cases where the share scope is used to share singletons, and stateful services, across multiple MFE instances.

#### Independence Property

Native Federation's use of import maps requires all remotes to be defined in the host. This introduces tight-coupling between MFEs where the shell must load all child remote on behalf of all consumers.

Module Federation supports independent runtimes by default. This capability enabling key patterns related to Service-based Delivery, where Products are free to load the Services they need, decoupling the operations and code.

For Example: With module federation Products like Thread are free to independently manage their Service dependencies such as Content Viewer without host coordination.

### 1.b) Code Resolution Step

> Native Federation uses browser-native Import Maps to resolve and load modules directly through ES Module imports. Module Federation uses a Container API pattern where modules are loaded through a JSON manifest and webpack's container runtime which creates a virtual module system for resolving remote assets. These approaches have differences in terms of the runtime execution of the program.

Code Resolution is measured by along the following Properties:

- Initial load performance: Network calls, Render blocking resources, LCP, CPU throttle

| Resolution Step Properties               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Initial load Performance | ❌ | ✅ |
| # Network calls | 19 | 11 |
| # Render blocking resource | 1 | 0 |
| LCP normal connection | 110ms | 50ms |
| LCP Fast 4G | 1.48s | 0.62s |
| LCP Slow 4G | 5.03s | 2.14s |
| LCP 3G | 17.70s | 6.14s |
| LCP CPU throttle 20x | 0.89s | 0.49s |
| Runtime init | 24.861083984375 ms | 18.72900390625 ms |

#### Initial Load Performance Property

There are more network requests for Native Federation systems meaning that the worse the network, the worse the performance of Native Federation.

For the same app there were 12 network requests for module federation and 19 requests for native federation

Though part of this is due to the bundling differences between esbuild and rspack.

Native federation also has a render blocking resource, `https://ga.jspm.io/npm:es-module-shims@1.5.17/dist/es-module-shims.js` this can add significant slow down to the entire app loading if this resource becomes bottle necked

#### Resolution Layer Real World Impact

The technical differences in the Resolution Layer translate into significant business and development impacts:

1. **Market Reach and User Experience**
   - Module Federation:
     - Lower bounce rates in emerging markets due to faster initial loads
     - Better conversion rates from improved performance on low-end devices
     - Wider market reach through better performance on slower networks
   - Native Federation:
     - Higher bounce rates in markets with poor connectivity
     - Limited reach in emerging markets due to performance constraints
     - Better suited for markets with robust infrastructure

</details>

## 2) Integration Layer

<details>

<summary>Integration Layer</summary>

The Integration Layer handles how federated remotes integrate with the consumer's runtime environment. This layer encompasses the following steps:

2.a) Dependency Resolution: Managing shared dependencies and version resolution
2.b) Module Integration: Defining module boundaries and initialization

### 2.a) Dependency Resolution Step

Dependency Resolution step is measured by the following Properties:

- Version Management: How dependencies and their versions are managed
- Sharing Strategy: How shared dependencies are handled across modules

| Dependency Resolution Properties               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Version Management | ✅ Supports dependency sharing through Import Maps | ✅ Supports semver ranges |
| Sharing Strategy | ✅ Configurable at build time | ✅ Configurable sharing strategies |

#### Version Management Property

Native Federation uses Import Maps and EcmaScript modules to manage shared dependencies. It provides the `shareAll` helper that can share all dependencies found in package.json, with options for singleton management and version control. While it requires more precise version matching, it embraces emerging browser standards for module resolution.

Module Federation uses a container-based architecture that enables flexible version resolution through semver ranges, providing more flexibility in version management.

#### Sharing Strategy Property

Native Federation provides a straightforward sharing strategy through the `shareAll` helper with configurable options: `singleton`, `strictVersion`, `requiredVersion`, `includeSecondaries`, and `skip`

Module Federation offers similar capabilities through its container-based architecture, with additional configuration options for advanced sharing scenarios.

### 2.b) Module Integration Step

Module Integration step is measured by the following Properties:

- Initialization Control: Level of control over module initialization
- Scope Isolation: How module boundaries and scopes are managed
- Error Handling: How module loading errors are managed

| Module Integration Properties               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Initialization Control | ❌ Standard ESM initialization | ✅ Container initialization API |
| Scope Isolation | ❌ Basic ES Module scoping | ✅ Enhanced container isolation |
| Error Handling | ❌ Manual error handling | ✅ Built-in error handling |

#### Initialization Control Property

Module Federation's container initialization API offers fine-grained control over module loading and initialization, while Native Federation uses standard ESM initialization.

#### Scope Isolation Property

Module Federation provides enhanced container isolation through its container-based architecture, while Native Federation relies on basic ES Module scoping.

#### Error Handling Property

Module Federation's container abstraction provides built-in error handling for module loading and dependency conflicts, while Native Federation's integration with standard ES modules means error handling must be managed manually.

### Integration Layer Real World Impact

The Integration Layer capabilities translate into significant implications for development teams and business outcomes:

1. **Authentication and Session Management**
   - Module Federation enables immediate user session validation with built-in singleton management, preventing unauthorized access and reducing authentication-related UI flickers
   - Native Federation requires manual implementation of authentication singletons, leading to more complex session management and potential inconsistencies across micro-frontends

2. **Feature Flag Systems**
   - Module Federation's eager loading capability ensures feature flags are loaded and evaluated during bootstrap, preventing UI flickering and enabling immediate feature decisions
   - Share scope system enables consistent feature flag state across all micro-frontends
   - Native Federation's ESM-based loading requires additional coordination of feature flag systems, potentially causing inconsistent feature rendering and increased development overhead

3. **Global State Management**
   - Module Federation's eager shared dependencies and container initialization ensure state is available immediately, reducing state synchronization issues
   - Share scope system provides a unified state management layer across all micro-frontends
   - Native Federation's basic ESM scoping requires manual state synchronization, requiring additional effort to maintain state consistency

</details>

## 3) Runtime Management Layer

<details>

<summary>Runtime Management Layer</summary>

The Runtime Management Layer handles how federated services are managed during execution. This layer encompasses the following steps:

3.a) Runtime Control: Managing and controlling the loading, access, and execution of federated dependencies
3.b) Runtime Extension: Extending the runtime with plugins and custom behaviors

### 3.a) Runtime Control Step

Runtime Control step is measured by the following Properties:

- Module Loading: How modules are loaded and initialized
- Lifecycle Management: How module lifecycles are managed
- Module Graph Management: How the module graph is updated during runtime

| Runtime Control Properties               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Module Loading | ❌ Limited control | ✅ Programmatic control |
| Lifecycle Management | ❌ Basic ESM lifecycle | ✅ Full lifecycle control |
| Module Graph Management | ✅ Basic support | ✅ Advanced control |

#### Module Loading Property

Module Federation provides programmatic control over module loading through its container API, allowing fine-grained control over how and when modules are loaded. Native Federation relies on the browser's built-in module loading system, offering less control.

#### Lifecycle Management Property

Module Federation enables full control over module initialization and cleanup through its container architecture. Native Federation uses standard ESM lifecycle management with limited control options.

### 3.b) Runtime Extension Step

Runtime Extension step is measured by the following Properties:

- Plugin Support: Ability to extend runtime behavior through plugins
- Error Handling: Customization of error recovery and handling
- Monitoring Capabilities: Support for logging and performance tracking
- Security Controls: Implementation of access control and license enforcement

| Runtime Extension Properties | Native Federation | Module Federation |
|--|--|--|
| Plugin Support | ❌ No plugin system | ✅ Extensible plugin system |
| Security Controls | ❌ Manual implementation required | ✅ Plugin-based security framework |
| Error Handling | ❌ Manual error handling | ✅ Built-in recovery mechanisms |
| Monitoring Capabilities | ❌ Limited monitoring | ✅ Comprehensive monitoring |

#### Plugin Support Property

Module Federation's runtime is extensible through a plugin system that enables. Native Federation's integration with standard ES modules means error handling must be managed manually.

#### Security Controls Property

Module Federation's plugin architecture significantly reduces the effort required to implement:

- **License Enforcement**: Built-in capabilities to restrict module access based on license status
- **Role-Based Access**: Granular control over which teams or services can access specific modules
- **Usage Tracking**: Automated monitoring of module consumption for license compliance
- **Security Policies**: Centralized implementation of security rules across all federated modules

#### Error Handling Property

Module Federation's runtime provides built-in error recovery mechanisms for:

- **Module Loading**: Graceful error handling for failed module loading
- **Module Initialization**: Graceful error handling for failed module initialization

Native Federation's integration with standard ES modules means error handling must be managed manually.

#### Monitoring Capabilities Property

Module Federation provides comprehensive logging and monitoring hooks for tracking:

### Runtime Management Layer Real World Impact

The technical capabilities of the Runtime Management Layer translate into significant business and operational impacts:

1. **Access Control and Security**
   - Lower development costs for implementing security controls
   - Higher likelihood of license compliance through automated enforcement
   - Reduced risk of unauthorized module access
   - Simplified audit trails for security compliance

2. **Error Handling**
   - Lower development costs for implementing error recovery mechanisms
   - Higher likelihood of graceful error handling
   - Reduced risk of system downtime due to errors
   - Simplified error recovery mechanisms

3. **Monitoring Capabilities**
   - Increased visibility for module usage patterns, leading to more insights on composition patterns
   - Lower effort to debug and troubleshoot issues

</details>

## Options Comparison

<details>

<summary>Options Comparison</summary>

### High-Level Summary on Differences

Module Federation and Native Federation represent fundamentally different approaches to code federation:

- **Architecture**: Module Federation uses a container-based architecture with a virtual module system, while Native Federation leverages browser-native ES Modules and Import Maps.

- **Performance**: Module Federation demonstrates better initial load performance with fewer network requests and no render-blocking resources, resulting in faster LCP across various network conditions.

- **Runtime Control**: Module Federation provides extensive runtime control through its container API, while Native Federation offers basic ESM-based control.

- **Dependency Management**: Module Federation supports flexible version management with semver ranges, while Native Federation requires exact version matches.

### Detailed Comparison

| Federation Layer | Native Federation | Module Federation |
| ---------------- | ----------------- | ----------------- |
| Resolution | • Uses browser-native Import Maps<br>• More network requests (19 vs 11)<br>• Has render-blocking resources<br>• Slower LCP across network conditions | • Container-based virtual module system<br>• Fewer network requests<br>• No render-blocking resources<br>• Better LCP performance<br>• Runtime share scope configuration |
| Integration | • Exact version matching<br>• Basic ES Module scoping<br>• Standard ESM initialization<br>• Manual error handling<br>• Common dependency sharing | • Semver range support<br>• Enhanced container isolation<br>• Container initialization API<br>• Built-in error handling<br>• Configurable sharing strategies |
| Management | • Limited module loading control<br>• Basic ESM lifecycle<br>• No plugin system<br>• Limited monitoring capabilities<br>• Manual error handling | • Programmatic module loading<br>• Full lifecycle control<br>• Extensible plugin system<br>• Comprehensive monitoring<br>• Built-in recovery mechanisms |

</details>

## Conclusion

<details>

<summary>Conclusion</summary>

Based on our analysis across the three layers of federation, here are the real-world implications of choosing each approach:

| Layer | Module Federation | Native Federation |
| ----- | ---------------- | ----------------- |
| Resolution | - Reduced bounce rates and higher conversion rates due to faster initial page loads<br>- Larger market support for markets with slower networks and devices<br> - Overall faster LCP<br> - Independent runtime support is scalable | - Higher bounce rates and lower conversion rates due to faster initial page loads<br> - Potential performance bottlenecks in high-latency scenarios. Less market support.<br> - Overall slower LCP <br> - Additional coordination overhead as system grows due to no nested runtime support |
| Integration | - **Team Autonomy**: Independent version updates without system-wide coordination<br>- **Maintenance**: Lower long-term maintenance costs through smart dependency sharing<br>- **Performance**: Reduced CDN costs and better caching through optimized bundles<br>- **Learning Curve**: Higher initial training investment for development teams | - **Team Onboarding**: Faster developer ramp-up with simpler concepts<br>- **Development Speed**: Quicker iterations for smaller teams<br>- **Technical Debt**: Potential future refactoring needs due to version constraints<br>- **Resource Usage**: Higher storage and bandwidth costs from bundle duplication |
| Management | - **Customization**: Lower development costs for custom features through plugins<br>- **Scalability**: Better support for large, distributed development teams<br>- **Control**: Finer-grained performance optimization capabilities<br>- **Staffing**: Requires senior developers with federation expertise | - **Operational Cost**: Lower operational overhead for small to medium projects<br>- **Team Structure**: Suitable for smaller, centralized teams<br>- **Future-Proofing**: May require significant refactoring for advanced features<br>- **Resource Allocation**: More predictable resource planning |

This comparison demonstrates that Module Federation offers more flexibility and power at the cost of complexity, while Native Federation provides a simpler approach with some limitations. The choice between them should be based on specific project requirements, team expertise, and business needs.

</details>