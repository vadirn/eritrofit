'use strict';

window.React = require('react');
var RouterActions = require('./actions/RouterActions');
var RouterStore = require('./stores/RouterStore');
var _ = require('lodash');
// var page = require('page');

var views = require('./constants/views');
// var routes = require('./constants/routes');

var Login = require('./views/login.jsx');

var App = React.createClass({
  getInitialState: function() {
    return ({
      current_url: window.location.hash.substring(1),
      view: 'DEFAULT',
      params: {}
    });
  },
  componentWillMount: function() {
    var self = this;
    window.onpopstate = function() {
      RouterActions.popstate({
        target_url: window.location.hash.substring(1),
        current_url: self.state.current_url,
        current_view: self.state.view
      });
    };
  },
  componentDidMount: function() {
    var self = this;
    RouterStore.streams.setView.listen(function(payload) {
      if (!payload) { return; }
      // 1. set next_url if exists, empty it if next_url is the same as current_url
      // 2. set current_view and transfer props to it,
      //    don't forget to handle redirectPrompt handler
      // 3. update current_url with next_url
      // 4. ...
      self.setState({
        view: payload.target_view,
        params: payload.params,
        current_url: payload.target_url
      });

      if (payload.update_url) {
        window.history.replaceState({}, '', '#'+self.state.current_url);
      }
    });
    // initial popstate
    RouterActions.popstate({
      target_url: window.location.hash.substring(1),
      current_url: self.state.current_url,
      current_view: self.state.view
    });
  },
  render: function() {
    var view;
    // in case of redirectPrompt
    var params = _.assign(this.state.params, { current_url: this.state.current_url });

    switch(this.state.view) {
      case views.INDEX:
        view = 'index';
        break;
      case views.LOGIN:
        view = <Login params={params} />;
        break;
        case views.PASSWORD_RESET:
          view = 'reset password';
          break;
      case views.DAY:
        view = 'day';
        break;
      case views.PROFILE:
        view = 'profile';
        break;
      case views.RESULTS:
        view = 'results';
        break;
      case views.DAYS:
        view = 'days';
        break;
      case views.NEW_DAY:
        view = 'new_day';
        break;
      case views.USERS:
        view = 'users';
        break;
      default:
        view = '404!!!!';
        // NOT_FOUND
        break;
    }

    return (
      <div>
        {view}
      </div>
    );
  }
});

React.render(<App />, document.getElementById('main'));
