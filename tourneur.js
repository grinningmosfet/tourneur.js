/**
 * tourneur.js
 * 
 * Le Tourneur is a page turner app for Espruini.
 *
 * @author Pierre "grinningmosfet" Guillod (maintainer) and contributors
 * @version 1.2.0
 *
 * This file is part of Le Tourneur.
 *
 * Le Tourneur is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Le Tourneur is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with Le Tourneur. If not, see <https://www.gnu.org/licenses/>.
 */

var EMPTY_BATT_THRESH = 20;
var LONG_PRESS_MILLIS = 300;

var kb = require("ble_hid_keyboard");
NRF.setServices(undefined, { hid : kb.report });

var timoutObj = null;

/**
 * btnPressed
 * Callback for button press
 * 
 * Starts a timeout that will issue
 * a long press action after timing
 * out.
 * 
 * \return void
 */

function btnPressed() {
  timoutObj = setTimeout(function(){
    timoutObj = null;
    try {
      kb.tap(kb.KEY.LEFT,0);
      ledsAnim("rev");
    } catch (error) {
      ledsAnim("error");
    }
  }, LONG_PRESS_MILLIS);
}

/**
 * btnReleased
 * Callback for button release
 * 
 * If the timeout us still running,
 * the long press delay was not reached.
 * Therefore, the timeout needs to be
 * stopped and a forward action must
 * be issued.
 * 
 * \return void
 */

function btnReleased() {
  if (timoutObj) {
    clearTimeout(timoutObj);
    timoutObj = null;
    try {
      kb.tap(kb.KEY.RIGHT,0);
      ledsAnim("fwd");
    } catch (error) {
      ledsAnim("error");
    }
  }
}

setWatch(btnPressed,  BTN, {edge:"rising", repeat:true,debounce:50});
setWatch(btnReleased, BTN, {edge:"falling",repeat:true,debounce:50});

/**
 * ledsAnim
 * LEDs animations handler
 *
 * \param level: characterizes the animation <"feedback"|"error">
 * \return void
 */

function ledsAnim(level) {
  var BLACK  = 0;
  var RED    = 1;
  var GREEN  = 2;
  var BLUE   = 4;
  var WHITE  = RED + GREEN + BLUE;
  var YELLOW = RED + GREEN;

  switch(level) {
    case "fwd":
      digitalWrite([LED3,LED2,LED1],GREEN);
      setTimeout(function(){digitalWrite([LED3,LED2,LED1],BLACK);},    5);
      if(isBattUnderThresh(EMPTY_BATT_THRESH)) {
        setTimeout(function(){digitalWrite([LED3,LED2,LED1],RED);}, 200);
        setTimeout(function(){digitalWrite([LED3,LED2,LED1],BLACK);},  205);
      }
      break;
    case "rev":
      digitalWrite([LED3,LED2,LED1],YELLOW);
      setTimeout(function(){digitalWrite([LED3,LED2,LED1],BLACK);},    5);
      if(isBattUnderThresh(EMPTY_BATT_THRESH)) {
        setTimeout(function(){digitalWrite([LED3,LED2,LED1],RED);}, 200);
        setTimeout(function(){digitalWrite([LED3,LED2,LED1],BLACK);},  205);
      }
      break;
    case "error":
      digitalWrite([LED3,LED2,LED1],RED);
      setTimeout(function(){digitalWrite([LED3,LED2,LED1],BLACK);},    5);
      if(isBattUnderThresh(EMPTY_BATT_THRESH)) {
        setTimeout(function(){digitalWrite([LED3,LED2,LED1],RED);}, 200);
        setTimeout(function(){digitalWrite([LED3,LED2,LED1],BLACK);},  205);
      }
      break;
  }
}

/**
 * isBattUnderThresh
 * Compares battery level to arbitrary threshold.
 *
 * \param thresh: threshold
 * \return boolean: if the current battery level is under the threshold
 */
function isBattUnderThresh(thresh) {
  return E.getBattery() < thresh;
}