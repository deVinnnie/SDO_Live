var countDown = 100;
var text;
var spinner;

class Spinner{
  
  constructor(hand) {
    this.hand = hand;
    this.value = 100;
    this.steps = 20;
  }
  
  updateVal(value, total, R, hand) {
      var init = false;
      let color = "#de9913";
      if (init) {
          hand.animate({arc: [value, total, R]}, 900, ">");
      } else {
          if (!value || value == total) {
              console.log("I'm here");
              value = total;
              hand.animate({arc: [value, total, R]}, 1000, "bounce", function () {
                  hand.attr({arc: [total, total, R]});
              }
            );
          } else {
              hand.animate({arc: [value, total, R]}, 750, "elastic");
          }
      }
  }
  
  
  reset(){
    console.log('reset');
    this.value = 100;
    //this.updateVal(this.value, 100, 50, this.hand, 2);
    this.update();
  }
  
  update(){
      var DEFAULT_INTERVAL = 20*1000; //20s
      
      this.value-= (100/this.steps); //0->360
      
      if(this.value > 0){
        this.updateVal(this.value, 100, 50, this.hand, 2);
        setTimeout(this.update.bind(this), DEFAULT_INTERVAL/this.steps);
      }
      
      init = false;
  }
}



window.onload = function () {
    
    let width = 120;
    let height = 120;
    let center = width / 2;
    var r = Raphael("holder", width, height),
        R = 50,
        init = true,
        param = {stroke: "#fff", "stroke-width": 10},
        hash = document.location.hash,
        marksAttr = {fill: hash || "#444", stroke: "none"},
        html = [
            document.getElementById("h"),
            document.getElementById("m"),
            document.getElementById("s"),
            document.getElementById("d"),
            document.getElementById("mnth"),
            document.getElementById("ampm")
        ];
    // Custom Attribute
    r.customAttributes.arc = function (value, total, R) {
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = center + R * Math.cos(a),
            y = center - R * Math.sin(a),
            color = "#de9913",
            path;
        
        if (value <= 1) {
            path = [
              ["M", center, center - R], 
              ["A", R, R, 0, 1,              1, R, center - R]
            ];
        }
        else if (value >= total) {
            path = [
              ["M", center, center - R], 
              ["A", R, R, 0, 1,              1, R, center - R]
            ];
        } else {
            console.log(value);
            path = [
              ["M", center, center - R], 
              ["A", R, R, 0, +(alpha > 180), 1, x, y]
            ];
        }
        return {path: path, stroke: color};
    };

    drawMarks(R, 60);
    var sec = r.path()
               .attr(param)
               .attr({arc: [0, 60, R]});
    
    spinner = new Spinner(sec);
    
    text = r.text(center, center, "- / -")
       .attr({id:"viewIndicator"})
       .attr({font: "22px OpenSans", opacity: 0.5})
       .attr({fill: "#fff"});

    text.node.id = "viewIndicator";

    function drawMarks(R, total) {
        out = r.set();
        for (var value = 0; value < total; value++) {
            var alpha = 360 / total * value,
                a = (90 - alpha) * Math.PI / 180,
                x = center + R * Math.cos(a),
                y = center - R * Math.sin(a);
            out.push(r.circle(x, y, 2).attr(marksAttr));
        }
        return out;
    }    
};
