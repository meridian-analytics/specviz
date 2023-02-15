## specviz react

### HID bindings

|context|binding|action|
|--|--|--|
|global|<kbd>Z</kbd>|play|
|global|<kbd>X</kbd>|stop|
||||
|visualizer|mouse click|seek|
|visualizer|mouse click|select annotation|
|visualizer|trackpad|pan|
|visualizer|<kbd>alt</kbd> + wheel|zoom|
|visualizer|mouse click + drag|create annotation|
||||
|navigator|trackpad|pan|
|navigator|mouse click|pan jump|
|navigator|mouse wheel|pan vertical|
|navigator|<kbd>shift</kbd> + mouse wheel|pan horizontal|
|navigator|<kbd>alt</kbd> + wheel|zoom|
|navigator|mouse click + drag|zoom region|

### tasks

- [x] visualization: spectrogram
- [x] visualization: waveform
- [x] visualization: zoom
- [x] visualization: pan
- [x] visualization: sync zoom/pan
- [x] visualization: playhead
- [x] visualization: playhead timestamp on hover
- [ ] visualization: frequency/amplitude, time axes
- [ ] visualization: nonlinear freq axis
- [x] visualization: annotation rects
- [x] cursor: hold alt to render cursor
- [x] cursor: coordinate pair
- [x] cursor: nonlinear axes
- [x] cursor: 1-dimensional variant
- [x] audio: playback
- [x] audio: resume at playhead
- [x] audio: preserve playhead on unmount
- [x] audio: seek to location
- [x] annotation: create
- [x] annotation: playback region
- [x] annotation: playback frequency filter
- [x] annotation: drag selection preview
- [x] annotation: click to select
- [x] annotation: click-drag to select mulitple
- [x] annotation: ctrl-click to add/remove selection
- [x] annotation: 1-dimensional variant
- [x] annotation: click-drag to move
- [x] tools: annotation tool
- [x] tools: selection tool
- [x] tools: zoom tool
- [x] tools: pan tool
- [x] navigator: show visible region
- [x] navigator: playhead
- [x] navigator: wheel to zoom
- [x] navigator: wheel to pan
- [x] navigator: click to jump
- [x] navigator: click + drag zoom to slection
- [x] navigator: annotation rects
- [x] bindings: keyboardevent
- [ ] bindings: mouseevent
- [ ] bindings: wheelevent
- [x] ux: 2-dimensional zoom
- [x] ux: declarative audio/visual loading
- [x] ux: zoom center on cursor
- [ ] bug: audio sometimes does not stop on unmount
