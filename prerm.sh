#!/bin/bash

pkcommand=$(which pkexec)

rm "$pkcommand"
mv "$pkcommand.bak" "$pkcommand"