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

### (Optional) Install Caddy with Rate Limiting Module

Rate limiting is not built-in to Caddy. To add rate limiting capability, you need to build Caddy with the rate limit module.

#### 1. Install Prerequisites

```bash
# Install Go (if not already installed)
sudo apt update
sudo apt install golang-go -y
go version

# Install xcaddy
go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest

# Add Go bin to PATH
echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.bashrc
source ~/.bashrc

# Verify xcaddy installation
xcaddy version
```

#### 2. Build Caddy with Rate Limit Module

```bash
# Create build directory
mkdir -p ~/caddy-build
cd ~/caddy-build

# Build Caddy with rate limit module
xcaddy build --with github.com/mholt/caddy-ratelimit

# Wait for build to complete (2-10 minutes depending on server specs)
# After completion, 'caddy' binary will be in this directory
```

#### 3. Replace Caddy Binary

```bash
# Backup existing Caddy (optional)
sudo mv /usr/bin/caddy /usr/bin/caddy.backup

# Copy new Caddy to /usr/bin/
sudo cp ~/caddy-build/caddy /usr/bin/caddy

# Set permissions
sudo chmod +x /usr/bin/caddy

# Verify module is loaded
/usr/bin/caddy list-modules | grep rate
# Expected output: http.handlers.rate_limit
```

#### 4. Setup Log Directory

```bash
# Create log directory
sudo mkdir -p /var/log/caddy

# Set ownership
sudo chown -R caddy:caddy /var/log/caddy

# Set permissions
sudo chmod 755 /var/log/caddy
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

## Rate Limiting Configuration

If you've installed the rate limit module (see installation steps above), you can add rate limiting to your Caddyfile.

### Example: Basic Rate Limiting

```caddy
your-domain.com {
    # Rate limiting
    rate_limit {
        zone general {
            key {remote_host}
            events 100        # Max 100 requests
            window 1m         # Per 1 minute
        }
    }

    reverse_proxy localhost:8080
}
```

### Example: Different Limits per Endpoint

```caddy
your-domain.com {
    # Strict limit for login endpoint
    @login path /login
    rate_limit @login {
        zone login {
            key {remote_host}
            events 5          # Max 5 requests
            window 5m         # Per 5 minutes
        }
    }

    # Moderate limit for API endpoints
    @api path /api/*
    rate_limit @api {
        zone api {
            key {remote_host}
            events 50         # Max 50 requests
            window 1m         # Per 1 minute
        }
    }

    # Relaxed limit for general pages
    rate_limit {
        zone general {
            key {remote_host}
            events 200        # Max 200 requests
            window 1m         # Per 1 minute
        }
    }

    reverse_proxy localhost:8080
}
```

### Testing Rate Limiting

**For quick testing**, use aggressive limits:

```caddy
rate_limit {
    zone test {
        key {remote_host}
        events 5           # Only 5 requests
        window 10s         # Per 10 seconds
    }
}
```

**Test with curl:**
```bash
for i in {1..10}; do
  curl -i https://your-domain.com 2>&1 | grep "HTTP/"
  echo "Request #$i"
  sleep 0.5
done
```

Expected result:
- Requests 1-5: `HTTP/2 200` ✅
- Requests 6-10: `HTTP/2 429` ❌ (rate limited)

**Test with browser:**
1. Open your website
2. Refresh (F5) 6-7 times quickly
3. You should see **429 Too Many Requests** error

### Apply Changes

After editing Caddyfile:

```bash
# Format Caddyfile (optional but recommended)
sudo caddy fmt --overwrite /etc/caddy/Caddyfile

# Validate configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Restart Caddy
sudo systemctl restart caddy
```
