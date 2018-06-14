#!/usr/bin/env bash

cd "$(dirname "$0")"

docker build -t blokaly/mocia .
docker tag blokaly/mocia blokaly/mocia
docker push blokaly/mocia
