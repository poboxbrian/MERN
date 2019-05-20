import React, {Component, Fragment} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import img_delete from "../images/delete.png";
import img_edit from "../images/edit.png";

export default class HandoffList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      handoffs: [],
      runStatus: null,
      message: null
    };
  }

  componentDidMount() {
    axios.get('http://localhost:4000/handoffs/')
      .then(res => {
        this.setState({ handoffs: res.data });
      })
      .catch(err => {
        this.setState({
          runStatus: 'error',
          message: err.data
        });
      })
  }

  onClickDelete = (e) => {
    e.preventDefault();

    let targetId = e.target.id;

    axios.get('http://localhost:4000/handoffs/delete/'+targetId)
      .then(res => {
        this.setState({
          handoffs: this.state.handoffs.filter(h => h._id !== targetId),
          runStatus: 'delete',
          message: res.data
        });
      })
      .catch(err => {
        this.setState({
          runStatus: 'error',
          message: err.data
        });
      })
  };

  displayHandoffs = (handoff, i) => {
    return (
      <tr key={i + '_' + handoff._id}>
        <td className={handoff.completed ? 'completed' : ''}>{handoff.description}</td>
        <td className={handoff.completed ? 'completed' : ''}>{handoff.responsible}</td>
        <td className={handoff.completed ? 'completed' : ''}>{handoff.priority}</td>
        <td>
          <a href={"/edit/" + handoff._id}>
            <img src={img_edit} width="20" height="20" alt={"edit"} />
          </a>&nbsp;&nbsp;
          <img src={img_delete} width="20" height="20" alt={"delete"} id={handoff._id} onClick={this.onClickDelete} />
        </td>
      </tr>
    );
  };


  handoffList() {
    return this.state.handoffs.map((currentHandoff, i) => {
      return this.displayHandoffs(currentHandoff, i);
    })
  }

  displayHeader() {
    return <h3>Handoffs List</h3>;
  }

  displayReport() {
    switch (this.state.runStatus) {
      case "delete":
        toast.success(this.state.message, {
          position: toast.POSITION.TOP_CENTER
        });
        break;
      case "error":
        toast.error(this.state.message, {
          position: toast.POSITION.TOP_CENTER
        });
        break;
    }
  }

  render() {
    return (
      <Fragment>
      <div>
        {this.displayReport()}
        <ToastContainer />
      </div>
      <div>
        {this.displayHeader()}
        <table className="table table-striped" style={{ marginTop: 20 }} >
          <thead>
          <tr>
            <th>Description</th>
            <th>Responsible</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          { this.handoffList() }
          </tbody>
        </table>
      </div>
      </Fragment>
    )
  }
}