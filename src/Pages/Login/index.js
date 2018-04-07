import React, { Component } from 'react'
import {
  Row,
  Col,
  Button,
  FormGroup,
  FormControl,
  InputGroup
} from 'react-bootstrap'
import PropTypes from 'prop-types'
import util from '../../utils'
import {login} from '../../utils/_data'
import './Login.css'

class Login extends Component {
    static propTypes = {
      history: PropTypes.object,
    }

    state = {
      username: '',
      password: '',
      error: '',
    }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    onLogin = async () => {
      let { username, password, error } = this.state;
      if(!username || !password) {
        error = 'Please enter valid username or password'
        return this.setState({ error })
      }
      const data = {
        username,
        password,
      };
      const res = await login(data);
      if(res.status === 'error') {
        error = 'Please enter valid username or password'
        return this.setState({ error })
      } else {
        username = '';
        password = '';
        localStorage.setItem('user', JSON.stringify(res.data))
        util.setCookie( 'auth', `Bearer ${res.data.token}` )
        util.setCookie( 'userId', res.data._id )
      }
      this.setState({
        error,
        username,
        password,
      })
      this.props.history.push({
        pathname: '/transaction'
      })
    }

    render() {
      const { username, password, error } = this.state;

      return (
        <div className="container home homebackground">
          <div className="login pt-3">
            {error && <h2 className="lead alert alert-danger">{error}</h2> }
            <div className="loginform">
              <Row>
                <Col md={6}>
                  <div className="homefont font-30">Welcome to the Chores Check Up! <br/>
                    <h4 className="homefont font-18">If you need a username/password ask your parent!.</h4>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-user" /></InputGroup.Addon>
                      <FormControl type="text" placeholder="username" name="username" value={username} onChange={this.onChange}/>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup>
                      <InputGroup.Addon><i className="fa fa-lock" /></InputGroup.Addon>
                      <FormControl type="password" name="password" placeholder="password" value={password} onChange={this.onChange} />
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Button className="btn btn-info" onClick={this.onLogin}>
                    Sign In
                  </Button>
                </Col>
              </Row>
            </div>
            <Row>
              <Col md={6}>
                <p className="hometext"> Responsibility</p>
              </Col>
            </Row>
          </div>
        </div>
      )

    }

}

export default Login
