#! /bin/bash
#--startup-file app.js \


  port=$1

  if [[ -z $1 ]]
  then port=3005
  fi
  
  passenger start \
   --daemonize \
   --app-type node \
   --log-file log/passenger.log \
   --pid-file log/passenger.pid \
   --port $port \
   --sticky-sessions \
   --sticky-sessions-cookie-name shinyNodeProxy \
   --max-pool-size 10 \
   --min-instances 10



