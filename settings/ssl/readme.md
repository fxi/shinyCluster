SSL
###

To create self-signed certificate :

```{sh}

openssl req -x509 -newkey rsa:2048 -keyout key.pem -out key-cert.pem
openssl rsa -in key.pem -out newkey.pem && mv newkey.pem key.pem

```

