'use strict';

var api = require('../utils/api');
var InputTextarea = require('./inputTextarea.jsx');
var Icon = require('./Icon.jsx');
var DayStore = require('../stores/DayStore');
var DayActions = require('../actions/DayActions');
var moment = require('moment');

var WorkoutsForm = React.createClass({
  getInitialState: function() {
    return ({
      error: '',
      submitting: false,
      showForm: false,
      text: '',
      createWorkoutSuccessUnsub: {}
    });
  },
  componentDidMount: function() {
    var self = this;
    this.unsubFromCreateWorkoutSuccess = DayStore.streams.createWorkoutSuccess.listen(function() {
      // if (self.isMounted()) {
        self.setState({
          submitting: false,
          showForm: false,
          text: ''
        });
      // }
    });
  },
  handleNewWorkoutTextUpdate: function(text) {
    this.setState({
      text: text
    });
  },
  toggleForm: function() {
    this.setState({
      showForm: !this.state.showForm
    });
  },
  handleFormSubmit: function(event) {
    event.preventDefault();
    this.setState({
      submitting: true
    });
    DayActions.createWorkout({
      text: this.state.text,
      day: this.props.day,
      timestamp: moment().utc().format(),
      user: this.props.user
    });
  },
  componentWillUnmount: function() {
    this.unsubFromCreateWorkoutSuccess();
  },
  render: function() {
    var form;
    var toggleFormButtonBody = <span><Icon name='add' /> Добавить комплекс </span>;
    if (this.state.showForm) {
      toggleFormButtonBody = 'Отмена';
      form = (<form onSubmit={this.handleFormSubmit} className='workouts-form'>
        <div className='workout-userpic figure-userpic'>
          <img src={api.getLargeBase64Userpic(this.props.user)} />
        </div>
        <div className='workout'>
          <div className='workout-meta'>
            <strong className='workout-meta-user'>
              {this.props.username}
            </strong>
          </div>
          <div className='workout-body'>
            <InputTextarea
              name='workout_text'
              autoFocus={true}
              text={this.state.text}
              onTextChange={this.handleNewWorkoutTextUpdate}
              placeholder='Введите инструкции' />
          </div>
          <div className='workout-footer'>
            <span className='workout-footer-item'>
              {this.state.error}
            </span>
            <button className='workout-submit' type='submit' disabled={this.state.submitting}>
              Сохранить
            </button>
          </div>
        </div>
      </form>);
    }
    return (
      <div>
        {form}
        <button onClick={this.toggleForm} className='workout-add' type='button' >
          {toggleFormButtonBody}
        </button>
      </div>
    );
  }
});

module.exports = WorkoutsForm;