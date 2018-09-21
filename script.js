/* global $*/
$(document).ready(() => {
  let currentDroppable = null;
  let drag = $('#draggable')[0];
  let dragJQ = $('#draggable');
  
  //Moves draggable element to mouse/finger position
  let goTo = (pageX, pageY, auxX, auxY) => {
    dragJQ.css({
      left: pageX - auxX + 'px',
      top: pageY - auxY + 'px'
    });
  };
  
  //Changes droppable's style when draggable element collides with it
  let dropabbleCollision = (elem) => {
    $(elem).css({
      backgroundColor: 'rgba(236, 236, 236, 0.64)'
    });
    elem.innerText = "I'll stay here";
  };
  
  //Changes droppable's style when draggable element leaves collision area
  let leaveDroppable = (elem) => {
    $(elem).css({
      backgroundColor: ''
    });
    elem.innerText = " ";
  };
  
  //Sets "page" and "client" positions in event when it is touchable event 
  let fixPositionTouchEvents = (event) => {
    if(event.type.indexOf("touch") !== -1) {
      event.pageX = event.originalEvent.touches[0].pageX;
      event.pageY = event.originalEvent.touches[0].pageY;
      event.clientX = event.originalEvent.touches[0].clientX;
      event.clientY = event.originalEvent.touches[0].clientY;
    }
  };
  
  //Avoids weird behavior  
  dragJQ.bind("dragstart", () => {
    return false;
  }); 
  
  //Start drag n' drop
  dragJQ.bind("touchstart mousedown", (event) => {
    //Fix touch events
    fixPositionTouchEvents(event);
    
    //Fixes cursor position when user click/touch draggable element
    let auxX = event.clientX - drag.getBoundingClientRect().left;
    let auxY = event.clientY - drag.getBoundingClientRect().top;
    
    //Listens draggable element moves
    let mouseMove = (event) => {
      //Fix touch events
      fixPositionTouchEvents(event);
      
      goTo(event.pageX, event.pageY, auxX, auxY);
      
      drag.innerText = "Drag me";
      
      //Hide draggable element to get droppable below
      dragJQ.hide();
      let elementBelow = document.elementFromPoint(event.clientX, event.clientY);
      dragJQ.show();
      
      //If find a droppable
      if (!elementBelow) return;
      let droppableBelow = elementBelow.closest('.droppable');
      
      //If its another droppable
      if (currentDroppable != droppableBelow) {
        //leave current droppable
        if (currentDroppable) { // null in first time
          leaveDroppable(currentDroppable);
        }
    
        currentDroppable = droppableBelow;
        //if we're going to another droppable
        if (currentDroppable) { 
          dropabbleCollision(currentDroppable);
        }
      }
    };
    
    //bind move
    $(document).bind("mousemove touchmove", mouseMove);
    
    //when user stop dragging
    dragJQ.bind("mouseup touchend", () => {
      $(document).unbind("mousemove touchmove", mouseMove);
      drag.onmouseup = null;
      //If we're in some droppable
      if(currentDroppable) {
        drag.innerText = "I'm here";
        //move draggable to center
        var centerPosition = {
          top: ($(currentDroppable).position().top + $(currentDroppable).height()/2) - dragJQ.height()/2 + 2,
          left: ($(currentDroppable).position().left + $(currentDroppable).width()/2) - dragJQ.width()/2 + 2,
        };
        dragJQ.css(centerPosition);
      }else {
        drag.innerText = "Drag me";
      }
    });
    
  });
});