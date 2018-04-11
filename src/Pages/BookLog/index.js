import React, { Component } from 'react'
import moment from 'moment'
import swal from 'bootstrap-sweetalert'
import BookModal from '../Common/BookModal'
import { getUserBooks, addUserBook, deleteUserBook } from '../../utils/_data'
import singlebook from '../../assets/images/singlebook.svg'
import thumbUp from '../../assets/images/thumbs-up.png'

class BookLog extends Component {
  state = {
    currentUser: {},
    books: [],
    bookModal: false,
    title: '',
    pages: '',
    author: '',
    level: '',
    summary: '',
    date: '',
  }

  componentWillMount() {
    const currentUser = (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || {};
    if(currentUser && currentUser._id) {
      this.setState({
        currentUser
      })
      this.getBooks()
    }
  }

  getBooks = async () => {
    const res = await getUserBooks();
    if(res) {
      this.setState({
        books: res,
      })
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleModal = () => {
    this.setState({
      bookModal: !this.state.bookModal,
    })
  }

  addBook = async () => {
    const { title, author, pages, level, summary, date } = this.state;
    if ( !title || !author || !pages || !level || !summary || !date ) {
      swal({
        title: "Empty Fields!",
        text: "Please enter all fields!",
        type: "error",
        timer: 3500,
        confirmButtonText: "Ok"
      });
    } else {
      let itemToSend = {
        title,
        author,
        pages,
        level,
        summary,
        date,
      };
      await addUserBook(itemToSend);
      swal({
        title: "Book Added!",
        text: "Today a reader, tomorrow a leader.",
        imageUrl: thumbUp,
        timer: 3500,
        confirmButtonText: "Ok"
      });
      this.getBooks();
      this.setState({
        bookModal: false,
        title: '',
        pages: '',
        author: '',
        level: '',
        summary: '',
        date: '',
      })
    }
  }

  onDelete = (id) => {
    const that = this;
    swal({
        title: "Are you sure?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Yes, delete it!",
        closeOnConfirm: false
      },
      async function(){
        swal("Deleted!", "success");
        await deleteUserBook(id);
        that.getBooks();
      })
  }

  render() {
    const { books, bookModal } = this.state;
    return (
      <div>
        <BookModal
          state={this.state}
          show={bookModal}
          onChange={this.onChange}
          onCancel={this.handleModal}
          addBook={this.addBook}
        />
        <div className="row inline-block" style={{paddingTop: 50}}>
          <div className="col-sm-2" >
            <button className="btn btn-default btn-primary round-button" style={{marginTop: '10vh', marginLeft: '10vw'}} onClick={this.handleModal}>
              <h4>
                Add Book
                <img src={singlebook} className="round-button-img" alt="single-book"/>
              </h4>
            </button>
          </div>
          <div className="col-sm-10">
            <h3 style={{marginTop: '10vh', paddingLeft: '15vw', color: '#b7334b' }}>
              &#8220;The more that you read, the more things you will know.
              <br/>The more you learn, the more places you'll go.&#8221;— Dr. Seuss
            </h3>
          </div>
        </div>
        <div className="row">
          <table id="checklisttable">
            <thead>
            <tr>
              <th>Date</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Pages</th>
              <th>Lexile Level</th>
              <th>Summary</th>
              <th>Mom Approved Reward</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {
              books && books.length ? books.map((book, i) => {
                const unix = book.date && moment(book.date).unix();
                const date = moment.unix(unix).format('MM-DD-YYYY')
                return (
                  <tr key={i}>
                    <td>{date && date}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.pages}</td>
                    <td>{book.level}</td>
                    <td>{book.summary}</td>
                    <td>{book.momapproved}</td>
                    <td>
                      {
                        book.momapproved === 'Waiting Approval' &&
                        <button type="button" className="btn btn-default btn-danger" onClick={() => this.onDelete(book._id)}>Delete</button>
                      }
                    </td>
                  </tr>
                )
              }) : null
            }
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

export default BookLog
