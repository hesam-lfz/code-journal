interface FormElements extends HTMLFormControlsCollection {
  photoUrl: HTMLInputElement;
  title: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

const $formElement = document.querySelector('#entry-form') as HTMLFormElement;
const $entryImageElement = document.querySelector(
  '#entry-image',
) as HTMLImageElement;
if ($formElement == null || $entryImageElement == null) throw new Error('Oops');
const formControls = $formElement.elements as FormElements;
const $photoUrlElement = formControls.photoUrl;
const placeholderImageSrc = $entryImageElement.getAttribute('src') || '';

$photoUrlElement.addEventListener('input', (event: Event) => {
  const photoUrl = (event.target as HTMLInputElement).value;
  if (photoUrl != null) {
    $entryImageElement.setAttribute('src', photoUrl);
  }
});

$formElement.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const newEntry: JournalEntry = {
    entryId: data.nextEntryId++,
    title: formControls.title.value,
    photoUrl: formControls.photoUrl.value,
    notes: formControls.notes.value,
  };
  data.entries.unshift(newEntry);
  writeData();
  $entryImageElement.setAttribute('src', placeholderImageSrc);
  $formElement.reset();
});
