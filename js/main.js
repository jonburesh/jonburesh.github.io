function page_selected(id)
{
    var sitePages = document.getElementsByClassName("site-page");
    var pageCount = sitePages.length;
    
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