'use strict'

function renderBooks() {
  var books = getBooks()
  var strHtmls = books.map(function (book) {
    return `
        <tr>
          <td>${book.id}</td>
          <td>${book.bookName}</td>
          <td>${book.price}</td>
          <td><button onclick="onReadBook('${book.id}')">Read</button></td>
          <td><button onclick="onUpdateBook('${book.id}')">Update</button></td>
          <td><button onclick="onRemoveBook('${book.id}')">Delete</button></td>
        </tr>`
  }).join('')
  document.querySelector("tbody").innerHTML = strHtmls
}

function renderThead(){
  document.querySelector('thead').hidden = false
}

function onAddBook(){
    var bookName = prompt('please add a book name')
    var price = +prompt('please add the book price')
    if (!bookName)return
    addBook(bookName,price)
    renderThead()
    renderBooks()
}

function onUpdateBook (bookId){
    var bookPrice = +prompt('change the book price')
    if(!bookPrice)return
    updateBook(bookId,bookPrice)
    renderBooks()
}

function onReadBook(bookId) {
  var book = getbookById(bookId)
  console.log('book',book);
  var elModal = document.querySelector('.modal')
  elModal.querySelector('h4').innerText = book.bookName
  elModal.querySelector('h5 span').innerText = book.price
  elModal.querySelector('img').src = book.imgUrl
  elModal.querySelector('p').innerText = book.desc
  elModal.querySelector('.rating').innerHTML=`<input oninput="onChangeRate(this.value,'${bookId}')" type="number" value="${book.rate}" min="0" max="10" />`
  elModal.hidden = false
}

function onCloseModal() {
  document.querySelector('.modal').hidden = true
}

function onChangeRate(newRate,bookId){
    changeRate(bookId, newRate)
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    var isBooks = checkIfNoBooks()
    if(isBooks){
      document.querySelector('thead').hidden = true
    }
    renderBooks()
}


 