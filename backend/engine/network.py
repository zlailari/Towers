"""This should be the only class that the gameloop cares about
when it comes to running the network.

This class spins up a process for the websocket server,
and for the gameloop's client which talks to the server.

The client and server process run in the background, and this
class acts as the interface to them, so that the gameloop
doesn't need to care about how they work or what they do."""
import json
from ws_server import ws_server as server
from ws_server.identifiers import GAMELOOP_CLIENT_IDENTIFIER
import engine.ws_client as client
import time
from engine.util import utf, obj_from_json, dump_obj_dict, info
from engine.message_enum import MSG

INFO_ID = 'network.py'  # used to id info output


class Network:

    def __init__(self, create_server):
        address = '0.0.0.0'
        port = '9000'

        if create_server:
            # start the websocket server running on a different process
            server.start_server_process(address, port)
            # sleeping probably not necessary, but can't hurt
            time.sleep(1)

        # set the gameloops client running on a different thread.
        client.start_client_thread(address, port)

        # there is actually a time-dependent operation going on here
        # the client starts in a new thread, so we need to give it adequate
        # time to spin up.
        time.sleep(3)  # TODO: this will block the server, create setter method

        # this is the main handle for communicating with the server.
        # this Network class will abstract it into accessible methods like
        # send(), receive(), etc
        self.client_protocol = client.get_client_protocol()
        assert self.client_protocol is not None

        # identify this client as the gameloop server
        identifier_msg = {'type': MSG.identifier.name,
                          'secret': GAMELOOP_CLIENT_IDENTIFIER}
        self.send_message(identifier_msg)

    def receive(self):
        """Returns a Python object (a dict) built from the raw JSON.
        This is done by popping messages off our network client."""
        as_json = self.client_protocol.receive_message()
        if as_json is None:
            # if there are no messages, receive_message() returns None, and so
            # do we
            return None
        as_obj = obj_from_json(as_json)
        #info('received (type {}): {}'.format(as_obj['type'], as_json), INFO_ID)
        return as_obj

    def send_message(self, data):
        """Given a Python object, convert it to JSON and send it."""
        assert 'type' in data, 'cannot send a message without giving it a type (e.g., the message dict needs an entry called "type"). (data object: {})'.format(
            str(data))
        as_json = json.dumps(data, default=dump_obj_dict)
        #info('sending message: {}'.format(as_json), INFO_ID)
        self.client_protocol.sendMessage(utf(as_json), isBinary=False)
