import React from 'react'
import { FormGroup, FormControl, Modal } from 'react-bootstrap'
import logo from '../../assets/images/books.png'

const BookApprovedModal = (props) => (
  <Modal show={props.show} onHide={props.onCancel}>
    <Modal.Header>
      <h3 className="mt-0">
        <img src={logo} className="icons" />
        Approve a reward for: {props.username}
      </h3>
    </Modal.Header>
    <Modal.Body>
      <FormGroup>
        <FormControl type="text" value={props.title} readOnly={true}/>
      </FormGroup>
      <FormGroup>
        <FormControl type="text" value={props.pages} readOnly={true}/>
      </FormGroup>
      <FormGroup>
        <FormControl type="text" value={props.level} readOnly={true}/>
      </FormGroup>
      <FormGroup>
        <FormControl type="number" min={0} name='reward' value={props.reward} onChange={props.onChange} placeholder="Enter a reward"/>
      </FormGroup>
      <FormGroup>
        <label>Date: </label>
        <FormControl type="date" name="date" value={props.date} onChange={props.onChange}/>
      </FormGroup>
    </Modal.Body>
    <Modal.Footer>
      <button type="button" className="btn btn-default btn-success" onClick={props.updateRewardBook} >
        Save
      </button>
      <button type="button" className="btn btn-default btn-danger" onClick={props.onCancel} >
        Cancel
      </button>
    </Modal.Footer>
  </Modal>
)

export default BookApprovedModal
