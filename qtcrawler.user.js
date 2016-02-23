// ==UserScript==
// @name         Qt visitor
// @namespace    http://your.homepage/
// @version      0.1
// @description  I did it for the azn girls tbh
// @author       (You)
// @match        http://www.interpals.net/online.php
// @include      http*://interpals.net/online.php
// @include      http://interpals.net/online.php
// @include      http*://www.interpals.net/online.php
// @include      http://www.interpals.net/online.php
// @include      http*://interpals.net/online.php?*
// @include      http://interpals.net/online.php?*
// @include      http*://www.interpals.net/online.php?*
// @include      http://www.interpals.net/online.php?*
// @grant        none
// ==/UserScript==

var Qts = 
{
    init: function() 
    {
        // init local storage
        if(localStorage.getItem("qts") === null) 
        {
            localStorage.setItem("qts", JSON.stringify({}));
        }
        
        //
        // Create Popup
        //
        
        var popup = document.createElement('div');
        $(popup).css({
            'display'           : 'none',
            'height'            : '100px',
            'width'             : '300px',
            'position'          : 'fixed',
            'left'              : '50%',
            'margin-left'       : '-150px',
            'z-index'           : '99999',
            'background-color'  : '#ccc'
        });
        $(popup).attr('id', 'qtpopup');
        
        //
        // Create Popup Content
        //
        
        // Headline
        var popupHeadline = document.createElement('h1');
        $(popupHeadline).html('Titel');
        
        // Popup info
        var popupInfo = document.createElement('div');
        $(popupInfo).attr('id', 'qtpopupinfo');
        $(popupInfo).html('currently visiting qts... ');
        
        // Pointer
        var popupContent = document.createElement('span');
        $(popupContent).attr('id', 'qtpopupcontent');
        
        // Add content to Popup
        $(popup).append(popupHeadline);
        $(popup).append(popupInfo);
        $(popup).append(popupContent);
        
        // Add Popup to Body
        $('body').append(popup);
        
        //
        // Create User Interface
        //
        
        // Create container
        var fLinkAuto = document.createElement('div');
        $(fLinkAuto).addClass('filterLinks');
        
        // Create headline for container
        var fLinkHeadline = document.createElement('h1');
        $(fLinkHeadline).css({
            'margin'    : '5px 0 5px 25px',
            'float'     : 'left'
        });
        
        // Create link "view all"
        var fLinkViewAll = document.createElement('a');
        $(fLinkViewAll).attr('href', '#');
        $(fLinkViewAll).attr('id', 'autoView');
        $(fLinkViewAll).html('view all');
        
        // Append link to box
        $(fLinkAuto).append(fLinkHeadline);
        $(fLinkAuto).append(fLinkViewAll);
        
        // Add box to headmenu
        $('form[name="onlineForm"').append(fLinkAuto);

        // set UI listener
        Qts.refreshListener();
    },
    
    refreshListener: function()
    {
        $('#autoView').off('click');
        $('#autoView').on('click', function(ev) {
            ev.preventDefault();
            Qts.runBot();
            ev.stopPropagation();
        });
    },
    
    runBot: function()
    {
        // get visited qts from localStorage
        var visitedQts = Qts._getVisited();
        var qtCounter = 0;
        var qtTotal = $('.online_prof a.female').length;
        var doneCount = 0;
        
        // iterate through profiles
        $('#qtpopup').show();
        $('#qtpopupinfo').html("running");
        $('.online_prof a.female').each(function() 
        {
            if($(this).attr('href').indexOf('country') === -1)
            {
                var userName = $(this).attr('href').replace('/','');

                if(typeof visitedQts[userName] !== typeof undefined) 
                {
                    
                    return;
                }
                qtCounter ++;
                visitedQts[userName] = true;
                
                var el = $(this);
                
                // actual ajax call to visit profile
                // @todo change to relative calls
                $.get('https://www.interpals.net/'+$(this).attr('href')).done(function() 
                {
                    doneCount++;
                    $('#qtpopupcontent').html('visited : '+doneCount+'/ '+qtCounter);
                    // paint profile black for visited qt
                    el.parent().parent().parent().css({'background-color': '#000'});
                    if(doneCount === qtCounter)
                    {
                        $('#qtpopupinfo').html("finished visiting qts");
                    }
                });
            }
        });
        
        Qts._setVisited(visitedQts);
    },
    
    _getVisited: function()
    {
        return JSON.parse(localStorage.getItem("qts"));
    },
    
    _setVisited: function(qtList)
    {
        localStorage.setItem("qts", JSON.stringify(qtList));
    }
};

$(document).ready(function() 
{
    Qts.init(); // run bot tbh
});
