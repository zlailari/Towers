from enum import Enum

# enums for determing types of messages
# MSG_TYPES.chat = 1, etc.
MSG = Enum('MSG', 'chat tower_update tower_request game_update identifier info instance_request reconnect_request lobby_info lobby_full lobby_dne lobby_joined lobby_request leave_lobby game_start_request new_lobby_request game_start assign_id game_add_player game_remove_player creep_request')
