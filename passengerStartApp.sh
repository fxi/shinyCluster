#! /bin/bash

 passenger start \
   --daemonize \
   --app-type node \
   --startup-file app.js \
   --log-file log/passenger.log \
   --pid-file log/passenger.pid \
   --port 3000 \
   --max-pool-size 8



