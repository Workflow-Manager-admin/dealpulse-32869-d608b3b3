#!/bin/bash
cd /home/kavia/workspace/code-generation/dealpulse-32869-d608b3b3/dealpulse
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

