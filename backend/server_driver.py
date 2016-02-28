#!/usr/bin/env python3
"""This is the top-level driver to run the server.
This only exists so that the scope of this program begins
somewhere above all the child directories."""

import websockets.test_server as server
server.main()
