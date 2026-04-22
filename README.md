<p align="center">
  <img src="./public/banner.png" width="400" height="120" />
</p>

<p align="center">
  Design your GitHub contribution graph. Click dates, generate commits, transform your profile.
</p>

## Preview

<img width="2926" height="1674" alt="image" src="https://github.com/user-attachments/assets/f836365f-f27d-4195-b20f-72a655541b38" />
<br><br>
<img width="2938" height="1682" alt="image" src="https://github.com/user-attachments/assets/83d2c96d-7d64-4c6c-b1a0-b8ba57fde34c" />

## Live Proof

[SEE IT YOURSELF](https://github.com/rishabnotfound?tab=overview&from=2007-12-01&to=2007-12-31)

![alt text](./public/proof.png)

## How It Works

1. **Sign in** — Connect your GitHub account via OAuth
2. **Pick dates** — Click on the contribution graph to select dates
3. **Set commits** — Choose how many commits per date (1-15)
4. **Generate** — We create real commits with backdated timestamps
5. **Done** — Your GitHub profile updates within minutes

All commits go to a private repository named `Commitify-{username}`. You can delete it anytime from Settings.

## Tech Stack

| Tech | Purpose |
|------|---------|
| Next.js 14 | React framework (App Router) |
| TypeScript | Type safety |
| MongoDB | User data storage |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| GitHub OAuth | Authentication |
| GitHub API | Commit operations |

## Your Data is Safe

- We only store your GitHub username, email, and access token
- **Tokens are encrypted** with AES-256-GCM before storage
- We never store your GitHub password
- We don't sell or share your data with anyone
- You can delete your account and all data anytime
- The code is open source — verify it yourself

## Self Hosting

```bash
# Clone
git clone https://github.com/rishabnotfound/Commitify.git
cd Commitify

# Install
npm install

# Configure
cp .env.example .env
```

Fill in your `.env`:

```env
MONGODB_URI=your_mongodb_connection_string
GITHUB_CLIENT_ID=your_github_oauth_app_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_secret
ENCRYPTION_KEY=32_byte_hex_string_for_encryption
SESSION_SECRET=random_string_for_cookies
```

```bash
# Run
npm run dev
```

## Disclaimer

This tool generates real commits with backdated timestamps. This may violate GitHub's Terms of Service. Your account could be flagged, suspended, or banned. **Use at your own risk.** We are not responsible for any consequences. See [Terms of Service](https://commitify.site/terms) for full details.

## License

[MIT](LICENSE)

## Credits

Built by [rishabnotfound](https://github.com/rishabnotfound)
