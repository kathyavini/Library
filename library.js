let myLibrary = [];
let editCaller; // Used when re-populating add book form
let cardShown; // book information card

// Global elements
let addButton = document.querySelector(".add-book");
let submitButton = document.querySelector(".submit");
let editButton = document.querySelector(".edit");
let deleteButton = document.querySelector(".delete");
let books = document.querySelectorAll('.book>img');

// Start with one book on the table
let pood = new Book("Practical Object-Oriented Design: An Agile Primer Using Ruby, 2nd Edition", "Sandi Metz", 2018, false)

addBookToLibrary(pood, 3);

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
    document.querySelector('.title').textContent = 
            this.title;
    document.querySelector('.author-year').textContent = 
            `${this.author} (${this.year})`;
    document.querySelector('.read').textContent = 
            `${this.read? "Read":"Not Yet Read"}`;

    if (this.read) {
        document.querySelector('.read-check').style.visibility = "visible";
    } else {
        document.querySelector('.read-check').style.visibility = "hidden";
    }

    // For plant's library
    if (this.index != 9) {
        deleteButton.classList.remove('hidden');
        editButton.classList.remove('hidden');
    }

    // To pair delete and edit buttons with the correct book
    document.querySelector('.card-index').textContent = this.index;

    // To track which book the currently displayed card corresponds to
    this.myCard = true;
};

Book.prototype.editForm = function() {

    // Populate form with book's values
    document.querySelector('#title').value = this.title;
    document.querySelector('#author').value = this.author;
    document.querySelector('#year').value = this.year;
    document.querySelector('#read').checked = this.read;

    // Call up form and save which book did the calling
    editCaller = this.index;
    submitButton = document.querySelector(".submit");
    submitButton.textContent = "Update Book";

    hideBookCard();
    toggleFormVisibility();
};


Book.prototype.removeFromLibrary = function() {
    delete myLibrary[this.index];
    updateBookDisplay();
}

Book.prototype.showMyCard = function() {
    if (this.myCard && cardShown) {
        hideBookCard();
    } else if (cardShown) {
        myLibrary.forEach( book => {
            book.myCard = false;
        });
       this.populateBookCard();
    } else {
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
        // Page loads with books already assigned
        myLibrary[index] = book;
        book.index = index;
    } else { // Add to first empty slot
        // Starts at 1 b/c that's how book images are counted
        for (let i = 1; i < 8; i++) {
            if (myLibrary[i] === undefined) {
                myLibrary[i] = book;
                book.index = i;
                break;
            }
        }
    }

    updateBookDisplay();
}

function updateBookDisplay() {
    for (let i = 1; i < 8; i++) {
        bookImage = document.querySelector(`.bk${i}`);
        if (myLibrary[i]) {
            myLibrary[i].image = bookImage;
            bookImage.style.visibility = 'visible';
        } else {
            bookImage.style.visibility = 'hidden';
        }
    }

    // Fix if book 4 has been left in mid-air
    if (myLibrary[4] && !myLibrary[3]) {
        myLibrary[4].image.classList.add("bottom");
    }

    // Raise book 4 back up if book 3 is present
    if (myLibrary[3] && myLibrary[4]) {
        myLibrary[4].image.classList.remove("bottom");
    }
}

// Showing and hiding the add/edit form
function toggleFormVisibility() {
    addForm = document.querySelector('.add-form');
    addForm.classList.toggle('visible');
}


// Showing and hiding the Book Info Card
function showBookCard() {
    bookCard = document.querySelector('.book-card');
    bookCard.style.visibility = "visible";
    cardShown = true;
    hideFullWarning();
}

function hideBookCard() {
    bookCard = document.querySelector('.book-card');
    bookCard.style.visibility = "hidden";
    document.querySelector('.read-check').style.visibility = "hidden"
    cardShown = false;
}

function showFullWarning() {
    document.querySelector('.full-warning').style.visibility = "visible";
}

function hideFullWarning() {
    document.querySelector('.full-warning').style.visibility = "hidden";
}

function libraryIsFull() {
    for (let i = 1; i < 8; i++) {
        if (!myLibrary[i]) return false;
    }
    return true
}

function clearAddForm() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#year').value = '';
    document.querySelector('#read').checked = '';
}

function getDataFromForm() {

    if (document.querySelector('#title').value) {
        formTitle = document.querySelector('#title').value;
    } else formTitle = "Title Unknown";

    if (document.querySelector('#author').value) {
        formAuthor = document.querySelector('#author').value;
    } else formAuthor = "Author Unknown";

    if (document.querySelector('#year').value) {
        formYear = document.querySelector('#year').value;
    } else formYear = "Year Unknown";

    formRead = document.querySelector('#read').checked;

    return [formTitle, formAuthor, formYear, formRead];
}


// Event listeners for global elements 
addButton.addEventListener('click', () => {    
    
    if (libraryIsFull()){
        hideBookCard();
        showFullWarning();
        return
    }

    hideFullWarning();
    clearAddForm();
    toggleFormVisibility();
    hideBookCard();

});

submitButton.addEventListener('click', (ev) => {
    
    ev.preventDefault();
    [formTitle, formAuthor, formYear, formRead] = getDataFromForm();

    // Edit if called from a book info card
    if (editCaller) {
        myLibrary[editCaller].title = formTitle
        myLibrary[editCaller].author = formAuthor;
        myLibrary[editCaller].year = formYear;
        myLibrary[editCaller].read = formRead;

        myLibrary[editCaller].showMyCard();

    // Otherwise create a new book
    } else {
        inputBook = new Book (
            formTitle,
            formAuthor,
            formYear,
            formRead);
        
        addBookToLibrary(inputBook);
    }

    editCaller = null;
    submitButton.textContent = "Add Book";

    toggleFormVisibility();
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
    hideFullWarning();
})

// Assign event listeners to the correct book images
books.forEach(book => {
    book.addEventListener('click', () => {
        myLibrary[book.getAttribute(("data-index"))].showMyCard();
    })
});

// Plant's library - just for fun
plant = document.querySelector('.plant');
plant.addEventListener('click', () => {
    plantBook.showMyCard();
    deleteButton.classList.add('hidden');
    editButton.classList.add('hidden');
});

const plantBook = new Book("The Hidden Life of Trees", "Peter Wohlleben", 2016, true)

addBookToLibrary(plantBook, 9);

// Just for testing
function fillLibrary() {
    for (let i = 1; i < 8; i++) {
        test = new Book(`Title ${i}`, `Author ${i}`, 2021, true);
        addBookToLibrary(test);
    }
}