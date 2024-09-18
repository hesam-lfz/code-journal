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

if (
  $formElement == null ||
  $entryImageElement == null ||
  $entryListElement == null
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
  $entryListElement.prepend(renderEntry(newEntry));
  if (data.entries.length === 1) toggleNoEntries();
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
    if (viewName === 'entries' || viewName === 'entry-form') {
      viewSwap(viewName);
    }
  });
}

$entryListElement.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  if ($eventTarget.tagName === 'I') {
    const $clickedEntryElement = $eventTarget.closest('li') as HTMLElement;
    console.log($clickedEntryElement);
    if ($clickedEntryElement !== null) {
      const clickedEntryId = Number($clickedEntryElement.dataset.entryId);
      for (const entry of data.entries) {
        if (entry.entryId === clickedEntryId) {
          data.editing = entry;
          viewSwap('entry-form');
          break;
        }
      }
    }
  }
});

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
