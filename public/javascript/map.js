var s = Snap();

Snap.load(config.map, function(f) {
  // add to DOM!
  g = f.selectAll('g');
  s.append(g);

  // add fill colors
  s.selectAll('path, polygon, rect').attr({fill: config.clear}).forEach( function(e) {
    e.hover(
      function() { e.attr({ fill: config.fill }); },
      function() { e.attr({ fill: config.clear }); }
    );
  });
});
