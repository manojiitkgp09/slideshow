function Slideshow(idSelector, settings) {
  if (typeof(settings) === "object") {
    if (settings.data instanceof Array) {
      this.data = settings.data;//For displaying dynamic images from server
    }
  }
  this.context = document.getElementById(idSelector);
  this.images = this.data || this.context.getElementsByTagName('img');
  this.nextLink = document.createElement('a');
  this.nextLink.setAttribute("class", "next");
  this.nextLink.setAttribute("className", "next");
  var nextText = document.createTextNode('>');
  this.nextLink.appendChild(nextText);
  this.previousLink = document.createElement('a');
  this.previousLink.setAttribute("class", "previous");
  this.previousLink.setAttribute("className", "previous");
  var previousText = document.createTextNode('<');
  this.previousLink.appendChild(previousText);
  this.modeButton = document.createElement('button');
  this.modeButton.setAttribute("class", "mode");
  this.modeButton.setAttribute("className", "mode");
  this.modeButtonText = document.createTextNode('Auto');
  this.modeButton.appendChild(this.modeButtonText);
  this.slideShowTimerDD = document.createElement('select');
  this.slideShowTimerDD.setAttribute("class", "timer");
  this.slideShowTimerDD.setAttribute("className", "timer");
  var timerInput = [1, 2, 3, 4, 5];
  for (var i=0;i<timerInput.length;i++) {
    var option = document.createElement("option");
    option.text = timerInput[i];
    option.value = timerInput[i];
    try {
        this.slideShowTimerDD.add(option, null); //Standard
    }catch(error) {
        this.slideShowTimerDD.add(option); // IE only
    }  
  }
  this.autoModeMenu = document.createElement('div');
  this.context.appendChild(this.previousLink);
  this.context.appendChild(this.nextLink);
  this.context.appendChild(this.modeButton);
  this.context.appendChild(this.slideShowTimerDD);
  this.currentIndex = 0;
  this.delay = 1000;
  this.duration = 400;
  this.autoPlay = true;
  this.pause = false; //Pause slideshow when in autoplay mode
  this.hover = false;
  this.initialize();
}

Slideshow.prototype = {
  initialize: function() {
    this.context.setAttribute("class", "slideshow");
    this.context.setAttribute("className", "slideshow"); //For IE
    this.setImagesStyle();
    this.createHoverHandlers();
    this.createKeyHandlers();
    this.createNavigationLinksHandlers();
    this.createModeHandlers();
    this.createSlideShowTimerHandler();
    if (this.autoPlay) {
      this.start();
    }
    else {
      this.showCurrentImage();
    }
  },
  createHoverHandlers: function() {
    var self = this;
    self.addEvent(this.context, "mouseover", function() {
      self.hover = true;
    });
    self.addEvent(this.context, "mouseout", function() {
      self.hover = false;
    });
  },
  createKeyHandlers: function() {
    var self = this;
    self.addEvent(window, "keyup", function(event) {
      var keycode = event.keyCode? event.keyCode : event.charCode;
      if (keycode === 39) {
	      self.next();
      }
      else if (keycode === 37) {
	      self.previous();
      }
    });
  },
  createModeHandlers: function() {
    var self = this;
    self.addEvent(this.modeButton, "click", function() {
      var modeValue = self.getMode();
      if (modeValue === "Auto") {
  	    self.setMode("Manual");
	      self.autoPlay = false;
	      clearInterval(self.slideShowTimer);
      }
      else {
      	self.setMode("Auto");
      	self.autoPlay = true;
	clearInterval(self.slideShowTimer);
      	self.start();
      }
    });
  },
  createNavigationLinksHandlers: function() {
    var self = this;
    self.addEvent(this.previousLink, "click", function() {
      	self.previous();
    });
    self.addEvent(this.nextLink, "click", function() {
      	self.next();
    });

  },
  createSlideShowTimerHandler: function() {
    var self = this;
    self.addEvent(self.slideShowTimerDD, "change", function() {
       clearInterval(self.slideShowTimer);
       self.delay = self.slideShowTimerDD.options[self.slideShowTimerDD.selectedIndex].value*1000;
       self.start();
    });
  },
  clearSlideTransition: function() {
    clearInterval(this.fadeTimer);
  },
  getNextIndex: function() {
    var nextIndex;
    if (this.currentIndex < this.images.length - 1) {
      nextIndex = this.currentIndex+1;
    }
    else {
      nextIndex = 0;
    }
    return nextIndex;
  },
  getPreviousIndex: function() {
    var previousIndex;
    if (this.currentIndex === 0) {
      previousIndex = this.images.length - 1;
    }
    else {
      previousIndex = this.currentIndex - 1;
    }
    return previousIndex;
  },
  previous:function() {
    this.clearSlideTransition();
    var currentIndex = this.currentIndex;
    var previousIndex = this.getPreviousIndex();
    this.setSlideTransition(currentIndex, previousIndex);
  },
  next: function() {
    this.clearSlideTransition();
    var currentIndex = this.currentIndex;
    var nextIndex = this.getNextIndex();
    this.setSlideTransition(currentIndex, nextIndex);
  },
  start: function() {
    var self = this; //Set interval should have access to slideshow params
    this.showCurrentImage();
    this.slideShowTimer = setInterval(function() {
      if (!self.pause && !self.hover && self.autoPlay) {
	self.next();
      }
    }, this.delay);
  },
  setSlideTransition: function(currentIndex, nextIndex) {
    var self = this;
    var currentImageOpacity = 1;
    var nextImageOpacity = 0;
    var opacityStep = (1/(self.duration/100));
    var currentImage = this.images[currentIndex];
    var nextImage = this.images[nextIndex]; 
    this.currentIndex = nextIndex;
    this.fadeTimer = setInterval(function() {
      if (currentImageOpacity !== 0) {
      	currentImageOpacity = currentImageOpacity - opacityStep;
      	currentImage.style.opacity =currentImageOpacity;
        currentImage.style.filter = "alpha(opacity="+currentImageOpacity*100+")";
        
      	currentImage.style.display = "none";
      }
      if (currentImageOpacity === 0) 
      {
      	nextImageOpacity = nextImageOpacity + opacityStep;
      	nextImage.style.opacity = nextImageOpacity;
        nextImage.style.filter = "alpha(opacity="+nextImageOpacity*100+")";
      	nextImage.style.display = "block";
    	if (nextImageOpacity === 1)   {
    	  self.clearSlideTransition();
    	}
      }
    }, 50);
  },
  setImagesStyle: function() {
    for (var i=0;i<this.images.length;i++) {
      this.images[i].style.display = "none";
      this.images[i].style.width = "250px";
      this.images[i].style.height = "250px";
    }
  },
  showCurrentImage: function() {
    this.images[this.currentIndex].style.display = "block";
  },
  addEvent: function(target, event, handler) {
    if (typeof(window.addEventListener) !== "undefined") {
      target.addEventListener(event, handler);
    }
    else if (typeof(window.attachEvent) !== "undefined") {
      target.attachEvent("on"+event, handler); 
    }
    else {
      target["on"+event] = handler;
    }
  },
  getMode: function() {
      var self = this;
      if (typeof(self.modeButtonText.wholeText) !== "undefined") {
        return self.modeButtonText.wholeText;
      }
      else {
        return self.modeButtonText.data;
      }
  },
  setMode: function(mode) {
    var self = this;
    if (typeof(self.modeButtonText.textContent) !== "undefined") {
        self.modeButtonText.textContent = mode;
      }
      else {
        self.modeButtonText.data = mode;
      }
  }  
};
