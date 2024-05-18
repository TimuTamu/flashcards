// dom elements selector

const container = document.querySelector( ".container");
const addQuestionModal = document.getElementById("add-card-modal");
const saveBtn = document.getElementById("save-btn");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const errorMessage = document.getElementById("error");
const addQuestion = document.getElementById("add-card");
const closeBtn = document.getElementById("close-btn");

// Initialising Variables

let editBool = false;
let originalId = null;
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

addQuestion.addEventListener('click', () => {
    //Show the add question modal and hide the container
    container.classList.add('hide');
    question.value = "";
    answer.value = "";
    addQuestionModal.classList.remove('hide');
});

closeBtn.addEventListener('click', () =>{
    //Show the cards and hide question modal
    container.classList.remove('hide');
    addQuestionModal.classList.add('hide');
    if(editBool) {
        editBool = false;
    }
});

saveBtn.addEventListener('click',() =>{
    // save the flashcard
    let tempQuestion = question.value.trim();
    let tempAnswer = answer.value.trim();
    if(!tempQuestion || !tempAnswer) {
        //display error message if question or answer is empty
        errorMessage.classList.remove('hide');
    }else{
        if(editBool){
            //If editing an existing flashcard, remove the original flashcard from the array
            flashcards = flashcards.filter(flashcard => flashcard.id !== originalId);
        }
        let id = Date.now();
        // Add the new flashcard to the array
        flashcards.push({ id, question: tempQuestion, answer: tempAnswer});
        // Save the flashcards array to localstorage
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
        container.classList.remove('hide');
        errorMessage.classList.add('hide');
        viewList();
        question.value = "";
        answer.value = "";
        editBool = false;
        addQuestionModal.classList.add('hide');
    }
});

// Function to display the flashcards list

function viewList(){
    const cardsList = document.querySelector('.cards-list');
    cardsList.innerHTML = '';
    flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    flashcards.forEach(flashcard => {
        const div = document.createElement("div");
        div.classList.add('card');
        div.innerHTML = `
        <p class="q-div">${flashcard.question}</p>
        <p class="a-div hide" >${flashcard.answer}</p>
        <button class="show-hide-btn">Show/Hide</button>
        <div class="btns-con">
            <button class="edit"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        div.setAttribute('data-id', flashcard.id);
        const displayAns = div.querySelector('.a-div');
        const showHideBtn = div.querySelector('.show-hide-btn');
        const editBtn = div.querySelector('.edit');
        const deleteBtn = div.querySelector('.delete');

        showHideBtn.addEventListener('click', () => {
            //Toggle the visibility of the answer
            displayAns.classList.toggle('hide');
        });

        editBtn.addEventListener('click', () => {
            // Enable editing mode and show the add question card
            editBool = true;
            modifyElement(editBtn, true);
            addQuestionModal.classList.remove('hide');
        });

        deleteBtn.addEventListener('click', () => {
            // Delete the Flashcard
            modifyElement(deleteBtn);
        });

        cardsList.appendChild(div);

    });
}

// Function to modify a flashcard

const modifyElement = (element, edit = false) => {
    const parentDiv = element.parentElement.parentElement;
    const id = Number(parentDiv.getAttribute('data-id'));
    const parentQuestion = parentDiv.querySelector('.q-div').innerHTML;
    if(edit){
        const parentAnswer = parentDiv.querySelector('.a-div').innerHTML;
        answer.value = parentAnswer;
        question.value = parentQuestion;
        originalId = id;
        disableBtns(true);
    }else{
        //Remove the flashcard from array and update localstorage
        flashcards = flashcards.filter(flashcard => flashcard.id !== id);
        localStorage.setItem('flashcards', JSON.stringify(flashcards));
    }
    parentDiv.remove();
}

//Function to disable edit Buttons
const disableBtns = (value) =>{
    const editButtons = document.getElementsByClassName('edit');
    Array.from(editButtons).forEach((element) =>{
        element.disabled = value;
    });
}

//Event listener to display the flashcards list when the DOM is loaded

document.addEventListener('DOMContentLoaded', viewList);