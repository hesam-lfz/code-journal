'use strict';
const $formElement = document.querySelector('#entry-form');
const $entryImageElement = document.querySelector('#entry-image');
if ($formElement == null || $entryImageElement == null) throw new Error('Oops');
const formControls = $formElement.elements;
console.log(formControls);
const $photoUrlElement = formControls.photoUrl;
$photoUrlElement.addEventListener('input', (event) => {
  const photoUrl = event.target.value;
  if (photoUrl != null) {
    $entryImageElement.setAttribute('src', photoUrl);
  }
});
