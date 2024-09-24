interface FormElements extends HTMLFormControlsCollection {
  photoUrl: HTMLInputElement;
  title: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

const $formElement = document.querySelector('#entry-form') as HTMLFormElement;
const $entryImageElement = document.querySelector(
  '#entry-image',
) as HTMLImageElement;
const $noEntriesTextElement = document.querySelector('#no-entries');
const $entryListElement = document.querySelector('.entry-list');
const $entriesViewElement = document.querySelector('div[data-view="entries"]');
const $entryFormViewElement = document.querySelector(
  'div[data-view="entry-form"]',
);
const $navItemElements = document.querySelectorAll('.nav-item');
const $newEntryHeaderElement = document.querySelector(
  '.new-entry-header',
) as HTMLHeadingElement;
const $deleteButtonElement = document.querySelector('.delete-button');
const $modalElement = document.querySelector('dialog');
const $cancelModalElement = document.querySelector('.cancel-modal');
const $confirmModalElement = document.querySelector('.confirm-modal');

if (
  $formElement == null ||
  $entryImageElement == null ||
  $entryListElement == null ||
  $newEntryHeaderElement == null ||
  $deleteButtonElement == null ||
  $modalElement == null ||
  $cancelModalElement == null ||
  $confirmModalElement == null
)
  throw new Error('Oops');
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
  const entryToSave: JournalEntry = {
    entryId: 0,
    title: formControls.title.value,
    photoUrl: formControls.photoUrl.value,
    notes: formControls.notes.value,
  };
  if (data.editing === null) {
    // Adding a new entry...
    entryToSave.entryId = data.nextEntryId++;
    data.entries.unshift(entryToSave);
    const $newLiElement = renderEntry(entryToSave);
    $entryListElement.prepend($newLiElement);
  } else {
    // Editing an existing entry...
    const entryItem: JournalEntry = data.editing;
    const entryId = entryItem.entryId;
    entryToSave.entryId = entryId;
    // find index of entry in the data.entries array to edit:
    let entryIndex: number = -1;
    for (let i = 0; i < data.entries.length; i++) {
      if (data.entries[i].entryId === entryId) {
        entryIndex = i;
        break;
      }
    }
    if (entryIndex >= 0) {
      data.entries[entryIndex] = entryToSave;
      const $newLiElement = renderEntry(entryToSave);
      const $liEntryToReplace = document.querySelector(
        'li[data-entry-id="' + entryId + '"]',
      );
      $liEntryToReplace?.replaceWith($newLiElement);
    } else {
      throw new Error('Entry to edit was not found!');
    }
    data.editing = null;
  }
  writeData();
  resetForm();
  toggleNoEntries();
  viewSwap('entries');
});

document.addEventListener('DOMContentLoaded', () => {
  for (const entry of data.entries) {
    $entryListElement.appendChild(renderEntry(entry));
  }
  toggleNoEntries();
  viewSwap(data.view);
});

if (!$navItemElements) throw new Error('$navItem is null');
for (const $navItemElement of $navItemElements) {
  $navItemElement.addEventListener('click', (event: Event) => {
    const $eventTarget = event.target as HTMLElement;
    const viewName = $eventTarget.dataset.view;
    // Clear out any prepopulated form values:
    if (viewName === 'entry-form') resetForm();
    if (viewName === 'entries' || viewName === 'entry-form') viewSwap(viewName);
  });
}

$entryListElement.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget.tagName === 'I') {
    const $clickedEntryElement = $eventTarget.closest('li') as HTMLElement;
    if ($clickedEntryElement !== null) {
      const clickedEntryId = Number($clickedEntryElement.dataset.entryId);
      for (const entry of data.entries) {
        if (entry.entryId === clickedEntryId) {
          data.editing = entry;
          prepopulateFormForEntryEdit(entry);
          viewSwap('entry-form');
          break;
        }
      }
    }
  }
});

$deleteButtonElement.addEventListener('click', () => {
  $modalElement.showModal();
});

$cancelModalElement.addEventListener('click', () => {
  $modalElement.close();
});

$confirmModalElement.addEventListener('click', () => {
  if (data.editing === null) return;
  const entryItem: JournalEntry = data.editing;
  const entryId = entryItem.entryId;
  // find index of entry in the data.entries array to remove:
  let entryIndex: number = -1;
  for (let i = 0; i < data.entries.length; i++) {
    if (data.entries[i].entryId === entryId) {
      entryIndex = i;
      break;
    }
  }
  if (entryIndex >= 0) {
    data.entries.splice(entryIndex, 1);
    const $liEntryToRemove = document.querySelector(
      'li[data-entry-id="' + entryId + '"]',
    );
    $liEntryToRemove?.remove();
    data.editing = null;
    writeData();
    resetForm();
    $modalElement.close();
    toggleNoEntries();
    viewSwap('entries');
  } else {
    throw new Error('Did not find the entry!');
  }
});

function resetForm(): void {
  $formElement.reset();
  $entryImageElement.setAttribute('src', placeholderImageSrc);
  $newEntryHeaderElement.textContent = 'New Entry';
  $deleteButtonElement?.classList.add('hide');
}

function prepopulateFormForEntryEdit(entry: JournalEntry): void {
  formControls.title.value = entry.title;
  formControls.photoUrl.value = entry.photoUrl;
  formControls.notes.value = entry.notes;
  $entryImageElement.setAttribute('src', entry.photoUrl);
  $newEntryHeaderElement.textContent = 'Edit Entry';
  $deleteButtonElement?.classList.remove('hide');
}

/*
          <li class="row">
            <div class="column-half">
              <img
                src="https://us.palaisdesthes.com/media/catalog/product/cache/17268bf11b2baf4cb4cd0cb108e37f78/2/7/2726.jpg" />
            </div>
            <div class="column-half">
              <h2>Tea</h2>
              <p>T ea</p>
            </div>
          </li>
*/
function renderEntry(entry: JournalEntry): HTMLLIElement {
  const $entry = document.createElement('li');
  $entry.setAttribute('data-entry-id', entry.entryId.toString());

  const $entryRow = document.createElement('div');
  $entryRow.className = 'row';

  const $leftColumn = document.createElement('div');
  $leftColumn.className = 'column-half';

  const $listImageWrapper = document.createElement('div');
  $listImageWrapper.className = 'list-image-wrapper';

  const $entryImg = document.createElement('img');
  $entryImg.setAttribute('src', entry.photoUrl);

  const $rightColumn = document.createElement('div');
  $rightColumn.className = 'column-half';

  const $entryTitle = document.createElement('h2');
  $entryTitle.textContent = entry.title;

  const $editIcon = document.createElement('i');
  $editIcon.className = 'edit fa-solid fa-pencil';

  const $entryNotes = document.createElement('p');
  $entryNotes.textContent = entry.notes;

  $entry.append($entryRow);
  $entryRow.append($leftColumn, $rightColumn);
  $leftColumn.append($listImageWrapper);
  $listImageWrapper.append($entryImg);
  $rightColumn.append($entryTitle, $entryNotes);
  $entryTitle.append($editIcon);

  return $entry;
}

function toggleNoEntries(): void {
  if ($noEntriesTextElement == null) throw new Error('Oops');

  if (data.entries.length > 0) $noEntriesTextElement.classList.add('hidden');
  else $noEntriesTextElement.classList.remove('hidden');
}

function viewSwap(viewName: 'entries' | 'entry-form'): void {
  if (!$entryFormViewElement || !$entriesViewElement) {
    throw new Error('$entryFormView or $entriesView is null');
  }

  if (viewName === 'entries') {
    $entriesViewElement.classList.remove('hidden');
    $entryFormViewElement.classList.add('hidden');
  } else if (viewName === 'entry-form') {
    $entryFormViewElement.classList.remove('hidden');
    $entriesViewElement.classList.add('hidden');
  }
  if (data.view !== viewName) {
    data.view = viewName;
    writeData();
  }
}
