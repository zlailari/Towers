Setup Instructions:

Make sure you have virtualenv installed

> virtualenv -p python3 virtenv-towers

> source virtenv-towers/bin/activate

> pip install autobahn

This fork:
All of the important backend stubs are accounted for and partially implemented: the game pieces, engine, and state of the game can be integrated into a server. The current area of concern is integration of the networking loop into the game logic on said server. Once that is resolved it is only a matter of filling out the remainder of our stubs and logic into the MVP.
