// Resizes and repositions variable text fields to fit correctly on cheese marker vector cutting patern
// Max dimensions for text labels: 0.35in W & 1.35in H (25pt W x  97pt H) 

function getLabelPosition() {
    "use strict";
    var offset = 243,
        fullPath;
    // 243 pt between labels, 97pt long text path
    function calculatePosition(labelNum) {
        if (labelNum > 16) {
            //4th row, 5 labels
            if (labelNum === 17) {
                fullPath = [[219, -167.5], [219, -264.5]];
            } else {
                fullPath[0][0] = fullPath[0][0] + offset;
                fullPath[1][0] = fullPath[1][0] + offset;
            }
        } else if (labelNum > 10) {
            //3rd row, 6 labels
            if (labelNum === 11) {
                fullPath = [[70, -237], [70, -140]];
            } else {
                fullPath[0][0] = fullPath[0][0] + offset;
                fullPath[1][0] = fullPath[1][0] + offset;
            }
        } else if (labelNum > 5) {
            //2nd row, 5 labels
            if (labelNum === 6) {
                fullPath = [[219, -50.5], [219, -147.5]];
            } else {
                fullPath[0][0] = fullPath[0][0] + offset;
                fullPath[1][0] = fullPath[1][0] + offset;
            }
        } else {
            //1st row, 6 labels
            if (labelNum === 0) {
                fullPath = [[70, -120], [70, -23]];
            } else {
                fullPath[0][0] = fullPath[0][0] + offset;
                fullPath[1][0] = fullPath[1][0] + offset;
            }
        }
        return fullPath;
    }
    return calculatePosition;
}

function buildPathTextFrame(coordArray, align, textSize, fontFamily, name) {
    "use strict";
    var newPath,
        pTextFrame;
    newPath = app.activeDocument.pathItems.add();
    newPath.setEntirePath(coordArray);
    pTextFrame = app.activeDocument.textFrames.pathText(newPath);
    pTextFrame.textRange.paragraphAttributes.justification = align;
    pTextFrame.textRange.characterAttributes.size = textSize;
    pTextFrame.textRange.characterAttributes.textFont = textFonts.getByName(fontFamily);
    pTextFrame.name = name;
    return pTextFrame;
}

function overflows(tF) {
    "use strict";
    var charCount = 0, i;
    for (i = 0; i < tF.lines.length; i++) {
        charCount += tF.lines[i].characters.length;
    }
    return charCount < tF.characters.length;
}

function main() {
    "use strict";
    var labelTextFrame,
        labelMaker,
        pathEndPoints,
        fontSize,
        i,
        docRef = app.activeDocument,
        labelTypeface = "Garamond",

    if (docRef.variables.length === 22) {
        labelMaker  = getLabelPosition();
        for (i = 0; i < docRef.variables.length; i++) {

            //determine start/end points of line
            pathEndPoints = labelMaker(i);
            fontSize = 24;
            labelTextFrame = buildPathTextFrame(pathEndPoints, Justification.CENTER, fontSize, labelTypeface, ("NewLabel" + i));

            // set primary textFrame's contents and decrement 5% each loop until all text fit onto primary labelTextFrame 
            labelTextFrame.contents = docRef.variables[i].pageItems[0].contents;
            while (overflows(labelTextFrame) === true) {
			    fontSize *= 0.95;
                labelTextFrame.textRange.characterAttributes.size = Math.round(fontSize);
            }
            // final font resize to format text that moved back from the overflowChecker object
            labelTextFrame.textRange.characterAttributes.size = Math.round(fontSize);

        }
        redraw();
    } else {
        alert("Error, script detected more than 22 label variables\nPlease confirm correct 20x4 template is open and selected in Illustrator.");
   }
}
main();
