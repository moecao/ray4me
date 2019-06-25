#!/bin/bash

NETWORKS_SERVICE="Wi-Fi"
SOCKS_PROXY_URL="127.0.0.1"
SOCKS_PROXY_PORT="1080"
WEB_PROXY_URL="127.0.0.1"
WEB_PROXY_PORT="1087"
PAC_URL="http://localhost/proxy.pac"

if [[ $1 == "p" || $1 == "proxy" ]]; then 
   echo "Changing proxy to PAC model..."
   networksetup -setwebproxystate $NETWORKS_SERVICE off
   networksetup -setsocksfirewallproxystate $NETWORKS_SERVICE off
   networksetup -setsecurewebproxystate $NETWORKS_SERVICE off
   networksetup -setautoproxystate $NETWORKS_SERVICE on
   networksetup -setautoproxyurl $NETWORKS_SERVICE $PAC_URL
   echo "Change to PAC model sucessfully!"
elif [[ $1 == "g" || $1 == "global" ]]; then
   echo "Changing proxy to global model..."
   networksetup -setautoproxystate $NETWORKS_SERVICE off
   # networksetup -setwebproxystate $NETWORKS_SERVICE on
   # networksetup -setsecurewebproxystate $NETWORKS_SERVICE on
   networksetup -setsocksfirewallproxystate $NETWORKS_SERVICE on
   # networksetup -setwebproxy $NETWORKS_SERVICE $WEB_PROXY_URL $WEB_PROXY_PORT
   # networksetup -setsecurewebproxy $NETWORKS_SERVICE $WEB_PROXY_URL $WEB_PROXY_PORT
   networksetup -setsocksfirewallproxy $NETWORKS_SERVICE $SOCKS_PROXY_URL $SOCKS_PROXY_PORT
   echo "Change to GLOBAL model sucessfully!"
elif [[ $1 == "n" || $1 == 'no' ]]; then
   echo "Changeing proxy to none..."
   networksetup -setwebproxystate $NETWORKS_SERVICE off
   networksetup -setsocksfirewallproxystate $NETWORKS_SERVICE off
   networksetup -setsecurewebproxystate $NETWORKS_SERVICE off
   networksetup -setautoproxystate $NETWORKS_SERVICE off
elif [[ $1 == "e" || $1 == "exit" || $1 == "q" || $1 == "quit" ]]; then
   exit
elif [[ $1 == "h" || $1 == "help" ]]; then
   echo "======Select Proxy Model======"
   echo "==  'p': PAC proxy model    =="
   echo "==  'g': GLOBAL proxy model =="
   echo "==  'n': No proxy model     =="
   echo "=============================="
else
   echo "Please input right command: "
   echo "======Select Proxy Model======"
   echo "==  'p': PAC proxy model    =="
   echo "==  'g': GLOBAL proxy model =="
   echo "==  'n': No proxy model     =="
   echo "=============================="
fi


