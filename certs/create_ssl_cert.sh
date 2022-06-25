#!/bin/sh
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out cert.crt \
            -keyout cert.key \
            -subj "/C=PL/ST=Pomorskie/L=Gdynia/O=ShirtDip/OU=Printing Software Manufacturer/CN=shirtdip.pl"