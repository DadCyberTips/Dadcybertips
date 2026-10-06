#!/bin/sh
# Builds doom.wasm from the GPL doomgeneric sources with clang + wasi-libc (no Emscripten needed).
# Needs: clang, lld, wasi-libc, libclang-rt-dev-wasm32 (Ubuntu: apt install clang lld wasi-libc libclang-rt-dev-wasm32)
set -e
cd "$(dirname "$0")/dgsrc"   # output: ../doom.wasm (the file the page loads)
SRCS="dummy am_map doomdef doomstat dstrings d_event d_items d_iwad d_loop d_main d_mode d_net f_finale f_wipe g_game hu_lib hu_stuff info i_cdmus i_endoom i_joystick i_scale i_sound i_system i_timer memio m_argv m_bbox m_cheat m_config m_controls m_fixed m_menu m_misc m_random p_ceilng p_doors p_enemy p_floor p_inter p_lights p_map p_maputl p_mobj p_plats p_pspr p_saveg p_setup p_sight p_spec p_switch p_telept p_tick p_user r_bsp r_data r_draw r_main r_plane r_segs r_sky r_things sha1 sounds statdump st_lib st_stuff s_sound tables v_video wi_stuff w_checksum w_file w_main w_wad z_zone w_file_stdc i_input i_video doomgeneric doomgeneric_wasm"
FILES=""; for s in $SRCS; do FILES="$FILES $s.c"; done
EXPORTS=""; for e in dg_key dg_init dg_tick dg_fb dg_width dg_height; do EXPORTS="$EXPORTS -Wl,--export=$e"; done
clang --target=wasm32-wasi -O2 -w -I/usr/include/wasm32-wasi -L/usr/lib/wasm32-wasi \
  -mexec-model=reactor -Wl,--no-entry $EXPORTS \
  -Wl,--initial-memory=50331648 -Wl,--max-memory=268435456 -Wl,--stack-first -Wl,-z,stack-size=1048576 -Wl,--strip-all \
  $FILES -lm -o ../../doom.wasm
ls -la ../../doom.wasm
