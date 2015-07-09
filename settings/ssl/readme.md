SSL
###


When running with passenger, we can set up a https server. 

This folder contains ssl certificate. Please verify that gitignore is set to ignore .csr .key and .crt files. 

Generate ssl auto signed certificate and key:
```{sh}
openssl genrsa -des3 -out server.key 1024
openssl req -new -key server.key -out server.csr
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```


