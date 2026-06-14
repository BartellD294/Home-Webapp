# General notes

Curl command for Roku remote control:
curl -d '' "http://192.168.0.148:8060/keypress/right"
curl -d '' "http://192.168.0.148:8060/keypress/volumeup"
etc...

Direct text can be sent (to search bar, etc) using keypress "lit_(character)".
example:
curl -d '' "http://192.168.0.148:8060/keypress/lit_a"

