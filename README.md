# Lumen — Ambient Canvas

A no-build, static screensaver playground made with plain HTML, CSS, and JavaScript. It is ready for GitHub Pages: there is no npm, Node.js, React, bundler, package manager, or compile step required to host it.

## Quick start

1. Download/extract this folder.
2. Open `index.html`, or serve it locally for a more realistic test:

   ```bash
   cd lumen-screensaver
   python -m http.server 8000
   ```

   Visit `http://localhost:8000`.

3. To publish it, push the folder contents to a GitHub repository. In **Settings → Pages**, choose **Deploy from a branch**, select your branch (usually `main`) and the repository root (`/`). Save. GitHub Pages serves `index.html` directly; there is nothing to build.

   Keep `index.html`, `css/`, and `js/` together with the same folder structure. The included `.nojekyll` file is harmless for a plain static site.

## What is included

- **54 endless animated scenes:** ambient, nature, cosmic, abstract, retro-tech, terminal, and operating-system-inspired scenes. Includes Blue Screen of Death, Black Screen of Death, Windows/macOS/Linux update simulations, Kernel Panic, BIOS, retro desktop, synthwave, underwater, storm, DNA helix, fractal bloom, wireframe worlds, and many more.
- **Draggable widgets:** local clock/date, rotating thought, focus timer, sticky note, countdown, world clock, web iframe, and battery indicator (only when supported by the browser).
- **Save and restore:** scene, widget positions/content, speed, density, glow, palette, and autopilot settings are saved in the browser's `localStorage` on that device.
- **Display controls:** fullscreen canvas, clean view, pause/resume, scene switching, search/filter, speed/density sliders, five palettes, and timed scene rotation.
- **Keyboard shortcuts:** `F` fullscreen, `H` clean view, `Space` pause/resume, `←` / `→` switch scenes, `/` focus the scene search, and `Esc` close a dialog.
- **No downloaded art required:** the backgrounds are drawn by Canvas. Google Fonts and the UI libraries load from CDNs, so the page needs an internet connection for those external dependencies.

## Libraries

- [Tailwind CSS Play CDN](https://tailwindcss.com/docs/installation/play-cdn) — utility classes without a build step.
- [Preline UI](https://preline.co/docs/) — included for its browser-side component interactions.
- [GSAP](https://gsap.com/docs/v3/Installation/) — lightweight entrance and widget transitions.
- [Lucide](https://lucide.dev/guide/packages/lucide) — interface icons.
- Google Fonts — DM Sans, Space Grotesk, and DM Mono.

No packages need to be installed. The library versions and CDN URLs are defined in `index.html`.

**Production trade-off:** Tailwind's official Play CDN is intended for development/prototyping, not an optimized production build. This project uses it deliberately to honor the strict zero-build requirement. GitHub Pages can serve it as-is, but the browser compiles utility classes at runtime and the site depends on the external CDN. For a more optimized production setup, precompile Tailwind CSS; that would introduce a build step, so it is intentionally not done here.

## Web panel / iframe limitations

A web panel can embed a URL only if the remote site permits iframe embedding. Some sites block this using `X-Frame-Options` or Content Security Policy (`frame-ancestors`); no front-end workaround can override those browser protections. You can usually embed your own site if its response headers allow it. This page cannot freely extract a portion of a different website because of the browser's same-origin security model. For a blocked URL, open it in a separate tab or adjust the site's headers if you control it.

## Settings and privacy

The layout is stored locally in the browser under `lumen-ambient-canvas-v1`. There is no account, backend, analytics, or server-side database in this project. Clearing this site's browser storage resets the layout. The embedded URL itself may set its own cookies/storage when it loads, subject to its own policies and browser settings.

## Troubleshooting

- **Icons/fonts/styles missing:** confirm internet access and check that the CDNs are not blocked by an extension, network filter, or content policy.
- **Iframe remains blank:** the target site likely disallows embedding, requires authentication that cannot be used inside an iframe, or does not support third-party cookies.
- **Fullscreen doesn't start:** start it using the on-screen button or `F`; browsers require a user gesture. Press `Esc` to exit.
- **Settings don't persist:** ensure site storage is available and not cleared automatically by browser privacy settings.
