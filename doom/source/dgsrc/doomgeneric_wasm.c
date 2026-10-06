// doomgeneric platform layer for the browser (WebAssembly + WASI), written for dadcybertips.com.
// Licensed GPL-2.0-or-later, same as doomgeneric / id Software's 1999 GPL Doom source release.
#include <stdint.h>
#include "doomkeys.h"
#include "doomgeneric.h"
#include "doomstat.h"
#include "d_player.h"
#include "g_game.h"

#define WASM_IMPORT(name) __attribute__((import_module("env"), import_name(name)))
#define WASM_EXPORT(name) __attribute__((export_name(name)))

WASM_IMPORT("js_draw") extern void js_draw(void);
WASM_IMPORT("js_now_ms") extern double js_now_ms(void);
WASM_IMPORT("js_level_complete") extern void js_level_complete(int epsd, int last, int skill, int kills, int maxkills,
    int items, int maxitems, int secrets, int maxsecrets, int time_tics, int par_tics, int cheated);

#define KEYQUEUE_SIZE 64
static unsigned short key_queue[KEYQUEUE_SIZE];
static unsigned int kq_write = 0, kq_read = 0;
static double start_ms = 0;

void DG_Init(void) { start_ms = js_now_ms(); }
void DG_DrawFrame(void) { js_draw(); }
void DG_SleepMs(uint32_t ms) { (void)ms; }  // the browser drives timing; never block
uint32_t DG_GetTicksMs(void) { return (uint32_t)(js_now_ms() - start_ms); }
void DG_SetWindowTitle(const char *title) { (void)title; }

int DG_GetKey(int *pressed, unsigned char *key)
{
    if (kq_read == kq_write) return 0;
    unsigned short d = key_queue[kq_read];
    kq_read = (kq_read + 1) % KEYQUEUE_SIZE;
    *pressed = d >> 8;
    *key = d & 0xFF;
    return 1;
}

WASM_EXPORT("dg_key") void dg_key(int pressed, int doomkey)
{
    key_queue[kq_write] = (unsigned short)((pressed << 8) | (doomkey & 0xFF));
    kq_write = (kq_write + 1) % KEYQUEUE_SIZE;
}

WASM_EXPORT("dg_init") void dg_init(void)
{
    static char *argv[] = { "doom", "-iwad", "doom1.wad", 0 };
    doomgeneric_Create(3, argv);
}
WASM_EXPORT("dg_tick") void dg_tick(void) { doomgeneric_Tick(); }
WASM_EXPORT("dg_fb") uint32_t *dg_fb(void) { return DG_ScreenBuffer; }
WASM_EXPORT("dg_width") int dg_width(void) { return DOOMGENERIC_RESX; }
WASM_EXPORT("dg_height") int dg_height(void) { return DOOMGENERIC_RESY; }

// Called from WI_Start() when a level is finished (single player only).
void dg_level_complete(wbstartstruct_t *wb)
{
    if (netgame || deathmatch) return;
    int cheated = (players[consoleplayer].cheats & (CF_NOCLIP | CF_GODMODE)) ? 1 : 0;
    js_level_complete(wb->epsd, wb->last, (int)gameskill, wb->plyr[0].skills, wb->maxkills, wb->plyr[0].sitems, wb->maxitems,
                      wb->plyr[0].ssecret, wb->maxsecret, wb->plyr[0].stime, wb->partime, cheated);
}

#ifdef DG_TEST   /* test builds only: lets the smoke test finish a level instantly */
WASM_EXPORT("dg_test_exit") void dg_test_exit(void) { G_ExitLevel(); }
#endif

// wasi-libc has no system(); i_system.c calls it to pop up an error dialog on some platforms.
int system(const char *cmd) { (void)cmd; return -1; }
