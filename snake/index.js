
jQuery(document).ready(function(){

  var stage = new Kinetic.Stage({
    container: 'game',
    width: window.innerWidth,
    height: window.innerHeight
  });

  var layers = {'bg':new Kinetic.Layer(), 'loading':new Kinetic.Layer({x: (stage.getWidth()/2)-(320/2),
    y: (stage.getHeight()/2)-(285/2),
    width: 320,
    height: 285}), 'game':new Kinetic.Layer()};

  //Haces un rectangulo sobre lo que quieras centrar y luego calculas:
  // x: (stage.getWidth()/2)-(rect.getWidth()/2)
  // y: (stage.getHeight()/2)-(rect.getHeight()/2)

  var rect = new Kinetic.Rect({

    'width': stage.attrs.width,
    'height': stage.attrs.height,
    'fillLinearGradientStartPoint':{x:0,y:0},
    'fillLinearGradientEndPoint':{x:stage.attrs.width,y:stage.attrs.height},
    'fillLinearGradientColorStops':[0, '#D7D7E2', 1, '#B7CBCF']
  });

  // add the shape to the layer
  layers['bg'].add(rect);

  var circlesList = new CircleList();

  circlesList.circles = [
      // x, y, radius, color
      new Circle(150, 160, 90, "rgba(197, 171, 224,.9)"),
      new Circle(67, 136, 34,  "rgba(177, 190, 229,.9)"),
      new Circle(106, 74, 22,  "rgba(137, 150, 224,.8)"),
      new Circle(114, 52, 10,  "rgba(177, 125, 221,.75)"),
      new Circle(220, 82, 56,  "rgba(177, 165, 224,.6)"),
      new Circle(250, 138, 43, "rgba(157, 170, 223,.9)"),
      new Circle(232, 232, 25, "rgba(157, 181, 224,.9)"),
      new Circle(256, 222, 10, "rgba(107, 212, 225,.7)"),
      new Circle(128, 244, 36, "rgba(107, 190, 225,.9)"),
      new Circle(64, 188, 10,  "rgba(107, 205, 226,.9)")
  ];

  for(var i=0;i<circlesList['circles'].length;i++)
  {
    layers['loading'].add(circlesList['circles'][i].kcircle);
  }

  var ebury_logo = new Image();

  // variables accessible from within function(frame)
  var frameCount = 0;
  var currentSecond = 0;
  var frameRate = 0;

  ebury_logo.onload = function() {
    
    var image = new Kinetic.Image({
      x: 100,
      y: 145,
      image: ebury_logo,
      width: 113,
      height: 40,
      opacity: 1
    });

    layers['loading'].add(image);
    layers['loading'].draw();

    function updateFrameRate(time) {
          var second = Math.floor(time / 1000); // ms to integer seconds
          console.log(second, currentSecond)
          if (second != currentSecond) {
             frameRate = frameCount;
             frameCount = 0;
             currentSecond = second;
          }
          frameCount ++;
      }


    var anim = new Kinetic.Animation(function(frame) {

      // within function(frame), called with current time on each new frame
      
      //updateFrameRate(frame.time);

      wait(10, frame.time, function(){
          layers['loading'].getCanvas().getContext().globalCompositeOperation = 'darker';
          circlesList.update();
      });
      //console.log(frameRate);

      // layers['loading'].getCanvas().getContext().globalCompositeOperation = 'darker';
      // circlesList.update();

    }, layers['loading']);

    anim.start();

    stage.on('click.start touchstart.start', function(e){

        stage.off('click.start touchstart.start');
        anim.stop();

        var tween = new Kinetic.Tween({
            node: layers['loading'],
            opacity: 0,
            duration: 1,
            onFinish: function(){
                console.log('done!');
                tween.destroy();
                layers['loading'].destroy();
                //Startgame
                startGame();
            }
        }).play();
    });

  };   

  ebury_logo.src = './snake/images/ebury_logo.png';

  stage.add(layers['bg']);
  stage.add(layers['loading']);
  // for(var layer in layers)
  // {
  //   stage.add(layers[layer]);
  // }

  function wait(seconds, time, callback) {
      seconds = seconds || 1000;
      var second = Math.floor(time / seconds);
      if (second != currentSecond) 
      {
         callback();
         currentSecond = second;
      }
  }

  function startGame()
  {
    
    var snake = new Player();

    layers['game'].add(snake.actor[0]);

    stage.add(layers['game']);

    // stage.on('mousemove.game', function(data){

    //     snake.targetPos.x = data.evt.clientX;
    //     snake.targetPos.y = data.evt.clientY;
    // });

    var canvas = layers['game'].getCanvas()._canvas;
    
    $(canvas).attr('tabindex', 1);

    canvas.focus();

    $(canvas).keydown(function (data) {

      var key = data.keyCode;

        //Going left
        if(key == 37 && snake.direction != 'right')
        {
          snake.direction = 'left'; 
        }
        //Going up
        else if(key == 38 && snake.direction != 'down')
        {
          snake.direction = 'up';
        }
        //Going right
        else if(key == 39 && snake.direction != 'left')
        {
          snake.direction = 'right';
        }
        //Going down
        else if(key == 40 && snake.direction != 'up')
        {
          snake.direction = 'down';
        }
    });

    var anim = new Kinetic.Animation(function(frame) {

       wait(60, frame.time, function(){
          
          snake.update();
      });


    }, layers['game']);

    anim.start();
  }
  

  function Player()
  {
    this.actor = [new Kinetic.Circle({x:stage.getWidth()/2, y:stage.getHeight()/2, radius: 15, fill:'#000', stroke: 'rgb(191, 191, 191)', strokeWidth: 3})];

    this.direction = 'right';
    this.targetPos = {x:stage.getWidth()/2, y:stage.getHeight()/2};
    this.sprint = 30;

    this.update = function()
    {
      
      //Collipsion
      var x = this.actor[0].x();
      var y = this.actor[0].y();

      //Collision
      if(x>= (window.innerWidth-15) || x <= 15)
      {
        return;
      }

      if(y >= (window.innerHeight-15) || y <= 15)
      {
        return;
      }

      if(this.direction == 'right')
      {
        x += this.sprint;
      }
      else if(this.direction == 'left')
      {
        x -= this.sprint;
      }
      else if(this.direction == 'up')
      {
        y -= this.sprint;
      }
      else if(this.direction == 'down')
      {
        y += this.sprint;
      }

      //Remove last element and return it
      var tail = this.actor.pop();
      tail.x(x);
      tail.y(y);

      //Add to the begining
      this.actor.unshift(tail);

      // for(var i=0; i<this.actor.length; i++)
      // {
        
      //   var x = this.actor[i].x();
      //   var y = this.actor[i].y();

      //   if(this.direction == 'right')
      //   {
      //     this.actor[i].x(x+this.sprint);
      //   }
      //   else if(this.direction == 'left')
      //   {
      //     this.actor[i].x(x-this.sprint);
      //   }
      //   else if(this.direction == 'up')
      //   {
      //     this.actor[i].y(y-this.sprint);
      //   }
      //   else if(this.direction == 'down')
      //   {
      //     this.actor[i].y(y+this.sprint);
      //   }

      //   // var ty = this.targetPos.y - i*15;
      //   // var tx = this.targetPos.x - i*15;
      //   // var y = this.actor[i].y() + (ty - this.actor[i].y())*this.sprint;
      //   // var x = this.actor[i].x() + (tx - this.actor[i].x())*this.sprint;

      //   // this.actor[i].x(x);
      //   // this.actor[i].y(y);
      // }
      

      //Eat something
      if(Math.random() > 0.89)
      {
        
        var new_actor = new Kinetic.Circle({x: tail.x(), y: tail.y(), radius: 15, fill:'red', stroke: 'rgb(191, 191, 191)', strokeWidth: 3});

        this.actor.unshift(new_actor);

        layers['game'].add(new_actor);
      }

    }
  };

  // data structures
  function CircleList()
  {
      this.circles = [];
      
      this.update = function()
      {
         // special case for first blob - which is the main magenta disc
         var circle = this.circles[0];
         if (Math.random() > 0.69)
         {
            circle.velocity.z += (Math.random()*0.10 - 0.05);
            circle.spring = 0.0125;
         }
         circle.update();
         
         // all the other blobs can animate based on mouse interaction
         for (var i = 1,dx,dy,d; i < this.circles.length; i++)
         {
            circle = this.circles[i];
            
            // else based on a random chance, pulse the blob
            if (Math.random() > 0.995)
            {
               circle.targetPos[0] = circle.origin[0];
               circle.targetPos[1] = circle.origin[1];
               circle.velocity[2] += (Math.random()*0.30 - 0.15);
               circle.spring = 0.0125;
            }
            // else just animate towards the original position
            else
            {
               circle.targetPos[0] = circle.origin[0];
               circle.targetPos[1] = circle.origin[1];
               circle.spring = 0.05;
            }
            
            circle.update();
         }
      };
   };
   
   function Circle(x, y, radius, colour)
   {
      this.kcircle = new Kinetic.Circle({x:x, y:y, radius: radius, fill:colour, stroke: 'rgb(191, 191, 191)', strokeWidth: 1});
      this.origin = [x,y, 0];
      this.position = [x,y, 0];
      this.targetPos = [x,y, 0];
      this.originradius = radius;
      this.radius = radius;
      this.velocity = [0,0, 0];
      this.friction = 0.75;
      this.spring = 0.05;
      
      this.update = function()
      {
         this.velocity[0] += (this.targetPos[0] - this.kcircle.x()) * this.spring;
         this.velocity[0] *= this.friction;
         this.kcircle.x(this.kcircle.x() + this.velocity[0]);
         
         this.velocity[1] += (this.targetPos[1] - this.kcircle.y()) * this.spring;
         this.velocity[1] *= this.friction;
         this.kcircle.x(this.kcircle.x() + this.velocity[1]);
         
         var dox = this.origin[0] - this.kcircle.x(),
             doy = this.origin[1] - this.kcircle.y(),
             d = Math.sqrt(dox * dox + doy * doy);
         
         this.targetPos[2] = d/150 + 1;
         this.velocity[2] += (this.targetPos[2] - this.position[2]) * this.spring;
         this.velocity[2] *= this.friction;
         this.position[2] += this.velocity[2];
         
         this.kcircle.radius(this.originradius * this.position[2]);
         if (this.kcircle.radius() < 1) this.kcircle.radius(1);
      };
   };



});


