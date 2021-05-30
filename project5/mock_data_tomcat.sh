#!/bin/bash

for (( i = 1; i <= 500; i++)); do 
    curl -X POST http://tomcat:8888/editor/post -d "action=save&username=cs144&postid=0&title=mokeTitle&body=mockBody";
done;
