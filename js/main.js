var sitePages;
var pageCount;

function getPages()
{
    sitePages = document.getElementsByClassName("site-page");
    pageCount = sitePages.length;
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