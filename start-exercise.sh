#! /bin/sh
git switch main
git pull origin main
git branch $1
git branch --list
git switch $1

