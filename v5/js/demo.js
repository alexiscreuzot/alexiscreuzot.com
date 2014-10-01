/**
 * Particleground demo
 * @author Jonathan Nicol - @mrjnicol
 */

$(document).ready(function() {
  
  FastClick.attach(document.body);

  $('#page').particleground({
    dotColor: 'rgba(255,255,255,0.5)',
    lineColor: 'rgba(255,255,255,0.2)',
    curvedLines:false,
    proximity:100,
    parallaxMultiplier:30
  });
});
