# Doom in the browser — corresponding source

This folder is the complete source for the `doom.wasm` and `doom.js` files served on the DadCyberTips Doom page.

- **Engine:** [doomgeneric](https://github.com/ozkl/doomgeneric) by ozkl, a portable fork of id Software's Doom source code
  (the 1999 GPL release of `linuxdoom-1.10`, https://github.com/id-Software/DOOM) with Chocolate Doom code. Licensed **GNU GPL v2** (see `COPYING`).
- **Browser platform layer:** `dgsrc/doomgeneric_wasm.c` and `../doom.js` (written for this site, also GPL-2.0-or-later).
  Other-platform files (SDL, X11, Windows, ...) and the sound back-ends were removed from this copy; **this build has no sound.**
- **Game data:** `../doom1.wad` is the official, unmodified **shareware** Doom v1.9 data file (Episode 1, "Knee-Deep in the Dead"),
  © id Software, which id permits to be distributed freely and unmodified. It is *not* covered by the GPL.
  DOOM is a trademark of id Software LLC / ZeniMax Media. This site is not affiliated with or endorsed by them.
  The full game is sold on Steam and GOG.

## Rebuilding

```
sudo apt install clang lld wasi-libc libclang-rt-dev-wasm32
./build.sh        # writes ../doom.wasm
```
