import {DEFAULT_INTERVAL} from './views';

var r;

export class Spinner {

  constructor() {
    let width = 120;
    let height = 120;
    this.center = width / 2;
    var center = this.center;
    r = Raphael("holder", width, height);

    this.init = true;
    this.param = {stroke: "#fff", "stroke-width": 10};
    this.marksAttr = {fill: "#444", stroke: "none"};
    // Custom Attribute
    r.customAttributes.arc = function (value, total) {
        var
            R = 50,
            alpha = 360 / total * value,
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
            //console.log(value);
            path = [
              ["M", center, center - R],
              ["A", R, R, 0, +(alpha > 180), 1, x, y]
            ];
        }
        return {path: path, stroke: color};
    };

    this.drawMarks(50, 60);
    var sec = r.path()
               .attr(this.param)
               .attr({arc: [0, 60]});


    this.hand = sec;
    this.text = r.text(this.center, this.center, "- / -")
           .attr({id:"viewIndicator"})
           .attr({font: "22px OpenSans", opacity: 0.5})
           .attr({fill: "#fff"});

    this.text.node.id = "viewIndicator";

    this.value = 100;
    this.steps = 20;
  }

    drawMarks(R, total) {
          var out = r.set();
          for (var value = 0; value < total; value++) {
              var alpha = 360 / total * value,
                  a = (90 - alpha) * Math.PI / 180,
                  x = this.center + R * Math.cos(a),
                  y = this.center - R * Math.sin(a);
              out.push(r.circle(x, y, 2).attr(this.marksAttr));
          }
          return out;
      }

  updateVal(value, total, R, hand) {
      this.init = false;
      let color = "#de9913";
      if (this.init) {
          hand.animate({arc: [value, total, R]}, 900, ">");
      } else {
          if (!value || value == total) {
              //console.log("I'm here");
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


  reset(index, total){
    this.text.attr('text',
          "" + (index+1) +  "/"
           + total
        );
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

      this.init = false;
  }
}