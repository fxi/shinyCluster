#! /bin/bash

 passenger start \
   --daemonize \
   --app-type node \
   --startup-file app.js \
   --log-file log/passenger.log \
   --pid-file log/passenger.pid \
   --port 3000 \
   --ssl \
   --ssl-port 3001 \
   --ssl-certificate settings/ssl/server.crt \
   --ssl-certificate-key settings/ssl/server.key \
   --max-pool-size 8



