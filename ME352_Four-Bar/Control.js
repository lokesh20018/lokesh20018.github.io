
$(document).ready(function() {
    // page structure
  
    // disable the browserWarning on Chrome
    var browserRE = /Chrome\/([1-9][0-9]*)/;
    var matchArray = browserRE.exec(navigator.userAgent);
    if (matchArray) {
        var version = parseInt(matchArray[1]);
        if (version >= 24) {
            $("div.browserWarning").hide();
        }
    }

    // active navigation link
    var activeNavId;
    if (/index\.html$/.test(window.location.pathname)) {
        activeNavId = "navHome";
    } else if (/\/$/.test(window.location.pathname)) {
        activeNavId = "navHome";
    } else if (/r[a-z]+\.html$/.test(window.location.pathname)) {
        activeNavId = "navRef";
    } else if (/a[a-z]+\.html$/.test(window.location.pathname)) {
        activeNavId = "navApps";
    } else {
        console.log("Warning: unable to determine active navigation");
    }
    $("a#" + activeNavId).closest("li").addClass("activeNav");

    // Derivation header
    $("div.envContainer.derivation").prepend('<p class="envHeader">Derivation</p>');

    // Solution header
    $("div.envContainer.solution").prepend('<p class="envHeader">Solution</p>');

    // if we have a hash in the URL, set the corresponding element

    // Controller buttons
    var getPD = function(canvasId) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error("Unable to find canvas with ID: " + canvasId);
        }
        var pd = canvas.prairieDraw;
        if (!pd) {
            throw new Error("Unable to find PrairieDraw controller for canvas with ID: " + canvasId);
        }
        return pd;
    }
    var showCheckbox = function(jButton, checked) {
        if (jButton.children("span").length == 0) {
            jButton.append('<span data-icon="B" aria-hidden="true" class="checkbox"></span>');
        }
        if (checked) {
            jButton.children("span.checkbox").attr("data-icon", "B");
        } else {
            jButton.children("span.checkbox").attr("data-icon", ",");
        }
    }
    var bindAnimToggleButton = function(jButton, canvasId) {
        var pd = getPD(canvasId);
        jButton.click(function() {pd.toggleAnim();});
        pd.registerAnimCallback(function(animated) {showCheckbox(jButton, animated);});
    }
    var bindOptionToggleButton = function(jButton, canvasId, optionName) {
        var pd = getPD(canvasId);
        jButton.click(function() {pd.toggleOption(optionName);});
        pd.registerOptionCallback(optionName, function(value) {showCheckbox(jButton, value);});
    }
    var bindSeqToggleButton = function(jButton, canvasId, seqName) {
        var pd = getPD(canvasId);
        jButton.click(function() {pd.stepSequence(seqName);});
        pd.registerSeqCallback(seqName, function(event, index, stateName) {
            var checked = (((event === "exit") && (index == 0))
                           || ((event === "enter") && (index == 1)));
            showCheckbox(jButton, checked);
        });
    }
    var bindSeqStepButton = function(jButton, canvasId, seqName, stateName) {
        var pd = getPD(canvasId);
        jButton.click(function() {pd.stepSequence(seqName, stateName);});
        pd.registerSeqCallback(seqName, function(event, index, currentStateName) {
            var active = (event === "enter") && (stateName === currentStateName);
            if (active) {
                jButton.removeClass("inactive").addClass("active");
            } else {
                jButton.removeClass("active").addClass("inactive");
            }
        });
    }
    var bindResetButton = function(jButton, canvasId) {
        var pd = getPD(canvasId);
        jButton.click(function() {pd.reset();});
    }


    document.getElementById("saveCanvas").addEventListener("click", function() {
        window.print();
    });

    $("button[class]").each(function() {
        var classList = $(this).attr("class").split(/\s+/);
        var d;
        for (var i = 0; i < classList.length; i++) {
            d = /^anim-toggle:([^:]+)$/.exec(classList[i]);
            if (d !== null) bindAnimToggleButton($(this), d[1]);
            d = /^option-toggle:([^:]+):([^:]+)$/.exec(classList[i]);
            if (d !== null) bindOptionToggleButton($(this), d[1], d[2]);
            d = /^seq-toggle:([^:]+):([^:]+)$/.exec(classList[i]);
            if (d !== null) bindSeqToggleButton($(this), d[1], d[2]);
            d = /^seq-step:([^:]+):([^:]+):([^:]+)$/.exec(classList[i]);
            if (d !== null) bindSeqStepButton($(this), d[1], d[2], d[3]);
            d = /^reset:([^:]+)$/.exec(classList[i]);
            if (d !== null) bindResetButton($(this), d[1]);
        }
    });

    // Data input binding
    var bindDataInputRange = function(jInput, canvasId, optionName) {
        var pd = getPD(canvasId);
        // disabling the following line
        // these should get set from the default values in the JS
        // this isn't very well tested, so it might need some more work
        //pd.setOption(optionName, parseFloat(jInput.val()));
        jInput.on("input change", function() {
            pd.setOption(optionName, parseFloat($(this).val()), undefined, jInput);
        });
        pd.registerOptionCallback(optionName, function(value, trigger) {
            if (trigger !== jInput) {
                // someone else caused this change, so reflect it
                jInput.val(value);
            }
        });
    };
    var bindDataInputRadio = function(jInput, canvasId, optionName) {
        var pd = getPD(canvasId);
        jInput.change(function() {
            pd.setOption(optionName, jInput.val(), undefined, jInput);
        });
        pd.registerOptionCallback(optionName, function(value, trigger) {
            if (trigger === undefined || trigger.prop("name") !== jInput.prop("name")) {
                // either no radio group or a different radio group caused this change, so reflect it
                if (jInput.val() === value) {
                    jInput.prop("checked", true);
                } else {
                    jInput.prop("checked", false);
                }
            }
        });
    };
    $("input[class]").each(function() {
        var classList = $(this).attr("class").split(/\s+/);
        var d;
        for (var i = 0; i < classList.length; i++) {
            d = /^data-input:([^:]+):([^:]+)$/.exec(classList[i]);
            if (d !== null) {
                if ($(this).attr("type") == "range") {
                    bindDataInputRange($(this), d[1], d[2]);
                } else if ($(this).attr("type") == "radio") {
                    bindDataInputRadio($(this), d[1], d[2]);
                }
            }
        }
    });

    // Data option binding
    var bindDataOption = function(jSpan, canvasId, optionName) {
        var pd = getPD(canvasId);
        pd.registerOptionCallback(optionName, function(value) {
            jSpan.text(String(value));
        });
    }
    $("span[class]").each(function() {
        var classList = $(this).attr("class").split(/\s+/);
        var d;
        for (var i = 0; i < classList.length; i++) {
            d = /^data-option:([^:]+):([^:]+)$/.exec(classList[i]);
            if (d !== null) bindDataOption($(this), d[1], d[2]);
        }
    });
});