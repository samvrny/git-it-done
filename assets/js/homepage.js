var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");

var getUserRepos = function(user) {
    
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl).then(function(response) {
        
            if (response.ok) {
                response.json().then(function(data) {
                    displayRepos(data, user); //passes the data, and user to the displayRepos function where it is needed
                });
            }
            else {
                alert("Error: GitHub User Not Found");
            }       
    })

    .catch(function(error) {
        //Notice this .catch() function getting chained to the end of the then statement on line 12
        alert("Unable to connect to GitHub");
    });
};

var formSubmitHandler = function(event) {
    event.preventDefault();
    
    var username = nameInputEl.value.trim(); //gets the input value from nameInputEl (look at the corresponding HTML to find out what/ where that is)

    if (username) {
        getUserRepos(username);
        nameInputEl.value = ""; //resets the value of the search to be empty
    }
    else {
        alert("Please enter a Github username");
    }
};

var displayRepos = function(repos, searchTerm) {
    
    //check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories available for this user.";
        repoSearchTerm.textContent = searchTerm;
        return;
    }

    //clear old text
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loops over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("div");
        repoEl.classList = "list-item flex-row justify-space-between align-center";

        //create a span element to hold repository name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }
        else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        repoEl.appendChild(statusEl);

        //append container to the DOM
        repoContainerEl.appendChild(repoEl);
    }

console.log(repos);
console.log(searchTerm);
};

userFormEl.addEventListener("submit", formSubmitHandler);
