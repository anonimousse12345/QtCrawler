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
        
        // init user interface
        $('form[name="onlineForm"').append( '<div class="filterLinks"> <h1 style="margin: 5px 0 5px 25px; float: left;"> \
            Automatize: </h1> <a href="#" id="autoView">view all profiles</a> </div>');
        
        $('body').append('<div id="qtpopup" style="display: none; height: 100px; z-index: 99999;background-color: #ccc; \
                            position: fixed; top: 100px; width: 300px; left: 50%; margin-left: -150px;">\
                            <h1>Qt Crawler</h1> <div id="qtpopupinfo">currently visiting qts...</div>\
                            <span id="qtpopupcontent"></span>\
                            </div>');
        
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
                $.get('http://www.interpals.net/'+$(this).attr('href')).done(function() 
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
