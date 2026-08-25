#!/bin/bash

source /etc/ssh-telegram.env

journalctl -f -n 0 -o cat --no-pager _COMM=sshd |
while read -r line; do

    if [[ "$line" =~ Failed\ password\ for\ invalid\ user\ ([^[:space:]]+)\ from\ ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+) ]]; then
        USER="${BASH_REMATCH[1]}"
        IP="${BASH_REMATCH[2]}"

    elif [[ "$line" =~ Failed\ password\ for\ ([^[:space:]]+)\ from\ ([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+) ]]; then
        USER="${BASH_REMATCH[1]}"
        IP="${BASH_REMATCH[2]}"

    else
        continue
    fi

    MESSAGE="🔴 SSH FAILED LOGIN

👤 User: ${USER}
🌐 IP: ${IP}
🖥️ Server: $(hostname)
🕐 Time: $(date '+%Y-%m-%d %H:%M:%S')"

    /usr/bin/curl -s \
        --resolve api.telegram.org:443:149.154.166.110 \
        -X POST \
        "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
        -d "chat_id=${CHAT_ID}" \
        --data-urlencode "text=${MESSAGE}" \
        > /dev/null

done