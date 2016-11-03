// ==UserScript==
// @name         Atlantiss.eu Armory Tooltip
// @namespace    http://community.atlantiss.eu/index.php?/user/291-mesaj/
// @version      0.6c
// @description  Workaround for Atlantiss Armory page item icons and tooltips
// @author       Mesaj
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @match        http://atlantiss.eu/armory/character/*
// @grant        none
// @homepage http://community.atlantiss.eu/index.php?/topic/10071-website-armory-openwow-tooltip/
// @contactURL http://community.atlantiss.eu/index.php?/user/291-mesaj/
// @supportURL https://github.com/2jasemx/Atlantiss-OpenWoW-Armory/issues
// @contributionURL https://github.com/2jasemx/Atlantiss-OpenWoW-Armory
// @updateURL https://github.com/2jasemx/Atlantiss-OpenWoW-Armory/raw/master/ats-owow-armory.user.js
// @downloadURL https://github.com/2jasemx/Atlantiss-OpenWoW-Armory/raw/master/ats-owow-armory.user.js
// ==/UserScript==

(function() {
    'use strict';
    alert("\n\nArmory has been officialy fixed by Atlantiss Team.\nIt's no longer needed to have Tampermonkey/Greasemonkey script.\nThanks to everyone who used it.\n\nRegards, Mesaj.");
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
                //console.log(thumbnail);
                if (thumbnail === null) {
                    thumbnail = parsedpage.match(/'(spell.*?)'/g); //if icon name doesn't start with inv or trade try spell
                }
                //console.log(thumbnail);
                if(thumbnail !== null) {
                    var th_string = thumbnail[0];
                    //console.log(th_string); //DEBUG: Check to see if icon name is selected correctly within multiple occurences
                    var imageurl = "http://cdn.openwow.com/cata/icons/large/"+th_string.substr(1,th_string.length-2)+".jpg";
                    //console.log(imageurl); //DEBUG: Check if icon link was built correctly to put as thumbnail

                    $('.slot-'+itemslot+' img').attr('src',imageurl);
                }
                else {
                    //console.log(itemSlots[i]  + thumbnail + ' is null'); //DEBUG: Show items which icon not loaded
                }
            },
        });
    } //async

    function replaceGemID(html, gemid, itemslot){ 
        $.getJSON({
            url: 'https://raw.githubusercontent.com/xmesaj2/Atlantiss-OpenWoW-Armory/master/jewelids.json',
            success: function (data) {
                gemid = gemid.split(':');
                //data is the JSON string
                for (var gid in gemid) {
                    //console.log(gid); //DEBUG: Check if indexing gem array properly
                    //console.log(data[0][gemid[gid]]); //DEBUG: Check if parsed JewelID by Gem item ID is found
                    gemid[gid] = data[0][gemid[gid]]; //replace item id with jewel id
                    var jewelids = gemid.join(":"); // build back array in format id:id
                    //console.log('jewelids ' + jewelids); //DEBUG: Check if build JewelID array properly
                    var finaljid = html + '&gems=' + jewelids;
                    $('.slot-'+itemslot+' a').attr('rel', finaljid);
                }

            },
        });
    }


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
        //console.log(slot); DEBUG: Check which itemslot is currently loaded



        if (slot != "javascript:void(0)" || slot !== null ) { //No item in slot
            //console.log('slot '+ itemSlots[i]);
            var gemshtml = $('.slot-'+itemSlots[i]+' a').attr('rel'); //get string with rel attributes
            console.log(gemshtml);
            if (gemshtml) { //Non gemable item in slot
                var gems = gemshtml.split("gems="); // get only gem ids
                if(gems.length == 2){ // if no gems then array is not split - dont replace anything
                    var gemsids = gems[1]; // take from array only gem Item IDs
                    gems = gems[0]; // html only
                    //console.log(gemsids); //DEBUG: Check if gem array has IDs only
                    replaceGemID(gems, gemsids, itemSlots[i]);
                }
            }
            var itemid = slot.replace(/^\D+|\D+$/g, ''); //extract just id
            //console.log(slot +' with id ' + itemid);
            idList.push(itemid);
            $('.slot-'+itemSlots[i]+' a').attr('href',"http://cata.openwow.com/item="+itemid); //create tooltip

            getValues(itemid, itemSlots[i]);

        }
    }
    //images fix
    //console.log(idList); //DEBUG: Check values in list (for the future use with modelviewer)


})();
