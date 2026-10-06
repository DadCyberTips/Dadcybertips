// Browser glue for doom.wasm (GPL doomgeneric port). Minimal in-memory WASI shim + game loop.
// GPL-2.0-or-later. Source: see /doom/source/ in this repository.
(function (root) {
  'use strict';
  var TIC_MS = 1000 / 35;

  // --- in-memory file system (holds doom1.wad, plus any config/save files Doom writes) ---
  function makeFS(wad) {
    var files = { 'doom1.wad': wad };
    var fds = {}; var nextFd = 4;
    return {
      open: function (name, create, trunc) {
        name = name.replace(/^\.?\//, '');
        if (!files[name]) { if (!create) return -1; files[name] = new Uint8Array(0); }
        else if (trunc) files[name] = new Uint8Array(0);
        fds[nextFd] = { name: name, pos: 0 }; return nextFd++;
      },
      get: function (fd) { return fds[fd]; },
      file: function (fd) { return files[fds[fd].name]; },
      setFile: function (fd, data) { files[fds[fd].name] = data; },
      close: function (fd) { delete fds[fd]; },
      unlink: function (name) { name = name.replace(/^\.?\//, ''); if (!files[name]) return false; delete files[name]; return true; }
    };
  }

  function start(opts) {
    var canvas = opts.canvas, ctx = canvas.getContext('2d');
    var inst, mem, fs = makeFS(opts.wad), dec = new TextDecoder();
    var running = false, lastTick = 0, imageData = null, log = opts.onLog || function () {};
    var u8 = function () { return new Uint8Array(mem.buffer); };
    var dv = function () { return new DataView(mem.buffer); };

    var wasi = {
      fd_close: function (fd) { fs.close(fd); return 0; },
      fd_fdstat_get: function (fd, buf) {
        var d = dv(); d.setUint8(buf, fd < 3 ? 2 : (fd === 3 ? 3 : 4)); d.setUint16(buf + 2, 0, true);
        d.setBigUint64(buf + 8, 0xFFFFFFFFFFFFFFFFn, true); d.setBigUint64(buf + 16, 0xFFFFFFFFFFFFFFFFn, true); return 0;
      },
      fd_fdstat_set_flags: function () { return 0; },
      fd_prestat_get: function (fd, buf) { if (fd !== 3) return 8; var d = dv(); d.setUint8(buf, 0); d.setUint32(buf + 4, 1, true); return 0; },
      fd_prestat_dir_name: function (fd, p) { u8()[p] = 47; return 0; },
      fd_read: function (fd, iovs, n, outp) {
        var f = fs.get(fd); if (!f) return 8; var data = fs.file(fd), d = dv(), m = u8(), total = 0;
        for (var i = 0; i < n; i++) {
          var ptr = d.getUint32(iovs + i * 8, true), len = d.getUint32(iovs + i * 8 + 4, true);
          var take = Math.min(len, Math.max(0, data.length - f.pos));
          m.set(data.subarray(f.pos, f.pos + take), ptr); f.pos += take; total += take; if (take < len) break;
        }
        d.setUint32(outp, total, true); return 0;
      },
      fd_write: function (fd, iovs, n, outp) {
        var d = dv(), m = u8(), total = 0, i, ptr, len;
        if (fd === 1 || fd === 2) {
          for (i = 0; i < n; i++) { ptr = d.getUint32(iovs + i * 8, true); len = d.getUint32(iovs + i * 8 + 4, true); log(dec.decode(m.subarray(ptr, ptr + len))); total += len; }
          d.setUint32(outp, total, true); return 0;
        }
        var f = fs.get(fd); if (!f) return 8; var data = fs.file(fd);
        for (i = 0; i < n; i++) {
          ptr = d.getUint32(iovs + i * 8, true); len = d.getUint32(iovs + i * 8 + 4, true);
          if (f.pos + len > data.length) { var g = new Uint8Array(f.pos + len); g.set(data); data = g; }
          data.set(m.subarray(ptr, ptr + len), f.pos); f.pos += len; total += len;
        }
        fs.setFile(fd, data); d.setUint32(outp, total, true); return 0;
      },
      fd_seek: function (fd, off, whence, outp) {
        var f = fs.get(fd); if (!f) return 8; var size = fs.file(fd).length; off = Number(off);
        var np = whence === 0 ? off : whence === 1 ? f.pos + off : size + off; if (np < 0) return 28;
        f.pos = np; dv().setBigUint64(outp, BigInt(np), true); return 0;
      },
      path_open: function (dirfd, dirflags, p, plen, oflags, rb, ri, fdflags, outp) {
        var name = dec.decode(u8().subarray(p, p + plen)), fd = fs.open(name, !!(oflags & 1), !!(oflags & 8));
        if (fd < 0) return 44; dv().setUint32(outp, fd, true); return 0;
      },
      path_unlink_file: function (dirfd, p, plen) { return fs.unlink(dec.decode(u8().subarray(p, p + plen))) ? 0 : 44; },
      path_create_directory: function () { return 0; },
      path_remove_directory: function () { return 0; },
      path_rename: function () { return 52; },
      proc_exit: function (code) { running = false; throw new Error('Doom exited (' + code + ')'); }
    };

    var env = {
      js_now_ms: function () { return performance.now(); },
      js_draw: function () {
        var w = inst.exports.dg_width(), h = inst.exports.dg_height(), n = w * h;
        var src = new Uint32Array(mem.buffer, inst.exports.dg_fb(), n);
        if (!imageData) { canvas.width = w; canvas.height = h; imageData = ctx.createImageData(w, h); imageData.dst = new Uint32Array(imageData.data.buffer); }
        var dst = imageData.dst, p;
        for (var i = 0; i < n; i++) { p = src[i]; dst[i] = 0xFF000000 | ((p & 0xFF) << 16) | (p & 0xFF00) | ((p >> 16) & 0xFF); }
        ctx.putImageData(imageData, 0, 0);
      }
    };

    return WebAssembly.instantiate(opts.wasm, { env: env, wasi_snapshot_preview1: wasi }).then(function (r) {
      inst = r.instance; mem = inst.exports.memory;
      inst.exports._initialize(); inst.exports.dg_init();
      function frame(t) {
        if (!running) return;
        if (t - lastTick >= TIC_MS) { lastTick = t; inst.exports.dg_tick(); }
        requestAnimationFrame(frame);
      }
      return {
        run: function () { if (running) return; running = true; lastTick = 0; requestAnimationFrame(frame); },
        pause: function () { running = false; },
        key: function (pressed, code) { inst.exports.dg_key(pressed ? 1 : 0, code); },
        tick: function () { inst.exports.dg_tick(); },
        isRunning: function () { return running; }
      };
    });
  }

  // --- keyboard -> Doom key codes ---
  var MAP = { ArrowLeft: 0xac, ArrowRight: 0xae, ArrowUp: 0xad, ArrowDown: 0xaf, Enter: 13, Escape: 27, Tab: 9, Backspace: 127,
    ControlLeft: 0xa3, ControlRight: 0xa3, Space: 0xa2, ShiftLeft: 0x80 + 0x36, ShiftRight: 0x80 + 0x36, AltLeft: 0x80 + 0x38, AltRight: 0x80 + 0x38,
    Comma: 0xa0, Period: 0xa1, Equal: 0x3d, Minus: 0x2d,
    F1: 0xbb, F2: 0xbc, F3: 0xbd, F4: 0xbe, F5: 0xbf, F6: 0xc0, F7: 0xc1, F8: 0xc2, F9: 0xc3, F10: 0xc4, F11: 0xd7, F12: 0xd8 };
  var WASD = { KeyW: 0xad, KeyS: 0xaf, KeyA: 0xac, KeyD: 0xae, KeyQ: 0xa0, KeyE: 0xa1 };
  function doomKey(e, wasd) {
    if (wasd && WASD[e.code] !== undefined) return WASD[e.code];
    if (MAP[e.code] !== undefined) return MAP[e.code];
    if (e.key && e.key.length === 1) return e.key.toLowerCase().charCodeAt(0);
    return null;
  }

  root.DoomWasm = { start: start, doomKey: doomKey };
})(typeof window !== 'undefined' ? window : globalThis);
