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

The ultimate goal is to determine the "Real World" impacts of choosing between MF and NF. As such, the Real World impact will be discussed in each layer, with a high-level summary in the Conclusion section.

</details>

## Federation Conceptual Framework

<details>

<summary>Conceptual Framework</summary>

Federation consists of three layers: Resolution, Integration, and Management.

- **Layers** represent the logically distinct phases of the concept of Federation. Each layer contains steps defining key processes within the layer.
- **Steps** describe the granular happenings within each layer. Steps are measured by properties that provide meaningful comparisons between implementations.
- **Properties** define key characteristics of each step and provide objective comparison criteria.

The following sections analyze each layer, breaking down steps and properties to compare Module Federation and Native Federation.

</details>

## 1) Resolution Layer

<details>

<summary>Resolution Layer</summary>

The Resolution Layer is the first step in federation, where code is resolved and loaded into the consumer's runtime. It consists of:

- 1.a) Runtime initialization: Configuring the runtime environment
- 1.b) Code Resolution: Loading remote modules into the consumer runtime

### 1.a) Runtime Initialization Step

Measured by:

- Configurability: The options for configuring the runtime
- Independence: Independent runtime support

| Property               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Configurability | No support for share scope configuration. Smaller API. | Can configure shared deps at runtime. Broader API. |
| Independence | No default support for independent runtimes or nested remotes. | Supports independent runtimes and nested remotes. |

#### Configurability

Module Federation [init](https://module-federation.io/guide/basic/runtime.html#init) allows runtime share scope configuration in addition to remotes.

#### Independence

Native Federation relies on import maps, requiring all remotes to be defined in the host, introducing tight coupling. Module Federation supports independent runtimes, allowing services to load dynamically without host coordination.

**Example:** With Module Federation, products like Thread can manage service dependencies independently, such as Content Viewer, without host involvement.

### 1.b) Code Resolution Step

Native Federation uses browser-native Import Maps, while Module Federation employs a Container API that loads modules via a JSON manifest and Webpack's container runtime.

Measured by:

- **Initial Load Performance**: Network calls, render-blocking resources, LCP, CPU throttle

| Property               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Initial load Performance | Less performant | More performant |
| # Network calls | 19 | 11 |
| # Render blocking resource | 1 | 0 |
| LCP normal connection | 110ms | 50ms |
| LCP Fast 4G | 1.48s | 0.62s |
| LCP Slow 4G | 5.03s | 2.14s |
| LCP 3G | 17.70s | 6.14s |
| LCP CPU throttle 20x | 0.89s | 0.49s |
| Runtime init | 24.86 ms | 18.73 ms |

> Note: These lab metrics were conducted on a Apple M3 Max chip with 36 GB and 5G internet connection.
> The methodology involved using Chrome Developer tools to throttle the CPU and Network.
> The data was gathered using Chrome Developer tools performance panel, custom performance timings, and lighthouse.
> Network cache was disabled to ensure initial load conditions were not cached. For more please see [measurements](./performance-measurements/)

#### Initial Load Performance

Native Federation requires more network requests, impacting performance on poor connections. A render-blocking resource (`es-module-shims.js`) further slows app loading if bottle-necked.

### Resolution Layer Real-World Impact

The technical differences in the Resolution Layer translate into business impacts including:

- **Module Federation**: Lower bounce rates, better conversion, improved performance on low-end devices.
- **Native Federation**: Higher bounce rates, limited reach in emerging markets, best suited for robust infrastructure.

</details>

## 2) Integration Layer

<details>

<summary>Integration Layer</summary>

Handles how federated remotes integrate into the consumer runtime.

It consists of the following steps:

- 2.a) Dependency Resolution: Managing dependencies and their versions
- 2.b) Module Integration: Loading and initializing federated modules

### 2.a) Dependency Resolution Step

Dependency Resolution step is measured by the following Properties:

- **Version Management**: How each federation approach resolves and manages dependency versions:
  - Native Federation uses Import Maps for exact version matching (e.g., "react": "18.2.0")
  - Module Federation supports flexible semver ranges (e.g., "react": "^18.2.0")

- **Sharing Strategy**: How shared dependencies are managed at runtime:
  - Native Federation configures sharing at build time through Import Maps with limited runtime flexibility
  - Module Federation offers runtime share scope configuration with dynamic dependency registration

| Property | Native Federation | Module Federation |
|----------|------------------|-------------------|
| Version Management | Import Maps with exact version matching | Container-based with semver range support |
| Sharing Strategy | Static Import Maps configuration at build time | Dynamic share scope with runtime configuration |

#### Version Management

Native Federation uses Import Maps and EcmaScript modules to manage shared dependencies. It provides the `shareAll` helper that can share all dependencies found in package.json, with options for singleton management and version control. While it requires more precise version matching, it embraces emerging browser standards for module resolution.

Module Federation uses a container-based architecture that enables flexible version resolution through semver ranges, providing more flexibility in version management.

#### Sharing Strategy

Native Federation provides a straightforward sharing strategy through the `shareAll` helper with configurable options: `singleton`, `strictVersion`, `requiredVersion`, `includeSecondaries`, and `skip`. It uses a single global scope through the browser's module system, with share scope configuration determined at build time.

Module Federation offers multiple share scopes with granular control over dependency visibility through its container-based architecture. Share scopes in Module Federation are a powerful concept that provides:

1. **Runtime Configuration**
   - Dynamic registration of shared dependencies
   - Ability to modify share scope configuration after initialization
   - Support for multiple independent share scopes

2. **Dependency Isolation**
   - Separate share scopes for different parts of the application
   - Version conflict resolution within each scope
   - Independent upgrade paths for shared dependencies
   - Singleton management across micro-frontends

Native Federation, in contrast, relies on the browser's global module system, which means:

1. **Single Global Scope**
   - All shared dependencies exist in one global namespace
   - No built-in support for multiple share scopes
   - Share scope configuration is determined at build time

### 2.b) Module Integration Step

Module Integration step is measured by the following properties:

- **Initialization Control**: Control over module initialization
- **Scope Isolation**: Module boundary management

| Property               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Initialization Control | Standard ESM initialization | Container initialization API |
| Scope Isolation | Basic ES Module scoping | Enhanced container isolation |

#### Initialization Control

Module Federation's container initialization API offers fine-grained control over module loading and initialization, while Native Federation uses standard ESM initialization.

#### Scope Isolation

Module Federation provides enhanced container isolation through its container-based architecture, while Native Federation relies on basic ES Module scoping.

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

4. **Isolation**
    - Module Federation enables independent micro-frontends with isolated dependencies, A/B testing different versions of shared libraries, and gradual migration strategies
    - Native Federation's global scope provides simpler setup but requires careful coordination between teams and has limited options for dependency isolation

</details>

## 3) Runtime Management Layer

<details>

<summary>Runtime Management Layer</summary>

Handles runtime execution management.

Consists of the following steps:

- 3.a) Runtime Control: Managing and controlling the loading, access, and execution of federated dependencies
- 3.b) Runtime Extension: Extending the runtime with plugins and custom behaviors

### 3.a) Runtime Control Step

Runtime Control step is measured by the following Properties:

- Module Loading: How modules are loaded and initialized
- Lifecycle Management: How module lifecycles are managed
- Module Graph Management: How the module graph is updated during runtime

| Property               | Native Federation     | Module Federation |
| --------------------- | --------------------- | ----------------- |
| Module Loading | Limited control | Programmatic control |
| Lifecycle Management | Native ESM lifecycle | Full lifecycle control |
| Module Graph Management | Limited support | Advanced control |

#### Module Loading

Module Federation provides programmatic control over module loading through its container API with support for [preloading](https://module-federation.io/guide/basic/runtime.html#preloadremote), allowing fine-grained control over how and when modules are loaded. Native Federation relies on the browser's built-in module loading system, offering less control.

#### Lifecycle Management

Module Federation enables full control over module initialization and cleanup through its plugin-based runtime architecture. Native Federation uses standard ESM lifecycle management with limited control options. There is no standard lifecycle management in Native Federation.

#### Module Graph Management

Native federation cannot update the import map, rather it must create a new one. Module federation has sophisticated methods for [registering](through its container architecture) new remotes, as well as registering new [shared](https://module-federation.io/guide/basic/runtime.html#loadshare) dependencies.

### 3.b) Runtime Extension Step

Runtime Extension step is measured by the following Properties:

- Plugin Support: Ability to extend runtime behavior through plugins
- Error Handling: Customization of error recovery and handling
- Monitoring Capabilities: Support for logging and performance tracking
- Security Controls: Implementation of access control and license enforcement

| Property | Native Federation | Module Federation |
|--|--|--|
| Plugin Support | No plugin system | Extensible [plugin](https://module-federation.io/plugin/dev/index.html) system |
| Security Controls | Manual implementation required | Plugin-based security framework |
| Error Handling | Manual error handling | Built-in recovery mechanisms |
| Monitoring Capabilities | Limited monitoring | Comprehensive monitoring |

#### Plugin Support

Module Federation's runtime is extensible through a [plugin](https://module-federation.io/guide/basic/runtime.html#registerplugins) system that enables a wide-variety of use cases. Native Federation's integration with standard ES modules means error handling must be managed manually, putting the developer in charge of supporting runtime use cases.

#### Security Controls

Module Federation's plugin architecture significantly reduces the effort required to implement:

- **License Enforcement**: Built-in capabilities to restrict module access based on license status
- **Role-Based Access**: Granular control over which teams or services can access specific modules
- **Usage Tracking**: Automated monitoring of module consumption for license compliance
- **Security Policies**: Centralized implementation of security rules across all federated modules

#### Error Handling

Module Federation's runtime provides built-in error recovery mechanisms for:

- **Module Loading**: Graceful error handling for failed module loading
- **Module Initialization**: Graceful error handling for failed module initialization

Native Federation's integration with standard ES modules means error handling must be managed manually.

#### Monitoring Capabilities

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

Module Federation and Native Federation represent quite similar mental models, but they are fundamentally different implementation to code federation:

- **Architecture**: Module Federation uses a container-based architecture with a virtual module system, while Native Federation leverages browser-native ES Modules and Import Maps.

- **Performance**: Module Federation demonstrates better initial load performance with fewer network requests and no render-blocking resources, resulting in faster LCP across various network conditions.

- **Runtime Control**: Module Federation provides extensive runtime control through its container API, while Native Federation offers basic ESM-based control.

- **Dependency Management**: Module Federation supports flexible version management with semver ranges, while Native Federation requires exact version matches.

### Detailed Comparison

| Federation Layer | Native Federation | Module Federation |
| ---------------- | ----------------- | ----------------- |
| Resolution | - Uses browser-native Import Maps<br>- More network requests (19 vs 11)<br>- Has render-blocking resources<br>- Slower LCP across network conditions | - Container-based virtual module system<br>- Fewer network requests<br>- No render-blocking resources<br>- Better LCP performance<br>- Runtime share scope configuration |
| Integration | - **User Experience**: Immediate session validation and feature flag evaluation prevents UI flickering<br>- **Market Reach**: Smart dependency sharing reduces bundle sizes, improving load times in low-bandwidth markets<br>- **Reliability**: Built-in error handling and recovery mechanisms reduce service disruptions<br>- **Feature Consistency**: Share scope system ensures consistent feature flags and state across micro-frontends | - **Initial Simplicity**: Standard ES modules provide familiar user experience<br>- **Market Limitations**: Bundle duplication and strict version requirements impact performance in low-bandwidth scenarios<br>- **Service Reliability**: Manual error handling increases risk of service disruptions<br>- **Feature Challenges**: Basic ES Module scoping requires additional effort for consistent feature management |
| Management | - Manual module loading control<br>- Basic ESM lifecycle<br>- No plugin system<br>- Limited monitoring capabilities<br>- Manual error handling | - Programmatic module loading with support for preloading<br>- Full lifecycle control<br>- Extensible plugin system<br>- Lifecycle based monitoring<br>- Built-in recovery mechanisms |

</details> 

## Real World Impact Analysis

<details>

<summary>Real World Impact Analysis</summary>

Based on our analysis across the three layers of federation, here are the real-world implications of choosing each approach:

| Layer | Module Federation | Native Federation |
| ----- | ---------------- | ----------------- |
| Resolution | - Reduced bounce rates and higher conversion rates due to faster initial page loads<br>- Larger market support for markets with slower networks and devices<br> - Overall faster LCP<br> - Independent runtime support is scalable | - Higher bounce rates and lower conversion rates due to faster initial page loads<br> - Potential performance bottlenecks in high-latency scenarios. Less market support.<br> - Overall slower LCP <br> - Additional coordination overhead as system grows due to no nested runtime support |
| Integration | - Immediate user session validation and feature flag evaluation prevents UI flickering<br>- Smart dependency sharing reduces bundle sizes, improving load times in low-bandwidth markets<br>- Built-in error handling and recovery mechanisms reduce service disruptions<br>- Share scope system ensures consistent feature flags and state across micro-frontends | - Standard ES modules provide familiar user experience<br>- Bundle duplication and strict version requirements impact performance in low-bandwidth scenarios<br>- Manual error handling increases risk of service disruptions<br>- Basic ES Module scoping requires additional effort for consistent feature management |
| Management | - Automated license enforcement and access controls reduce security incidents<br>- Built-in monitoring provides faster issue detection and resolution<br>- Plugin system enables rapid feature deployment and customization<br>- Comprehensive error recovery reduces service downtime | - Manual security implementation increases vulnerability risks<br>- Limited monitoring capabilities extend time to detect and resolve issues<br>- Basic runtime controls restrict feature deployment flexibility<br>- Manual error handling leads to longer service recovery times |

### Analysis Remarks

Both Module Federation and Native Federation implementations continue to evolve, with each approach developing features to address emerging use cases in the federation space. While Module Federation provides extensive runtime management capabilities through its container API and plugin system, Native Federation leverages browser-native ES Modules to implement federation features. The two approaches represent different architectural choices in implementing federation concepts, each with their own trade-offs in terms of flexibility, complexity, and browser compatibility.

</details>

## Conclusion

While there is no one-size-fits-all solution, Module Federation's container-based architecture and plugin system provide a flexible and extensible runtime management system, while Native Federation's integration with standard ES modules provides a familiar and familiar user experience. For performance and extensibility Module Federation is preferred. For quite simple projects, and adherence to standards, Native Federation is preferred.

<details>

<summary>Further Considerations</summary>

## Further Considerations

In addition to the technical aspects above, there are some other important things to consider when choosing these technologies. First, Module Federation is the clear thought leader in the space. Second, Module Federation comes with greater support for developer productivity in the form of: documentation, tooling, and large community.

### Module Federation as the intellectual Drivers of the Federation Concept

Additionally, it is worth nothing that the Module Federation team is the intellectual pioneers of runtime federation concepts in the JavaScript ecosystem, establishing many of the foundational patterns and approaches that have influenced subsequent federation implementations:

1. **First Runtime Federation System**
   - Established core patterns for dynamic remote loading and version reconciliation
   - Defined the container-based architecture now common in federation systems

2. **Technical Innovation Leadership**
   - Introduced the share scope concept for runtime dependency management
   - Invented bidirectional host-remote architecture
   - Developed the first implementation of runtime version resolution for federated modules

3. **Architectural Influence**
   - Module Federation's container architecture has become the reference implementation for federation systems
   - Its version resolution strategies have been adopted across the ecosystem
   - The plugin system architecture has set standards for extensible federation

4. **Industry Impact**
   - Drove adoption of micro-frontend architecture in enterprise applications
   - Established patterns for scaling distributed frontend development
   - Influenced browser vendors' approach to native module loading capabilities

### Module Federation as Developer Productivity Enablers

### Productivity

| Feature | Native Federation | Module Federation |
|---------|------------------|-------------------|
| 1) Documentation | Limited | Comprehensive |
| 2) Development Tooling | Basic | Comprehensive |
| 3) Community Support | Limited | Extensive |
| 4) Framework Adapters | Angular | React, Vue |
| 5) Remote TypeScript Integration | No | Yes |

1) Module Federation provides comprehensive documentation including multiple dedicated websites, books, hundreds of examples, and extensive community-contributed guides. Native Federation offers limited documentation with no dedicated documentation site and fewer examples.

2) Module Federation features a rich tooling ecosystem including Chrome Developer Tools extensions, framework-specific adapters, and debugging utilities that significantly enhance development efficiency. Native Federation offers minimal tooling.

3) Module Federation has an active community with regular updates, bug fixes, and a robust support network for developers encountering issues. Native Federation has a smaller community primarily focused on Angular integration. Additionally, Module Federation has 98% of the market share in the module federation space based on NPM downloads.

4) Module Federation has more framework adapters, supporting React and Vue while Native Federation is primarily focused on Angular.

5) Module Federation provides automatic TypeScript remote types, enabling fully typed development experiences across federated boundaries, allowing engineers to have a fully typed integration experience. Native Federation lacks robust type support across module boundaries, resulting in diminished IDE assistance and type safety.

</details>