import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import {
  simpleAction
} from './actions/simpleAction';

const mapStateToProps = state => ({
    data: state.testReducer.result
});

const mapDispatchToProps = dispatch => ({
   update: (data) => dispatch(simpleAction(data))
});

class App extends Component {
  render() {
    return (
      <div className="container-fluid">
       <Navbar/>
          <button onClick={() => this.props.update('Foo')}>Submit</button>
        <p align="center" style={{ color: 'red'}}>
            Hey { this.props.data}
        </p>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
