console.log('10.1');

var m = {t:50,r:50,b:50,l:50},
    w = document.getElementById('canvas').clientWidth - m.l - m.r,
    h = document.getElementById('canvas').clientHeight - m.t - m.b;

var plot = d3.select('.canvas')
    .append('svg')
    .attr('width', w + m.l + m.r)
    .attr('height', h + m.t + m.b)
    .append('g').attr('class','plot')
    .attr('transform','translate('+ m.l+','+ m.t+')');

//Mapping specific functions
//First, choose a projection
var projection = d3.geoAlbersUsa();

var pathGenerator = d3.geoPath()
    .projection(projection);

d3.json('../data/gz_2010_us_040_00_5m.json',dataloaded);

function dataloaded(err, data){

    //See what the data looks like first
    console.log(data);

    //Update projection to fit all the data within the drawing extent
    projection
        //.translate([w/2,h/2])
        //.scale(2000)
        //.center() //Not valid for AlbersUsa projection
        .fitExtent([[0,0],[w,h]],data);

    //Represent a feature collection of polygons
    var states = plot.selectAll('.node')
        .data(data.features, function(d){return d.properties.COUNTY; })
        .enter()
        .append('path').attr('class','node state')
        .attr('d',pathGenerator);

    //Represent a feature collection of points
    var points = [
        {city:'Boston',location:[-71.0589,42.3601]},
        {city:'San Francisco',location:[-122.4194,37.7749]}
    ];
    var cities = plot.selectAll('.city')
        .data(points,function(d){return d.city})
        .enter()
        .append('circle')
        .attr('transform',function(d){
           var xy = projection(d.location);
           return 'translate('+xy[0]+','+xy[1]+')';
        })
        .style('fill','red')
        .attr('r',5);

    //Represent a line
    var lineData = {
        type:"Feature",
        geometry:{
            type:'LineString',
            coordinates:[[-71.0589,42.3601],[-122.4194,37.7749]]
        },
        properties:{}
    };
    var line = plot.append('path')
        .datum(lineData)
        .attr('d',pathGenerator)
        .style('fill','none')
        .style('stroke','blue')
        .style('stroke-width','2px');
}