'use strict';
const $formElement = document.querySelector('#entry-form');
const $entryImageElement = document.querySelector('#entry-image');
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
  $navItemElement.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    const viewName = $eventTarget.dataset.view;
    if (viewName === 'entries' || viewName === 'entry-form') {
      viewSwap(viewName);
    }
  });
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
function renderEntry(entry) {
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
  // const $editIcon = document.createElement('i');
  // $editIcon.className = 'edit fa-solid fa-pencil';
  const $entryNotes = document.createElement('p');
  $entryNotes.textContent = entry.notes;
  $entry.append($entryRow);
  $entryRow.append($leftColumn, $rightColumn);
  $leftColumn.append($listImageWrapper);
  $listImageWrapper.append($entryImg);
  $rightColumn.append($entryTitle, $entryNotes);
  // $entryTitle.append($editIcon);
  return $entry;
}
function toggleNoEntries() {
  if ($noEntriesTextElement == null) throw new Error('Oops');
  if (data.entries.length > 0) $noEntriesTextElement.classList.add('hidden');
  else $noEntriesTextElement.classList.remove('hidden');
}
function viewSwap(viewName) {
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
  data.view = viewName;
}
