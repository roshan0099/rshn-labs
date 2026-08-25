# SSH Failed Login → Telegram Alert

A lightweight Bash script that monitors SSH authentication failures on a Linux server and instantly sends a Telegram alert whenever a failed SSH login is detected.

Useful for monitoring VPS/cloud servers and getting notified about brute-force attempts or unauthorized SSH access.

## Features

* 🔴 Detects failed SSH login attempts
* 👤 Shows the attempted username
* 🌐 Shows the source IP address
* 🖥️ Shows the server hostname
* 🕐 Shows the time of the failed attempt
* 📱 Sends alerts directly to Telegram
* ⚡ Runs continuously in the background
* 🪶 No external monitoring platform required

## Example Alert

```text
🔴 SSH FAILED LOGIN

👤 User: admin
🌐 IP: 203.0.113.42
🖥️ Server: my-server
🕐 Time: 2026-08-25 20:15:32
```

---

# Requirements

* Linux server with `systemd`
* SSH server
* `journalctl`
* `curl`
* A Telegram bot
* A Telegram chat ID

The script is intended for systems where SSH logs are available through `journald`.

---

# 1. Create a Telegram Bot

Open Telegram and search for:

**@BotFather**

Create a new bot using:

```text
/newbot
```

BotFather will give you a token similar to:

```text
123456789:AAExampleBotTokenHere
```

Keep this token private.

---

# 2. Get Your Telegram Chat ID

Send a message to your bot first.

Then open the following URL in your browser:

```text
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

For example:

```text
https://api.telegram.org/bot123456789:AAExampleBotTokenHere/getUpdates
```

Look for:

```json
"chat": {
    "id": 123456789
}
```

That number is your `CHAT_ID`.

---

# 3. Create the Environment File

Create:

```bash
sudo nano /etc/ssh-telegram.env
```

Add:

```bash
BOT_TOKEN="YOUR_BOT_TOKEN"
CHAT_ID="YOUR_CHAT_ID"
```

Example:

```bash
BOT_TOKEN="123456789:AAExampleBotTokenHere"
CHAT_ID="123456789"
```

Save the file.

### Secure the credentials

Make sure only root can read the file:

```bash
sudo chmod 600 /etc/ssh-telegram.env
```

---

# 4. Install the Script

Copy the script to:

```bash
/usr/local/bin/ssh-failure-telegram.sh
```

For example:

```bash
sudo nano /usr/local/bin/ssh-failure-telegram.sh
```

Paste the script and save it.

Make it executable:

```bash
sudo chmod +x /usr/local/bin/ssh-failure-telegram.sh
```

---

# 5. Test the Script Manually

Run:

```bash
sudo /usr/local/bin/ssh-failure-telegram.sh
```

The script will start monitoring SSH logs.

Now intentionally generate a failed SSH login from another machine.

For example:

```bash
ssh wronguser@YOUR_SERVER_IP
```

Enter an incorrect password.

You should receive a Telegram notification.

Press:

```text
Ctrl+C
```

to stop the script when running it manually.

---

# 6. Run Automatically with systemd

Create a service:

```bash
sudo nano /etc/systemd/system/ssh-failure-telegram.service
```

Add:

```ini
[Unit]
Description=SSH Failed Login Telegram Alert
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/usr/local/bin/ssh-failure-telegram.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Save the file.

Reload systemd:

```bash
sudo systemctl daemon-reload
```

Enable the service:

```bash
sudo systemctl enable ssh-failure-telegram.service
```

Start it:

```bash
sudo systemctl start ssh-failure-telegram.service
```

---

# 7. Check Service Status

Run:

```bash
sudo systemctl status ssh-failure-telegram.service
```

You should see:

```text
Active: active (running)
```

To view the service logs:

```bash
sudo journalctl -u ssh-failure-telegram.service -f
```

---

# 8. Stop / Restart the Service

Stop:

```bash
sudo systemctl stop ssh-failure-telegram.service
```

Restart:

```bash
sudo systemctl restart ssh-failure-telegram.service
```

Disable automatic startup:

```bash
sudo systemctl disable ssh-failure-telegram.service
```

---

# How It Works

The script follows new SSH log entries using:

```bash
journalctl -f -n 0 -o cat --no-pager _COMM=sshd
```

It looks for messages matching failed authentication attempts such as:

```text
Failed password for invalid user admin from 203.0.113.42
```

or:

```text
Failed password for root from 203.0.113.42
```

The script extracts:

* Username
* Source IP
* Server hostname
* Current timestamp

It then sends the information to your Telegram bot using the Telegram Bot API.

---

# Telegram API IP Resolution

The script uses:

```bash
--resolve api.telegram.org:443:149.154.166.110
```

This forces `api.telegram.org` to resolve to the specified IPv4 address.

This can be useful on servers where DNS resolution for Telegram is problematic or restricted.

**Important:** this IP should not be assumed to be universal or permanent. Telegram infrastructure can change, and connectivity may vary by network/region.

If you don't specifically need the forced resolution, you can remove:

```bash
--resolve api.telegram.org:443:149.154.166.110
```

and let normal DNS resolution handle `api.telegram.org`.

---

# Troubleshooting

## No Telegram messages

Check that the environment file exists:

```bash
sudo cat /etc/ssh-telegram.env
```

Verify:

```text
BOT_TOKEN=...
CHAT_ID=...
```

Also make sure the bot has been started by sending it a message in Telegram.

---

## Check SSH logs manually

Run:

```bash
sudo journalctl -u ssh -n 50
```

or:

```bash
sudo journalctl -u sshd -n 50
```

Depending on the Linux distribution, SSH may be logged under either `ssh` or `sshd`.

You can also check:

```bash
sudo journalctl _COMM=sshd -n 50
```

---

## Check whether curl works

Test Telegram directly:

```bash
source /etc/ssh-telegram.env

curl -s \
    -X POST \
    "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" \
    -d "chat_id=${CHAT_ID}" \
    --data-urlencode "text=SSH Telegram test"
```

You should receive a Telegram message.

---

## Service keeps stopping

Check:

```bash
sudo journalctl -u ssh-failure-telegram.service -n 100
```

Also verify the script is executable:

```bash
ls -l /usr/local/bin/ssh-failure-telegram.sh
```

If necessary:

```bash
sudo chmod +x /usr/local/bin/ssh-failure-telegram.sh
```

---

# Security

### Never commit your Telegram credentials

Do **not** put this in GitHub:

```bash
BOT_TOKEN="your-real-token"
CHAT_ID="your-real-chat-id"
```

Keep credentials in:

```text
/etc/ssh-telegram.env
```

and make sure the file is not tracked by Git.

You can add:

```text
/etc/ssh-telegram.env
```

to `.gitignore`.

If you accidentally expose your bot token, immediately revoke/regenerate it through **@BotFather**.

---

# Files

A typical installation looks like:

```text
/usr/local/bin/
└── ssh-failure-telegram.sh

/etc/
└── ssh-telegram.env

/etc/systemd/system/
└── ssh-failure-telegram.service
```

---

# Supported Failed Login Formats

The script currently detects:

```text
Failed password for invalid user USER from IP
```

and:

```text
Failed password for USER from IP
```

IPv4 addresses are supported by the current regular expressions.

---

# License

Use, modify, and distribute this script as you wish. No warranty is provided.

Made for simple, lightweight SSH security monitoring. 🔐
