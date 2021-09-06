var test = true;

$(document).on(
    "click", ".mli",  function() {

        test = false;

        $( ".mli" ).removeClass("textBig").addClass("textSmall");
        $( this ).removeClass("textSmall").addClass("textBig");

        disaredElement = $( `#${$( this ).attr("id")}div` )

        $('html, body').stop().animate({
            scrollTop: disaredElement.offset().top
        }, 250);

        setTimeout(
            function() {
                test = true;
            },
            250
        );

    }
);

var lastId,
scrollItems = $( ".lidiv" ).map(
    function() {
        return $(this).attr("id");
    }
);

$(window).scroll(function(){

    var fromTop = $(this).scrollTop() + $( "#menu" ).height()/2;
    
    var cur = scrollItems.map(function(){
        if ($(`#${this}`).offset().top < fromTop)
        return this;
    });
    
    id = cur[cur.length-1];
    
    if (lastId !== id) {
        lastId = id;

        if (test) {
            $( ".mli" ).removeClass("textBig").addClass("textSmall");
            $( `#${id.replace("div", "")}` ).removeClass("textSmall").addClass("textBig");
        };
    }                   
});

// Finish page

function fixW() {
    var w = $("#menu").width();
    $( "#menuFix" ).css({"width": `${ w }px`});
    $( "#infoFix" ).css({"width": `${ w }px`});
};

fixW();

var data = {};

function loadPics(path, dest, cols, isInter, suf) {
    $.getJSON(path, function(json) {

        var contentW = $("#content").width(),
            sqW;

        if (cols == 4) {
            sqW = (contentW - contentW * 0.0025 * 3) / 4;
        } else {
            sqW = (contentW - contentW * 0.0025) / 2;
        }

        $.each( json, function( i, val ) {

            ind = `g${i}${suf}`

            cntnr = $( "<div>", {
                "id": `${ind}cntnr`,
                "class": `${val.mode} cntnr`,
                "height": `${sqW}px` 
            }).appendTo( `#${dest}` );

            $( "<div>", {
                "id": `${ind}schtsch`,
            }).appendTo( cntnr );

            showCntnr = $( "<div>", {
                "id": `${ind}showCntnr`,
                "class": "showCntnr",
            }).appendTo( cntnr );

            $( "<img>", {
                "src": val.pic,
                "height": "100%",
                "width": "100%"
            }).appendTo( showCntnr );

            if (isInter) {
                
                $( "<div>", {
                    "id": ind,
                    "class": "show textBig wh intTextWh",
                    "hidden": "true",
                    "href": val.link,
                    html: "Activate"
                }).appendTo( showCntnr );
            }

            data[ind] = {
                // "link": val.link,
                "text": val.text
            };

        });

    });
}

loadPics("./new_content.json", "li3divCntnt", 4, false, "O");
loadPics("./new_content.json", "li2divCntnt", 4, false, "N");
loadPics("./interactive_content.json", "li1divCntnt", 2, true, "I");

$(document).on(
    "mouseover", ".intText", function() {
        $( this ).removeClass("bl").addClass("red");
    }
);
$(document).on(
    "mouseleave", ".intText", function() {
        $( this ).removeClass("red").addClass("bl");
    }
);

$(document).on(
    "mouseover", ".intTextWh", function() {
        $( this ).removeClass("wh").addClass("red");
    }
);
$(document).on(
    "mouseleave", ".intTextWh", function() {
        $( this ).removeClass("red").addClass("wh");
    }
);

$(document).on(
    "mouseover", ".square, .rect", function() {
        $(`#${$( this ).attr("id").replace("cntnr", "")}`).removeAttr("hidden");
    }
);
$(document).on(
    "mouseleave", ".square, .rect", function() {
        $(`#${$( this ).attr("id").replace("cntnr", "")}`).attr("hidden", "ture");
    }
);


function addSchtsch(curId) {
    var timer = $( "<img>", {
        "src": "./pics/schtsch.gif",
        "height": "100%"
    }).appendTo( $( `#${curId}schtsch` ) ); 
}

function delSchtsch(curId) {
    var timer = $( `#${curId}schtsch` ).find( "img" );
    timer.remove()  
};


$(document).on(
    "click", ".show", function() {

        let curId = $( this ).attr("id");

        addSchtsch(curId);

        $( `#${curId}showCntnr` ).attr("hidden", "true");

        var curfFrame = $( "<iframe>", {
            "id": `${curId}intrctv`,
            "height": "100%",
            "width": "100%",
            "class": "interGr",
            "src": $( this ).attr("href"),
            "frameborder": 0
        }).css({visibility: "hidden", "opacity": 0}).appendTo( $( `#${curId}cntnr` ) );

        curfFrame.on("load", function() {
            setTimeout(
                function() {
                    curfFrame.css({visibility: "visible"})
                    curfFrame.animate({opacity: 1}, 500);
                    delSchtsch(curId);
                },
                500
            )
        });

        $( "<span>", {
            "id": `${curId}close`,
            "class": "x textBig wh intTextWh",

            html: "✕"

        }).appendTo( 
            $( "<div>", {
                "class": "close"
            }).appendTo( $( `#${curId}cntnr` ) )
        );
    }
);

$(document).on(
    "click", ".x",  function() {

        let curId = $( this ).attr("id");

        $( `#info` ).remove();

        $( `#${curId.replace("close", "showCntnr")}` ).removeAttr("hidden");
        $( `#${curId.replace("close", "intrctv")}` ).remove();
        $( this ).remove();
        
    }
);