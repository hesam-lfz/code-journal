'use strict';
const $formElement = document.querySelector('#entry-form');
const $entryImageElement = document.querySelector('#entry-image');
if ($formElement == null || $entryImageElement == null) throw new Error('Oops');
const formControls = $formElement.elements;
const $photoUrlElement = formControls.photoUrl;
const placeholderImageSrc = $entryImageElement.getAttribute('src') || '';
$photoUrlElement.addEventListener('input', (event) => {
  const photoUrl = event.target.value;
  if (photoUrl != null) {
    $entryImageElement.setAttribute('src', photoUrl);
  }
});
$formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const newEntry = {
    entryId: data.nextEntryId++,
    title: formControls.title.value,
    photoUrl: formControls.photoUrl.value,
    notes: formControls.notes.value,
  };
  data.entries.unshift(newEntry);
  $entryImageElement.setAttribute('src', placeholderImageSrc);
  $formElement.reset();
});
