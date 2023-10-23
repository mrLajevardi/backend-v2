module.exports = {
  apps: [
    {
      name: 'arad-v2.back',
      script: './dist/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
      },
      node_args: 'cross-env PORT=3007 --max-http-header-size=80000',
      env_production: {
        NODE_ENV: 'production',
      },  
    },
  ],
};
