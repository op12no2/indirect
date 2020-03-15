
var version = '2.0';

// globals

var gt      = 1000.0;                 // population
var gk      = 0.1;                    // recovery rate
var gz      = 350;                    // model iterations
var gx      = 480;                    // canvas width
var gy      = 480;                    // canvas height
var gw      = 3;                      // line width
var gtot    = 0;

var gColBackground  = "#1b4f72";
var gColAxis        = "#216a8c";
var gColBase        = "#FFFFFF";
var gColHerd        = "#FFFFFF";
var gColRuler       = "#eeeeee";
var gColText        = "#FFFFFF";

var gaxn = 5;
var gaxd = gx/gaxn;
var gayn = 5;
var gayd = gx/gayn;
              
function px(x) {
  return x * gx/gt;
}

function py (y) {
  return gy - y * gy/gt;
}

function sir() {

  var R0  = dslide / 10;      // basic reproduction number
  var c   = R0 * gk;          // contact rate
  var ht  = 1-1/R0;           // herd immunity threadhold
  var htp = Math.round(ht * 100);
  var hi  = gt * ht;          // max immume people
  var tot = 0;                // total infections

  ctx.fillStyle = gColBackground;
  ctx.fillRect(0,0,gx,gy);

  ctx.strokeStyle = gColAxis;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  for (var a=1; a<gaxn; a++) {
    ctx.moveTo(gaxd*a,0); 
    ctx.lineTo(gaxd*a,gy);
  }
  for (var a=0; a<=gayn; a++) {
    ctx.moveTo(0,gayd*a); 
    ctx.lineTo(gx,gayd*a);
  }
  ctx.stroke();

  ctx.fillStyle = gColText;
  ctx.font      = "30px Serif";
  ctx.fillText("R0="+R0, 10, 460);

  ctx.strokeStyle = gColRuler;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(px(hi),py(0)); 
  ctx.lineTo(px(hi),py(gt));
  ctx.stroke();
  ctx.fillStyle = gColText;
  ctx.font      = "20px Serif";
  ctx.fillText("H="+htp+"%", px(hi)-80, 40);

  for (var r=0; r < gt; r+=1) { 

    var rr = r;
    var ii = 1;
    var ss = gt - ii - rr;

    tot = ii;

    for (var i=0; i<gz; i++) {

      var sf       = ss / gt;
      var infected = c * sf * ii;

      var ssa = ss - infected;
      var iia = ii + infected - gk * ii;
      var rra = rr + gk * ii;

      ss = ssa;
      ii = iia;
      rr = rra;

      tot += infected;
    }

    if (r == 1) {
      ctx.strokeStyle = gColBase;
      ctx.lineWidth   = gw;
      ctx.beginPath();
      ctx.moveTo(px(r),py(tot)); 
      ctx.lineTo(px(gt),py(r));
      ctx.stroke();

      gtot = tot;

      ctx.strokeStyle = gColHerd;
      ctx.lineWidth   = gw;
      ctx.beginPath();
      ctx.moveTo(px(r),py(tot)); 

    } else {
      ctx.lineTo(px(r),py(tot));
    }    
  }
  ctx.stroke();

  var iy = gtot;
  if (iy > gt*0.90)
    iy = gt * 0.90;

  //ctx.strokeStyle = gColRuler;
  //ctx.lineWidth   = 1;
  //ctx.beginPath();
  //ctx.moveTo(px(0),py(gtot)-gw); 
  //ctx.lineTo(px(gt),py(gtot)-gw);
  //ctx.stroke();
  //ctx.fillStyle = gColText;
  //ctx.font      = "20px Serif";
  //ctx.fillText("I="+ Math.round(100*gtot/gt) +"%", px(100), py(iy)-10);
}

var dslide = 25;  // R0 slider (x10)

var canvas = 0;
var ctx    = 0;

$(function() {

  $('#ver').html(version);

  canvas = document.getElementById("graphs");
  ctx    = canvas.getContext("2d");

  $('#dslider').on('input', function (e) {
    dslide = parseInt($('#dslider').val());
    sir();
  });

  sir();

});



