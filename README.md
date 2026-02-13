# Caddy Reverse Proxy Demo

A demonstration project for Caddy reverse proxy with automatic HTTPS setup.

## Prerequisites

- Server running with public IP
- Public domain with DNS A record pointing to server IP
- Firewall allowing ports 80 and 443

## Deployment

### Clone This Repository

```bash
git clone https://github.com/yourusername/caddy-reverse-proxy-demo.git
cd caddy-reverse-proxy-demo
```

### Install Caddy on Server

Follow the official installation guide for your distribution:
https://caddyserver.com/docs/install

Verify installation:
```bash
systemctl status caddy
```

### Configure Caddyfile

Copy the `Caddyfile` from this repository to `/etc/caddy/Caddyfile` and adjust the domain:

```caddy
your-domain.com {
    reverse_proxy localhost:8080
}
```

### Build and Run Web Container

```bash
docker-compose up -d --build
```

The container will be available at `localhost:8080`.

### Reload Caddy

```bash
caddy reload --config /etc/caddy/Caddyfile
```

Done. Caddy will automatically handle SSL certificate provisioning via Let's Encrypt and reverse proxy traffic to your Docker container.


## Local Development

```bash
cd web
npm install
npm run dev
```

## Troubleshooting

Check DNS resolution:
```bash
dig your-domain.com +short
```

Check Caddy logs:
```bash
sudo journalctl -u caddy -f
```

Check container status:
```bash
docker ps
curl localhost:8080
```

## Adding Multiple Virtual Hosts

Edit `/etc/caddy/Caddyfile`:

```caddy
app1.your-domain.com {
    reverse_proxy localhost:8081
}

app2.your-domain.com {
    reverse_proxy localhost:8082
}
```

Reload Caddy after changes.
