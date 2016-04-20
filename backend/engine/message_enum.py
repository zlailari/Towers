from enum import Enum

# enums for determing types of messages
MSG = Enum('MSG', 'chat tower_update tower_request game_update identifier info instance_request reconnect_request lobby_info') # MSG_TYPES.chat = 1, etc.
