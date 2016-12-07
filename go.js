/**
WorldEdit command blocks CraftScripts pack
Author: WRIM
www.planetminecraft.com/member/wrim/
http://minecraft.wrim.pl

"Command combiner generator" argorithm by:
MrGarretto
https://mrgarretto.com
**/

var useHopperClock = false;
var useBlockdata = false;
var arg_offset_x = 0;
var arg_offset_y = 0;
var arg_offset_z = 0;
var arg_box_length_x = 5;	//length
var arg_box_length_z = 3;	//width
var arg_orientation = 1;	//X+ = 1, X- = 2, Z+ = 3, Z- = 4
var arg_encase = true;
var arg_encase_block_window = 'stained_glass 1';
var arg_encase_block_caps = 'stained_hardened_clay 2';
var arg_advanced_objectivename = makeRandomStr(6);
var show_output = 127;
var signLines = [];
var signLineIndex = 0;

var input_commands = new Array();
var output_commands = new Array();

function printArgs(argNum)
{
	if (argNum == 0)
		context.checkArgs(0, 0, "/cs " + argv[0] + " [orientation] [useblockdata] [usehopperclock] [length] [width] [offset-x] [offset-y] [offset-z] [encase-caps-block data] [encase-window-block data] [encase] [destroy-sign] [deactivate-sign] [output] [scoreboard-objective-name]\n" +
			"§r§eorientation:§r x+, x-, z+ or z-\n" +
			"§r§euseblockdata:§r (t)rue or (f)alse\n" +
			"§r§eusehopperclock:§r (t)rue or (f)alse\n" +
			"§r§elength:§r length of command blocks area\n" +
			"§r§ewidth:§r with of command blocks area\n" +
			"§r§eoffsets:§r move machine position\n" +
			"§r§eencase-caps/encase-window:§r block name and data value of caps/window\n" +
			"§r§eencase:§r enable/disable casing:§r (t)rue or (f)alse\n" +
			"§r§edestroy-sign:§r (t)rue or (f)alse\n" +
			"§r§edeactivate-sign:§r (t)rue or (f)alse\n" +
			"§r§eoutput:§r in(w)orld, (c)onsole or (b)oth\n" +
			"§r§escoreboard-objective-name:§r any text\n" +
			"§r§bpos1§r is first INIT block, §bpos2§r is first main block\n" +
			"§r§aDefault args:§r /cs " + argv[0] + " x+ f f 5 3 0 0 0 stained_hardened_clay 2 stained_glass 1 t f f b <random_string>"
			);
	else
		context.checkArgs(0, 0, argNum);
}

if (argv.length > 1 && argv[1] == 'help')
{
	//player.printRaw("§eDefault args:§r /cs " + argv[0] + " x+ f f 5 3 0 0 0 stained_hardened_clay 2 stained_glass 1 t f f b <random_string>");
	printArgs(0);
}

//args checks
var i = 0;
if (argv.length > ++i)
{
	     if (argv[i] == 'x+' || argv[i] == 'X+') arg_orientation = 1;
	else if (argv[i] == 'x-' || argv[i] == 'X-') arg_orientation = 2;
	else if (argv[i] == 'z+' || argv[i] == 'Z+') arg_orientation = 3;
	else if (argv[i] == 'z-' || argv[i] == 'Z-') arg_orientation = 4;
	else printArgs('orientation possible values: x+, x-, z+, z-');
	
}
if (argv.length > ++i)
{
	if (argv[i] == 'true' || argv[i] == 't') useBlockdata = true;
	else if (argv[i] == 'false' || argv[i] == 'f') useblockdata = false;
	else printArgs('useblockdata must be (t)rue or (f)alse');
}
if (argv.length > ++i)
{
	if (argv[i] == 'true' || argv[i] == 't') useHopperClock = true;
	else if (argv[i] == 'false' || argv[i] == 'f') useHopperClock = false;
	else printArgs('usehopperclock must be (t)rue or (f)alse');
}
if (argv.length > ++i)
{
	if (isNaN(argv[i])) printArgs('sizes must be numbers');
	else arg_box_length_x = parseInt(argv[i]);
}
if (argv.length > ++i)
{
	if (isNaN(argv[i])) printArgs('sizes must be numbers');
	else arg_box_length_z = parseInt(argv[i]);
}
if (argv.length > ++i)
{
	if (isNaN(argv[i])) printArgs('offsets must be numbers');
	else arg_offset_x = parseInt(argv[i]);
}
if (argv.length > ++i)
{
	if (isNaN(argv[i])) printArgs('offsets must be numbers');
	else arg_offset_y = parseInt(argv[i]);
}
if (argv.length > ++i)
{
	if (isNaN(argv[i])) printArgs('offsets must be numbers');
	else arg_offset_z = parseInt(argv[i]);
}
if (argv.length > (i += 2))
{
	if (isNaN(argv[i])) printArgs('data value must be number');
	arg_encase_block_caps = argv[i-1] + ' ' + argv[i]
}
if (argv.length > (i += 2))
{
	if (isNaN(argv[i])) printArgs('data value must be number');
	arg_encase_block_window = argv[i-1] + ' ' + argv[i]
}
if (argv.length > ++i)
{
	if (argv[i] == 'true' || argv[i] == 't') arg_encase = true;
	else if (argv[i] == 'false' || argv[i] == 'f') arg_encase = false;
	else printArgs('encase must be (t)rue or (f)alse');
}
if (argv.length > ++i)
{
	if (argv[i] == 'true' || argv[i] == 't')
	{
		signLines[signLineIndex++] = [
			{
				lineText: "",
				lineColor: "black", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: ""
			},
			{
				lineText: "Destroy Machine",
				lineColor: "dark_red", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: ""
			},
			{
				lineText: "",
				lineColor: "black", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: ""
			},
			{
				lineText: "",
				lineColor: "black", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: "DESTROYMACHINE"
			}
		]
	}
	else if (argv[i] != 'false' && argv[i] != 'f') printArgs('destroy-sign must be (t)rue or (f)alse');
}
if (argv.length > ++i)
{
	if (argv[i] == 'true' || argv[i] == 't')
	{
		signLines[signLineIndex++] = [
			{
				lineText: "",
				lineColor: "black", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: "TOGGLEACTIVE"
			},
			{
				lineText: "ON/OFF Machine",
				lineColor: "dark_blue", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: "TOGGLEACTIVE"
			},
			{
				lineText: "",
				lineColor: "black", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: "TOGGLEACTIVE"
			},
			{
				lineText: "",
				lineColor: "black", 
				lineItalic: false, 
				lineBold: false, 
				lineUnderlined: false, 
				lineCommand: "TOGGLEACTIVE"
			}
		]
	}
	else if (argv[i] != 'false' && argv[i] != 'f') printArgs('deactivate-sign must be (t)rue or (f)alse');
}
if (argv.length > ++i)
{
	if (argv[i] == 'inworld' || argv[i] == 'w') show_output = 1;
	else if (argv[i] == 'console' || argv[i] == 'c') show_output = 2;
	else if (argv[i] == 'both' || argv[i] == 'b') show_output = 3;
	else printArgs('output must be: in(w)orld, (c)onsole or (b)oth');
}
if (argv.length > ++i)
{
	arg_advanced_objectivename = argv[i];
}
if (argv.length > ++i)
{
	printArgs('Too many arguments!');
}
//end of argv checks

//importClass(Packages.java.util.Arrays);
//player.printRaw(arg_advanced_objectivename+' '+Arrays.toString(argv));

var isDirty = true;
useServerSigns = true;

var nbtSelectorCur = 1;
var scoreboardObjInUse = [false, false, false];
var nbtScoreArr = [];

function nbtInSelectors(currentCommand) {
	var pattern = /@[eapr]\[.*nbt=\{(.*?)\}.*\]/g;
	if (!pattern.test(currentCommand)) {
		// End the function here if it doesn't include an NBT shortcut
		return;
	}

	scoreboardObjInUse[1] = true;

	var entitySelectorChar = currentCommand.split(/ (@[eapr])\[/g)[1];
	var scoreboardObjName = inputScoreboard + '_N';
	var nbtStr = currentCommand.split(pattern)[1];

	var objectiveAlreadyExists = false;
	var finalCur = 0;

	for (n = 0; n < nbtScoreArr.length; n++) {
		if (nbtScoreArr[n].nbtstr == nbtStr) {
			objectiveAlreadyExists = true;
			finalCur = nbtScoreArr[n].score;
		}
	}
	if (!objectiveAlreadyExists) {
		nbtScoreArr[nbtScoreArr.length] = {
			nbtstr: nbtStr,
			score: nbtSelectorCur
		};
		finalCur = nbtSelectorCur;
	}

	allCommands.splice(i, 0, {
		cmd: 'scoreboard players set ' + entitySelectorChar + ' ' + scoreboardObjName + ' ' + finalCur + ' {' + nbtStr + '}',
		tag: 'none'
	});

	// Add a command at the end to reset the score each tick
	allCommands[allCommands.length] = {
		cmd: 'scoreboard players reset @e ' + scoreboardObjName,
		tag: 'none'
	};

	// Add 1 to i since the previous index will change to the inserted object
	i++;

	allCommands[i].cmd = allCommands[i].cmd.replace(/,nbt=\{.*?\},/g, ',score_'+scoreboardObjName+'_min='+finalCur+',score_'+scoreboardObjName+'='+finalCur+',');
	allCommands[i].cmd = allCommands[i].cmd.replace(/,nbt=\{.*?\}/g, ',score_'+scoreboardObjName+'_min='+finalCur+',score_'+scoreboardObjName+'='+finalCur);
	allCommands[i].cmd = allCommands[i].cmd.replace(/nbt=\{.*?\},/g, 'score_'+scoreboardObjName+'_min='+finalCur+',score_'+scoreboardObjName+'='+finalCur + ',');
	allCommands[i].cmd = allCommands[i].cmd.replace(/nbt=\{.*?\}/g, 'score_'+scoreboardObjName+'_min='+finalCur+',score_'+scoreboardObjName+'='+finalCur);

	// Increase i again so that it doesn't repeat into an infinite loop
	// i++;

	if (!objectiveAlreadyExists) {
		nbtSelectorCur++;
	}
}

var globalBoxLength = 0;

function generateCompactCommand() {
	var inputOffX = parseInt(arg_offset_x);
	var inputOffY = parseInt(arg_offset_y);
	var inputOffZ = parseInt(arg_offset_z);

	boxLengthX = parseInt(arg_box_length_x);
	boxLengthZ = parseInt(arg_box_length_z);

	if (parseInt(arg_orientation) == 3)
		inputOffX++;

	fetchCommands();
	getBoxDimensionInputs();
	generateCoordinates(boxLengthX, boxLengthZ);
	offsetCoordinates(inputOffX, inputOffY, inputOffZ, parseInt(arg_orientation));
	formatEscaping();
	generateCasing(arg_encase_block_window, arg_encase_block_caps, parseInt(arg_orientation), inputOffX, inputOffY, inputOffZ);
	generateRotatedCoordinates(parseInt(arg_orientation));
	setupSigns(parseInt(arg_orientation), inputOffX, inputOffY, inputOffZ);
	getCoordTags();
	insertCoordTags();
	setupPrevCoords();
	createScoreObjAddCmds()
	generateOutputCommand();
}

// Create the array for the commands along with their tags
allCommands = [];

function createScoreObjAddCmds() {
	if (scoreboardObjInUse[0]) {
		allInitCommands.splice(0, 0, {
			cmd: 'scoreboard objectives add ' + inputScoreboard + '_I dummy',
			tag: 'none'
		});
	}
	if (scoreboardObjInUse[1]) {
		allInitCommands.splice(0, 0, {
			cmd: 'scoreboard objectives add ' + inputScoreboard + '_N dummy',
			tag: 'none'
		});
	}
	if (scoreboardObjInUse[2]) {
		allInitCommands.splice(0, 0, {
			cmd: 'scoreboard objectives add ' + inputScoreboard + '_A dummy',
			tag: 'none'
		}, {
			cmd: 'summon ' + (mc11 ? 'armor_stand' : 'ArmorStand') + ' ~' + allCommands[0].posX + ' ~' + allCommands[0].posY + ' ~' + allCommands[0].posZ + ' {CustomName:TogAct,Marker:1,NoGravity:1,Invisible:1}',
			tag: 'none'
		});
	}
}

function getCoordTags() {
	coordTags = [];
	for (i = 0; i < allCommands.length; i++) {
		if (allCommands[i].tag == 'tagged') {
			coordTags[coordTags.length] = {identifier: allCommands[i].tagid, loc: [allCommands[i].posX, allCommands[i].posY, allCommands[i].posZ]};
		}
	}
}

function insertCoordTags() {
	for (i = 0; i < allCommands.length; i++) {
		if (allCommands[i].cmd.indexOf('@TAG-') >= 0) {
			for (c = 0; c < coordTags.length; c++) {
				allCommands[i].cmd = allCommands[i].cmd.replace("@TAG-" + coordTags[c].identifier, ('~'+(coordTags[c].loc[0]-allCommands[i].posX)+' ~'+(coordTags[c].loc[1]-allCommands[i].posY)+' ~'+(coordTags[c].loc[2]-allCommands[i].posZ)));
			}
		}
	}
}

function getBoxDimensionInputs() {
	inputOffsetX = parseInt(arg_offset_x);
	inputOffsetY = parseInt(arg_offset_y);
	inputOffsetZ = parseInt(arg_offset_z);
	inputLimitX = boxLengthX;
	inputLimitZ = boxLengthZ;
}

function setupSigns(orientation, offsetX, offsetY, offsetZ) {
	// Signs
	// Adding the signs to the box
	var signJsonData = '';
	var signHeightY = 0;
	var signLineCommand = '';
	var signOffset = {};
	for (i = 0; i < signLines.length; i++) {
		// Clear the sign json data to be used again
		signJsonData = '';

		// Figure out the sign's location
		// Calculate what the height of the sign should be so that it is vertically centered
		signHeightY = Math.ceil((getHighestY() - offsetY) / 2) - Math.floor(signLines.length / 2) + i - 1 + offsetY;
		var signLoc = {};
		var wallsignRotation = 4;
		signLoc.xPos = 1;
		signLoc.zPos = 0;

		// Add offsets
		signLoc.xPos += offsetX;
		signLoc.zPos += offsetZ;

		if (orientation == 2) {
			signLoc.xPos *= -1;
			signLoc.zPos *= -1;
			wallsignRotation = 5;
		} else if (orientation == 3) {
			signLoc.zPos = [signLoc.xPos, signLoc.xPos = signLoc.zPos][0]; // Swap the X and Z values
			signLoc.xPos *= -1;
			wallsignRotation = 2;
		} else if (orientation == 4) {
			signLoc.zPos = [signLoc.xPos, signLoc.xPos = signLoc.zPos][0]; // Swap the Z and X values
			signLoc.zPos *= -1;
			wallsignRotation = 3
		}

		for (b = 0; b < signLines[i].length; b++) {
			if (signLines[i][b].lineText.length >= 1 || (useServerSigns && signLines[i][b].lineCommand.length === 0)) {
				// If a command is set for this line and there is also text
				if (signLines[i][b].lineCommand.length >= 1) {
					// Make the destroy command coordinates relative to the sign's coordinates!
					signLineCommand = formatForClickevent(signJsonData, signLines, signLoc, signHeightY);
				} else {
					signLineCommand = '';
				}

				signJsonData = signJsonData + ',Text' + (b + 1) + ':"{\\\\\\"text\\\\\\":\\\\\\"' + signLines[i][b].lineText + '\\\\\\"';

				if (signLines[i][b].lineColor !== 'black') {
					signJsonData += ',\\\\\\"color\\\\\\":\\\\\\"' + signLines[i][b].lineColor + '\\\\\\"';
				}

				signJsonData += signLineCommand;

				if (signLines[i][b].lineItalic == true) {
					signJsonData = signJsonData + ',\\\\\\"italic\\\\\\":true';
				}
				if (signLines[i][b].lineBold == true) {
					signJsonData = signJsonData + ',\\\\\\"bold\\\\\\":true';
				}
				if (signLines[i][b].lineUnderlined == true) {
					signJsonData = signJsonData + ',\\\\\\"underlined\\\\\\":true';
				}
				signJsonData = signJsonData + '}"';
			} else if (signLines[i][b].lineCommand.length >= 1) {
				// If there is no text but there is a command set
				signJsonData += formatForClickevent(signJsonData, signLines, signLoc, signHeightY);
			}
		}
		signJsonData = signJsonData.replace(',', ''); // Remove the extra comma at the beginning
		allInitCommands.splice(0, 0, {cmd: 'setblock ~' + (signLoc.xPos) + ' ~' + (signHeightY) + ' ~' + (signLoc.zPos) + ' wall_sign ' + wallsignRotation + ' 0 {' + signJsonData + '}', tag: 'sign'});
	}
}

function formatForClickevent(signJsonData, signLines, signLoc, signHeightY) {
	var orientation = parseInt(arg_orientation);

	var coordinates = [(getLowestX() - 2 - signLoc.xPos), (getLowestY() - 1 - signHeightY), (getLowestZ() - 1 - signLoc.zPos), (getHighestX() + 1 - signLoc.xPos), (getHighestY() + 1 - signHeightY), (getHighestZ() + 1 - signLoc.zPos)];

	// Doesn't need to account for orientation because the rotation has already taken place on the command blocks by this point, so it doesn't need to calculate it independently
	// The only exception is that it should decrease(?) the Z coordinates by 1 if the orientation is Z+ (3), because the box will automatically have 1 added to it if so, since the machine would be too close to the initial stack otherwise.

	// if (orientation == 2) {
	// 	coordinates[0] = -coordinates[0];
	// 	coordinates[3] = -coordinates[3];
	// } else if (orientation == 3) {
	// 	// Switch X and Z
	// 	coordinates[2] = [coordinates[0], coordinates[0] = coordinates[2]][0];
	// 	coordinates[5] = [coordinates[3], coordinates[3] = coordinates[5]][0];
	// 	// Negate X
	// 	coordinates[0] = -coordinates[0];
	// 	coordinates[3] = -coordinates[3];
	// } else if (orientation == 4) {
	// 	coordinates[2] = [coordinates[0], coordinates[0] = coordinates[2]][0];
	// 	coordinates[5] = [coordinates[3], coordinates[3] = coordinates[5]][0];
	// 	coordinates[2] = -coordinates[2];
	// 	coordinates[5] = -coordinates[5];
	// }

	if (orientation == 3) {
		coordinates[2]--;
	}

	var toggleActiveScore = arg_advanced_objectivename + '_A';
	if (signLines[i][b].lineText.length >= 1) {
		// Has text and has a command
		if (signLines[i][b].lineCommand == 'TOGGLEACTIVE') {
			scoreboardObjInUse[2] = true;
			if (b == 0) {
				var clickeventCommand = ',\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('scoreboard players add @e[type=' + (mc11 ? 'armor_stand' : 'ArmorStand') + ',name=TogAct,c=1] ' + toggleActiveScore + ' 1') + '\\\\\\"}';
			} else if (b == 1) {
				var clickeventCommand = ',\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('execute @e[score_' + toggleActiveScore + '_min=1,score_' + toggleActiveScore + '=1] ~ ~ ~ blockdata ~ ~ ~ {auto:0}') + '\\\\\\"}';
			} else if (b == 2) {
				var clickeventCommand = ',\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('execute @e[score_' + toggleActiveScore + '_min=2] ~ ~ ~ blockdata ~ ~ ~ {auto:1}') + '\\\\\\"}';
			} else if (b == 3) {
				var clickeventCommand = ',\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('scoreboard players reset @e[score_' + toggleActiveScore + '_min=2] ' + toggleActiveScore) + '\\\\\\"}';
			}
		} else {
			// Regular for having text and a command
			var clickeventCommand = ',\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + signLines[i][b].lineCommand.replace('DESTROYMACHINE', ('fill ~' + coordinates[0] + ' ~' + coordinates[1] + ' ~' + coordinates[2] + ' ~' + coordinates[3] + ' ~' + coordinates[4] + ' ~' + coordinates[5] + ' air')) + '\\\\\\"}';
		}
	} else {
		// Doesn't have any text, but has a command
		if (signLines[i][b].lineCommand == 'TOGGLEACTIVE') {
			scoreboardObjInUse[2] = true;
			if (b == 0) {
				var clickeventCommand = ',Text' + (b + 1) + ':"{\\\\\\"text\\\\\\":\\\\\\"\\\\\\",\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('scoreboard players add @e[type=' + (mc11 ? 'armor_stand' : 'ArmorStand') + ',name=TogAct,c=1] ' + toggleActiveScore + ' 1') + '\\\\\\"}}"';
			} else if (b == 1) {
				var clickeventCommand = ',Text' + (b + 1) + ':"{\\\\\\"text\\\\\\":\\\\\\"\\\\\\",\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('execute @e[score_' + toggleActiveScore + '_min=1,score_' + toggleActiveScore + '=1] ~ ~ ~ blockdata ~ ~ ~ {auto:0}') + '\\\\\\"}}"';
			} else if (b == 2) {
				var clickeventCommand = ',Text' + (b + 1) + ':"{\\\\\\"text\\\\\\":\\\\\\"\\\\\\",\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('execute @e[score_' + toggleActiveScore + '_min=2] ~ ~ ~ blockdata ~ ~ ~ {auto:1}') + '\\\\\\"}}"';
			} else if (b == 3) {
				var clickeventCommand = ',Text' + (b + 1) + ':"{\\\\\\"text\\\\\\":\\\\\\"\\\\\\",\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + ('scoreboard players reset @e[score_' + toggleActiveScore + '_min=2] ' + toggleActiveScore) + '\\\\\\"}}"';
			}
		} else {
			var clickeventCommand = ',Text' + (b + 1) + ':"{\\\\\\"text\\\\\\":\\\\\\"\\\\\\",\\\\\\"clickEvent\\\\\\":{\\\\\\"action\\\\\\":\\\\\\"run_command\\\\\\",\\\\\\"value\\\\\\":\\\\\\"' + signLines[i][b].lineCommand.replace('DESTROYMACHINE', ('fill ~' + coordinates[0] + ' ~' + coordinates[1] + ' ~' + coordinates[2] + ' ~' + coordinates[3] + ' ~' + coordinates[4] + ' ~' + coordinates[5] + ' air')) + '\\\\\\"}}"';
		}
	}
	return clickeventCommand;
}

function getHighestY() {
	var highestVal = -999;
	for (g = 0; g < allCommands.length; g++) {
		if (allCommands[g].posY > highestVal) {
			highestVal = allCommands[g].posY;
		}
	}
	return highestVal;
}

function getLowestY() {
	var lowestVal = 999;
	for (g = 0; g < allCommands.length; g++) {
		if (allCommands[g].posY < lowestVal) {
			lowestVal = allCommands[g].posY;
		}
	}
	return lowestVal;
}

function getHighestX() {
	var highestVal = -999;
	for (g = 0; g < allCommands.length; g++) {
		if (allCommands[g].posX > highestVal) {
			highestVal = allCommands[g].posX;
		}
	}
	return highestVal;
}

function getLowestX() {
	var highestVal = 999;
	for (g = 0; g < allCommands.length; g++) {
		if (allCommands[g].posX < highestVal) {
			highestVal = allCommands[g].posX;
		}
	}
	return highestVal;
}

function getHighestZ() {
	var highestVal = -999;
	for (g = 0; g < allCommands.length; g++) {
		if (allCommands[g].posZ > highestVal) {
			highestVal = allCommands[g].posZ;
		}
	}
	return highestVal;
}

function getLowestZ() {
	var highestVal = 999;
	for (g = 0; g < allCommands.length; g++) {
		if (allCommands[g].posZ < highestVal) {
			highestVal = allCommands[g].posZ;
		}
	}
	return highestVal;
}

function getDelimiter(commandString) {
	return '\n';
}

function splitCommands(commandString) {
	var commandInputArray = commandString.split(getDelimiter(commandString));
	return commandInputArray;
}

function setupPrevCoords() {
	for (i = 0; i < allCommands.length; i++) {
		if (allCommands[i].cmd.indexOf('@prev@') >= 0) {
			allCommands[i].cmd = allCommands[i].cmd.replace(/@prev@/g, ('~' + (allCommands[i-1].posX - allCommands[i].posX) + ' ~' + (allCommands[i-1].posY - allCommands[i].posY) + ' ~' + (allCommands[i-1].posZ - allCommands[i].posZ)));
		}
	}
}

function removeBlankCommands() {
	for (i = 0; i < allCommands.length; i++) {
		if (allCommands[i].cmd.length <= 0) {
			allCommands.splice(i, 1);
		}
	}
}

function fetchCommands() {
	allCommands = [];
	allInitCommands = [];
	inputScoreboard = arg_advanced_objectivename;
	// Take the entire command-string and separate each command by \n (each new line)
	var commandInputArray = input_commands; //splitCommands(input_commands);

	// Give each command its necessary tag if needed (init, if, then)
	floorCraftingCount = 0;
	var floorCraftingReturnArr = [];

	// Multi-line command modifiers
	var multilineContinue = true;
	var multilineIndex = 0;
	var multilineModifiers = '';
	for (i = 0; i < commandInputArray.length; i++) {
		if (commandInputArray[i].substring(0, 2) == '/*') {
			multilineModifiers = commandInputArray[i].substring(2, commandInputArray[i].length);
			commandInputArray.splice(i, 1);
			multilineIndex = i-1;
			while (multilineContinue == true) {
				multilineIndex++;
				if (commandInputArray[multilineIndex] == undefined) {
					multilineContinue = false;
				} else {
					if (!(commandInputArray[multilineIndex].substring(0, 2).indexOf('#') >= 0  || commandInputArray[multilineIndex].length <= 0 || commandInputArray[multilineIndex] == ' ')) {
						if (commandInputArray[multilineIndex] == '*/') {
							multilineContinue = false;
							commandInputArray.splice(multilineIndex, 1);
						} else {
							commandInputArray[multilineIndex] = multilineModifiers + commandInputArray[multilineIndex];
						}
					}
				}
			}
		}
	}

	for (i = 0; i < commandInputArray.length; i++) {
		if (commandInputArray[i].substring(0, 5) == 'INIT:') {
			// Init commands go in a different array!
			allInitCommands[allInitCommands.length] = {cmd: commandInputArray[i].substring(5, commandInputArray[i].length), tag: 'init'};
		} else if (commandInputArray[i].substring(0, 11).indexOf('IF:') >= 0) {
			// IF will be optional, and won't really do anything other than help read through the source commands
			allCommands[allCommands.length] = {cmd: commandInputArray[i].replace('IF:', ''), tag: 'if'};

		} else if (commandInputArray[i].substring(0, 11).indexOf('DO:') >= 0) {
			// DO will simply make the command block conditional (add 8 to the damage value). Since it will work that way, if 1 DO command fails, the rest won't run.
			allCommands[allCommands.length] = {cmd: commandInputArray[i].replace('DO:', ''), tag: 'do'};

		} else if (commandInputArray[i].substring(0, 13).indexOf('COND:') >= 0) {
			// DO will simply make the command block conditional (add 8 to the damage value). Since it will work that way, if 1 DO command fails, the rest won't run.
			allCommands[allCommands.length] = {cmd: commandInputArray[i].replace('COND:', ''), tag: 'do'};

		} else if (commandInputArray[i].indexOf('@prev@') >= 0) {
			// When a command includes '@prev', it will replace '@prev' with the relative coordinates of the previous command block.
			allCommands[allCommands.length] = {cmd: commandInputArray[i], tag: 'prev'};

		} else if (commandInputArray[i].substring(0, 12).indexOf('TAG#') >= 0) {
			// When a command starts with 'TAG#', it will track the number after it.
			allCommands[allCommands.length] = {cmd: commandInputArray[i].substring((commandInputArray[i].indexOf(':') + 1), commandInputArray[i].length), tag: 'tagged', tagid: commandInputArray[i].substring(4, commandInputArray[i].indexOf(':'))};
			
		} else if (commandInputArray[i].substring(0, 2).indexOf('#') >= 0  || commandInputArray[i].length <= 0 || commandInputArray[i] == ' ') {
			// Don't do anything since it is a comment or an empty line
		} else if (commandInputArray[i].substring(0, 15).indexOf('FloorCrafting:') >= 0) {
			// Generate the commands for the floorcrafting
			floorCraftingReturn = generateFloorCrafting(commandInputArray[i]);
			for (r = 0; r < floorCraftingReturn.reg.length; r++) {
				allCommands[allCommands.length] = floorCraftingReturn.reg[r];
			}
			for (r = 0; r < floorCraftingReturn.init.length; r++) {
				allInitCommands[allInitCommands.length] = floorCraftingReturn.init[r];
			}
		} else {
			allCommands[allCommands.length] = {cmd: commandInputArray[i], tag: 'none'};
		}
	}

	// Loop again and find any commands with I: R: or NA: or NT: (impulse command blocks, repeating command blocks, and 'not auto')
	for (i = 0; i < allCommands.length; i++) {
		// No Auto
		if (allCommands[i].cmd.substring(0, 13).indexOf('NA:') >= 0) {
			allCommands[i].auto = false;
			allCommands[i].cmd = allCommands[i].cmd.replace('NA:', '');
		} else {
			allCommands[i].auto = true;
		}
		if (allCommands[i].cmd.substring(0, 13).indexOf('NT:') >= 0) {
			allCommands[i].trackoutput = 'TrackOutput:0,';
			allCommands[i].cmd = allCommands[i].cmd.replace('NT:', '');
		} else {
			allCommands[i].trackoutput = '';
		}
		allCommands[i].inputcmdblock = 'default';
		// Impulse command block
		if (allCommands[i].cmd.substring(0, 13).indexOf('I:') >= 0) {
			allCommands[i].inputcmdblock = 'impulse';
			allCommands[i].cmd = allCommands[i].cmd.replace('I:', '');
		}
		if (allCommands[i].cmd.substring(0, 13).indexOf('R:') >= 0) {
			allCommands[i].inputcmdblock = 'repeating';
			allCommands[i].cmd = allCommands[i].cmd.replace('R:', '');
		}
	}

	allInitCommands.reverse();
	for (i = 0; i < allCommands.length; i++) {
		nbtInSelectors(allCommands[i].cmd);
	}
	if (useHopperClock)
		allCommands.splice(0, 0, {cmd:"HOPPER1Placeholder"}, {cmd:"HOPPER2Placeholder"}, {cmd:"HOPPER3Placeholder"});

}

// floorCraftingScoreboard = makeRandomStr(5) + '_I';
floorCraftingCount = 0;
floorCraftingCurIndex = 1;

function makeRandomStr(strlength) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i=0; i < strlength; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function generateFloorCrafting(floorCraftingCommand) {
	var floorCraft = [];
	floorCraftingCommand = floorCraftingCommand + '  ';

	var startIndex = floorCraftingCurIndex;

	var floorCraftingCommandArr = [];
	var floorCraftingINITArr = [];

	var floorCraftingArguments = [];
	var prevMarker = 0;
	for (f = 0; f < floorCraftingCommand.length - 1; f++) {
		if (checkBrackets(floorCraftingCommand.substring(0, f + 1)) == 0 && floorCraftingCommand.substring(f, f + 1) == ' ') {
			floorCraftingArguments.push(floorCraftingCommand.substring(prevMarker, f));
			prevMarker = f + 1;
		}
	}

	floorCraftingArguments.splice(0, 1);

	// Retrieve the (optional) scoreboard name argument then remove it from the array (Not in use anymore since it is now definable in the options at the top of the page)
	// var inputScoreboard = '';
	// if (floorCraftingArguments.length % 3 !== 0) {
	// 	// If there is 1 or 2 extra arguments at the end
	// 	inputScoreboard = floorCraftingArguments[floorCraftingArguments.length - 1];
	// 	floorCraftingArguments.splice(floorCraftingArguments.length-2, 1);
	// 	floorCraftingCount = 0;
	// }
	// if (inputScoreboard.length <= 0) {
	// 	inputScoreboard = floorCraftingScoreboard;
	// }

	scoreboardObjInUse[0] = true;

	floorCraftingScoreboard = inputScoreboard + '_I';

	// if (floorCraftingCount <= 0) {
	// 	floorCraftingINITArr[floorCraftingINITArr.length] = {cmd: 'scoreboard objectives add ' + floorCraftingScoreboard + ' dummy', tag: 'init'};
	// }
	
	// At this point, the array only consists of the actual arguments
	var isResult = false;
	for (f = 0; f < floorCraftingArguments.length; f += 3) {
		isResult = false;
		if (floorCraftingArguments[f].substring(0, 4) == 'RES:') {
			isResult = true;
		}
		floorCraft.push({
			item: floorCraftingArguments[f].replace('RES:', ''),
			damage: floorCraftingArguments[f+1],
			nbt: floorCraftingArguments[f+2],
			isresult: isResult
		});
	}

	// At this point, the 'floorCraft' array holds objects of each item and it's settings
	var currentDamage = '';
	var currentNBT = '';
	var executeSelector = '';
	var oneIngDoneRad = '';

	for (f = 0; f < floorCraft.length; f++) {
		if (!floorCraft[f].isresult) {
			// Isn't a result item
			currentDamage = '';
			currentNBT = '';
			if (floorCraft[f].damage !== '0')
				currentDamage = ',Damage:' + floorCraft[f].damage + 's';
			if (floorCraft[f].nbt !== '{}')
				currentNBT = ',tag:' + floorCraft[f].nbt;
			floorCraftingCommandArr[floorCraftingCommandArr.length] = {cmd: 'scoreboard players set @e ' + floorCraftingScoreboard + ' ' + floorCraftingCurIndex + ' {Item:{id:minecraft:' + floorCraft[f].item + currentDamage + currentNBT + '},OnGround:1b}', tag: 'none'};
			executeSelector = executeSelector + 'execute @e[score_' + floorCraftingScoreboard + '_min=' + floorCraftingCurIndex + ',score_' + floorCraftingScoreboard + '=' + floorCraftingCurIndex + oneIngDoneRad + '] ~ ~ ~ ';
			oneIngDoneRad = ',r=1';
			floorCraftingCurIndex++;
		}
	}

	for (f = 0; f < floorCraft.length; f++) {
		if (floorCraft[f].isresult) {
			// Is a result item
			currentDamage = '';
			currentNBT = '';
			if (floorCraft[f].damage !== '0')
				currentDamage = ',Damage:' + floorCraft[f].damage;
			if (floorCraft[f].nbt !== '{}')
				currentNBT = ',tag:' + floorCraft[f].nbt;
			floorCraftingCommandArr[floorCraftingCommandArr.length] = {cmd: executeSelector + 'summon ' + (mc11 ? 'item' : 'Item') + ' ~ ~0.5 ~ {Item:{id:minecraft:' + floorCraft[f].item + currentDamage + currentNBT + ',Count:1}}', tag: 'none'};
			floorCraftingCommandArr[floorCraftingCommandArr.length] = {cmd: executeSelector + 'kill @e[type=' + (mc11 ? 'item' : 'Item') + ',r=3,score_' + floorCraftingScoreboard + '_min=' + startIndex + ',score_' + floorCraftingScoreboard + '=' + floorCraftingCurIndex + ']', tag: 'none'};
		}
	}

	floorCraftingCount += 1;

	return {reg: floorCraftingCommandArr, init: floorCraftingINITArr};
}

function formatEscaping() {
	for (i = 0; i < allCommands.length; i++) {
		allCommands[i].cmd = allCommands[i].cmd.replace(/\\/g, '\\\\');
		allCommands[i].cmd = allCommands[i].cmd.replace(/"/g, '\\"');
		allCommands[i].cmd = allCommands[i].cmd.replace(/\\/g, '\\\\');
		allCommands[i].cmd = allCommands[i].cmd.replace(/"/g, '\\"');
	}
	for (i = 0; i < allInitCommands.length; i++) {
		allInitCommands[i].cmd = allInitCommands[i].cmd.replace(/\\/g, '\\\\');
		allInitCommands[i].cmd = allInitCommands[i].cmd.replace(/"/g, '\\"');
	}
}

function calculateBoxEdge(side, maxOrMin) {
	var size = 0;
	predictAmountOfCmds = allCommands.length;
	if (side == 'length') {
		// Get size (no offsets yet)
		size = boxLengthX;
		if (predictAmountOfCmds < size) {
			size = predictAmountOfCmds;
		}

		// Convert size to min and max coordinates
		if (maxOrMin == 'min') {
			return 2;
		} else {
			return 2 + size;
		}
	} else if (side == 'width') {
		// Get size (no offsets yet)
		size = boxLengthZ;
		if (predictAmountOfCmds / boxLengthX < size) {
			size = Math.ceil(predictAmountOfCmds / boxLengthX);
		}

		// Convert size to min and max coordinates
		if (maxOrMin == 'min') {
			if (size % 2 == 0) {
				size -= 1;
			}
			return -Math.floor(size / 2);
		} else {
			return Math.floor(size / 2);
		}
	} else if (side == 'height') {
		// Get size (no offsets yet)
		size = 999;
		if ((predictAmountOfCmds - 1) / boxLengthX < size) {
			size = Math.floor((predictAmountOfCmds - 1) / boxLengthX / boxLengthZ);
		}

		// Convert size to min and max coordinates
		if (maxOrMin == 'min') {
			return -2;
		} else {
			return size - 2;
		}
	}
}

function addDataIfNone(blockId) {
	if (blockId.indexOf(' ') <= -1) {
		return blockId + ' 0';
	} else {
		return blockId;
	}
}

function rotateCaseNegate(axis) {
	if (axis == 'x') {
		caseSides.min[0] *= -1;
		caseSides.max[0] *= -1;
		caseCaps.min[0] *= -1;
		caseCaps.max[0] *= -1;
	} else {
		caseSides.min[2] *= -1;
		caseSides.max[2] *= -1;
		caseCaps.min[2] *= -1;
		caseCaps.max[2] *= -1;
	}
}

function rotateCaseSwap() {
	tempCaseCoords.tempCaseSides = [caseSides.min[0], caseSides.min[1], caseSides.min[2], caseSides.max[0], caseSides.max[1], caseSides.max[2]];
	tempCaseCoords.tempCaseCaps = [caseCaps.min[0], caseCaps.min[1], caseCaps.min[2], caseCaps.max[0], caseCaps.max[1], caseCaps.max[2]];
	// Casesides min swapping
	caseSides.min[0] = tempCaseCoords.tempCaseSides[2];
	caseSides.min[2] = tempCaseCoords.tempCaseSides[0];
	// Casesides max swapping
	caseSides.max[0] = tempCaseCoords.tempCaseSides[5];
	caseSides.max[2] = tempCaseCoords.tempCaseSides[3];

	// Casecaps min swapping
	caseCaps.min[0] = tempCaseCoords.tempCaseCaps[2];
	caseCaps.min[2] = tempCaseCoords.tempCaseCaps[0];
	// Casecaps max swapping
	caseCaps.max[0] = tempCaseCoords.tempCaseCaps[5];
	caseCaps.max[2] = tempCaseCoords.tempCaseCaps[3];
}

// Declare these 3 variables globally
caseSides = {};
caseCaps = {};
tempCaseCoords = {};

function generateCasing(sides, caps, orientation, offsetX, offsetY, offsetZ) {
	if (arg_encase == false) {
		return;
	}
	// First, get the min and max values for the casing
	caseSides = {min:[calculateBoxEdge('length', 'min') + offsetX, calculateBoxEdge('height', 'min') + offsetY, (calculateBoxEdge('width', 'min') - 1 + offsetZ)], max:[(calculateBoxEdge('length', 'max') + 1 + offsetX), calculateBoxEdge('height', 'max') + offsetY, (calculateBoxEdge('width', 'max') + 1 + offsetZ)]};

	caseCaps = {min:[calculateBoxEdge('length', 'min') + offsetX, (calculateBoxEdge('height', 'min') - 1 + offsetY), (calculateBoxEdge('width', 'min') - 1 + offsetZ)], max:[(calculateBoxEdge('length', 'max') + 1 + offsetX), (calculateBoxEdge('height', 'max') + 1 + offsetY), (calculateBoxEdge('width', 'max') + 1 + offsetZ)]};

	// Rotation based on input orientation
	tempCaseCoords = {};
	if (orientation == 2) {
		rotateCaseNegate('x');
		rotateCaseNegate('z');
	} else if (orientation == 3) {
		rotateCaseSwap();
		rotateCaseNegate('x');
	} else if (orientation == 4) {
		rotateCaseSwap();
		rotateCaseNegate('z');
	}

	// Fills in the sides of the box (usually glass)
	allInitCommands[allInitCommands.length] = {cmd: ('fill ~' + caseSides.min[0] + ' ~' + caseSides.min[1] + ' ~' + caseSides.min[2] + ' ~' + caseSides.max[0] + ' ~' + caseSides.max[1] + ' ~' + caseSides.max[2] + ' ' + addDataIfNone(sides) + ' 0 ' + caps.split(' ')[0]), tag: 'init'};

	// Fills in the top and bottom caps of the box (stained clay by default)
	allInitCommands[allInitCommands.length] = {cmd: ('fill ~' + caseCaps.min[0] + ' ~' + caseCaps.min[1] + ' ~' + caseCaps.min[2] + ' ~' + caseCaps.max[0] + ' ~' + caseCaps.max[1] + ' ~' + caseCaps.max[2] + ' ' + addDataIfNone(caps) + ' hollow'), tag: 'init'};

	// .splice(1, 0, 
}

function generateCoordinates(maxLength, maxWidth) {
	// maxLength is the maximum amount of command blocks along the X axis. maxWidth is how far across the Z axis before it goes upwards.
	var condReady = false;
	var condOutOfBounds = false;
	var maxLengthFork = boxLengthX;
	maxWidth -= 1;

	var currentX = 0;
	var currentY = 0;
	var currentZ = 0;

	if (boxLengthX < 4)
		boxLengthX = 4;

	while (!condReady || condOutOfBounds) {
		currentX = 0;
		currentY = 0;
		currentZ = 0;

		maxLengthFork = boxLengthX - 1;

		for (i = 0; i < allCommands.length; i++) {
			if (allCommands[i].tag !== 'init') {
				if ((!useHopperClock && i == 0) || (useHopperClock && i == 3)) {
					// Make the first command be a repeating command block
					allCommands[i].repeating = true;
				}
				if (useHopperClock && i == 0) {
					// The first 2 command blocks should be hoppers instead.
					allCommands[i].tag = 'hopper1';
				}
				if (useHopperClock && i == 1) {
					// The first 2 command blocks should be hoppers instead.
					allCommands[i].tag = 'hopper2';
				}
				if (useHopperClock && i == 2) {
					// The first 2 command blocks should be hoppers instead.
					allCommands[i].tag = 'hopper3';
				}

				allCommands[i].posX = currentX;
				allCommands[i].posY = currentY;
				allCommands[i].posZ = currentZ;

				// Calculate the direction that it should be facing.
				if (currentZ % 2 == 0 && currentY % 2 == 0 || currentZ % 2 !== 0 && currentY % 2 !== 0) {
					// All even Z rows on the even Y heights
					allCommands[i].direction = 'east';
					currentX += 1;
				}
				if (currentZ % 2 == 0 && currentY % 2 !== 0 || currentZ % 2 !== 0 && currentY % 2 == 0) {
					// All even Z rows on the odd Y heights
					allCommands[i].direction = 'west';
					currentX -= 1;
				}

				if (currentX < 0) {
					if (currentY % 2 == 0) {
						allCommands[i].direction = 'south';
						currentZ += 1;
					} else {
						allCommands[i].direction = 'north';
						currentZ -= 1;
					}
					
					currentX = 0;
				}

				if (currentX > maxLengthFork) {
					// When it reaches the max length (X), it should go up on the Z axis.
					if (currentY % 2 == 0) {
						allCommands[i].direction = 'south';
						currentZ += 1;
					} else {
						allCommands[i].direction = 'north';
						currentZ -= 1;
					}

					currentX -= 1;
				}

				if (currentZ > maxWidth) {
					// When it reaches the max width (Z), it should go up on the Y axis.
					allCommands[i].direction = 'up';

					currentY += 1;
					currentZ -= 1;
				}

				if (currentZ < 0) {
					// When it is on an odd Y coordinate, it will go up once the Z value is below 0.
					allCommands[i].direction = 'up';

					currentY += 1;
					currentZ = 0;
				}
			} else {
				// If it's an init command, it doesn't need a direction, but it should have all coordinates set to 0 to prevent errors
				allCommands[i].posX = 0;
				allCommands[i].posY = 0;
				allCommands[i].posZ = 0;
			}
		}

		// // Check if the conditional chains are good
		// for (i = 1; i < allCommands.length; i++) {
		// 	if (allCommands[i-1].tag!='do' && allCommands[i].tag=='do' && allCommands[i-1].tag!=='init' && allCommands[i].direction!=allCommands[i-1].direction) {
		// 		allCommands.splice(i-1, 0, {cmd:'',tag:'none'});
		// 		i++;
		// 	}
		// }
		// condReady = true;
		// for (i = 1; i < allCommands.length; i++) {
		// 	if (allCommands[i-1].tag!=='do' && allCommands[i].tag=='do' && allCommands[i-1].tag!=='init' && allCommands[i].direction!=allCommands[i-1].direction)
		// 		condReady = false;
		// }

		// if (condReady) {
		// 	condOutOfBounds = false;
		// 	for (i = 1; i < allCommands.length; i++) {
		// 		if (allCommands[i-1].tag=='do' && allCommands[i].tag=='do' && allCommands[i-1].direction!=allCommands[i].direction) {
		// 			condOutOfBounds = true;
		// 			boxLengthX++;
		// 		}
		// 	}
		// }

		condReady = true;
		condOutOfBounds = false;

	}
	if (condOutOfBounds) {
		player.printError('That message doesn\'t exists! The box length was automatically increased in order to keep the conditional chain intact.');
	}
}

function dirToDamage(direction, isConditional) {
	var damageDir = 0;
	switch(direction) {
		case 'down':
			damageDir = 0;
			break;
		case 'up':
			damageDir = 1;
			break;
		case 'north':
			damageDir = 2;
			break;
		case 'south':
			damageDir = 3;
			break;
		case 'west':
			damageDir = 4;
			break;
		case 'east':
			damageDir = 5;
			break;
	}

	// To make it a condition cmdblock, it should have 8 added to its damage.
	if (isConditional == true) {
		damageDir += 8;
	}

	return damageDir;
}

function tagConditionals() {
	// Returns 'true' if the command index specified is going to be a conditional block
	for (i = 0; i < allCommands.length; i++) {
		if (allCommands[i].tag == 'do') {
			allCommands[i].isCond = true;
		}
	}
}

function generateBrackets() {
	var bracketString = '';
	for (i = 0; i < allCommands.length + allInitCommands.length; i++) {
		bracketString += '}]';
	}
	return bracketString;
}

function generateOutputCommand() {
	var initCmdString = '';
	var typeString = '';
	tagConditionals();
	var finalInitCmdArray = [];
	var doNormalProcedure = true;
	var autoString = '';

	for (var i = 0; i < allCommands.length; i++) {
		doNormalProcedure = true;
		if (allCommands[i].tag == 'hopper1') {
			// This item is the first hopper, which should hold the item from the start.
			doNormalProcedure = false;
			finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' hopper ' + dirToDamage(fixDirForOrientation("east", parseInt(arg_orientation)), false) + ' replace {Items:[{id:minecraft:stone,Count:1}]}}';

		} else if (allCommands[i].tag == 'hopper2') {
			allCommands[i].direction == 'west';
			// This item is the first hopper, which should hold the item from the start.
			doNormalProcedure = false;
			finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' hopper ' + dirToDamage(fixDirForOrientation("west", parseInt(arg_orientation)), false) + '}';

		} else if (allCommands[i].tag == 'hopper3') {
			allCommands[i].direction == 'east';
			// This item is the first hopper, which should hold the item from the start.
			doNormalProcedure = false;
			finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' unpowered_comparator ' + dirToDamageComparator(fixDirForOrientation("east", parseInt(arg_orientation))) + '}';

		} else {
			if (allCommands[i].repeating == true) {
				if (useHopperClock) {
					// Using a hopper clock instead, so it should be an impulse (regular) command block
					typeString = '';
				} else {
					// Normal, 20hz repeat clock
					typeString = 'repeating_';
				}
			} else {
				typeString = 'chain_';
			}
			if (allCommands[i].inputcmdblock == 'impulse') {
				typeString = '';
			}
			if (allCommands[i].inputcmdblock == 'repeating') {
				typeString = 'repeating_';
			}
		}

		autoString = '';
		if (!useHopperClock) {
			if (allCommands[i].auto == true && allCommands[i].cmd.length > 0)
				autoString = 'auto:1,';
		} else {
			if (i == 3) {
				autoString = '';
			} else {
				autoString = 'auto:1,';
			}
		}

		if (doNormalProcedure) {
			if (allCommands[i].cmd.length > 0) {
				var commandQuoteWrap = '';
				if (allCommands[i].cmd.indexOf('"') > -1) {
					commandQuoteWrap = '"';
				}

				if (useBlockdata) {
					finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:blockdata ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' {' + autoString + allCommands[i].trackoutput + 'Command:' + commandQuoteWrap + allCommands[i].cmd + commandQuoteWrap + '}}';
				} else {
					finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' ' + typeString + 'command_block ' + dirToDamage(allCommands[i].direction, allCommands[i].isCond) + ' 0 {' + autoString + allCommands[i].trackoutput + 'Command:' + commandQuoteWrap + allCommands[i].cmd + commandQuoteWrap + '}}';
				}
				
			} else {
				// Omit the Command:"" part if there is no command specified
				if (useBlockdata) {
					//finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:blockdata ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' ' + typeString + 'command_block ' + dirToDamage(allCommands[i].direction, allCommands[i].isCond) + '}';
					// There doesn't have to be anything here for the blockdata version since the command blocks are already placed using /fill
				} else {
					finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~' + allCommands[i].posX + ' ~' + allCommands[i].posY + ' ~' + allCommands[i].posZ + ' ' + typeString + 'command_block ' + dirToDamage(allCommands[i].direction, allCommands[i].isCond) + '}';
				}
				
			}
		}
	}


	// This section is after the block of code above so that it can be ensured that the /fill commands are executed before the blockdata commands
	if (useBlockdata) {
		// Create /fill commands to place command blocks beforehand

		var lowestCorner = {
			x: 9999,
			y: 9999,
			z: 9999
		};

		var highestCorner = {
			x: -9999,
			y: -9999,
			z: -9999
		};

		for (var i = 0; i < allCommands.length; i++) {

			// Update lowest corner if this one is lower
			if (allCommands[i].posX < lowestCorner.x)
				lowestCorner.x = allCommands[i].posX;
			if (allCommands[i].posY < lowestCorner.y)
				lowestCorner.y = allCommands[i].posY;
			if (allCommands[i].posZ < lowestCorner.z)
				lowestCorner.z = allCommands[i].posZ;

			// Update highest corner if this one is higher
			if (allCommands[i].posX > highestCorner.x)
				highestCorner.x = allCommands[i].posX;
			if (allCommands[i].posY > highestCorner.y)
				highestCorner.y = allCommands[i].posY;
			if (allCommands[i].posZ > highestCorner.z)
				highestCorner.z = allCommands[i].posZ;

		}

		var firstCmdBlockDir = dirToDamage(allCommands[0].direction, false);

		// Command blocks that are 'different':
		for (var i = 0; i < allCommands.length; i++) {

			if (allCommands[i].direction !== allCommands[0].direction || allCommands[i].repeating === true || allCommands[i].inputcmdblock === 'impulse' || allCommands[i].inputcmdblock === 'repeating' || allCommands[i].isCond === true) {

				var typeString = '';

				if (allCommands[i].repeating == true) {
					if (useHopperClock) {
						// Using a hopper clock instead, so it should be an impulse (regular) command block
						typeString = '';
					} else {
						// Normal, 20hz repeat clock
						typeString = 'repeating_';
					}
				} else {
					typeString = 'chain_';
				}
				if (allCommands[i].inputcmdblock == 'impulse') {
					typeString = '';
				}
				if (allCommands[i].inputcmdblock == 'repeating') {
					typeString = 'repeating_';
				}

				if (allCommands[i+1] !== undefined && allCommands[i].direction === allCommands[i+1].direction && allCommands[i].isCond === allCommands[i+1].isCond && allCommands[i].inputcmdblock === allCommands[i+1].inputcmdblock && allCommands[i].repeating === allCommands[i+1].repeating) {
					// The next command block in the array has the same basic type as the current one. Combine into a /fill command

					var checkContinuous = 1;

					while (allCommands[i+checkContinuous] !== undefined && allCommands[i].direction === allCommands[i+checkContinuous].direction && allCommands[i].isCond === allCommands[i+checkContinuous].isCond && allCommands[i].inputcmdblock === allCommands[i+checkContinuous].inputcmdblock && allCommands[i].repeating === allCommands[i+checkContinuous].repeating) {
						checkContinuous++;
					}

					checkContinuous--;

					finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:fill ~'+allCommands[i].posX+' ~'+allCommands[i].posY+' ~'+allCommands[i].posZ+' ~'+allCommands[i+checkContinuous].posX+' ~'+allCommands[i+checkContinuous].posY+' ~'+allCommands[i+checkContinuous].posZ+' ' + typeString + 'command_block ' + dirToDamage(allCommands[i].direction, allCommands[i].isCond) + '}';

					i += checkContinuous; // skip all of the command blocks that were already included in this /fill command

				} else {

					finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~'+allCommands[i].posX+' ~'+allCommands[i].posY+' ~'+allCommands[i].posZ+' ' + typeString + 'command_block ' + dirToDamage(allCommands[i].direction, allCommands[i].isCond) + '}';

				}

			}

		}

		// MIGHT HAVE TO CHANGE THIS TO A .SPLICE() AT THE BEGINNING OF THE ARRAY
		finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:fill ~'+lowestCorner.x+' ~'+lowestCorner.y+' ~'+lowestCorner.z+' ~'+highestCorner.x+' ~'+highestCorner.y+' ~'+highestCorner.z+' chain_command_block ' + firstCmdBlockDir + '}';

	}


	// Generate the initCmdString, which is used in the final command
	for (i = 0; i < allInitCommands.length; i++) {
		if (allInitCommands[i].tag == 'sign' || (allInitCommands[i].cmd.indexOf('"') === -1 && allInitCommands[i].cmd.indexOf("'") === -1)) {
			finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:' + allInitCommands[i].cmd + '}';
		} else {
			finalInitCmdArray[finalInitCmdArray.length] = ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:"' + allInitCommands[i].cmd + '"}';
		}
	}

	// Check conditional chains
	var previousTag = 'none'; // placeholder; default
	var previousY = 0;
	var previousZ = 0;

	for (i = 0; i < allCommands.length; i++) {

		if (allCommands[i].tag == 'do' && (allCommands[i].posY !== previousY || allCommands[i].posZ !== previousZ)) {
			arg_box_length_x = (parseInt(arg_box_length_x) + 2);

			//generateCompactCommand();

			player.printError('The box length is to small to keep the conditional chain intact.');

			return;
		}

		previousTag = allCommands[i].tag;
		previousY = allCommands[i].posY;
		previousZ = allCommands[i].posZ;

	}

	// Had to put every entity into an array then reverse it because of the Passengers tag
	finalInitCmdArray = finalInitCmdArray.reverse();

	outputCommands = [];

	var outputTemplate = 'summon ' + (mc11 ? 'falling_block' : 'FallingSand') + ' ~ ~1 ~ {Block:stone,Time:1,Passengers:[{id:' + (mc11 ? 'falling_block' : 'FallingSand') + ',Block:redstone_block,Time:1,Passengers:[{id:' + (mc11 ? 'falling_block' : 'FallingSand') + ',Block:activator_rail,Time:1,Passengers:[{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:gamerule commandBlockOutput false}&&INITCMDSTRING&&,{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~ ~ ~1 command_block 0 0 {Command:fill ~ ~-3 ~-1 ~ ~ ~ air}},{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:setblock ~ ~-1 ~1 redstone_block},{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:kill @e[type=' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',r=1]}]}]}]}';

	for (i = 0; i < finalInitCmdArray.length; i++) {
		if (initCmdString.length + finalInitCmdArray[i].length + 492 + 89 > 32500) {
			initCmdString += ',{id:' + (mc11 ? 'commandblock_minecart' : 'MinecartCommandBlock') + ',Command:summon ' + (mc11 ? 'falling_block' : 'FallingSand') + ' ~ ~2 ~ {Block:command_block,Time:1}}';
			outputCommands[outputCommands.length] = outputTemplate.replace('&&INITCMDSTRING&&', initCmdString);
			initCmdString = '';
		}

		initCmdString += finalInitCmdArray[i];
	}

	if (initCmdString.length > 0) {
		outputCommands[outputCommands.length] = outputTemplate.replace('&&INITCMDSTRING&&', initCmdString);
	}

	// var outputCommand = '/summon MinecartCommandBlock ~ ~1 ~ {Command:kill @e[type=MinecartCommandBlock,r=1],Riding:{id:MinecartCommandBlock,Command:setblock ~ ~-1 ~1 redstone_block,Riding:{id:MinecartCommandBlock,Command:setblock ~ ~ ~1 command_block 0 replace {Command:fill ~ ~-3 ~-1 ~ ~ ~ air},Riding:{' + initCmdString + 'id:MinecartCommandBlock,Command:gamerule commandBlockOutput false,Riding:{id:MinecartCommandBlock,Riding:{id:FallingSand,Block:activator_rail,Time:1,Riding:{id:FallingSand,Block:redstone_block,Time:1,Riding:{id:FallingSand,Block:stone,Time:1}}}}}}}}' + generateBrackets();

	// var outputCommand = 'summon FallingSand ~ ~1 ~ {Block:stone,Time:1,Passengers:[{id:FallingSand,Block:redstone_block,Time:1,Passengers:[{id:FallingSand,Block:activator_rail,Time:1,Passengers:[{id:MinecartCommandBlock,Command:gamerule commandBlockOutput false}' + initCmdString + ',{id:MinecartCommandBlock,Command:setblock ~ ~ ~1 command_block 0 replace {Command:fill ~ ~-3 ~-1 ~ ~ ~ air}},{id:MinecartCommandBlock,Command:setblock ~ ~-1 ~1 redstone_block},{id:MinecartCommandBlock,Command:kill @e[type=MinecartCommandBlock,r=1]}]}]}]}'; // 492 characters, not counting anything but the pure string

	displayOutputError(false);

	output_commands = new Array();
	
	for (var i = 0; i < outputCommands.length; i++) {
		// outputCommands[i]
		output_commands[i] = outputCommands[i].replace(/~0 /g, '~ ');

		//$('#output-container').append("<textarea cols='50' rows='1' readonly class='output-command' onclick='this.focus();this.select()'></textarea><div class='output-stats'></div>");
		//$('.output-command').last().val(outputCommands[i]).css('display', 'inline-block');
		//$('.output-stats').last().html('Command Length: ' + outputCommands[i].length).slideDown(150);

		if (outputCommands[i].length > 32500) {
			displayOutputError('The character limit for command blocks was lowered to 32,500 in the 1.9 snapshots! This command is ' + (outputCommands[i].length - 32500) + ' characters over that limit!');
		}

		if (checkBrackets(outputCommands[i]) !== 0) {
			if (checkBrackets(outputCommands[i]) > 0) {
				player.printError('There are ' + checkBrackets(outputCommands[i]) + ' too many opening curly brackets in the final command!');
			} else {
				player.printError('There are ' + Math.abs(checkBrackets(outputCommands[i])) + ' too many closing curly brackets in the final command!');
			}
		}
	}
}

function displayOutputError(errorText) {
	if (errorText == false) {
		return;
	}
	player.printError(errorText);
}

function checkBrackets(command) {
	return (command.split('{').length - 1) - (command.split('}').length - 1);
}

function getBoxSize(side) {
	var maxVal = -999;
	var minVal = 999;
	for (i = 0; i < allCommands.length; i++) {
		if (side == 'length') {
			if (allCommands[i].posX > maxVal) {
				maxVal = allCommands[i].posX;
			}
			if (allCommands[i].posX < minVal) {
				minVal = allCommands[i].posX;
			}
		} else if (side == 'width') {
			if (allCommands[i].posZ > maxVal) {
				maxVal = allCommands[i].posZ;
			}
			if (allCommands[i].posZ < minVal) {
				minVal = allCommands[i].posZ;
			}
		}
	}
	return maxVal - minVal;
}

function offsetCoordinates(offsetX, offsetY, offsetZ, orientation) {
	// Simply offsets the coordinates if specified by the user. Just in a separate function to clean things up.
	// Since this function should always run before the generateRotatedCoordinates() function,
	// it should add 2 to the X offset, so it doesn't build the machine inside the starting stack.
	offsetX += 3;
	offsetY -= 2;
	offsetZ = -Math.floor(getBoxSize('width') / 2) + offsetZ;
	for (i = 0; i < allCommands.length; i++) {
		allCommands[i].posX += offsetX;
		allCommands[i].posY += offsetY;
		allCommands[i].posZ += offsetZ;
	}
}

function rotateDirectionCommandBlocks(rotation) {
	// Rotation key:   1 = 90   2 = 180   3 = 270
	var newdir = 0;
	while (rotation > 0) {
		for (i = 0; i < allCommands.length; i++) {
			switch(allCommands[i].direction) {
				case 'north':
					newdir = 'east';
					break;
				case 'east':
					newdir = 'south';
					break;
				case 'south':
					newdir = 'west';
					break;
				case 'west':
					newdir = 'north';
					break;
				default:
					newdir = allCommands[i].direction;
			}
			allCommands[i].direction = newdir;
		}
		rotation -= 1;
	}
}

function rotateDirection(direction, rotation) {
	// Rotation key:   1 = 90   2 = 180   3 = 270
	var newdir = direction;
	while (rotation > 0) {
			switch(newdir) {
				case 'north':
					newdir = 'east';
					break;
				case 'east':
					newdir = 'south';
					break;
				case 'south':
					newdir = 'west';
					break;
				case 'west':
					newdir = 'north';
			}
		rotation -= 1;
	}
	return newdir;
}

function fixDirForOrientation(direction, orientation) {
	// Orientation key (copy of it):   1 = X+   2 = X-   3 = Z+   4 = Z-
	if (orientation == 1)
		return direction;
	if (orientation == 2) 
		return rotateDirection(direction, 2);
	if (orientation == 3)
		return rotateDirection(direction, 1);
	if (orientation == 4)
		return rotateDirection(direction, 3);
}

function dirToDamageComparator(direction) {
	switch(direction) {
		case 'north':
			return 0;
		case 'east':
			return 1;
		case 'south':
			return 2;
		case 'west':
			return 3;
	}
}

function rotateSegSwap() {
	var tempCommandTray = [];
	// First put all commands in temp command tray
	for (i = 0; i < allCommands.length; i++) {
		tempCommandTray[i] = {cmd: allCommands[i].cmd, oldPosX: allCommands[i].posX, oldPosZ: allCommands[i].posZ};
	}
	// Then, swap the x with the y positions
	for (i = 0; i < tempCommandTray.length; i++) {
		allCommands[i].posX = tempCommandTray[i].oldPosZ;
		allCommands[i].posZ = tempCommandTray[i].oldPosX;
	}
}

function rotateSegNegate(axis) {
	if (axis == 'x') {
		for (i = 0; i < allCommands.length; i++) {
			allCommands[i].posX *= -1;
		}
	} else {
		for (i = 0; i < allCommands.length; i++) {
			allCommands[i].posZ *= -1;
		}
	}
}

function generateRotatedCoordinates(orientation) {
	// Orientation key:   1 = X+   2 = X-   3 = Z+   4 = Z-
	// By default, make it oriented towards X+, then swap them and negate if needed

	var tempCommandTray = [];
	if (orientation == 2) {
		rotateSegNegate('x');
		rotateSegNegate('z');
		rotateDirectionCommandBlocks(2);
	} else if (orientation == 3) {
		rotateSegSwap();
		rotateDirectionCommandBlocks(1);
		rotateSegNegate('x');
	} else if (orientation == 4) {
		rotateSegSwap();
		rotateSegNegate('z');
		rotateDirectionCommandBlocks(3);
	}
}

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.jnbt);
importClass(Packages.java.util.HashMap);

var IMPULSE = 137;
var REPEAT = 210;
var CHAIN = 211;

forward = new Array();
forward[0] = new Vector(0, -1, 0);
forward[1] = new Vector(0, 1, 0);
forward[2] = new Vector(0, 0, -1);
forward[3] = new Vector(0, 0, 1);
forward[4] = new Vector(-1, 0, 0);
forward[5] = new Vector(1, 0, 0);
backward = new Array(
	forward[1], forward[0], forward[3], forward[2], forward[5], forward[4]);

var editSession = context.remember();
var region = context.getSession().getSelection(player.getWorld());

var input_commands = new Array();
var i = 0;
var dir = 1;
var pos = region.getPos1();

while (editSession.getBlock(pos).getId() == IMPULSE || editSession.getBlock(pos).getId() == REPEAT || editSession.getBlock(pos).getId() == CHAIN)	//Wpisywanie do tablicy
{
	var commandBlock = editSession.getBlock(pos);
	//var conditional = Math.floor(commandBlock.getData()/8);
	//var variant = commandBlock.getId();
	var nbt = new HashMap(commandBlock.getNbtData().getValue());
	var cmd = nbt.get('Command').getValue();
	
	input_commands[i++] = 'INIT:' + cmd;
	
	dir = forward[commandBlock.getData()%8];
	pos = pos.add(dir);
}

var pos = region.getPos2();

while (editSession.getBlock(pos).getId() == IMPULSE || editSession.getBlock(pos).getId() == REPEAT || editSession.getBlock(pos).getId() == CHAIN)	//Wpisywanie do tablicy
{
	var commandBlock = editSession.getBlock(pos);
	var conditional = Math.floor(commandBlock.getData()/8);
	var variant = commandBlock.getId();
	var nbt = new HashMap(commandBlock.getNbtData().getValue());
	var cmd = nbt.get('Command').getValue() + '';
	
	if (nbt.get('auto').getValue() == 0)
		cmd = 'NA:' + cmd;
	
	if (conditional)
		cmd = 'COND:' + cmd;
	
	if (variant == IMPULSE)
		cmd = 'I:' + cmd;
	
	if (variant == REPEAT)
		cmd = 'R:' + cmd;
	
	input_commands[i++] = cmd;
	
	dir = forward[commandBlock.getData()%8];
	pos = pos.add(dir);
}

if (!nbt) context.checkArgs(1, 0, 'You must select command blocks (pos1 - INIT blocks, pos2 - main contraption)');
var mc11 = (nbt.get("id").getValue() == 'Control') ? false : true;

generateCompactCommand();

if (show_output & 1)
{
	if (arg_orientation == 1) dir = 4;
		else dir = 5;
	
	pos = player.getBlockIn();

	for (i = 0; i<output_commands.length; i++)
	{
		nbt = new HashMap();
		nbt.put("id", new StringTag(mc11 ? "minecraft:command_block" : "Control"));
		nbt.put("Command", new StringTag(output_commands[i]));
		nbt = new CompoundTag(nbt);
		commandBlock = new BaseBlock(IMPULSE, dir, nbt);
		commandBlock.setNbtData(nbt);
		editSession.setBlock(pos, commandBlock);
		
		pos = pos.add(forward[dir]);
	}
}

if (show_output & 2)
{
	player.print(output_commands.join('\n'));
	
	var output_commands_length = new Array();
	for (i = 0; i<output_commands.length; i++)
		output_commands_length[i] = output_commands[i].length;
	
	player.print('Command length: ' + output_commands_length.join(' + '));
}
