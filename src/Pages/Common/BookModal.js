import React from 'react'
import { FormGroup, FormControl, Modal } from 'react-bootstrap'
import logo from '../../assets/images/books.png'

const BookModal = (props) => (
  <Modal show={props.show} onHide={props.onCancel}>
    <Modal.Header>
      <img src={logo} className="icons-modal" alt="logo" /><h3 className="m-0 p-0">The more you read, the more you earn!</h3>
    </Modal.Header>
    <Modal.Body>
      <FormGroup>
        <FormControl type="text" name="title" value={props.state.title} placeholder="Title:" onChange={props.onChange} autoFocus={true}/>
      </FormGroup>
      <FormGroup>
        <FormControl type="text" name="author" value={props.state.author} placeholder="Author:" onChange={props.onChange} autoFocus={true}/>
      </FormGroup>
      <FormGroup>
        <FormControl type="number" name="pages" value={props.state.pages} placeholder="Pages:" min={0} onChange={props.onChange}/>
      </FormGroup>
      <FormGroup>
        <FormControl type="text" name="level" value={props.state.level} placeholder="Lexile Level or enter NA if don't know:" onChange={props.onChange}/>
      </FormGroup>
      <FormGroup>
        <FormControl componentClass="textarea" name="summary" value={props.state.summary} placeholder="Summary:" onChange={props.onChange}/>
      </FormGroup>
      <FormGroup>
        <label>Date: </label>
        <FormControl type="date" name="date" value={props.state.date} onChange={props.onChange}/>
      </FormGroup>
    </Modal.Body>
    <Modal.Footer>
      <button type="button" className="btn btn-default btn-success" onClick={props.addBook} >
        Save
      </button>
      <button type="button" className="btn btn-default btn-danger" onClick={props.onCancel} >
        Cancel
      </button>
    </Modal.Footer>
  </Modal>
)

export default BookModal
