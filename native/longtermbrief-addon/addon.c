#include <node_api.h>
#include <stdlib.h>
#include <string.h>

// longtermbrief exports (see longterm.c bottom).
void lib_init(void);
void lib_close(void);
int  lib_quit_check(void);
void lib_check_string(char *incoming);

static napi_value js_init(napi_env env, napi_callback_info info) {
  (void)info;
  lib_init();
  napi_value ret;
  napi_get_undefined(env, &ret);
  return ret;
}

static napi_value js_close(napi_env env, napi_callback_info info) {
  (void)info;
  lib_close();
  napi_value ret;
  napi_get_undefined(env, &ret);
  return ret;
}

static napi_value js_quit_check(napi_env env, napi_callback_info info) {
  (void)info;
  napi_value ret;
  napi_get_boolean(env, lib_quit_check() ? 1 : 0, &ret);
  return ret;
}

static napi_value js_check_string(napi_env env, napi_callback_info info) {
  size_t argc = 1;
  napi_value argv[1];
  napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

  if (argc < 1) {
    napi_throw_type_error(env, NULL, "checkString(str) requires one string argument");
    napi_value ret;
    napi_get_undefined(env, &ret);
    return ret;
  }

  // Determine required buffer size.
  size_t len = 0;
  napi_status st = napi_get_value_string_utf8(env, argv[0], NULL, 0, &len);
  if (st != napi_ok) {
    napi_throw_type_error(env, NULL, "checkString(str) argument must be a string");
    napi_value ret;
    napi_get_undefined(env, &ret);
    return ret;
  }

  char *buf = (char *)malloc(len + 1);
  if (!buf) {
    napi_throw_error(env, NULL, "Out of memory");
    napi_value ret;
    napi_get_undefined(env, &ret);
    return ret;
  }

  size_t copied = 0;
  napi_get_value_string_utf8(env, argv[0], buf, len + 1, &copied);
  buf[copied] = '\0';

  lib_check_string(buf);
  free(buf);

  napi_value ret;
  napi_get_undefined(env, &ret);
  return ret;
}

static napi_value init(napi_env env, napi_value exports) {
  napi_property_descriptor desc[] = {
    {"init", 0, js_init, 0, 0, 0, napi_default, 0},
    {"close", 0, js_close, 0, 0, 0, napi_default, 0},
    {"quitCheck", 0, js_quit_check, 0, 0, 0, napi_default, 0},
    {"checkString", 0, js_check_string, 0, 0, 0, napi_default, 0},
  };
  napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);
  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init)
