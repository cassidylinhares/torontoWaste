window.onload = function() {
    var searchBttn = document.getElementById("search");
    var searchContent = document.getElementsByTagName('input')[0];
    var resultSec = document.getElementById("result");
    var favTitle = document.getElementsByClassName("fav")[0];
    var favSec = document.getElementById("favouriteSec");
    var resultList = [];
    var favList = [];

    //press search button or enter to search
    searchBttn.addEventListener("click", function() {
        if (searchContent.value == "") {
            clearSearch();
        } else {
            clearSearch();
            lookUp(searchContent.value);
        }
    });
    searchContent.addEventListener("keyup", function(event) {
        var key = event.key;
        if (key == 'Enter') {
            clearSearch();
            lookUp(searchContent.value);
        } else if (searchContent.value == "") {
            clearSearch();
        }
    });

    searchContent.addEventListener("keyup", function() {
        if (searchContent.value == "") {
            clearSearch();
        }
    });

    function clearSearch() {
        resultSec.innerHTML = "";
    }

    function lookUp(entry) {
        //get the JSON data from site
        fetch(
                'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000'
            ).then(response => response.json())
            .then(waste => {
                let keyword;
                resultList = [];
                //search json keywords if it contains the search entry
                for (let i = 0; i < waste.length; i++) {
                    keyword = waste[i].keywords;
                    if (keyword.includes(entry.toLowerCase())) {
                        resultList.push({
                            title: waste[i].title,
                            body: waste[i].body
                        });
                    }
                }
                //only allow 6 results
                if (resultList.length > 6) {
                    resultList = resultList.slice(0, 6);
                }
                display(resultSec, "rgb(146, 147, 148)", resultList);
            });
    }

    function styleFlex(div) {
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.justifyContent = "flex-start";
        div.style.alignItems = "center";
    }

    function styleStar(star, icon, colour) {
        star.style.width = "10%";
        star.style.backgroundColor = "rgba(23, 60, 182, 0)";
        star.style.border = "0 none";
        icon.style.color = colour;
        icon.style.padding = "20% 2%";
    }

    function styleTitle(title) {
        title.style.fontSize = "1.5em";
        title.style.width = "30%";
    }

    function styleBody(body) {
        body.style.fontSize = "1.1em";
        body.style.width = "60%";
    }

    //clears fav list and styles favourite Section
    function displayFav() {
        favSec.innerHTML = "";
        let title = document.createElement("div");
        title.className = "title";
        title.innerHTML = "Favourites";
        title.style.color = "rgb(84, 145, 49)";
        favSec.appendChild(title);
    }

    function display(initLoc, colour, list) {
        for (let i = 0; i < list.length; i++) {

            //attach outter div to starting location (this is the start of each row)
            let div = document.createElement("div");
            styleFlex(div);
            initLoc.appendChild(div);

            //create a button with an icon inside and add it to the outter div
            let star = document.createElement("button");
            let icon = document.createElement("i");
            icon.className = "fas fa-star fa-2x";
            //add classname using the title of each object
            icon.classList.add('star-' + list[i].title.split(' ').join(''));
            div.appendChild(star);
            star.appendChild(icon);
            styleStar(star, icon, colour);

            //if element from fav list is green then make the corresponding result one green
            if (Array.from(document.getElementsByClassName('star-' + list[i]
                    .title.split(' ').join(''))).length > 1) {
                icon.style.color = "rgb(127, 214, 102)";
            }

            //add event listener to each star and either add to favs or removes
            star.addEventListener("click", (e) => {
                displayFav();
                if (initLoc.id == "result") {
                    addFav(e.target, i);
                } else if (initLoc.id == "favouriteSec") {
                    removeFav(i);
                }
                display(favSec, "rgb(127, 214, 102)", favList);
            });

            //create div that has the item title and attach to the outter div
            let title = document.createElement("div");
            styleTitle(title);
            div.appendChild(title);
            title.innerHTML = list[i].title;

            //fake node to decode item's html and then set the actual html to that
            let decoderDOM = document.createElement("div");
            decoderDOM.innerHTML = list[i].body;
            let decodedInnerHTML = decoderDOM.innerText;

            //create div for item description and add to the outter div
            let body = document.createElement("div");
            styleBody(body);
            div.appendChild(body);
            body.innerHTML = decodedInnerHTML;
        }
    }

    function addFav(star, index) {
        //only add items to fav if they are not already favourited
        if (!favList.some((element) => (element.body == resultList[index].body))) {
            favList.push({
                title: resultList[index].title,
                body: resultList[index].body
            });
            //set the result search star to green/favourited
            star.style.color = "rgb(127, 214, 102)";
        }
    }

    function removeFav(index) {
        //get the star star in fav list and result list and set them grey/unfavourited
        let unfavStar = document.getElementsByClassName('star-' +
            favList[index].title.split(' ').join(''));
        Array.from(unfavStar).forEach(element => {
                element.style.color = "rgb(146, 147, 148)";
            })
            //remove item from fav list
        favList.splice(index, 1);
    }
}
