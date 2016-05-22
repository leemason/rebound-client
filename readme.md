# Rebound Client

This is a Laravel Echo inspired websocket client.

Originally planned to work with/over socket.io we found it too opinionated, so we took the underlying engine.io library and built a "channel orientated" client library.

Because it uses engine.io as the base client you still benefit from all the fallbacks, and reconnection functionality.

And because its Echo inspired everything is targeted towards channels.

Docs and usage to come, but basically you can have normal channels, authenticated private and presence channels.