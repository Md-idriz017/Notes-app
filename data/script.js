export let notesList = JSON.parse(localStorage.getItem('notes')) || [];

export function saveTostorage(){
    localStorage.setItem('notes', JSON.stringify(notesList));
}