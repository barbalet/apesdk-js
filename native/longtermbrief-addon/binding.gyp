{
  "targets": [
    {
      "target_name": "longtermbrief",
      "sources": ["addon.c"],
      "include_dirs": [
        "../../longtermbrief/longtermbrief"
      ],
      "libraries": [
        "<!@(node -p \"require('path').resolve(__dirname, '../../longtermbrief/longtermbrief/liblongtermbrief.a')\")",
        "-lpthread",
        "-lm",
        "-lz"
      ],
      "conditions": [
        ["OS=='mac'", {
          "xcode_settings": {
            "OTHER_LDFLAGS": ["-lpthread", "-lm", "-lz"]
          }
        }]
      ]
    }
  ]
}
