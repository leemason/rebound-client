# Rebound Client

This is a Laravel Echo inspired websocket client.

Works in conjunction with the Rebound Server: https://github.com/leemason/rebound-server.

Originally planned to work with/over socket.io I found it too opinionated, so I took the underlying engine.io library and built a "channel orientated" client library.

Because it uses engine.io as the base client you still benefit from all the fall backs, and reconnection functionality.

And because its Echo inspired everything is targeted towards channels > events, no namespaces or rooms here.

## Installation

```npm install rebound-client --save```

If using any sort of bundler you can:

```javascript
var Socket = require('rebound-client');
var socket = new Socket('domain:port', csrf);
```

If you just want the compiled, minified script it can be found at ```dist/rebound-client.min.js```.

And you can access it in the global scope via ```rebound.Socket```.

```javascript
<script src="./rebound-client.min.js"></script>
<script>
(function(){
    var socket = new rebound.Socket('domain:port', '{{ csrf_token() }}');
})();
```

You must provide the web socket domain and port its hosted on, and a csrf token.
I guess this could be used outside of Laravel, but the core use case is Laravel, so pass in your csrf token as per the example.

Once you have a connected instance you can create/access channels.

## Channels

Channels are how you seperate your events, the core use case of the package is with Laravel intergration,
so your "channels" defined in your Laravel App events, are the channels that get distributed via your websockets.

Channels have the following methods:

```connected();``` connection status

```then(callback);``` callback called after succesful connection with channel as property (if already connected just fires callback)

```listen(event, callback);``` register a callback for the event. the callback is given a data object containing the event, channel, data (see example).

```leave();``` disconnect from the channel, no future events received.

There are 3 different types of channel:

Public: ```var channel = socket.channel('name'); || var channel = socket.subscribe('name');```

Public channels arent authorized, anybody can access them and be sent events.

Private: ```var channel = socket.private('name'); || var channel = socket.subscribe('private-name');```

Private channels are as the name suggests, private. When you request access to a private channel (determined by the prefix "private-")
the rebound server will first validate your authentication by doing a post request to your laravel app, where authorization will be granted or denied (docs to come on this soon).

Presence: ```var channel = socket.presence('name'); || var channel = socket.subscribe('presence-name');```

Presence channels must be authenticated just like private channels, but once your authenticated your given extra methods:

```members();``` the current list of members provided as socket_id => user values.

```joining(callback);``` register a callback when a new member joins the channel, the callback is given the latest members object and the channel as arguments.

```leaving(callback);``` register a callback when a member leaves the channel, the callback is given the latest members object and the channel as arguments.


## Events

Events are fired on channels, you can listen for events in the global scope, you must be listening on a channel.

Each event gets given 1 argument which contains the following properties:

```
function(res){
    res.event // the event name
    res.channel // the channel name
    res.data // the data sent from laravel with the event
}
```

## Example

```javascript
<script src="./rebound-client.min.js"></script>
<script>
(function(){
    var socket = new rebound.Socket('http://domain.com:3000/', '{{ csrf_token() }}');

    var publicChannel = socket.channel('channel-name');

    publicChannel.then(function(channel){
        // when connected
        channel.listen('App\\Events\\SomeEvent', function(res){

            // res.event = event name
            // res.channel = channel
            // res.data = data sent

        });
    });

    // or outside the then callback
    channel.listen('App\\Events\\SomeEvent', function(res){

        // res.event = event name
        // res.channel = channel
        // res.data = data sent

    });

    // want to leave?
    publicChannel.leave();


    // will trigger a post request to authenticate, if not authenticated you wont get subscribed! (info in server docs)
    // channel name gets prefixed with "private-"
    var privateChannel = socket.channel('channel-name');

    privateChannel.then(function(channel){
        // when connected
        channel.listen('App\\Events\\SomeEvent', function(res){

            // res.event = event name
            // res.channel = channel
            // res.data = data sent

        });

    });

    //want to leave?
    privateChannel.leave();


    // will trigger a post request to authenticate, as with private channel
    // channel name gets prefixed with "private-"
    var presenceChannel = socket.channel('channel-name');

    presenceChannel.then(function(channel){
        // when connected
        channel.listen('App\\Events\\SomeEvent', function(res){

            // res.event = event name
            // res.channel = channel
            // res.data = data sent

        });

        // get list of members
        channel.members();

        // listen for new members
        channel.joining(function(members, channel){

        });

        // listen for leaving members
        channel.leaving(function(members, channel){

        });

    });

    //want to leave?
    presenceChannel.leave();

})();
</script>
```