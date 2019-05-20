import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import HandoffEdit from "./components/handoff-edit.component";
import HandoffList from "./components/handoff-list.component";

import logo from "./images/cleation.png";
import img_list from "./images/list.png";
import img_list_add from "./images/list_add.png";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="https://cleation.com" target="_blank" rel="noopener noreferrer">
              <img src={logo} width="30" height="30" alt="Cleation.com" />
            </a>
            <Link to="/" className="navbar-brand">Handoffs</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <a href={"/"}>
                    <img src={img_list} width="20" height="20" alt={"List Handoffs"} />&nbsp;List
                  </a>
                </li>
                <li className="navbar-item">
                  <a href={"/create"}>
                    <img src={img_list_add} width="20" height="20" alt={"Create Handoff"} />&nbsp;Create
                  </a>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={HandoffList} />
          <Route path="/edit/:id" component={HandoffEdit} />
          <Route path="/create" component={HandoffEdit} />
        </div>
      </Router>
    );
  }
}

export default App;