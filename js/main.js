var sitePages;
var pageCount;


function getPages()
{
    sitePages = document.getElementsByClassName("site-page");
    pageCount = sitePages.length;
}

function setupCards()
{
    $('.card-content').click(function()
    {
        var cardTarget = $(this);
        // set to expanded
        cardTarget.toggleClass('expanded');
        // set to fullyExpanded after short delay
        setTimeout(function() 
        { 
            cardTarget.toggleClass('fullyExpanded'); 
        }, 50);
    });
}

function pageSelected(id)
{
    for (i = 0; i < pageCount; i++) 
    {
        if (sitePages[i].id == id)
        {
            sitePages[i].style.display = 'block';
        }
        else
        {
            sitePages[i].style.display = 'none';
        }
    }
}

getPages();
setupCards();
