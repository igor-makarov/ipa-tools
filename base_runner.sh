#!/bin/bash

if [ "$LOCAL_MODE" != "" ]; then
  bash -c "$@"
else
  vagrant ssh -c "cd ./scripts; $@"
fi
