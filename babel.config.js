module.exports = function (api) {
  const presets =
  [
    "@babel/preset-env",
    "@babel/typescript"
  ];
  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-syntax-export-default-from"
  ];
  api.cache.never();

  return { presets, plugins };
};