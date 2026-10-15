# Sujay's Cosmic GitHub Profile Kit

This package includes the exact uploaded wallpaper video, the looping GIF rendered from that video, a futuristic README, contribution-snake automation, and two playable mini-games hosted separately on GitHub Pages.

## Package structure

```text
README.md
assets/
  singularity-cosmic-vortex-moewalls-com.mp4   # exact original uploaded video
  cosmic-header.gif                            # converted from that video
  cosmic-divider.svg
.github/
  workflows/
    snake.yml                                  # video GIF + snake contribution animation
    pages.yml                                  # deploys the mini-arcade
site/
  index.html                                   # game hub
  games.js                                     # playable mini-games
  assets/
    cosmic-header.gif
    cosmic-divider.svg
    orbital-drift.svg
    signal-memory.svg
```

## 1. Put the files in the right repository

1. Your GitHub profile repository must be **public** and named exactly after the username (for example `SujayMohanty/SujayMohanty`). If your actual username differs, update the `SujayMohanty` links in `README.md` and the README's Game Hub URLs.
2. Extract the ZIP.
3. Upload/commit the *contents* of the ZIP so `README.md`, `assets/`, `.github/`, and `site/` are at the repository root. Don't upload the ZIP itself as the only repository file.
4. Keep the exact file name `assets/singularity-cosmic-vortex-moewalls-com.mp4`; the workflow expects that path.
5. Commit to the `main` branch.

## 2. Make the contribution snake work

1. Open **Settings → Actions → General → Workflow permissions**.
2. Enable read/write access for `GITHUB_TOKEN` if repository content write access is restricted.
3. Open **Actions → Refresh cosmic video header and contribution snake → Run workflow**.
4. When successful, the `output` branch contains `github-snake.svg` and `github-snake-dark.svg`. Reload the README after the job completes.
5. If the snake fails, inspect the Actions job log; a README cannot run JavaScript directly, so this is the SVG contribution calendar animation, not a playable game embedded in Markdown.

## 3. Publish the interactive games (GitHub Pages)

The README links to `https://sujaymohanty.github.io/SujayMohanty/`. The games are regular HTML/JS and must be hosted as a website—GitHub strips scripts from README content.

1. Open **Settings → Pages** in the repository.
2. Under **Build and deployment**, set the source to **GitHub Actions**.
3. Open **Actions → Deploy Cosmic Mini Arcade → Run workflow** (or make a commit under `site/` to trigger it).
4. Wait for the green check mark. Visit `https://sujaymohanty.github.io/SujayMohanty/`.
5. If your GitHub username or profile repository name is different, replace the URL in README and in this guide with `https://YOUR_USERNAME.github.io/YOUR_USERNAME/`.

### Games included

- **Orbital Drift:** Use arrow keys or A/D to move. Dodge purple asteroids and collect cyan energy orbs. On mobile, hold the left/right buttons. Three collisions end the run. High score is saved in browser local storage.
- **Signal Memory:** Press Start, watch the color-pad sequence, and repeat it. The sequence grows each round. Best level is saved on your device.

The games run in the user's browser and don't need a server or API. Keyboard controls, touch controls, status messages, and restart actions are included.

## 4. Updating the original video banner

The GIF in `assets/cosmic-header.gif` was rendered directly from your exact MP4. GitHub README doesn't reliably autoplay MP4 backgrounds, so the README loads the GIF. The Actions workflow regenerates the GIF from the original MP4 when run. You can also run the same ffmpeg step locally if you want a different crop or text placement.

## Files

- `README.md` — profile content
- `assets/` — original MP4 + GitHub-compatible GIF + divider
- `.github/workflows/snake.yml` — header and snake updater
- `.github/workflows/pages.yml` — GitHub Pages deployer for the arcade
- `site/` — source for the games website
