# tourneur.js

Le Tourneur is a page turner app for Espruini. Perfectly suits musicians, translators or even cooks!

## Operation

### Setup

Insert a CR2032 battery into your Puck.js, pair it with the Bluetooth device you'd like to control and you are ready to go!

### Button interface

 - **Short** press to skip one page.   (It simulates the press of the **right** keyboard key.)
 - **Long**  press to return one page. (It simulates the press of the **left** keyboard key.)

The long press delay can be customized (see _Variables_ below).

### Bilking indicators

 - **First blink**: no Bluetooth connection if **red**, skip if **green**, return if **yellow** (red + green).
 - **Second blink** (red): battery level is under threshold.

### Variables

Som compile-time parameters are exposed. They are reported in the table below:

| Variable            | Default | Description                                                               |
|---------------------|---------|---------------------------------------------------------------------------|
| `EMPTY_BATT_THRESH` |    `20` | Battery level in % below which low battery indicator turns on.            |
| `LONG_PRESS_MILLIS` |   `300` | Minimal press duration in milliseconds for a long press to be registered. |

## Tips & Tricks

Keep the virtual keyboard under Android
: As Le Tourneur acts like a keyboard, but without all the letters and numbers keys, you need to tell Android to keep showing the virtual keyboard in case you want to fill in a text field. This option exists in the Android settings.