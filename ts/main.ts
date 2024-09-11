interface FormElements extends HTMLFormControlsCollection {
  photoUrl: HTMLInputElement;
}

const $formElement = document.querySelector('#entry-form') as HTMLFormElement;
const $entryImageElement = document.querySelector(
  '#entry-image',
) as HTMLImageElement;
if ($formElement == null || $entryImageElement == null) throw new Error('Oops');
const formControls = $formElement.elements as FormElements;
console.log(formControls);
const $photoUrlElement = formControls.photoUrl;

$photoUrlElement.addEventListener('input', (event: Event) => {
  const photoUrl = (event.target as HTMLInputElement).value;
  if (photoUrl != null) {
    $entryImageElement.setAttribute('src', photoUrl);
  }
});
