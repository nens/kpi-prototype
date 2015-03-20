/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;

require("!style!css!./KPIApp.css");

var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var Row = require('react-bootstrap').Row;
var Grid = require('react-bootstrap').Grid;
var Col = require('react-bootstrap').Col;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var Accordion = require('react-bootstrap').Accordion;
var Panel = require('react-bootstrap').Panel;
var Label = require('react-bootstrap').Label;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

var Modal = require('react-bootstrap').Modal;
var Badge = require('react-bootstrap').Badge;
var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Table = require('react-bootstrap').Table;
var DateTimePicker = require('react-widgets').DateTimePicker;
var Promise = require('es6-promise').Promise;

var moment = require('moment');
var $ = require('jquery');
var _ = require('underscore');
var d3 = require('d3');

var topojson = require('topojson');
var colorbrewer = require('colorbrewer');
var queue = require('queue-async');

var debug = require('debug')('KPIApp.js');

var iconTevredenheid = require('../images/icon-tevredenheid.png');
var iconToestand = require('../images/icon-toestand.png');
var iconOmgeving = require('../images/icon-omgeving.png');
var iconGebruik = require('../images/icon-gebruik.png');
var iconPlanning = require('../images/icon-planning.png');
var iconLizard = require('../images/icon-lizard.png');

var Map = require('./Map');
var Utils = require('./Utils');


var KPIHisto = React.createClass({
    toggleGraph: function() {
        if(this.state.chartType === 'pi') {
            this.setState({chartType: 'real'});
        } else {
            this.setState({chartType: 'pi'});
        }
    },
    getInitialState: function() {
        var refval;
        if(localStorage.getItem(this.props.title)) {
            refval = localStorage.getItem(this.props.title);
        } else {
            localStorage.setItem(this.props.title, 50);
            refval = localStorage.getItem(this.props.title);
        }
        return {
            selected: false,
            referenceValue: refval,
            chartType: 'pi' // Can be 'pi' or 'real'
        };
    },  
    handleHistoClick: function() {
        var self = this;
        self.props.handleSelection({
            'title': self.props.title,
            'selected': !self.state.selected
        });        

        if(self.props.active) {
            self.setState({selected: false});
        } else {
            self.setState({selected: true});
        }
    },
    render: function() {

        var self = this;
        var title = this.props.title;
        var values = _.without(this.props.values,'NULL');
        var period = this.props.period;
        var line, lastValue, gradingValue;
        var labelColor = 'default';

        try {
          gradingValue = Math.round(values[values.length - 1].Value) || 0; // PI value  
        }
        catch (err) {
          gradingValue = 0;
          debug(err);
        }
    

        var tooltipString = 'Performance Indicator';


        // lastValue = values[values.length - 1].Value || 0;
        lastValue = Math.round(values[values.length - 1].Value) || 0;
        tooltipString = 'KPI';
       
        // Color grading of PI label
        if(gradingValue >= 0 && gradingValue <= 2) {
            labelColor = 'danger';
        } else if(gradingValue >= 2 && gradingValue <= 3) {
            labelColor = 'warning';
        } else if(gradingValue >= 3) {
            labelColor = 'success';
        } else {
            labelColor = 'default';
        }


        // D3 configuration
        var margin = {top: 20, right: 20, bottom: 60, left: 50},
            width = 500 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%m/%d/%Y").parse;

        if(period) {
            var startYear = moment('2014').subtract(period, 'years');    
        } else {
            var startYear = moment('2014').subtract(5, 'years');    
        }

        var x = d3.time.scale()
            .range([0, width])
            .domain([startYear.toDate(), moment('12-30-2014').toDate()]).clamp(true);

        var y = d3.scale.linear()
            .range([height, 1]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .tickPadding(12)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        line = d3.svg.line()
            .defined(function(d) { return d.Value != 'NULL'; })
            .x(function(d) { return x(parseDate(d.Date)); })
            .y(function(d) { return y(Number(d.Value)); });

        d3.select('#'+title.replace(/ /g, '-')).select('svg').remove(); // This should not be necessary, break up d3 into smaller components?


        var svg = d3.select('#'+title).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // y.domain(d3.extent(values, function(d) { return Number(d.Value); }));
        y.domain([1, 10]);    
        
        var xaxis = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        xaxis.selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)";
            });          

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .text('KPI')
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");

        var withoutNull = _.without(values, 'NULL');
        svg.append('circle')
           .attr('class', 'sparkcircle')
           .attr('cx', x(parseDate(withoutNull[withoutNull.length - 1].Date)))
           .attr('cy', y(Number(withoutNull[withoutNull.length - 1].Value)))
           .attr('r', 5); 

        var path = svg.append("path")
          .datum(values)
          .attr("class", "line")
          .attr("d", line);

        path.each(function(d) { d.totalLength = this.getTotalLength(); }) // Add total length per path, needed for animating over full length

        path
          .attr("stroke-dasharray", function(d) { return d.totalLength + " " + d.totalLength; })
          .attr("stroke-dashoffset", function(d) { return d.totalLength; })
          .transition()
            .duration(1000)
            .ease("linear")
            .attr("stroke-dashoffset", 0);


        var bisectDate = d3.bisector(function(d) { return parseDate(d.Date); }).left;

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        focus.append("circle")
            .attr("r", 4.5);

        focus.append("text")
            .attr("x", 9)
            .attr("dy", ".35em");

        svg.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focus.style("display", null); })
            .on("mouseout", function() { focus.style("display", "none"); })
            .on("mousemove", mousemove);

        function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(values, x0, 1),
              d0 = values[i - 1],
              d1 = values[i],
              d = x0 - d0.Date > d1.Date - x0 ? d1 : d0;

          focus.attr("transform", "translate(" + x(parseDate(d.Date)) + "," + y(d.Value) + ")");
          focus.select("text").text(d.Value);
        }
        
        var classesTitlebar = cx({
            'panel-heading': true,
            'rightarrowdiv': self.props.active,
            'active': self.props.active            
        });
        var classesContainer = cx({
            'panel': true,
            'panel-default': true,
            'active': self.props.active
        });

        return (
            <div className={classesContainer} 
                 onClick={this.handleHistoClick}
                 ref="histoRoot">

              <div style={{position:'relative'}} className={classesTitlebar}>
                    <OverlayTrigger placement="right" overlay={<Tooltip><strong>{tooltipString}</strong></Tooltip>}>
                        <Label onClick={this.toggleGraph} style={{float:'right', fontSize:'1.1em', cursor: 'pointer', backgroundColor:Utils.quantize(lastValue)}}>{lastValue}</Label>
                    </OverlayTrigger>&nbsp;
                    <span onClick={this.handleHistoClick} style={{cursor:'pointer', fontWeight:'bold', fontSize:'1.1em'}}>{title}</span>                
              </div>
              <div className="panel-body">
                <div className="histoChart" ref="chart" id={title} />
              </div>
            </div>            
        );
    }
});




var KPIApp = React.createClass({

    getDefaultProps: function() {
        return {};
    },
    getInitialState: function() {
        return {
            pis: [],
            stadsdeel: 'Almere'
        };
    },
    handleSelection: function(selection) {
        this.setState({
            activeSelection: selection.title
        });
        return selection;
    },    
    componentDidMount: function() {
        var self = this;
        d3.csv("static/data/KPI.csv", function (csv) {

            // Format the csv (parse month/year to better date etc)
            csv.map(function(d) {
                d.Date = moment(d.Date, 'MMM/YY').format('MM/DD/YYYY');
                d.month = moment(d.Date).month() + 1; // Zero-based!
            });

            // Group the data by PI
            var data = d3.nest()
                .key(function(d) { return d.KPI; })
                .entries(csv);

            var pisArray = data.map(function(obj) {
                return {
                    'key': obj.key, 
                    'values': obj.values
                };
            });

            self.setState({'pis': pisArray});
            self.setState({'stadsdeel': 'Almere'});
        });
    },
    componentWillMount: function() {
    },    
    componentWillUnmount: function() {
    },
    handleStadsdeelClick: function(stadsdeel) {
        if(this.state.stadsdeel === stadsdeel) {
            debug('De-selecting ' + stadsdeel + ', selecting Almere');
            this.setState({'stadsdeel': 'Almere'});
        } else {
            debug('Selecting ' + stadsdeel);
            this.setState({'stadsdeel': stadsdeel});            
        }
    },
    render: function() {
        var self = this;
        var panels = [];
        var i = 0;
        var perGebied, filteredPIList, currentPIValues = [];

        if(self.state.stadsdeel && self.state.activeSelection) {
            filteredPIList = self.state.pis.filter(function(pi) {
                if(pi.key === self.state.activeSelection) return pi;
            })[0].values;

            perGebied = d3.nest()
                .key(function(d) {
                    return d.Gebied;
                })
                .entries(filteredPIList);
        }

        _.each(this.state.pis, function(pi) {
            i = i + 1;

            var gebiedValues = d3.nest()
                  .key(function(d) { return d.Gebied; })
                  .entries(pi.values);

            var filteredValues = gebiedValues.filter(function(el) { return el.key === self.state.stadsdeel; })[0];

            panels.push(
                <KPIHisto
                        active={(self.state.activeSelection === pi.key) ? true : false}
                        handleSelection={self.handleSelection}
                        key={i} 
                        tabIndex={i+1}
                        title={pi.key}
                        period={window.period}
                        values={filteredValues.values.length < 1 ? [] : filteredValues.values} />
            );
        });

        return (
              <Grid>
              	<Row>
	              	<Col xs={12} md={6}>
                        <h2 style={{fontSize:'2em'}}>
                            
                        </h2>

                    {panels}
	              	</Col>
                  <Col xs={12} md={6} style={{textAlign:'left'}}>
                        <Map selectStadsdeel={this.handleStadsdeelClick}
                             perGebied={perGebied}
                             activeSelection={this.state.activeSelection}
                             stadsdeel={this.state.stadsdeel} />                             
                  </Col>
              	</Row>
              </Grid>
        );
    }
});




module.exports = KPIApp;