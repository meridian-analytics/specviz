## <a name="top"></a> @meridian_cfi/specviz-monorepo
* [intro](#intro)
* [examples](#examples)
* [docs](#docs)
* [dev](#dev)

## <a name="intro"></a> intro

Specviz is a customizable javascript library to display pre-computed spectrograms, built on top of React, SVG, and WebAudio. It currently provides the following main features, most of which can be opted in or out:

* Pre-computed spectrogram and waveform loading
* Zoom and pan navigation synchronized across multiple visuals
* Corresponding audio file playback
* Annotation tool for creating bounding boxes on the spectrogram and adding domain-specific data
* Listen to annotated regions with real-time frequency audio filter
* User-defined layouts and styles

Note that this library does not currently handle the spectrogram computation. This must be handled by the user in the backend or frontend and supplied to Specviz with a URL. It was originally inspired by [wavesurfer.js](https://wavesurfer-js.org/) and APLOSE.

![resources/example-advanced-annotation.webp](resources/example-advanced-annotation.webp)

<small>[back to top](#top)</small>
## <a name="examples"></a> examples

This repo contains several example packages to demostrate various features and configurations of Specviz.

* `example-basic-annotation`
* `example-basic-audio`
* `example-basic-spectrogram`
* `example-interactive-spectrogram`
* `example-advanced-annotation`

To run the examples, install the development dependencies, change to the example's directory, and run the `dev` script.

```sh
> bun install
> cd examples/example-advanced-annotation
> bun dev
```

The example webserver will display the connection URL. In the default case, [http://localhost:5173](http://localhost:5173).

```none
VITE v5.4.8  ready in 205 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

<small>[back to top](#top)</small>
## <a name="docs"></a> docs

See `packages/specviz/readme.md`.

<small>[back to top](#top)</small>
## <a name="dev"></a> dev

See the [examples](#examples) section to start the development webserver.

Run linter and formatter.

```sh
> bun check
```

```none
@meridian_cfi/specviz-example-basic-audio check $ biome check --write .
│ Checked 5 files in 10ms. No fixes applied.
└─ Done in 63 ms
@meridian_cfi/specviz-example-basic-spectrogram check $ biome check --write .
│ Checked 5 files in 5ms. No fixes applied.
└─ Done in 63 ms
@meridian_cfi/specviz-example-interactive-spectrogram check $ biome check --write .
│ Checked 5 files in 4ms. No fixes applied.
└─ Done in 66 ms
@meridian_cfi/specviz-example-advanced-annotation check $ biome check --write .
│ Checked 5 files in 24ms. No fixes applied.
└─ Done in 74 ms
@meridian_cfi/specviz-example-basic-annotation check $ biome check --write .
│ Checked 5 files in 9ms. No fixes applied.
└─ Done in 63 ms
@meridian_cfi/specviz check $ biome check --write .
│ Checked 24 files in 20ms. No fixes applied.
└─ Done in 70 ms
```

Run typescript compiler for all packages.

```sh
> bun tsc
```

```none
@meridian_cfi/specviz-example-basic-audio tsc $ tsc
└─ Done in 1.08 s
@meridian_cfi/specviz-example-basic-spectrogram tsc $ tsc
└─ Done in 1.38 s
@meridian_cfi/specviz-example-interactive-spectrogram tsc $ tsc
└─ Done in 1.07 s
@meridian_cfi/specviz-example-advanced-annotation tsc $ tsc
└─ Done in 1.42 s
@meridian_cfi/specviz-example-basic-annotation tsc $ tsc
└─ Done in 1.39 s
@meridian_cfi/specviz tsc $ tsc
└─ Done in 988 ms
```

<small>[back to top](#top)</small>
