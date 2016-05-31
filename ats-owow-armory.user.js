// ==UserScript==
// @name         Atlantiss.eu Armory Tooltip
// @namespace    http://community.atlantiss.eu/index.php?/user/291-mesaj/
// @version      0.5c
// @description  Workaround for Atlantiss Armory page
// @author       Mesaj
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js
// @match        http://atlantiss.eu/armory/character/*
// @grant        none
// ==/UserScript==
 
(function() {
    'use strict';
 
    //Integrate OpenWoW
    var OWoW = document.createElement('script');
    OWoW.src = 'http://cdn.openwow.com/api/tooltip.js';
    OWoW.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(OWoW);
 
    function getValues(itemid, itemslot){
        $.ajax({
            cache       : false,
            async       : true,
            url         : "http://cors.io/?u=http://cata.openwow.com/item="+itemid,
            //dataType    : "text",
            success: function (data) {
                var parsedpage = data;
                //console.log(parsedpage);
                var thumbnail = parsedpage.match(/'(inv.*?)'/g);
                if (/'(trade.?)'/g.test(parsedpage)) {
                    thumbnail = parsedpage.match(/'(trade.?)'/g); //if icon name doesn't start with inv try trade
                }
                console.log(thumbnail);
                if (thumbnail === null) {
                    thumbnail = parsedpage.match(/'(spell.*?)'/g); //if icon name doesn't start with inv or trade try spell
                }
                //console.log(thumbnail);
                if(thumbnail !== null) {
                    var th_string = thumbnail[0];
                    //console.log(th_string);
                    var imageurl = "http://cdn.openwow.com/cata/icons/large/"+th_string.substr(1,th_string.length-2)+".jpg";
                    //console.log(imageurl);
 
                    $('.slot-'+itemslot+' img').attr('src',imageurl);
                }
                else {
                    //console.log(itemSlots[i]  + thumbnail + ' is null');
                }
                //return parsedpage;
            },
        });
    } //async test
 
    //console.log(getValues(70266) + getValues(70266));
    //Make ring and trinket classes unique
    var ringfix = $(".slot-finger").eq(1);
    ringfix.attr('class', 'icon inventory-img slot-finger2');
    var trinketfix = $(".slot-trinket").eq(1);
    trinketfix.attr('class', 'icon inventory-img slot-trinket2');
 
    //OpenWoW Tooltips instead ATS
    var itemSlots = ["head","neck","shoulder","back","chest","shirt","tabard","wrists","hands","waist","legs","feet","finger","finger2","trinket","trinket2","mainhand","offhand","r"];
    var idList = [];
    var arrayLength = itemSlots.length;
    for (var i = 0; i < arrayLength; i++) {
 
        var slot = $('.slot-'+itemSlots[i]+' a').attr('href');
        //console.log(slot);
        if (slot != "javascript:void(0)" || slot !== null ) {
            //console.log('slot '+ itemSlots[i]);
 
            var itemid = slot.replace(/^\D+|\D+$/g, ''); //extract just id
            //console.log(slot +' with id ' + itemid);
            idList.push(itemid);
            $('.slot-'+itemSlots[i]+' a').attr('href',"http://cata.openwow.com/item="+itemid); //create tooltip
 
            getValues(itemid,itemSlots[i]);
 
            //console.log(parsedpage);
 
            //var thumbnail = parsedpage.match(/'(inv.*?)'/g);  //take icon from response html
 
        }
    }
    //images fix
    //console.log(idList); //list for the future use for example modelviewer
 
 
})();
