var menuOnScroll = true;

$(document).on(
    "click", ".mli",  function() {

        menuOnScroll = false;

        $( ".mli" ).removeClass("textBig").addClass("textSmall");
        $( this ).removeClass("textSmall").addClass("textBig");

        disaredElement = $( `#${$( this ).attr("id")}div` )

        $('html, body').stop().animate({
            scrollTop: disaredElement.offset().top
        }, 250);

        setTimeout(
            function() {
                menuOnScroll = true;
            },
            250
        );

    }
);

var lastId = "";

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
    
    id = cur[cur.length-1].toString();

    
    if (lastId !== id) {
        lastId = id;

        desactivate(true);
        killShowConteiner();

        if (menuOnScroll) {
            $( ".mli" ).removeClass("textBig").addClass("textSmall");
            $( `#${id.replace("div", "")}` ).removeClass("textSmall").addClass("textBig");
        };
    }                   
});

// Finish page

function fixW() {
    var mw = $("#menu").width();
    var cw = $("#content").width();

    $( "#showConteiner" ).css({"width": `${ cw }px`});

    $( "#menuFix" ).css({"width": `${ mw }px`});
    // $( "#infoFix" ).css({"width": `${ mw }px`});
    $( "#info" ).css({"width": `${ mw - 21 }px`});
};

fixW();

var data = {};

function loadPics(path, dest, cols, isInter, suf) {
    $.getJSON(path, function(json) {

        var contentW = $("#content").width(),
            sqW,
            sqWc;

        if (cols == 4) {
            sqW = (contentW - (2.5 * 3)) / 4;
        } else {
            sqW = (contentW - 2.5) / 2;
        }

        $.each( json, function( i, val ) {

            var ind = `g${i}${suf}`;

            if (val.mode == "rect") {
                sqWc = contentW;
            } else {
                sqWc = sqW;
            }

            var cntnr = $( "<div>", {
                "id": `${ind}cntnr`,
                "class": `${val.mode} cntnr`,
                "height": `${sqW}px`,
                "width": `${sqWc}px`
            }).appendTo( `#${dest}` );

            $( "<div>", {
                "id": `${ind}schtsch`,
            }).appendTo( cntnr );

            var showCntnr = $( "<div>", {
                "id": `${ind}showCntnr`,
                "class": "showCntnr",
                "height": sqW,
                "width": sqWc
            }).appendTo( cntnr );

            var curImage = $( "<img>", {
                "src": val.pic,
                "height": "100%",
                "width": "100%"
            }).appendTo( showCntnr );

            if (isInter) {

                curImage.attr("class", "activeImg");
                
                $( "<div>", {
                    "id": ind,
                    "class": "show textBiger wh intTextWh",
                    "href": val.link,
                    html: "&#9654;"
                }).css({display: "none"}).appendTo( showCntnr );
            }

            data[ind] = {
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
        curId = `#${$( this ).attr("id").replace("cntnr", "")}`;
        $( curId ).css({display: ""})
    }
);
$(document).on(
    "mouseleave", ".square, .rect", function() {
        curId = `#${$( this ).attr("id").replace("cntnr", "")}`;
        $( curId ).css({display: "none"})
    }
);

var smalPicsListener = true;
$(document).on(
    "mouseover", ".square, .rect, .squareSmall", function() {
        var curId = $( this ).attr("id").replace("cntnr", "")
        showInfo(curId);
    }
);
$(document).on(
    "mouseleave", ".square, .rect, .squareSmall", function() {
        if (smalPicsListener) {
            killInfo();
        }
    }
);

function showInfo(curId) {
    $( "#info" ).css({visibility: "visible"});
    $( "#infoText" ).text( data[curId]["text"] );
};

function killInfo() {
    $( "#info" ).css({visibility: "hidden"});
    $( "#infoText" ).text( "" );
};


function addSchtsch(curId) {
    var timer = $( "<img>", {
        "src": "./pics/schtsch.gif",
        "class": "centerImg",
        "height": "100%"
    }).appendTo( $( `#${curId}schtsch` ) ); 
};

function delSchtsch(curId) {
    var timer = $( `#${curId}schtsch` ).find( "img" );
    timer.remove()  
};

function desactivate(fadeIt) {
    var activeX = $( ".x" );

    if (activeX.length) {
        curId = activeX.attr("id");
        closer(curId, fadeIt);
    };
};


$(document).on(
    "click", ".squareSmall", function() {

        smalPicsListener = false;

        var showConteiner = $( "#showConteiner" );
        showConteiner.css( {display: "flex"} );
        $( "#limb" ).fadeIn("fast");
        showConteiner.addClass("showConteiner");

        var picSrc = $( this ).find( "img" ).attr( "src" );
        showConteiner.find( "#showImg" ).attr( "src", picSrc );
        
        var curId = $( this ).attr("id").replace("cntnr", "");
        showInfo(curId);
});

function killShowConteiner() {

    smalPicsListener = true;

    var showConteiner = $( ".showConteiner" );

    if (showConteiner.length) {

        showConteiner.css( {display: "none"} );
        $( "#limb" ).fadeOut("fast");

        killInfo();

    };
};

$(document).on(
    "click", "#limb, .showConteiner",  function(e) {
        if (e.target.id !== "showImg") {
            killShowConteiner();
        }
    }
);

$(document).on(
    "click", ".show", function() {

        var curId = $( this ).attr("id");
            // cutImg = $( `#${curId}img`);

        desactivate(false);

        addSchtsch(curId);

        var cntnr = $( `#${curId}cntnr` ),
            w = cntnr.width(),
            h = cntnr.height();

        $( `#${curId}showCntnr` ).css({display: "none"}).css({opacity: 0.5});

        // adding iframe
        var curfFrame = $( "<iframe>", {
            "id": `${curId}intrctv`,
            "height": h,
            "width": w,
            "class": "interGr",
            "src": $( this ).attr("href"),
            "frameborder": 0
        }).css({visibility: "hidden", "opacity": 0}).appendTo( cntnr );

        // adding x
        addX(curId);

        curfFrame.on("load", function() {
            setTimeout(
                function() {
                    curfFrame.css({visibility: "visible"})
                    curfFrame.animate({opacity: 1}, 500);
                    
                    fadeOutActiveImg();
                    delSchtsch(curId);

                },
                500
            )
        });
    }
);

function fadeOutActiveImg() {
    $( ".activeImg" ).animate({opacity: 0.5}, 500);
};

function fadeInActiveImg() {
    $( ".activeImg" ).animate({opacity: 1}, 500);
};

function addX(curId) {
    var xDiv = $( "<div>", {
        "class": "close"
    }).appendTo( $( `#${curId}cntnr` ) );

    $( "<span>", {
        "id": `${curId}close`,
        "class": "x textBig wh intTextWh",

        html: "✕"
    }).appendTo( xDiv );
};

function closer(curId, fadeIt) {
    xDiv = $( `#${curId}` ).parent();

    $( `#${curId.replace("close", "showCntnr")}` ).css({display: ""}).animate({opacity: 1}, 500);;

    var curFrame = $( `#${curId.replace("close", "intrctv")}` );

    xDiv.remove();
    curFrame.remove();

    if (fadeIt) {
        fadeInActiveImg();
    }

};

$(document).on(
    "click", ".x",  function() {
        let curId = $( this ).attr("id");
        closer(curId, true);
    }
);

window.onresize = function () {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(function () {
        location.reload();
    }, 0);
};

// window.onresize = function(){
//     window.location = window.location;
// };

// $(window).on('resize',function(){location.reload();});