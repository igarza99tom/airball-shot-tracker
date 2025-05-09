# Firebase Commands for Airball Shot Tracker

This reference guide contains useful Firebase commands for developing and deploying the Airball Shot Tracker app.

## Essential Commands

### 1. Local Testing

```bash
# Standard local server
firebase serve

# Make server accessible from other devices on your network
firebase serve --host 0.0.0.0
```

The `--host 0.0.0.0` flag makes the server accessible from other devices on your network.
Access from your phone by using your computer's IP address (<http://your-ip:5000>).

### 2. Deploy to Production

```bash
firebase deploy --only hosting
```

Deploys only the hosting part of the app (faster than full deployment).

### 3. Preview Channels

```bash
# Create a preview channel
firebase hosting:channel:create preview

# Deploy to a preview channel
firebase hosting:channel:deploy preview
```

Creates and deploys to isolated preview URLs for testing without affecting the production site.

### 4. Local Emulators

```bash
firebase emulators:start

# Make emulators accessible from other devices
firebase emulators:start --host 0.0.0.0
```

Runs local versions of Firebase services for development without affecting production data.

### 5. View Deployment Channels

```bash
firebase hosting:channel:list
```

Lists all deployment channels and their URLs.

### 6. Open Current Deployment

```bash
firebase open hosting
```

Opens the deployed app in a browser.

### 7. GitHub Integration

```bash
firebase init hosting:github
```

Sets up automatic deployment when pushing to GitHub repository.

## Troubleshooting Local Testing

### Finding Your Computer's IP Address

- Windows: Run `ipconfig` in Command Prompt
- Mac/Linux: Run `ifconfig` or `ip addr` in Terminal
- Look for the IPv4 address (usually starts with 192.168.x.x)

## Workflow Strategies

### Regular Development

1. Make changes locally
2. Test with `firebase serve --host 0.0.0.0`
3. When ready: `firebase deploy --only hosting`

### Sharing with Testers

1. Create a preview channel: `firebase hosting:channel:create friends-test`
2. Deploy to that channel: `firebase hosting:channel:deploy friends-test`
3. Share the unique URL
4. Collect feedback and iterate

### Feature Development

1. Create feature-specific channel: `firebase hosting:channel:create feature-name`
2. Deploy iterations to that channel
3. Test thoroughly
4. When ready, deploy to production

## Common Issues

- If deployment fails, check Firebase console for error messages
- Preview channels expire after 7 days by default
- Local emulators require separate setup: `firebase setup:emulators:XXX`

## Project Structure

The Airball Shot Tracker project is configured for Firebase Hosting. Other Firebase services may be added later as needed.
