#! /bin/bash

 passenger start \
   --daemonize \
   --app-type node \
   --startup-file app.js \
   --log-file log/passenger.log \
   --pid-file log/passenger.pid \
   --port 3005 \
   --ssl \
   --ssl-port 3006 \
   --sticky-sessions \
   --sticky-sessions-cookie-name shinyNodeProxy \
   --ssl-certificate settings/ssl/key-cert.pem \
   --ssl-certificate-key settings/ssl/key.pem \
   --max-pool-size 10 \
   --min-instances 10



