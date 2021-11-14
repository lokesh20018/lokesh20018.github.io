
$(document).ready(function() {

    var limitsFourBar = function(parametersDescription, groundLink, floatingLink, inputLink, outputLink) {
        var restraints = {};
        restraints.L = groundLink + floatingLink + inputLink + outputLink;
        restraints.ValidityIndex = restraints.L - 2 * Math.max(groundLink, floatingLink, inputLink, outputLink);
        restraints.valid = ((restraints.ValidityIndex >= 0) && (Math.min(groundLink, floatingLink, inputLink, outputLink) >= 0));
        if (restraints.ValidityIndex >= 0) {
            restraints.ValidityRelation = "≥ 0";
        } else {
            restraints.ValidityRelation = "< 0";
        }
        restraints.GrashofIndex = restraints.L - 2 * (Math.max(groundLink, floatingLink, inputLink, outputLink) + Math.min(groundLink, floatingLink, inputLink, outputLink));
        if (restraints.GrashofIndex > 0) {
            restraints.GrashofRelation = "> 0";
        } else if (restraints.GrashofIndex == 0) {
            restraints.GrashofRelation = "= 0";
        } else {
            restraints.GrashofRelation = "< 0";
        }

        restraints.T1 = groundLink + floatingLink - inputLink - outputLink;
        restraints.T2 = outputLink + groundLink - inputLink - floatingLink;
        restraints.T3 = outputLink + floatingLink - inputLink - groundLink;
        var charVal = function(TVal) {
            if (TVal > 0) {
                return "+";
            } else if (TVal == 0) {
                return "0";
            } else { 
                return "-";
            }
        };
        var linkageKey = (charVal(restraints.T1) + charVal(restraints.T2) + charVal(restraints.T3));
        var limitAngles = [
            parametersDescription.cosLawAngle(inputLink, groundLink, floatingLink + outputLink),
            -parametersDescription.cosLawAngle(inputLink, groundLink, floatingLink + outputLink),
            parametersDescription.cosLawAngle(inputLink, groundLink, floatingLink - outputLink),
            2 * Math.PI - parametersDescription.cosLawAngle(inputLink, groundLink, floatingLink - outputLink),
            parametersDescription.cosLawAngle(inputLink, groundLink, outputLink - floatingLink),
            2 * Math.PI - parametersDescription.cosLawAngle(inputLink, groundLink, outputLink - floatingLink)
        ];

        var keyMap = {
            "+++": ["crank",    "rocker",   true,  0, 0, -1, -1],
            "0++": ["crank",    "π-rocker", true,  0, 2, -1, -1],
            "-++": ["π-rocker", "π-rocker", false, 0, 2,  2,  3],
            "+0+": ["crank",    "0-rocker", true,  0, 2, -1, -1],
            "00+": ["crank",    "crank",    true,  0, 2, -1, -1],
            "-0+": ["crank",    "crank",    true,  0, 2, -1, -1],
            "+-+": ["π-rocker", "0-rocker", false, 0, 2,  4,  5],
            "0-+": ["crank",    "crank",    true,  0, 2, -1, -1],
            "--+": ["crank",    "crank",    true,  0, 0, -1, -1],
            "++0": ["crank",    "π-rocker", true,  1, 2, -1, -1],
            "0+0": ["crank",    "π-rocker", true,  0, 1, -1, -1],
            "-+0": ["π-rocker", "π-rocker", true,  1, 1,  2,  3],
            "+00": ["crank",    "crank",    true,  0, 1, -1, -1],
            "000": ["crank",    "crank",    true,  0, 1, -1, -1],
            "-00": ["crank",    "crank",    true,  0, 1, -1, -1],
            "+-0": ["π-rocker", "crank",    true,  1, 1,  4,  5],
            "0-0": ["crank",    "crank",    true,  0, 1, -1, -1],
            "--0": ["crank",    "crank",    true,  1, 2, -1, -1],
            "++-": ["0-rocker", "π-rocker", false, 0, 2,  1,  0],
            "0+-": ["0-rocker", "π-rocker", true,  1, 1,  1,  0],
            "-+-": ["rocker",   "rocker",   true,  0, 2,  2,  0],
            "+0-": ["0-rocker", "crank",    true,  1, 1,  1,  0],
            "00-": ["0-rocker", "crank",    true,  1, 1,  1,  0],
            "-0-": ["0-rocker", "0-rocker", true,  1, 1,  1,  0],
            "+--": ["rocker",   "crank",    true,  0, 2,  4,  0],
            "0--": ["0-rocker", "crank",    true,  1, 1,  1,  0],
            "---": ["0-rocker", "0-rocker", false, 0, 2,  1,  0]
        }
        var data = keyMap[linkageKey];
        restraints.inputType = data[0];
        restraints.outputType = data[1];
        restraints.canFlip = (data[4] > 0);
        restraints.limited = (data[5] >= 0);
        restraints.Grashof = data[2];
        restraints.flipPhase = data[3];
        restraints.flipPeriod = data[4];
        restraints.alphaMin = (data[5] >= 0 ? limitAngles[data[5]] : 0);
        restraints.alphaMax = (data[6] >= 0 ? limitAngles[data[6]] : 0);

        if (restraints.Grashof) {
            restraints.GrashofType = "Grashof";
            restraints.GrashofInfo = "rotates fully";
        } else {
            restraints.GrashofType = "non-Grashof";
            restraints.GrashofInfo = "reciprocates";
        }
        return restraints;
    };

    var linkagePDFunction = function(t) {
        this.addOption("controlMethod", "lengths");
        this.addOption("reversed", false);
        this.addOption("flipped", false);
        this.addOption("g", 40);
        this.addOption("a", 20);
        this.addOption("b", 30);
        this.addOption("f", 40);
        this.addOption("T1", 30);
        this.addOption("T2", 10);
        this.addOption("T3", 10);
        this.addOption("L", 130);
        this.addOption("PPosition", 0);
        this.addOption("POffset", 0);
        this.addOption("gAngleDeg", 0);
        this.addOption("oscInput", false);
        this.addOption("oscCenter", 50);
        this.addOption("oscMagnitude", 50);
        this.addOption("phaseOffset", 0.1);
        this.addOption("traceC", false);
        this.addOption("traceD", false);
        this.addOption("traceP", false);
        this.addOption("showLabels", true);
        this.addOption("showPivots", true);
        this.addOption("showInputRange", false);
        this.addOption("showCoupler", true);
        this.addOption("zoom", 100);
        var zoom = this.getOption("zoom");        
	    this.setUnits(130, 130 / this.goldenRatio);
        this.scale($V([zoom / 100, zoom / 100]));
        this.addOption("xTranslate", 0);
        this.addOption("yTranslate", 0);
        this.translate($V([this.getOption("xTranslate"), this.getOption("yTranslate")]));
        var a = this.getOption("a");
        var b = this.getOption("b");
        var g = this.getOption("g");
        var f = this.getOption("f");
        var PPosition = this.getOption("PPosition");
        var POffset = this.getOption("POffset");
        var gAngle = this.degToRad(this.getOption("gAngleDeg"));
        var restraints = limitsFourBar(this, g, f, a, b);
        this.addOption("inputType", restraints.inputType);
        this.addOption("outputType", restraints.outputType);
        this.addOption("ValidityIndex", restraints.ValidityIndex);
        this.addOption("ValidityRelation", restraints.ValidityRelation);
        this.addOption("GrashofIndex", restraints.GrashofIndex);
        this.addOption("Grashof", restraints.Grashof);
        this.addOption("GrashofType", restraints.GrashofType);
        this.addOption("GrashofRelation", restraints.GrashofRelation);
        this.addOption("GrashofInfo", restraints.GrashofInfo);
        this.addOption("limitedRange", restraints.limited);
        if (!restraints.valid) {
            this.text($V([0, 0]), $V([0, 0]), "TEX:impossible geometry");
            return;
        }
        var oscilatingInput = this.getOption("oscInput");
        var oscilationCenter = this.getOption("oscCenter");
        var oscilatingAmplitude = this.getOption("oscMagnitude");
        var alphaLimited, alphaMin, alphaMax, alphaCent;
        var phase, alpha;
        var invertedState = false;
        if (restraints.limited) {
            var r, c;
            if (oscilatingInput) {
                c = oscilationCenter / 100;
                r = Math.min(c, 1 - c) * oscilatingAmplitude / 100;
            } else {
                c = 0.5;
                r = 0.5;
            }
            alphaLimited = true;
            alphaMin = this.linearInterp(restraints.alphaMin, restraints.alphaMax, c - r);
            alphaMax = this.linearInterp(restraints.alphaMin, restraints.alphaMax, c + r);
            alphaCent = this.linearInterp(restraints.alphaMin, restraints.alphaMax, c);
            var alphaRange = alphaMax - alphaMin;
            phase = (alphaRange > 0) ? (t / Math.max(alphaRange, 0.3) - this.getOption("phaseOffset")) : 0;
            var w = c + r * Math.sin(phase * Math.PI);
            alpha = this.linearInterp(restraints.alphaMin, restraints.alphaMax, w);
            if (restraints.canFlip) {
                if (oscilatingInput) {
                    if (restraints.flipPeriod == 2) {
                        if (oscilatingAmplitude == 100) {
                            if (oscilationCenter > 50) {
                                invertedState = (Math.cos((phase + 0.5) * Math.PI / 2) < 0);
                            } else if (oscilationCenter == 50) {
                                invertedState = (Math.cos(phase * Math.PI) < 0);
                            } else { 
                                invertedState = (Math.cos((phase - 0.5) * Math.PI / 2) < 0);
                            }
                        }
                    } else if (restraints.flipPeriod == 1) {
                        if (oscilatingAmplitude == 100) {
                            if (oscilationCenter > 50) {
                                if (Math.cos((phase / 4 + 1/8) * 2 * Math.PI) < 0) {
                                    invertedState = (w > 0.5);
                                } else {
                                    invertedState = (w < 0.5);
                                }
                            } else if (oscilationCenter == 50) {
                                invertedState = (Math.cos((phase / restraints.flipPeriod + restraints.flipPhase / 4) * 2 * Math.PI) < 0);
                            } else { 
                                if (Math.cos((phase / 4 - 1/8) * 2 * Math.PI) < 0) {
                                    invertedState = (w < 0.5);
                                } else {
                                    invertedState = (w > 0.5);
                                }
                            }
                        } else { 
                            if (c + r > 0.5 && c - r < 0.5) {
                                invertedState = (w > 0.5);
                            }
                        }
                    }
                } else {
                    invertedState = (Math.cos((phase / restraints.flipPeriod + restraints.flipPhase / 4) * 2 * Math.PI) < 0);
                }
            }
        } else {
            if (oscilatingInput) {
                var c = oscilationCenter / 100;
                var r = 0.5 * oscilatingAmplitude / 100;
                var alphaRange = r * 4 * Math.PI;
                var oscPhase = (alphaRange > 0) ? (t / Math.max(alphaRange, 0.3) - this.getOption("phaseOffset")) : 0;
                var w = c + r * Math.sin(oscPhase * Math.PI);
                alpha = w * 2 * Math.PI;
                alphaLimited = true;
                alphaMin = (c - r) * 2 * Math.PI;
                alphaMax = (c + r) * 2 * Math.PI;
                alphaCent = c * 2 * Math.PI;
                if (restraints.canFlip) {
                    phase = alpha / (2 * Math.PI);
                    invertedState = (Math.sin((phase / restraints.flipPeriod + restraints.flipPhase / 4) * 2 * Math.PI) < 0);
                }
            } else {
                alpha = t + Math.PI/2 + 0.1 - this.getOption("phaseOffset");
                alphaLimited = false;
                if (restraints.canFlip) {
                    phase = alpha / (2 * Math.PI);
                    invertedState = (Math.sin((phase / restraints.flipPeriod + restraints.flipPhase / 4) * 2 * Math.PI) < 0);
                }
            }
        }
        invertedState = (this.getOption("flipped") ? !invertedState : invertedState);
        var angleSign = (this.getOption("reversed") ? -1 : 1);
        var beta = this.solveFourBar(g, f, a, b, alpha, invertedState);
        var pointA = $V([-g/2, 0]).rotate(gAngle, $V([0, 0]));
        var pointB = $V([g/2, 0]).rotate(gAngle, $V([0, 0]));
        var pointD = pointA.add(this.vector2DAtAngle(angleSign * alpha + gAngle).x(a));
        var pointC = pointB.add(this.vector2DAtAngle(angleSign * beta + gAngle).x(b));
        var pointTransient = pointC.subtract(pointD);
        var pointOffset = pointTransient.rotate(Math.PI/2, $V([0, 0]));
        var pointP = pointD.add(pointTransient.x(0.5 + PPosition / 200)).add(pointOffset.x(POffset / 100));
        if (this.getOption("showPivots")) {
            var pivotHeight = 3;
            var pivotWidth = 3;
            this.pivot(pointA.add($V([0, -pivotHeight])), pointA, pivotWidth);
            this.pivot(pointB.add($V([0, -pivotHeight])), pointB, pivotWidth);
            this.ground(pointA.add($V([0, -pivotHeight])), $V([0, 1]), 2 * pivotWidth);
            this.ground(pointB.add($V([0, -pivotHeight])), $V([0, 1]), 2 * pivotWidth);
        }
        this.rod(pointA, pointD,1.5);
        this.rod(pointD, pointC,1.5);
        this.rod(pointC, pointB,1.5);
        this.rod(pointB, pointA,1.5);
        this.point(pointA);
        this.point(pointD);
        this.point(pointC);
        this.point(pointB);
        if (this.getOption("showCoupler")) {
            this.line(pointD, pointP);
            this.line(pointC, pointP);
            this.point(pointP);
        }
        if (this.getOption("traceC")) {
            var pCHistory = this.history("pointC", 0.05, 4 * Math.PI + 0.05, t, pointC);
            var pCTrace = this.historyToTrace(pCHistory);
            this.save();
            this.setProp("shapeOutlineColor", "rgb(255, 231, 76)");
            this.polyLine(pCTrace);
            this.restore();
        } else {
            this.clearHistory("pointC");
        }
        if (this.getOption("traceD")) {
            var pDHistory = this.history("pointD", 0.05, 4 * Math.PI + 0.05, t, pointD);
            var pDTrace = this.historyToTrace(pDHistory);
            this.save();
            this.setProp("shapeOutlineColor", "rgb(255, 89, 100)");
            this.polyLine(pDTrace);
            this.restore();
        } else {
            this.clearHistory("pointD");
        }
        if (this.getOption("traceP")) {
            var pPHistory = this.history("pointP", 0.05, 4 * Math.PI + 0.05, t, pointP);
            var pPTrace = this.historyToTrace(pPHistory);
            this.save();
            this.setProp("shapeOutlineColor", "rgb(56, 97, 140)");
            this.polyLine(pPTrace);
            this.restore();
        } else {
            this.clearHistory("pointP");
        }
        if (this.getOption("showLabels")) {
            var anchor, otherPoints;
            if (this.getOption("showPivots")) {
                this.text(pointA, $V([2, 0]), "TEX:$A$");
                this.text(pointB, $V([-1.5, -1.5]), "TEX:$B$");
            } else {
                anchor = this.findAnchorForIntersection(pointA, [pointD, pointB]);
                this.text(pointA, anchor, "TEX:$A$");
                anchor = this.findAnchorForIntersection(pointB, [pointA, pointC, pointB.add(this.vector2DAtAngle(gAngle))]);
                this.text(pointB, anchor, "TEX:$B$");
            }
            otherPoints = [pointB, pointD];
            if (this.getOption("showCoupler")) {
                otherPoints.push(pointP);
            }
            anchor = this.findAnchorForIntersection(pointC, otherPoints);
            this.text(pointC, anchor, "TEX:$C$");
            otherPoints = [pointC, pointA];
            if (this.getOption("showCoupler")) {
                otherPoints.push(pointP);
            }
            anchor = this.findAnchorForIntersection(pointD, otherPoints);
            this.text(pointD, anchor, "TEX:$D$");
            if (this.getOption("showCoupler")) {
                anchor = this.findAnchorForIntersection(pointP, [pointD, pointC]);
                this.text(pointP, anchor, "TEX:$P$");
            }
            this.labelLine(pointA, pointD, $V([0, 1]), "TEX:$a$");
            this.labelLine(pointD, pointC, $V([0, 1]), "TEX:$f$");
            this.labelLine(pointC, pointB, $V([0, 1]), "TEX:$b$");
            this.labelLine(pointB, pointA, $V([0, 1]), "TEX:$g$");
            var alphaR = Math.min(10, Math.min(g, a) * 0.7);
            var alphaShow = angleSign * this.fixedMod(alpha, 2 * Math.PI);
            this.circleArrow(pointA, alphaR, gAngle, alphaShow + gAngle, undefined, true);
            this.labelCircleLine(pointA, alphaR, gAngle, alphaShow + gAngle, $V([0, 1]), "TEX:$\\alpha$");
            var betaR = Math.min(10, Math.min(g, b) * 0.7);
            var betaShow = angleSign * this.fixedMod(beta, 2 * Math.PI);
            this.save();
            this.setProp("shapeStrokePattern", "dashed");
            this.line(pointB, pointB.add(this.vector2DAtAngle(gAngle).x(betaR * 1.4)));
            this.restore();
            this.circleArrow(pointB, betaR, gAngle, betaShow + gAngle, undefined, true);
            this.labelCircleLine(pointB, betaR, gAngle, betaShow + gAngle, $V([0, 1]), "TEX:$\\beta$");
        }
        if (this.getOption("showInputRange")) {
            var alphaR = Math.min(10, Math.min(g, a)) * 1.5;
            if (alphaLimited) {
                var alphaMinShow = gAngle + angleSign * alphaMin;
                var alphaMaxShow = gAngle + angleSign * alphaMax;
                var alphaCentShow = gAngle + angleSign * alphaCent;
                if (restraints.limited) {
                    var limitAlphaMinShow = gAngle + angleSign * restraints.alphaMin;
                    var limitAlphaMaxShow = gAngle + angleSign * restraints.alphaMax;
                }
                this.save();
                this.setProp("arrowLinePattern", "dashed");
                this.setProp("shapeStrokePattern", "dashed");
                var anchorMin = this.vector2DAtAngle(alphaMinShow);
                var anchorMax = this.vector2DAtAngle(alphaMaxShow);
                var anchorCent = this.vector2DAtAngle(alphaCentShow);
                var anchorLimitMin, anchorLimitMax;
                if (restraints.limited) {
                    anchorLimitMin = this.vector2DAtAngle(limitAlphaMinShow);
                    anchorLimitMax = this.vector2DAtAngle(limitAlphaMaxShow);
                }
                var innerScale = 1.2;
                var outerScale = 1.4;
                this.line(pointA, pointA.add(anchorMin.x(alphaR * innerScale)));
                this.line(pointA, pointA.add(anchorMax.x(alphaR * innerScale)));
                this.line(pointA, pointA.add(anchorCent.x(alphaR * innerScale)));
                if (restraints.limited) {
                    this.line(pointA, pointA.add(anchorLimitMin.x(alphaR * outerScale)));
                    this.line(pointA, pointA.add(anchorLimitMax.x(alphaR * outerScale)));
                }
                anchorMin = anchorMin.x(-1 / this.supNorm(anchorMin));
                anchorMax = anchorMax.x(-1 / this.supNorm(anchorMax));
                anchorCent = anchorCent.x(-1 / this.supNorm(anchorCent));
                if (restraints.limited) {
                    anchorLimitMin = anchorLimitMin.x(-1 / this.supNorm(anchorLimitMin));
                    anchorLimitMax = anchorLimitMax.x(-1 / this.supNorm(anchorLimitMax));
                }
                this.circleArrow(pointA, alphaR, alphaCentShow, alphaMinShow, undefined, true);
                this.circleArrow(pointA, alphaR, alphaCentShow, alphaMaxShow, undefined, true);
                this.restore();
                if (this.getOption("showLabels")) {
                    this.text(pointA.add(this.vector2DAtAngle(alphaCentShow).x(alphaR * innerScale)), anchorCent, "TEX:$\\alpha_{\\rm cent}$");
                    this.labelCircleLine(pointA, alphaR, alphaCentShow, alphaMinShow, $V([0, 1]), "TEX:$\\Delta\\alpha$");
                    this.labelCircleLine(pointA, alphaR, alphaCentShow, alphaMaxShow, $V([0, 1]), "TEX:$\\Delta\\alpha$");
                    if (restraints.limited) {
                        this.text(pointA.add(this.vector2DAtAngle(limitAlphaMinShow).x(alphaR * outerScale)), anchorLimitMin, "TEX:$\\alpha_{\\rm min}$");
                        this.text(pointA.add(this.vector2DAtAngle(limitAlphaMaxShow).x(alphaR * outerScale)), anchorLimitMax, "TEX:$\\alpha_{\\rm max}$");
                    }
                }
            } else {
                this.save();
                this.setProp("arrowLinePattern", "dashed");
                this.setProp("shapeStrokePattern", "dashed");
                this.circleArrow(pointA, alphaR, gAngle, 2 * Math.PI + gAngle, undefined, true);
                if (this.getOption("showLabels")) {
                    this.labelCircleLine(pointA, alphaR, gAngle, 2 * Math.PI + gAngle, $V([0, 1]), "TEX:$\\Delta\\alpha$");
                }
                this.restore();
            }
        }
    };

    var linkageConvertFromLengths = function(parametersDescription, setReset) {
        var a = parametersDescription.getOption("a");
        var b = parametersDescription.getOption("b");
        var g = parametersDescription.getOption("g");
        var f = parametersDescription.getOption("f");
        var restraints = limitsFourBar(parametersDescription, g, f, a, b);
        parametersDescription.setOption("inputType", restraints.inputType, false, undefined, setReset);
        parametersDescription.setOption("outputType", restraints.outputType, false, undefined, setReset);
        parametersDescription.setOption("ValidityIndex", restraints.ValidityIndex, false, undefined, setReset);
        parametersDescription.setOption("ValidityRelation", restraints.ValidityRelation, false, undefined, setReset);
        parametersDescription.setOption("GrashofIndex", restraints.GrashofIndex, false, undefined, setReset);
        parametersDescription.setOption("Grashof", restraints.Grashof, false, undefined, setReset);
        parametersDescription.setOption("GrashofType", restraints.GrashofType, false, undefined, setReset);
        parametersDescription.setOption("GrashofRelation", restraints.GrashofRelation, false, undefined, setReset);
        parametersDescription.setOption("GrashofInfo", restraints.GrashofInfo, false, undefined, setReset);
        parametersDescription.setOption("limitedRange", restraints.limited, false, undefined, setReset);
        if (parametersDescription.getOption("controlMethod") === "lengths") {
            var L = a + b + g + f;
            var T1 = g + f - b - a;
            var T2 = b + g - f - a;
            var T3 = f + b - g - a;
            parametersDescription.setOption("L", L, false, undefined, setReset);
            parametersDescription.setOption("T1", T1, false, undefined, setReset);
            parametersDescription.setOption("T2", T2, false, undefined, setReset);
            parametersDescription.setOption("T3", T3, false, undefined, setReset);
        }
    };

    var linkageConvertFromExcesses = function(parametersDescription) {
        if (parametersDescription.getOption("controlMethod") === "excesses") {
            var L = parametersDescription.getOption("L");
            var T1 = parametersDescription.getOption("T1");
            var T2 = parametersDescription.getOption("T2");
            var T3 = parametersDescription.getOption("T3");
            var a = (L - T1 - T2 - T3) / 4;
            var b = (L - T1 + T2 + T3) / 4;
            var g = (L + T1 + T2 - T3) / 4;
            var f = (L + T1 - T2 + T3) / 4;
            parametersDescription.setOption("a", a, false);
            parametersDescription.setOption("b", b, false);
            parametersDescription.setOption("g", g, false);
            parametersDescription.setOption("f", f, false);
        }
    };

    var mechanism = new PrairieDrawAnim("mechanismDrawing", linkagePDFunction);
    mechanism.registerOptionCallback("controlMethod", function(value) {
        if (value === "lengths") {
            // controlling the lenths directly
            var a = Math.min(Math.max(mechanism.getOption("a"), 5), 40);
            var b = Math.min(Math.max(mechanism.getOption("b"), 5), 40);
            var g = Math.min(Math.max(mechanism.getOption("g"), 5), 40);
            var f = Math.min(Math.max(mechanism.getOption("f"), 5), 40);
            mechanism.setOption("a", a);
            mechanism.setOption("b", b);
            mechanism.setOption("g", g);
            mechanism.setOption("f", f);
            $("input.lengthInput").css("visibility", "visible");
            $("input.excessInput").css("visibility", "hidden");
        } else if (value === "excesses") {
            // controlling the excess T_i inputs
            var L = Math.min(Math.max(mechanism.getOption("L"), 10), 200);
            var T1 = Math.min(Math.max(mechanism.getOption("T1"), -40), 40);
            var T2 = Math.min(Math.max(mechanism.getOption("T2"), -40), 40);
            var T3 = Math.min(Math.max(mechanism.getOption("T3"), -40), 40);
            mechanism.setOption("L", L);
            mechanism.setOption("T1", T1);
            mechanism.setOption("T2", T2);
            mechanism.setOption("T3", T3);
            $("input.lengthInput").css("visibility", "hidden");
            $("input.excessInput").css("visibility", "visible");
        } else {
            throw new Error("unknown controlMethod: " + value);
        }
    });

    mechanism.registerOptionCallback("oscInput", function(value) {
        if (value) {
            $(".oscInput").css("visibility", "visible");
        } else {
            $(".oscInput").css("visibility", "hidden");
        }
    });

    mechanism.registerOptionCallback("limitedRange", function(value) {
        if (value) {
            $(".limitedDesc").show();
            $(".unlimitedDesc").hide();
        } else {
            $(".limitedDesc").hide();
            $(".unlimitedDesc").show();
        }
    });
    // to clear already existing values in case the bar lengths are dynamically chnaged
    mechanism.registerOptionCallback("a", function(value) {linkageConvertFromLengths(this);});
    mechanism.registerOptionCallback("b", function(value) {linkageConvertFromLengths(this);});
    mechanism.registerOptionCallback("g", function(value) {linkageConvertFromLengths(this);});
    mechanism.registerOptionCallback("f", function(value) {linkageConvertFromLengths(this);});
    mechanism.registerOptionCallback("T1", function(value) {linkageConvertFromExcesses(this);});
    mechanism.registerOptionCallback("T2", function(value) {linkageConvertFromExcesses(this);});
    mechanism.registerOptionCallback("T3", function(value) {linkageConvertFromExcesses(this);});
    mechanism.registerOptionCallback("L", function(value) {linkageConvertFromExcesses(this);});
    mechanism.registerOptionCallback("reversed", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("flipped", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("g", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("a", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("b", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("f", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("PPosition", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("POffset", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("gAngleDeg", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("oscInput", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("oscCenter", function(value) {this.clearAllHistory();});
    mechanism.registerOptionCallback("oscMagnitude", function(value) {this.clearAllHistory();});   
}); 