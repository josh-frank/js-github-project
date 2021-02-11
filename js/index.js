const userSearchUrl = "https://api.github.com/search/users?q=*";
const userRepositoriesUrl = "https://api.github.com/users/*/repos";

const userSearchForm = document.getElementById( "github-form" );
const userList = document.getElementById( "user-list" );
const repositoryList = document.getElementById( "repos-list" );

function fetchUserSearchResults( userSearchFormSubmission ) {
    userSearchFormSubmission.preventDefault();
    const searchQuery = userSearchFormSubmission.target.elements.search.value;
    fetch( userSearchUrl.replace( "*", searchQuery ), { headers: { "Accept": "application/vnd.github.v3+json" } } )
        .then( response => response.json() )
        .then( userSearchResults => displayUserSearchResults( userSearchResults ) );
}

function displayUserSearchResults( searchResults ) {
    userList.innerHTML = "";
    searchResults.items.forEach( user => {
        const thisUserListItem = document.createElement( "li" );
        thisUserListItem.dataset.login = user.login;
        const thisUserAvatar = document.createElement( "img" );
        thisUserAvatar.classList.add( "avatar" );
        thisUserAvatar.src = user.avatar_url;
        thisUserAvatar.alt = user.login;
        const thisUserName = document.createElement( "b" );
        thisUserName.textContent = user.login;
        const lineBreak = document.createElement( "br" );
        const thisUserProfileLink = document.createElement( "a" );
        thisUserProfileLink.href = user.html_url;
        thisUserProfileLink.target = "_blank";
        thisUserProfileLink.textContent = "(profile)";
        thisUserListItem.append( thisUserAvatar, thisUserName, lineBreak, thisUserProfileLink );
        userList.append( thisUserListItem );
    } );
}

function fetchRepositories( username ) {
    fetch( userRepositoriesUrl.replace( "*", username ), { headers: { "Accept": "application/vnd.github.v3+json" } } )
    .then( response => response.json() )
    .then( repoSearchResults => displayRepoSearchResults( repoSearchResults ) );
}

function displayRepoSearchResults( repoSearchResults ) {
    repositoryList.innerHTML = "";
    repoSearchResults.forEach( repository => {
        const thisRepoListItem = document.createElement( "li" );
        const thisRepoLink = document.createElement( "a" );
        thisRepoLink.href = repository.html_url;
        thisRepoLink.target = "_blank";
        thisRepoLink.textContent = repository.name;
        thisRepoListItem.append( thisRepoLink );
        repositoryList.append( thisRepoListItem );
    } );
}

document.addEventListener( "DOMContentLoaded", () => {
    userSearchForm.addEventListener( "submit", fetchUserSearchResults );
    userList.addEventListener( "click", click => {
        if ( click.target.tagName != "A" ) { fetchRepositories( click.target.closest( "li" ).dataset.login ) }
    } );
} );