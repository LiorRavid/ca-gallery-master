'use strict'

const BOOK_DB='booksDB'
const HP_IMG = "img/Harry_P.jpeg"
const CP_IMG = "img/Crime_and_Punishment.jpg"
const FERMAT_IMG = "img/Fermat.jpg"

var gBooks = createBooks()

function _createBook(bookName,price,imgUrl) {
  const book = {
    id: makeId(),
    bookName,
    price,
    imgUrl,
    desc: makeLorem(),
    rate:'0'
  }
  return book
}

function createBooks(){
    var books = loadFromStorage(BOOK_DB)
    if (!books || !books.length) {
        books = [
            _createBook('Harry Potter',100,HP_IMG),
            _createBook('Crime and Punishment',98,CP_IMG),
            _createBook('Fermat\'s Last Theorem',128,FERMAT_IMG),
        ]
    }
    saveToStorage(BOOK_DB,books)
    return books
}

function getBooks(){
    return gBooks
}

function addBook(bookName,price){
    const book = _createBook(bookName,price)
    console.log('book',book)
    gBooks.unshift(book)
    saveToStorage(BOOK_DB,gBooks)
}

function updateBook(bookId,bookPrice){
    const book = getbookById(bookId)
    book.price = bookPrice
    saveToStorage(BOOK_DB,gBooks)
}

function getbookById(bookId){
    const book = gBooks.find((book)=>book.id=== bookId)
    return book
}

function changeRate(bookId, newRate) {
    const book = getbookById(bookId)
    book.rate = newRate
    saveToStorage(BOOK_DB,gBooks)
}

function removeBook(bookId){
    const book = getbookById(bookId)
    var idx = gBooks.indexOf(book)
    gBooks.splice(idx,1)
    saveToStorage(BOOK_DB,gBooks)
}

function checkIfNoBooks(){
    const books = loadFromStorage(BOOK_DB)
    return(!books || !books.length)
}

