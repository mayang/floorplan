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
    $('path, svg polygon, svg rect').tipsy({
      gravity: 'w',
      html: true,
      delayIn: 500,
      title: function() {
        var id = $(this).parent().attr('id');
        id = id[3] + id.substring(5);
        return chart[id] &&chart[id]['name'] ? chart[id]['name'] : id;
      }
    });

  });
});

// clear highlighted regions
$('#clear').click(function(e) {
  e.preventDefault();
  s.selectAll('polygon, rect, path').attr({fill: 'white'});
  $('#search').val('');
});


// set up auto complete, from typeahead.js site
var names = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  // local: $.map(names, function(name) { return { value: name} })
  prefetch: {
    url: '/names',
    filter: function(list) {
      return $.map(list, function(name) { return { value: name} });
    }
  }
});

names.initialize();

$('#search').typeahead(
  {
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'names',
    displayKey: 'value',
    source: names.ttAdapter()
  }
);

// clear highlighted regions
$('#clear').click(function(e) {
  e.preventDefault();
  s.selectAll('polygon, rect, path').attr({fill: 'white'});
  $('#search').val('');
});

// find this thing
$('#search').bind('keypress', function(e) {
  if (e.which == 13) {
    e.preventDefault();

     var query = $(e.target).val(); //.toLowerCase();


     var fillRegion = function(seatNo) {
       var id = '_x3' + seatNo[0] + '_' + seatNo.substring(1);
       var region = s.select('#' + id).select('path, rect, poly');
       if (region) {
           region.attr({fill: config.fill});
       }
     };

    // if number entered
    if (!isNaN(query)) {
      fillRegion(query);
      return;
    }

    // if name entered search for cube number
    $.ajax({
      type: 'GET',
      url: '/cube?name=' + encodeURI(query),
      // data: { name: query },
    }).then(fillRegion);
  }
});
