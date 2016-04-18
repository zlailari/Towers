#!/bin/bash

source virtenv-towers/bin/activate

cd backend
python start_test_game_server.py &

cd ..
node server.js &

trap 'killall' INT

killall() {
    trap '' INT TERM     # ignore INT and TERM while shutting down
    echo "**** Shutting down... ****"     # added double quotes
    kill -TERM 0         # fixed order, send TERM not INT
    wait
    echo DONE
}

cat # Wait forever
