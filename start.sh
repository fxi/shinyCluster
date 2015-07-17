#! /bin/bash

 passenger start \
   --daemonize \
   --app-type node \
   --startup-file app.js \
   --log-file log/passenger.log \
   --pid-file log/passenger.pid \
   --port 3005 \
   --sticky-sessions \
   --sticky-sessions-cookie-name shinyNodeProxy \
   --max-pool-size 10 \
   --min-instances 10



