let myLibrary = [];
let editCaller; // When re-populating add book form
let cardShown; // book information card

// Global elements
addButton = document.querySelector(".add-book");
submitButton = document.querySelector(".submit");
editButton = document.querySelector(".edit");
deleteButton = document.querySelector(".delete");

// Start with a book on the table
let attnEconomy = new Book("Resisting the Attention Economy", "Jenny Odell", 2019, true)

addBookToLibrary(attnEconomy, 3);

function Book(title, author, year, read) {
    this.title = title;
    this.author = author;
    this.year = year;
    this.read = read;
    this.myCard = false;
    this.index = null;
    this.image = null;
}

Book.prototype.populateBookCard = function() {
    document.querySelector('.title').textContent = this.title;
    document.querySelector('.author-year').textContent = `${this.author} (${this.year})`;
    document.querySelector('.read').textContent = `${this.read? "Read":"Not Yet Read"}`;
    if (this.read) {
        document.querySelector('.read-check').style.visibility = "visible";
    } else {
        document.querySelector('.read-check').style.visibility = "hidden";
    }

    if (this.index != 9) {
        deleteButton.classList.remove('hidden');
        editButton.classList.remove('hidden');
    }

    // For deletion and editing
    document.querySelector('.card-index').textContent = this.index;
    this.myCard = true;
};

Book.prototype.editForm = function() {
    document.querySelector('#title').value = this.title;
    document.querySelector('#author').value = this.author;
    document.querySelector('#year').value = this.year;
    document.querySelector('#read').checked = this.read;

    editCaller = this.index;
    submitButton = document.querySelector(".submit");
    submitButton.textContent = "Update Book";

    hideBookCard();
    document.querySelector('form').classList.toggle('visible');
};


Book.prototype.removeFromLibrary = function() {
    delete myLibrary[this.index];

    bookImage = document.querySelector(`.bk${this.index}`);
    bookImage.style.visibility = 'hidden';
    
    if (myLibrary[4] && !myLibrary[3]) {
        myLibrary[4].image.classList.add("bottom");
    }
}

Book.prototype.showMyCard = function() {
    console.log(`Entering showMyCard with the referent of this set to:`);
    console.log(this);
    if (this.myCard && cardShown) {
        hideBookCard();
        console.log("Hiding my own card");
    } else if (cardShown) {
        console.log("Card already shown but updating");
        myLibrary.forEach( book => {
            book.myCard = false;
        });
       this.populateBookCard();
    } else {
        console.log("Showing a fresh card");
        myLibrary.forEach( book => {
            book.myCard = false;
        });
        showBookCard();
        this.populateBookCard();
    }
}

// Global functions (not belonging to book object)

function addBookToLibrary(book, index) {
    if (index) {
        // Page loads with a few books already assigned
        myLibrary[index] = book;
        book.index = index;
    } else { // Add to first empty slot
        // Starts at 1 b/c that's how book images are counted
        for (let i = 1; i < 8; i++) {
        console.log(i);
        console.log(myLibrary[i]);
            if (myLibrary[i] === undefined) {
                myLibrary[i] = book;
                index = i;
                book.index = index;
                break;
            }
        }
    }

    console.log(`Book was assigned index ${index}`);

    // Show the book on the library table
    bookImage = document.querySelector(`.bk${index}`);
    myLibrary[index].image = bookImage;
    bookImage.style.visibility = 'visible';

    if (myLibrary[3] && myLibrary[4]) {
        myLibrary[4].image.classList.remove("bottom");
    }
}


// Showing and hiding the Book Info Card
function showBookCard() {
    bookCard = document.querySelector('.book-card');
    bookCard.style.visibility = "visible";
    cardShown = true;
}
function hideBookCard() {
    bookCard = document.querySelector('.book-card');
    bookCard.style.visibility = "hidden";
    document.querySelector('.read-check').style.visibility = "hidden"
    cardShown = false;
}


addButton.addEventListener('click', () => {
    
    // Library full
    if (myLibrary[1] && myLibrary[2] && myLibrary[3] && 
            myLibrary[4] && myLibrary[5] && myLibrary[6] && 
            myLibrary[7]) {
        document.querySelector('.full-warning').style.visibility = "visible";
        return
    }
    
    addForm = document.querySelector('.add-form');
    addForm.classList.toggle('visible');

    // Clear any previously input forms
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#year').value = '';
    document.querySelector('#read').checked = '';

    hideBookCard();
});


submitButton.addEventListener('click', (ev) => {
    ev.preventDefault();

    // Get data
    if (document.querySelector('#title').value) {
        formTitle = document.querySelector('#title').value;
    } else {
        formTitle = "Title Unknown";
    }
    if (document.querySelector('#author').value) {
        formAuthor = document.querySelector('#author').value;
    } else {
        formAuthor = "Author Unknown";
    }

    if (document.querySelector('#year').value) {
        formYear = document.querySelector('#year').value;
    } else {
        formYear = "Year Unknown";
    }

    // Edit if called from a book info card
    if (editCaller) {
        myLibrary[editCaller].title = formTitle
        myLibrary[editCaller].author = formAuthor;
        myLibrary[editCaller].year = formYear;
        myLibrary[editCaller].read = 
                    document.querySelector('#read').checked;
        myLibrary[editCaller].showMyCard();

    // Otherwise create a new book
    } else {
        inputBook = new Book (
            formTitle,
            formAuthor,
            formYear,
            document.querySelector('#read').checked
            );
        
        addBookToLibrary(inputBook);
    }

    editCaller = null;
    submitButton.textContent = "Add Book";

    document.querySelector('form').classList.toggle('visible');
})

// Buttons within book info card
editButton.addEventListener('click', () => {
    targetIndex = +(document.querySelector('.card-index').textContent);
    myLibrary[targetIndex].editForm();
})

deleteButton.addEventListener('click', () => {
    targetIndex = +(document.querySelector('.card-index').textContent);
    myLibrary[targetIndex].removeFromLibrary();
    hideBookCard();
    document.querySelector('.full-warning').style.visibility = "hidden";
})

// Assign event listeners to the correct book images
books = document.querySelectorAll('.book>img');
books.forEach(book => {
    book.addEventListener('click', () => {
        myLibrary[book.getAttribute(("data-index"))].showMyCard();
    })
});

// // Plant's library - just for fun
// // But a bit too buggy at the moment to use
// plant = document.querySelector('.plant');
// plant.addEventListener('click', () => {
//     plantBook.showMyCard();
//     deleteButton.classList.add('hidden');
//     editButton.classList.add('hidden');
// });

// const plantBook = new Book("The Hidden Life of Trees", "Peter Wohlleben", 2016, false)

// addBookToLibrary(plantBook, 9);