#! /bin/sh
git switch $1
git status
git commit -a -m "Completed $1 exercise."
git push origin $1
git switch main
