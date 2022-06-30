#! /bin/bash

export PATH='/home/stabyprod/.nvm/versions/node/v16.13.2/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin'

cp ../.env.production .

npm i react-quill --save --force

npm run build

pm2 reload staby-cms-client