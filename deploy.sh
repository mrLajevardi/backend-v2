npm run pm2:stop
path = "/var/services/arad-v2/*"
rm -rf $path
wd = pwd
path = "/var/services/backend-v2/"
cp -rf ./* $path
cp /var/services/configs/.env $path
cd $path && npm install && npm run build && npm run pm2:reload  