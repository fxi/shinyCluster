#! /bin/bash

port=$1
portSSL=$2

if [[ -z $1 ]]
then port=3006
fi

if [[ -z $1 ]]
then port=3007
fi


passenger start \
  --daemonize \
  --app-type node \
  --log-file log/passenger.log \
  --pid-file log/passenger.pid \
  --port $port \
  --ssl \
  --ssl-port $portSSL \
  --sticky-sessions \
  --sticky-sessions-cookie-name shinyNodeProxy \
  --ssl-certificate settings/ssl/key-cert.pem \
  --ssl-certificate-key settings/ssl/key.pem \
  --max-pool-size 10 \
  --min-instances 10



