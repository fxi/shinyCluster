#! /bin/bash
nc -z localhost $1 ; echo $?
