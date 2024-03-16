# Hack Pompey 2024 - Spotify Stat App 🎵

This is a web app that uses the Spotify API to display a user's top tracks and artists. It was created for Hack Pompey 2024.

![GIF of the app](./public/demo.gif)

Created with [T3 🚀](https://create.t3.gg/).

## Installation 🧰

To install packages and run the app:

```bash
yarn && yarn dev
```

The project uses NextAuth to authenticate users with Spotify. To access the Spotify API, a `.env` with the following secrets is required:

```env
SPOTIFY_CLIENT_ID=<your client id>
SPOTIFY_CLIENT_SECRET=<your client secret>
```
