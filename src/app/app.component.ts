import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
}
AFRAME.registerComponent('foo', {
  init: function () {
    document.onkeydown = checkKey;
    var lastrot = "none"
    // this.el.addEventListener('loaded', (e) => {
    //   box.emit('first');
    //   console.log("starting here")
    // })
    function checkKey(e) {
      e = e || window.event;
      var cards = document.getElementById('hexagon')
      if (e.keyCode == '86') {
        // this is the c key
        full_body_carousel_right_move(cards)
      }
      if (e.keyCode == '67') {
        // this is the v key
        full_body_carousel_left_move(cards)
      }
    }

    // this is the function to rotate and move all the cards to the right
    function full_body_carousel_right_move(cards) {
      console.log("entering this function")
      if (lastrot == "none") {
        cards.emit("rot0");
        lastrot = "rot0";
      } else {
        console.log()
        lastrot = "rot" + (String((Number(lastrot[3]) + 1) % 6));
        console.log(lastrot)
        cards.emit(lastrot);
      }
    }

    // this is the function to rotate and move all the cards to the left
    function full_body_carousel_left_move(cards) {
      console.log("entering this function")
      if (lastrot == "none" || lastrot == "rot0") {
        cards.emit("rot5");
        lastrot = "rot5";
      } else {
        console.log()
        lastrot = "rot" + (String((Number(lastrot[3]) - 1) % 6));
        console.log(lastrot)
        cards.emit(lastrot);
      }
    }
  }
})

