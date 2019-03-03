import { Component } from '@angular/core';
// import { Quaternion, Euler, Matrix4, Renderer, Mesh, CylinderGeometry, MeshPhongMaterial } from 'three';
import { environment } from '../environments/environment'
import { start } from 'repl';
import { CopyShader } from 'three';

var Leap = require('leapjs');
require('leapjs-plugins')

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
}
// TODO : Implement a JSON based decision to decide which gestures are active in this view.
AFRAME.registerComponent('leap',{
  init: function(){
    var self = this;
    self.startTime;
    self.safeDetect = true;
    Leap.loop({
      host:"192.168.0.101",  // Todo: Must find a way to extract this out from the command line parameters
      background: true,
      enableGestures: true,
      optimizeHMD:true
    },function(frame){
      if(self.safeDetect == true){ // Lock-unlock mech to make sure it detects and emits gestures at human possible speeds.
        self.detect(frame,self);
        // console.log(self.safeDetect);
      }
      else{
        var elapsed = new Date().getTime() - self.startTime;
        // console.log(elapsed);
        if(elapsed > 1000){
          self.safeDetect = true;
          console.log("Gesture unlocked");
        }
      }
    })
  },
  detect: function(frame,parent){
    // This bifurcation is made so that selection options can be easily not check functions they aren't supposed to
    // Yes, Just like a tree structure, my friend. Here it'll mostly be a Two-level thing
    parent.inbuiltGestures(frame,parent);   
    parent.simpleFingerGestures(frame,parent);
    //TODO: More gestures
  },
  inbuiltGestures(frame,parent){
    if(frame.gestures.length > 0){
      frame.gestures.forEach(function(gesture){
        if(gesture.type == "circle" && gesture.state == "stop"){
          console.log("Circle detected");
          // Todo : Emit an event after this
          parent.safeDetect = false;
          parent.startTime = new Date().getTime();
        }
        if(gesture.type == "swipe") {
          //Classify swipe as either horizontal or vertical
          var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
          var swipeDirection = 'left';
          //Classify as right-left or up-down
          if(isHorizontal){
            if(gesture.direction[0] > 0){
              swipeDirection = "right";
            } 
            else {
              swipeDirection = "left";
            }
          } 
          else { //vertical
            if(gesture.direction[1] > 0){
              swipeDirection = "up";
            } 
            else {
              swipeDirection = "down";
            }                  
          }
          console.log(swipeDirection)
          // Todo : Emit an event after this
          parent.safeDetect = false;
          parent.startTime = new Date().getTime();
       }
      });
    }
  },
  simpleFingerGestures(frame,parent){
    //Peace Gesture 
    if(frame.hands.length){
      if(frame.hands[0].indexFinger.extended && frame.hands[0].middleFinger.extended 
        && !frame.hands[0].ringFinger.extended && !frame.hands[0].pinky.extended){
        console.log("Peace gesture");
        // Todo : Emit an event after this
        parent.safeDetect = false;
        parent.startTime = new Date().getTime();
      }
    }
  }
});

AFRAME.registerComponent('circable',{
  init: function(){
    this.el.addEventListener('leap-circle',this.oncirc(this));
  },
  oncirc: function(e){
    // Do whatever you want to with the element and it's information
    console.log("Circle detected");
    console.log(e);
  }
});

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
      console.log(cards)
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
      console.log(cards)
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

