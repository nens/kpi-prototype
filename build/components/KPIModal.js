/**
 * @jsx React.DOM
 */

var React = require('react/addons');
var cx = React.addons.classSet;

require("!style!css!./KPIApp.css");
require("!style!css!./Colorbrewer.css");

var moment = require('moment');
var Router = require('react-router');
var Route = Router.Route;
var NotFoundRoute = Router.NotFoundRoute;
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;

var Row = require('react-bootstrap').Row;
var Accordion = require('react-bootstrap').Accordion;
var Panel = require('react-bootstrap').Panel;
var Grid = require('react-bootstrap').Grid;
var Label = require('react-bootstrap').Label;
var Col = require('react-bootstrap').Col;
var ModalTrigger = require('react-bootstrap').ModalTrigger;
var ButtonGroup = require('react-bootstrap').ButtonGroup;
var Button = require('react-bootstrap').Button;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Tooltip = require('react-bootstrap').Tooltip;

var Modal = require('react-bootstrap').Modal;
var Badge = require('react-bootstrap').Badge;
var TabbedArea = require('react-bootstrap').TabbedArea;
var TabPane = require('react-bootstrap').TabPane;
var DropdownButton = require('react-bootstrap').DropdownButton;
var MenuItem = require('react-bootstrap').MenuItem;
var Table = require('react-bootstrap').Table;
var Promise = require('es6-promise').Promise;

var $ = require('jquery');
var d3 = require('d3');
require('../libs/d3.tip.js');

var debug = require('debug')('KPIModal.js');


var WeightSetting = React.createClass({
    handleChange: function(e) {
        var self = this;
        // this.props.calc(self.props.title, e.target.value);
        swal('Excuses', 'Deze tabel is nog in ontwikkeling en wordt hier voor demonstratiedoeleinden getoond', 'error');
    },
    render: function() {
        var self = this;
        var computedPercentage = 0;
        // computedPercentage = self.props.calc(self.props.title, self.props.weight);      
        
        return (
            <tr>
              <td>{self.props.title}</td>
              <td><input type="number" 
                         className="factor"
                         onChange={self.handleChange}
                         defaultValue={self.props.times} />
              </td>
              <td>{parseFloat(self.props.weight).toFixed(1)}%</td>
            </tr>            
        );
    }
});


var KPIModal = React.createClass({
      calc: function(name, val) {
        // Formula: (Waarde (n)/ som waarden (n)) * 100 = X %
        var self = this;

        // var numFactors = self.state.weightData.length;
        // var total = 0;
        // $('.factor').each(function(i, factor) { total += Number(factor.value); });
        // var retval = (val / total) * 100;

        // console.log('name', name, 'val', val, 'total', total, 'retval', retval);

        // var oldWeightData = self.state.weightData;
        // var newWeightData = self.state.weightData.filter(function(wd) {
        //     if(wd.title === name) return wd;
        // });
        // var res = _.extend(oldWeightData, newWeightData);

        // if(this.isMounted()) {
        //     self.setState({
        //         weightData: res
        //     });            
        // }

        // return _.isFinite(retval) ? retval : 0;
        return true;
      },
      render: function() {
        var self = this;

        var tableRows = [];
        self.props.weightData.map(function(setting) {
            tableRows.push(
                <WeightSetting 
                    title={setting.title} 
                    key={setting.id} 
                    times={setting.times}
                    weight={setting.weight} />
            );
        });

        return this.transferPropsTo(
            <Modal title="Opbouw KPI" animation={true}>
              <div className="modal-body">
                    <Table responsive>
                          <thead>
                            <tr>
                              <th>Performance Indicator</th>
                              <th>Aantal x meetellend</th>
                              <th>Gewicht</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tableRows}
                          </tbody>
                    </Table>
              </div>
              <div className="modal-footer">
                <Button onClick={this.props.onRequestHide}>Toepassen</Button>
              </div>
            </Modal>
          );
      }
});

module.exports = KPIModal;