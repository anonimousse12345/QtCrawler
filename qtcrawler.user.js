// ==UserScript==
// @name         QtCrawler
// @namespace    com.yellowfever.qtcrawler
// @version      0.3-beta1
// @description  Taiwan is not a part of China
// @author       (You)
// @match        http*://www.interpals.net/*
// @include      http*://www.interpals.net/*
// @grant        none
// ==/UserScript==

var Qts = 
{
    init: function() 
    {
        var that = this;
        
        // Building interface and setting listener to activate the bot functionality
        that.buildInterface();
        that.refreshListener();
    },
    
    /**
     * Deletes all listener and re-sets them
     */
    refreshListener: function()
    {
        var that = this; 
        
        $('#autoView').off('click');
        $('#autoView').on('click', function(ev) {
            ev.preventDefault();
            that.runBot();
            ev.stopPropagation();
        });
        
        $('#autoMessage').off('click');
        $('#autoMessage').on('click', function(ev) {
            ev.preventDefault();
            that.showMessageBox();
            ev.stopPropagation();
        });
        
        $('#messageStart').off('click');
        $('#messageStart').on('click', function(ev) {
            ev.preventDefault();
            that.messageQts()();
            ev.stopPropagation();
        });
        
        $('#clearqtlist').off('click');
        $('#clearqtlist').on('click',function(ev) {
            ev.preventDefault();
            QtRegistry.resetQts();
            $('#clearqtlist').replaceWith('<strong>Visited QTs resetted</strong>');
            ev.stopPropagation();
        });
    },
    
    /**
     * Builds the interface (Popup) for the QtCrawler and adds a link
     * to the top menu to "view all profiles"
     */
    buildInterface: function()
    {
        var that = this;
        
        //
        // Create popups
        //
        that.createPopup('qtpopup');
        that.createPopup('messagepopup');
            
        //
        // Create User Interface
        //
        
        // Create container
        var fLinkAuto = document.createElement('div');
        $(fLinkAuto).addClass('filterLinks');
        
        // Create headline for container
        var fLinkHeadline = document.createElement('h1');
        $(fLinkHeadline).html('Automatize:');
        $(fLinkHeadline).css({
            'margin'    : '5px 0 5px 25px',
            'float'     : 'left'
        });
        
        // Create link "view all"
        var fLinkViewAll = document.createElement('a');
        $(fLinkViewAll).attr('href', '#');
        $(fLinkViewAll).attr('id', 'autoView');
        $(fLinkViewAll).html('view all');
        
        
        var fLinkMessageAll = document.createElement('a');
        $(fLinkMessageAll).attr('href', '#');
        $(fLinkMessageAll).attr('id', 'autoMessage');
        $(fLinkMessageAll).html('message all');
        
        
        // Append link to box
        $(fLinkAuto).append(fLinkHeadline);
        $(fLinkAuto).append(fLinkViewAll);
        $(fLinkAuto).append(fLinkMessageAll);
        
        // Add box to headmenu
        $('form[name="onlineForm"').append(fLinkAuto);
        
        
        // create message interface
        var popupTextbox = document.createElement('textarea');
        $(popupTextbox).attr('id', 'messagetext');
        $(popupTextbox).css({
            'width': '90%',
            'height': '50px'
        });
        
        $('.messagepopupinfo').html('Enter your message:'); 
       
        $('#messagepopup').append(popupTextbox);
        $('#messagepopup').append('<br />Placeholder: <br />');
        $('#messagepopup').append('{username}, {city}, {country} <br />');
        
        var messageLink = document.createElement('a');
        $(messageLink).attr('href', '#');
        $(messageLink).attr('id', 'messageStart');
        $(messageLink).html('start');
        
        $('#messagepopup').append(messageLink);
    },
    
    createPopup: function(popupName)
    {
        //
        // Create Popup
        //
        
        var popup = document.createElement('div');
        $(popup).css({
            'display'           : 'none',
            'height'            : '130px',
            'width'             : '330px',
            'position'          : 'fixed',
            'left'              : '50%',
            'margin-left'       : '-150px',
            'z-index'           : '99999',
            'background-color'  : '#ccc',
            'top'               : '10px',
            'padding'           : '5px'
        });
        $(popup).attr('id', popupName);
        
        //
        // Create Popup Content
        //
        
        // Headline
        var popupHeadline = document.createElement('h1');
        $(popupHeadline).html('QtCrawler');
        
        // Popup info
        var popupInfo = document.createElement('div');
        $(popupInfo).attr('class', popupName+'info');
        $(popupInfo).html('currently visiting qts... ');
        
        // Pointer
        var popupContent = document.createElement('span');
        $(popupContent).attr('class', popupName+'content');
        
        // Add content to Popup
        $(popup).append(popupHeadline);
        $(popup).append(popupInfo);
        $(popup).append(popupContent);
        
        // Add Popup to Body
        $('body').append(popup);
    },
    
    showMessageBox: function()
    {
        $('#messagepopup').show();
        this.refreshListener();
    },
    
    runBot: function()
    {
        var that = this;
        
        // get visited qts from localStorage
        var visitedQts = QtRegistry.getQts();
        var qtCounter = 0;
        var qtTotal = $('.online_prof a.female').length;
        var doneCount = 0;
        
        // iterate through profiles
        $('#qtpopup').show();
        $('.qtpopupinfo').html("running");
        $('.online_prof a.female').each(function() 
        {
            if($(this).attr('href').indexOf('country') === -1)
            {
                var userName = $(this).attr('href').replace('/','');

                if(typeof visitedQts[userName] !== typeof undefined) 
                {
                    return;
                }
                
                qtCounter++;
                visitedQts[userName] = true;
                
                var el = $(this);
                
                // actual ajax call to visit profile
                $.get('//www.interpals.net/'+$(this).attr('href')).done(function() 
                {
                    doneCount++;
                    $('.qtpopupcontent').html('visited : '+doneCount+'/ '+qtCounter);
                    // paint profile black for visited qt
                    el.parent().parent().parent().css({'background-color': '#f00'});
                    
                    if(doneCount === qtCounter)
                    {
                        var popupText = '';
                        
                        popupText  = 'Finished visiting QTs <br />';
                        
                        // if the difference between displayed qts and visited qts is not 0, 
                        // the qt registry had an entry.
                        //
                        // in this case, the user might want to reset his Qt List
                        if((qtTotal - qtCounter) !== 0)
                        {
                            popupText += '<br />';
                            popupText += 'A total of '+(qtTotal - qtCounter)+' QTs have been skipped ';
                            popupText += 'because you already visited them before. <br />';
                            popupText += '<a href="#" id="clearqtlist">Clear visited QT List</a> ';
                            popupText += '(click requires no further confirmation)';
                        }
                        
                        $('.qtpopupinfo').html(popupText);
                        // Refresh listener to activate clear-list button
                        that.refreshListener();
                    }
                });
            }
        });
        
        QtRegistry.setQts(visitedQts);
    },
    
    messageQts: function()
    {
        var that = this;
        
        // get visited qts from localStorage
        var visitedQts = QtRegistry.getQts();
        var qtCounter = 0;
        var qtTotal = $('.online_prof a.female').length;
        var doneCount = 0;
        
        // iterate through profiles
        $('#qtpopup').show();
        $('.qtpopupinfo').html("running");
        $('.online_prof a.female').each(function() 
        {
            if($(this).attr('href').indexOf('country') === -1)
            {
                var user = $(this).attr('href').replace('/','');
                
                qtCounter++;
                
                var el = $(this);
                
                $.ajax('/'+user).done(function(html) {
                    var visitedSite = document.createElement('div');
                    $(visitedSite).html(html);
                    var pmLink = $(visitedSite).find('#prof-action-links a').first().attr('href');
                    var pmCity = $(visitedSite).find('.profDataTopData div a').first().text().trim();
                    var pmCountry = $(visitedSite).find('.profDataTopData div a').first().next().text().trim();

                    $.get('//www.interpals.net/'+pmLink).done(function(response, _, header) {
                        var thread = document.createElement('div');
                        $(thread).html(response);
                        if(header.getResponseHeader("TM-finalURLdhdg") !== null)
                        {
                            if($(thread).find(".msg_user").length > 0) 
                            {
                                el.parent().parent().parent().css({'background-color': '#0f0'});
                            }
                            else
                            {
                                var threadUrl = header.getResponseHeader("TM-finalURLdhdg");
                                var chunks = threadUrl.split('thread_id=');
                                if(chunks.length === 2)
                                {
                                    var thradId = chunks[1];
                                    var sMessage = $('#messagetext').val();
                                    sMessage = sMessage.replace("{username}", user);
                                    sMessage = sMessage.replace("{city}", pmCity);
                                    sMessage = sMessage.replace("{country}", pmCountry);

                                    $.ajax({type:"POST",url:"pm.php",data:{action:"send_message",thread:thradId,message: sMessage},dataType:"json"}).done(function() {
                                        el.parent().parent().parent().css({'background-color': '#000'});
                                    });
                                }
                                else
                                {
                                    el.parent().parent().parent().css({'background-color': '#f00'});
                                }
                            }
                        }
                        else
                        {
                            el.parent().parent().parent().css({'background-color': '#f00'});
                        }
                    });
                });
            }
        });
    }
};

$(document).ready(function() 
{
    Qts.init(); // run bot tbh
});

/**
 * The QT Registry saves all previously visited profiles into the localStroage.
 * Since QtCrawler runs only in relatively new Chrome and Firefox versions
 * through *monkey, it's presumed that the client supports localStorage.
 */
var QtRegistry = 
{
    /**
     * returns the list of visited QTs
     * @returns {Array|Object}
     */
    getQts: function()
    {
        var that = this;
        
        that._init();
        return JSON.parse(localStorage.getItem("qts"));
    },
    
    /**
     * set the new visited QT list
     * @param {Array|Object} qtList the new list of visited qts
     */
    setQts: function(qtList)
    {
        localStorage.setItem("qts", JSON.stringify(qtList));
    },
    
    /**
     * reset the list of visited QTs
     */
    resetQts: function()
    {
        localStorage.setItem("qts", JSON.stringify({}));
    },
        
    /**
     * initialize localStorage variable
     */
    _init: function()
    {
        if(localStorage.getItem("qts") === null) 
        {
            localStorage.setItem("qts", JSON.stringify({}));
        }
        if(localStorage.getItem("messagedQts") === null) 
        {
            localStorage.setItem("messagedQts", JSON.stringify({}));
        }
    }
};
