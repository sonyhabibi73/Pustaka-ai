/**
 * `server-only` is a runtime guard that throws when a module is imported from
 * a Client Component bundle. Unit tests run in Node with no React bundler, so
 * the guard would fail every suite that imports a server module. This stub
 * keeps the import resolvable while preserving its intent in the real build.
 */
export {};
