

const autocompleteInput = document.querySelector('.autocomplete');
const repoList = document.querySelector('.repo-list');
const repoListOwner = document.querySelector('.repo-list-owner');
let selectedRepos = [];

let debounceTimer;

autocompleteInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(searchRepositories, 300);
});

function searchRepositories() {
    const query = autocompleteInput.value;
    if (query === '') {
        clearRepoList();
        return;
    }

    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then((response) => response.json())
        .then((data) => {
            clearRepoList();
            data.items.forEach((repo) => {
                const listItem = createRepoListItem(repo);
                repoList.appendChild(listItem);
            });
        });
}

function createRepoListItemOwner(repo) {
    const listItemOwner = document.createElement('li');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    const button = document.createElement('button');
    const repoName = repo.name;

    div1.textContent = `Name: ${repo.name}`;
    div2.textContent = `Owner: ${repo.owner.login}`;
    div3.textContent = `Stars: ${repo.stargazers_count}`;
    button.textContent = '❌';
    button.style.fontSize = '36px';
    button.style.color = 'red';
    button.className = 'remove-button';

    listItemOwner.appendChild(div1);
    listItemOwner.appendChild(div2);
    listItemOwner.appendChild(div3);
    listItemOwner.appendChild(button);

    listItemOwner.querySelector('.remove-button').addEventListener('click', function () {
        listItemOwner.remove();
        selectedRepos = selectedRepos.filter((r) => r.name !== repo.name);
    });

    return listItemOwner;
}

function createRepoListItem(repo) {
    const listItem = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = repo.name;
    listItem.appendChild(span);

    listItem.addEventListener('click', function () {
        autocompleteInput.value = '';
        selectedRepos.push(repo);
        const listItemOwner = createRepoListItemOwner(repo);
        repoListOwner.appendChild(listItemOwner);
    });

    return listItem;
}

function clearRepoList() {
    while (repoList.firstChild) {
        repoList.firstChild.remove();
    }
}

