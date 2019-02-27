#!/bin/bash

mkdir -p apps || true

if [ "$LOCAL_MODE" != "" ]; then
  mv ~/"Music/iTunes/iTunes Media/Mobile Applications"/* apps/
else
  vagrant scp ":\"/Users/vagrant/Music/iTunes/iTunes Media/Mobile Applications\"/*" apps
fi
