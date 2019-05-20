import React, {Component, Fragment} from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
// import 'react-toastify/dist/ReactToastify.min.css';

export default class HandoffEdit extends Component {
  constructor(props) {
    super(props);

    this.onChangeNameValue = this.onChangeNameValue.bind(this);
    this.onChangeToggle = this.onChangeToggle.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      id: null,
      description: '',
      responsible: '',
      priority: '',
      completed: false,
      runStatus: null,
      message: null
    }
  }

  componentDidMount() {
    if (!this.props.match.params.id) {
      return;
    }
    axios.get('http://localhost:4000/handoffs/'+this.props.match.params.id)
      .then(response => {
        this.setState({
          id: this.props.match.params.id,
          description: response.data.description,
          responsible: response.data.responsible,
          priority: response.data.priority,
          completed: response.data.completed
        })
      })
      .catch(err => {
        this.setState({
          runStatus: 'error',
          message: err.data
        });
      })
  }

  onChangeNameValue(e) {
    this.setState({
      runStatus: null,
      [e.target.name]: e.target.value
    });
  }

  onChangeToggle(e) {
    this.setState({
      runStatus: null,
      [e.target.name]: !this.state[e.target.name]
    });
  }

  onSubmit(e) {
    e.preventDefault();

    if (this.state.id) {
      const obj = {
        description: this.state.description,
        responsible: this.state.responsible,
        priority: this.state.priority,
        completed: this.state.completed
      };
      axios.post('http://localhost:4000/handoffs/update/'+this.props.match.params.id, obj)
        .then(res => {
          this.setState({
            runStatus: 'edit',
            message: res.data
          });
        })
        .catch( err => {
          this.setState({
            runStatus: 'error',
            message: err.data
          });
        });

    } else {
      const newHandoff = {
        description: this.state.description,
        responsible: this.state.responsible,
        priority: this.state.priority,
        completed: this.state.completed
      };

      axios.post('http://localhost:4000/handoffs/add', newHandoff)
        .then(res => {
          this.setState({
            runStatus: 'add',
            message: res.data
          });
        })
        .catch( err => {
          this.setState({
            runStatus: 'error',
            message: err.data
          });
        });

      this.setState({
        description: '',
        responsible: '',
        priority: '',
        completed: false
      });
    }
  }

  displayHeader() {
    if (this.state.id) {
      return <h3>Update Handoff</h3>;
    } else {
      return <h3>Create New Handoff</h3>;
    }
  }

  displayReport() {
    switch (this.state.runStatus) {
      case "add":
      case "edit":
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
        <div style={{marginTop: 10}}>
          { this.displayHeader() }
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <label>Description: </label>
              <input  type="text"
                      className="form-control"
                      name={"description"}
                      value={this.state.description}
                      onChange={this.onChangeNameValue}
              />
            </div>
            <div className="form-group">
              <label>Responsible: </label>
              <input
                type="text"
                className="form-control"
                name={"responsible"}
                value={this.state.responsible}
                onChange={this.onChangeNameValue}
              />
            </div>
            <div className="form-group">
              <div className="form-check form-check-inline">
                <input  className="form-check-input"
                        type="radio"
                        name="priority"
                        value="Low"
                        checked={this.state.priority === 'Low'}
                        onChange={this.onChangeNameValue}
                />
                <label className="form-check-label">Low</label>
              </div>
              <div className="form-check form-check-inline">
                <input  className="form-check-input"
                        type="radio"
                        name="priority"
                        value="Medium"
                        checked={this.state.priority === 'Medium'}
                        onChange={this.onChangeNameValue}
                />
                <label className="form-check-label">Medium</label>
              </div>
              <div className="form-check form-check-inline">
                <input  className="form-check-input"
                        type="radio"
                        name="priority"
                        value="High"
                        checked={this.state.priority === 'High'}
                        onChange={this.onChangeNameValue}
                />
                <label className="form-check-label">High</label>
              </div>
            </div>
            <div className="form-check">
              <input  className="form-check-input"
                      type="checkbox"
                      name="completed"
                      onChange={this.onChangeToggle}
                      checked={this.state.completed}
                      value={this.state.completed}
              />
              <label className="form-check-label" htmlFor="completedCheckbox">
                Completed
              </label>
            </div>

            <br />

            <div className="form-group">
              <input
                type="submit" value="Save" className="btn btn-primary"
              />
            </div>
          </form>
        </div>
      </Fragment>
    )
  }
}