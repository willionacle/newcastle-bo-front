module.exports = {
  apps: [{
    name: 'my-app',
    script: 'npx',
    args: 'serve -s dist -l 4444',
    env: {
      NODE_ENV: 'production'
    }
  }]
};