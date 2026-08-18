# Pritunl VPN Server — Ubuntu 24.04

Simple setup for running Pritunl with OpenVPN on an Ubuntu 24.04 VM.

## What we're installing

* Pritunl — VPN management/server UI
* OpenVPN — VPN tunnel
* MongoDB — Pritunl database

The client laptop only needs the Pritunl Client. OpenVPN doesn't need to be installed separately on the laptop when using the Pritunl Client.

---

## 1. Check the VM first

Check OS:

```bash
cat /etc/os-release
```

Check kernel:

```bash
uname -a
```

Check IPs:

```bash
hostname -I
```

Public IP:

```bash
curl -4 ifconfig.me
```

Check hostname:

```bash
hostnamectl
```

---

## 2. Update packages

```bash
sudo apt update
sudo apt upgrade -y
```

Install basic dependencies:

```bash
sudo apt install -y gnupg curl
```

---

## 3. Add MongoDB repo

Add the repository:

```bash
sudo tee /etc/apt/sources.list.d/mongodb-org.list << EOF
deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse
EOF
```

Add the key:

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
--dearmor --yes
```

---

## 4. Add OpenVPN repo

Add the repository:

```bash
sudo tee /etc/apt/sources.list.d/openvpn.list << EOF
deb [ signed-by=/usr/share/keyrings/openvpn-repo.gpg ] https://build.openvpn.net/debian/openvpn/stable noble main
EOF
```

Add the key:

```bash
curl -fsSL https://swupdate.openvpn.net/repos/repo-public.gpg | \
sudo gpg -o /usr/share/keyrings/openvpn-repo.gpg \
--dearmor --yes
```

---

## 5. Add Pritunl repo

Add the repository:

```bash
sudo tee /etc/apt/sources.list.d/pritunl.list << EOF
deb [ signed-by=/usr/share/keyrings/pritunl.gpg ] https://repo.pritunl.com/stable/apt noble main
EOF
```

Add the key:

```bash
curl -fsSL https://raw.githubusercontent.com/pritunl/pgp/master/pritunl_repo_pub.asc | \
sudo gpg -o /usr/share/keyrings/pritunl.gpg \
--dearmor --yes
```

Update apt:

```bash
sudo apt update
```

---

## 6. Install everything

```bash
sudo apt install -y pritunl openvpn mongodb-org wireguard wireguard-tools
```

Check that the packages exist:

```bash
dpkg -l | grep -Ei 'pritunl|openvpn|mongodb|wireguard'
```

---

## 7. Start the services

MongoDB + Pritunl:

```bash
sudo systemctl enable --now mongod pritunl
```

Check them:

```bash
systemctl status mongod
systemctl status pritunl
```

Both should show:

```text
Active: active (running)
```


## 8. Get the Pritunl setup key

```bash
sudo pritunl setup-key
```

Save the output somewhere temporarily.

The setup key is only used during the initial Pritunl web setup.

It is NOT:

* VPN password
* admin password
* user password
* OpenVPN client key

---

## 9. Get the VM IP

Private IP:

```bash
hostname -I
```

Public IP:

```bash
curl -4 ifconfig.me
```

If this is a cloud VM, use the public/external IP when accessing Pritunl from your laptop.

---

## 10. Check Pritunl web server

Check listening ports:

```bash
sudo ss -tulpn | grep -E ':80|:443'
```

Expected:

```text
*:80
*:443
```

Test locally from the VM:

```bash
curl -k https://127.0.0.1
```

A working installation should return something similar to:

```text
<a href="/login">Found</a>.
```

That means the Pritunl web server is alive.

---

## 11. Open the web UI

From your laptop:

```text
https://YOUR_PUBLIC_IP
```

Example:

```text
https://35.x.x.x
```

You may get a certificate warning during the initial setup. That's normal if you're using the initial certificate.

---

## 12. Initial Pritunl setup

On the setup page:

### Setup Key

Paste:

```bash
sudo pritunl setup-key
```

output.

### MongoDB URI

Since MongoDB is running on the same VM:

```text
mongodb://localhost:27017/pritunl
```

Save the configuration.

---

## 13. Get the default admin password

```bash
sudo pritunl default-password
```

Use the credentials shown by that command to log in.

Change the default password after logging in.

---

# VPN setup

## 14. Create a VPN server

In Pritunl:

```text
Servers
→ Add Server
```

Example:

```text
Name: HomeVPN
Protocol: UDP
Port: 15477
```

Create the server and start it.

---

## 15. Check that OpenVPN started

On the VM:

```bash
sudo ss -ulpn | grep openvpn
```

Expected:

```text
UNCONN 0 0 *:15477 *:* users:(("openvpn",...))
```

You can also check the actual process:

```bash
ps aux | grep '[o]penvpn'
```

---

## 16. Create an organization

In Pritunl:

```text
Users
→ Organizations
→ Add Organization
```

Example:

```text
HomeLab
```

---

## 17. Create a user

Create a user inside the organization.

Example:

```text
Username: myuser
```

Save it.

---

## 18. Download the VPN profile

Download the user's profile from Pritunl.

Import that profile into the Pritunl Client on your laptop.

You don't need to install OpenVPN separately on the laptop when using the Pritunl Client.

---

# GCP firewall

If the VM is running on Google Cloud, you need to allow the Pritunl web port and the VPN port.

For example:

```text
TCP 443    → Pritunl web UI
UDP 15477  → OpenVPN
```

Do NOT expose MongoDB:

```text
TCP 27017
```

Do NOT expose Pritunl's internal port:

```text
TCP 9756
```

The VPN port must match whatever you configured in the Pritunl server.

---

# Checking the firewall from the VM

Ubuntu UFW:

```bash
sudo ufw status
```

If UFW is inactive:

```text
Status: inactive
```

then UFW isn't filtering the traffic.

Remember that cloud firewalls are separate from UFW.

---

# Useful checks

## See all running services

```bash
systemctl --type=service --state=running
```

Filter for the important ones:

```bash
systemctl --type=service --state=running | grep -Ei 'pritunl|mongo|openvpn'
```

---

## Check Pritunl

```bash
sudo systemctl status pritunl
```

Logs:

```bash
sudo journalctl -u pritunl -n 100 --no-pager
```

Live logs:

```bash
sudo journalctl -u pritunl -f
```

---

## Check Pritunl web

```bash
sudo systemctl status pritunl-web
```

Logs:

```bash
sudo journalctl -u pritunl-web -n 100 --no-pager
```

Live logs:

```bash
sudo journalctl -u pritunl-web -f
```

---

## Check MongoDB

```bash
sudo systemctl status mongod
```

Logs:

```bash
sudo journalctl -u mongod -n 100 --no-pager
```

---

## Check ports

All listening ports:

```bash
sudo ss -tulpn
```

Pritunl web:

```bash
sudo ss -tulpn | grep -E ':80|:443'
```

OpenVPN:

```bash
sudo ss -ulpn | grep openvpn
```

---


# Troubleshooting VPN connection

If the Pritunl Client keeps doing:

```text
Connecting
↓
Disconnecting
```

first check that OpenVPN is actually listening:

```bash
sudo ss -ulpn | grep openvpn
```

Then check the port.

Example:

```text
*:15477
```

means the VPN is listening on UDP 15477.

Make sure GCP allows:

```text
UDP 15477
```

---

# If the VM public IP changes

This can break existing VPN profiles if the profile contains the old IP.

Get the current IP:

```bash
curl -4 ifconfig.me
```

If it changed, download a fresh profile from:

```text
Pritunl
→ Users
→ User
→ Download Profile
```

Then import the new profile into the Pritunl Client.

For a permanent VPN server, use a **static/reserved public IP** instead of an ephemeral cloud IP.

---

# Quick health check

Run these when you want a quick sanity check:

```bash
echo "=== IP ==="
hostname -I
curl -4 ifconfig.me

echo "=== SERVICES ==="
systemctl is-active mongod
systemctl is-active pritunl

echo "=== WEB ==="
sudo ss -tulpn | grep -E ':80|:443'

echo "=== OPENVPN ==="
sudo ss -ulpn | grep openvpn

echo "=== UFW ==="
sudo ufw status
```

A healthy basic setup should look roughly like:

```text
=== SERVICES ===
active
active

=== WEB ===
*:80
*:443

=== OPENVPN ===
*:15477

=== UFW ===
Status: inactive
```

---

# Useful commands to keep around

```bash
sudo systemctl restart pritunl
sudo systemctl restart mongod

sudo systemctl status pritunl
sudo systemctl status pritunl-web
sudo systemctl status mongod

sudo journalctl -u pritunl -f
sudo journalctl -u pritunl-web -f

sudo ss -tulpn
sudo ss -ulpn | grep openvpn

sudo tcpdump -ni any udp port 15477

curl -k https://127.0.0.1
curl -4 ifconfig.me
hostname -I
```

That's basically the **day-to-day cheat sheet** for this VM. You shouldn't need to reinstall anything just because the VPN stops connecting — check the service, port, firewall, IP, and profile first. If you feel stuck just ask any of the AI tools at your disposal, they can do wonders.
