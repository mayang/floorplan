var s = Snap();

$.ajax({
  type: 'GET',
  url: '/chart'
}).then(function(chart) {

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

    // add tooltips
    $('path, svg polygon, svg rect').parent().tipsy({
      gravity: 'w',
      html: true,
      title: function() {
        var id = $(this).attr('id');
        id = id[3] + id.substring(5);
        return chart[id] &&chart[id]['name'] ? chart[id]['name'] : id;
      }
    });

  });


})
