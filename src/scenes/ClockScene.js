export class ClockScene extends Phaser.Scene {
  constructor() {
    super('ClockScene');
    this.emitter = new Phaser.Events.EventEmitter(); // Create emitter instance
  }

  preload() {
    // No assets to load
  }

  create() {
    const style = {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'left'
    };

    // Text placeholders
    this.dateText = this.add.text(10, 10, 'Date: Loading...', style).setOrigin(0, 0);
    this.timeText = this.add.text(this.scale.width - 10, this.scale.height - 10, 'Time: Loading...', style)
      .setOrigin(1, 1);

    // Subscribe to custom event
    this.emitter.on('time:update', ({ date, time }) => {
      this.smoothUpdateText(this.dateText, `Date: ${date}`);
      this.smoothUpdateText(this.timeText, `Time: ${time}`);
    });

    // Cleanup on shutdown
    this.events.once('shutdown', () => {
        this.emitter.off('time:update', this.updateTimeHandler);
    });

    // Initial call and interval setup
    this.fetchAndEmitTime();
    this.time.addEvent({
      delay: 60 * 1000,
      callback: this.fetchAndEmitTime,
      callbackScope: this,
      loop: true
    });

    this.scale.on('resize', this.resize, this);
  }

  async fetchAndEmitTime() {
    try {
      const response = await fetch('https://worldtimeapi.org/api/timezone/Europe/Sofia');
      const data = await response.json();
      const utcDateTime = data.utc_datetime;

      const [date, timeWithMs] = utcDateTime.split('T');
      const time = timeWithMs.split('.')[0]; // Remove milliseconds

      // Emit the formatted date and time
      this.emitter.emit('time:update', { date, time });
    } catch (err) {
      console.error('Failed to fetch time:', err);
    }
  }

  smoothUpdateText(textObject, newValue) {
    // Fade out
    this.tweens.add({
      targets: textObject,
      alpha: 0,
      duration: 250,
      ease: 'Power1',
      onComplete: () => {
        textObject.setText(newValue); // Update text
        // Fade in
        this.tweens.add({
          targets: textObject,
          alpha: 1,
          duration: 250,
          ease: 'Power1'
        });
      }
    });
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    this.timeText.setPosition(width - 10, height - 10);
  }
}