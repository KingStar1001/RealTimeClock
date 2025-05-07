# RealTimeClock

The app by using Phaser's scene lifecycle to set up the UI and an event emitter to separate the data-fetching logic from the UI updates. Every 60 seconds, the time data is fetched and emitted as an event, allowing the UI to update whenever the new data arrives.
