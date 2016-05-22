# Rebound Client

This is a Laravel Echo inspired websocket client.

Originally planned to work with/over socket.io we found it too opinionated, so we took the underlying engine.io library and built a "channel orientated" client library.

Because it uses engine.io as the base client you still benefit from all the fallbacks, and reconnection functionality.

And because its Echo inspired everything is targeted towards channels.

Docs and usage to come, but basically you can have normal channels, authenticated private and presence channels.

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