import React, { Component } from 'react'
import moment from 'moment'
import swal from 'bootstrap-sweetalert'
import { getBooks, updateBook } from '../../utils/_data'
import BookApprovedModal from '../Common/BookApprovedModal'

class Reward extends Component {
  state = {
    books: [],
    approvedModal: false,
    approvableBook: {},
    reward: '',
    date: '',
  }

  componentWillMount() {
    this.getBookList()
  }

  getBookList = async () => {
    const res = await getBooks()
    if(res && res.length) {
      this.setState({
        books: res
      })
    }
  }

  updateRewardBook = async () => {
    const { reward, date, approvableBook } = this.state;
    if(!reward) {
      swal({
        title: "Empty Fields!",
        text: "Please enter reward!",
        type: "error",
        timer: 3500,
        confirmButtonText: "Ok"
      });
    } else {
      if(approvableBook && approvableBook._id) {
        const data = {
          reward: reward,
          book_id: approvableBook._id,
        }
        const res = await updateBook(data);
        swal({
          title: "Reward Added!",
          type: "success",
          timer: 3500,
          confirmButtonText: "Ok"
        });
        this.handleModal();
        this.getBookList();
      }
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleModal = (book) => {
    this.setState({
      approvedModal: !this.state.approvedModal,
      approvableBook: book || {},
      date: '',
    })
  }

  render() {
    const { books, approvedModal, approvableBook, date, reward } = this.state;
    return (
      <div>
        <BookApprovedModal
          {...approvableBook}
          show={approvedModal}
          date={date}
          reward={reward}
          onChange={this.onChange}
          onCancel={this.handleModal}
          updateRewardBook={this.updateRewardBook}
        />
        <h2 className="text-center mt-5">Approve rewards for reading</h2>
        <table id="checklisttable">
          <thead>
            <tr>
              <th>Date</th>
              <th>Username</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Pages</th>
              <th>Lexile Level</th>
              <th>Summary</th>
              <th>Mom Approved Reward ($)</th>
              <th />
            </tr>
          </thead>
          <tbody>
          {
            books.map((book) => {
              const unix = moment(book.date).unix();
              const date = moment.unix(unix).format('MM-DD-YYYY')
              return (
                <tr key={book._id}>
                  <td>{date}</td>
                  <td>{book.username}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.pages}</td>
                  <td>{book.level}</td>
                  <td>{book.summary}</td>
                  <td>{book.momapproved}</td>
                  <td>
                    {
                      book.momapproved === 'Waiting Approval' &&
                      <button type="button" className="btn btn-default btn-primary" onClick={() => this.handleModal(book)}>Approve</button>
                    }
                  </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    )
  }

}

export default Reward