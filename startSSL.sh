#! /bin/bash

 passenger start \
   --daemonize \
   --startup-file app.js \
   --app-type node \
   --log-file log/passenger.log \
   --pid-file log/passenger.pid \
   --port 3006 \
   --ssl \
   --ssl-port 3007 \
   --sticky-sessions \
   --sticky-sessions-cookie-name shinyNodeProxy \
   --ssl-certificate settings/ssl/key-cert.pem \
   --ssl-certificate-key settings/ssl/key.pem \
   --max-pool-size 10 \
   --min-instances 10



