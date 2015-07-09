#! /bin/bash

(netstat -atn | awk '{printf "%s\n%s\n", $4, $4}' | grep -oE '[0-9]*$'; seq 3939 61000) | sort -n | uniq -u | head -n 1

