## specviz react

### HID bindings

|context|binding|action|
|--|--|--|
|global|<kbd>Z</kbd>|play|
|global|<kbd>X</kbd>|stop|
||||
|visualizer|mouse click|seek|
|visualizer|trackpad|pan|
|visualizer|<kbd>alt</kbd> + wheel|zoom|
||||
|navigator|trackpad|pan|
|navigator|mouse click|pan jump|
|navigator|mouse wheel|pan vertical|
|navigator|<kbd>shift</kbd> + mouse wheel|pan horizontal|
|navigator|<kbd>alt</kbd> + wheel|zoom|

### tasks

- [x] visualization: spectrogram
- [x] visualization: waveform
- [x] visualization: zoom
- [x] visualization: pan
- [x] visualization: sync zoom/pan
- [x] visualization: playhead
- [ ] visualization: frequency/amplitude, time axes
- [ ] visualization: nonlinear freq axis
- [x] audio: playback
- [x] audio: resume at playhead
- [x] audio: preserve playhead on unmount
- [x] audio: seek to location
- [ ] annotation: create
- [ ] annotation: playback region
- [ ] annotation: playback filter
- [ ] tools: annotation tool
- [ ] tools: zoom tool
- [ ] tools: pan tool
- [x] navigator: show visible region
- [x] navigator: playhead
- [x] navigator: wheel to zoom
- [x] navigator: wheel to pan
- [x] navigator: click to jump
- [x] bindings: keyboardevent
- [ ] bindings: mouseevent
- [ ] bindings: wheelevent
- [x] ux: declarative audio/visual loading
- [ ] ux: reset zoom/pan when changing audio/visual?
