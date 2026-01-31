import {notesList, saveTostorage} from './data/script.js';

const appEl = document.querySelector('.js-app');
let editPhase = null;
function renderApp(){
    appEl.innerHTML = `
        <h1 class="title">Notes App</h1>
    
        <input
          type="text"
          class="search js-search"
          placeholder="Search notes..."
        />
    
        <textarea
          class="note-input js-note-input"
          placeholder="Write your note here..."
        ></textarea>
    
        <p class="error js-error"></p>
    
        <div class="actions js-actions">
          <button class="btn primary js-add-btn">Add Note</button>
          <button class="btn cancel js-cancel-btn">Cancel</button>
        </div>
    
        <div class="notes-list js-notes-list"></div>
        <div class="toast js-toast"></div>
    
        <p class="empty-msg js-empty-msg">
          No notes yet. Start by writing one ✍️
        </p>
    `;
};

renderApp();
renderNotesList();

document.querySelector('.js-add-btn')
    .addEventListener('click', () => {
        const noteEl = document.querySelector('.js-note-input');
        const note = noteEl.value;
        
        
        if(note === '') return;
        
        if(editPhase !== null){
            const index = notesList.findIndex(note => note.id === editPhase);
            
            if(index === -1) return;
            
            notesList[index].note = note;
            editPhase = null;
            document.querySelector('.js-add-btn')
                .innerHTML = 'Add Note';
            appEl.classList.remove('is-cancel');
        }else {
            notesList.unshift({
                id : Date.now(),
                note
            });
            
            toastMsg('Note Added');
        }
        
        renderNotesList();
        saveTostorage();
        
        noteEl.value = '';
    });

function renderNotesList(){
    let html ='';
    notesList.forEach((notes) => {
        html += `
        <div class="note-card js-note-card"
            data-id="${notes.id}">
            <p class="note-text js-note-text">${notes.note}</p>
            <div class="note-actions js-note-actions">
                <button class="js-edit">Edit</button>
                <button class="js-delete">Delete</button>
            </div>
            <div class="confirm-msg js-confirm"></div>
        </div>
        `;
    });
    
    document.querySelector('.js-notes-list')
        .innerHTML = html;
    
    document.querySelector('.js-empty-msg').style.display = 
        notesList.length === 0 ? 'block' : 'none';
}

document.querySelector('.js-notes-list')
    .addEventListener('click', (e) => {
        const appCont = e.target.closest('.js-app');
        const editBtn = e.target.closest('.js-edit');
        const deleteBtn = e.target.closest('.js-delete');
        const notesCont = e.target.closest('.js-note-card');
        const confirmEl = notesCont.querySelector('.js-confirm');
        const yesBtn = confirmEl.querySelector('.js-yes');
        const noBtn = confirmEl.querySelector('.js-no');
        
        if(!notesCont) return;
        
        if(deleteBtn){
            const confirmMsg = notesCont.querySelector('.js-note-actions');
            confirmEl.innerHTML = `
            <div class="confirm-alert">
            <p>Are you sure want to delete this note?</p>
            <div class="confirm-btn">
                <button class="js-yes">Yes</button>
                <button class="js-no">No</button>
            </div>
            </div>
            `;
            
            confirmMsg.classList.add('hidden');
        }
        
        if(e.target.classList.contains('js-yes')){
            const id = Number(notesCont.dataset.id);
            
            const index = notesList.findIndex(note => note.id === id);
            
            if(index === -1) return;
            
            notesList.splice(index, 1);
            
            toastMsg('Note Deleted');
            renderNotesList();
            saveTostorage();
        }
        
        if(noBtn){
            const confirmMsg = notesCont.querySelector('.js-note-actions');
            confirmMsg.classList.remove('hidden');
            confirmEl.innerHTML = '';
        }
        
        if(editBtn){
            const id = Number(notesCont.dataset.id);
            editPhase = id;
            
            document.querySelectorAll('.js-note-card')
                .forEach((note) => note.classList.remove('editing'));
            
            const noteEl = document.querySelector('.js-note-input');
            const index = notesList.findIndex(note => note.id === id);
            
            const deleteButton = notesCont.querySelector('.js-delete');
            deleteButton.disabled = true;
            
            noteEl.value = notesList[index].note;
            scrollWindow();
            
            setTimeout(() => {
                noteEl.focus()
            }, 500);
            
            document.querySelector('.js-add-btn')
                .innerHTML = 'Update Note';
            notesCont.classList.add('editing');
            appCont.classList.add('is-cancel');
        }
    });

document.querySelector('.js-cancel-btn')
    .addEventListener('click', () => {
        const deleteBtn = document.querySelectorAll('.js-delete');
        editPhase = null;
        const noteEl = document.querySelector('.js-note-input');
            
        deleteBtn.forEach((btn) => {
            btn.disabled = false;
        });
        
        document.querySelectorAll('.js-note-card')
            .forEach((note) => note.classList.remove('editing'));
        
        noteEl.value = '';
        document.querySelector('.js-add-btn')
                .innerHTML = 'Add Note';
        
        appEl.classList.remove('is-cancel');
    });

document.querySelector('.js-search')
    .addEventListener('input', (e) => {
        const searchValue = e.target.value.toLowerCase().trim();
        let hasMatch = false;
        
        document.querySelectorAll('.js-note-card')
          .forEach((note) => {
              const noteText  = note.querySelector('.js-note-text').innerText.toLowerCase();
              if(noteText.includes(searchValue)){
                    note.style.display = 'block';
                    hasMatch = true;
              }else {
                    note.style.display = 'none';
              }
            });
        document.querySelector('.js-empty-msg').style.display = 
            hasMatch || searchValue === '' ? 'none' : 'block';
        document.querySelector('.js-empty-msg')
            .innerText = 'No notes found';
    });

const toastEl = document.querySelector('.js-toast');
function toastMsg(message){
    toastEl.textContent = message;
    toastEl.classList.add('display');
    
    setTimeout(() => {
        toastEl.classList.remove('display');
    }, 1500);
}

function scrollWindow(){
    window.scrollTo({
        behavior: 'smooth'
    });
    
    document.querySelector('body')
        .scrollIntoView({behavior : 'smooth'});
}