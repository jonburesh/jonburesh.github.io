var sitePages;
var pageCount;
var currentPageButton;
var footer;

function getPages() {
    sitePages = document.getElementsByClassName("site-page");
    currentPageButton = document.getElementsByClassName("current-page");
    pageCount = sitePages.length;

    footer = document.getElementsByClassName("site-footer");
    
}

function setupFooter() {

    fetch('footer.html')
        .then(response => response.text())
        .then(html => {
            console.log(html);
            footer.innerHTML = html;
        })
        .catch(error => {
            console.error('Error loading HTML file:', error);
        });
}

function setupCards() {
    $('.card-content').click(function () {
        var cardTarget = $(this);
        cardTarget.addClass('tapped');
        // set to expanded
        cardTarget.toggleClass('expanded');
        // set to fullyExpanded after short delay
        setTimeout(function () {
            cardTarget.toggleClass('fullyExpanded');
        }, 50);
    });
}

function pageSelected(id, sender) {
    for (i = 0; i < pageCount; i++) {
        if (sitePages[i].id == id) {
            sitePages[i].style.display = 'block';
        }
        else {
            sitePages[i].style.display = 'none';
        }
    }
    if (currentPageButton.id != sender.id) {
        $(currentPageButton).removeClass("current-page");
    }
    currentPageButton = sender;
    $(sender).addClass("current-page");

}

getPages();
setupCards();
//setupFooter();
