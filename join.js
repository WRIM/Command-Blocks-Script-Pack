/**
WorldEdit command blocks CraftScripts pack
Author: WRIM
www.planetminecraft.com/member/wrim/
http://minecraft.wrim.pl
**/

importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.jnbt);
importClass(Packages.java.util.HashMap);

if (argv.length > 1 && argv[1] == 'help')
{
	context.checkArgs(0, 0, "[clone] [direction]\nAvailable directions: [down|up|north|south|west|east|DATA|x|y|z|x-|y-|z-|forward]\n§r§aDefault:§r false forward");
}

var clonemode = false;
if (argv.length > 1 && argv[1].substring(0,1) == 't')
{
	clonemode = true;
}

var finaldir = -1;
if (argv.length > 2)
{
	switch (argv[2].substring(0,1) + '')
	{
		case 'd':
		case '0':
			finaldir = 0;
			break;
		case 'u':
		case '1':
		case 'y':
			finaldir = 1;
			break;
		case 'n':
		case '2':
			finaldir = 2;
			break;
		case 's':
		case '3':
		case 'z':
			finaldir = 3;
			break;
		case 'w':
		case '4':
			finaldir = 4;
			break;
		case 'e':
		case '5':
		case 'x':
			finaldir = 5;
			break;
		case 'f':
			break;
		default:
			context.checkArgs(0, 0, "[down|up|north|south|west|east|DATA|x|y|z|x-|y-|z-|forward]");
	}
	if (argv[1] == 'x-' || argv[1] == 'y-' || argv[1] == 'z-') dir--;
}

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

var pos1 = region.getPos1();
var pos2 = region.getPos2();
var i = 0;
var dir = -1;
var message = '';

while (editSession.getBlock(pos2).getId() == IMPULSE || editSession.getBlock(pos2).getId() == REPEAT || editSession.getBlock(pos2).getId() == CHAIN)	//pos2 chain test
{
	var commandBlock = editSession.getBlock(pos2);
	dir = commandBlock.getData()%8;
	pos2 = pos2.add(forward[dir]);
}
if (dir == -1) context.checkArgs(1, 0, "pos2 must be command block");

dir = -1;
while (editSession.getBlock(pos1).getId() == IMPULSE || editSession.getBlock(pos1).getId() == REPEAT || editSession.getBlock(pos1).getId() == CHAIN)	//pos1 chain test
{
	var commandBlock = editSession.getBlock(pos1);
	dir = commandBlock.getData()%8;
	pos1 = pos1.add(forward[dir]);
}

if (finaldir == -1) finaldir = dir;

if (dir == -1) context.checkArgs(1, 0, "pos1 must be command block");
if (pos1.equals(pos2)) context.checkArgs(1, 0, "pos1 and pos2 can't belong to the same chain");

dir = -1;
var pos2 = region.getPos2();
while (editSession.getBlock(pos2).getId() == IMPULSE || editSession.getBlock(pos2).getId() == REPEAT || editSession.getBlock(pos2).getId() == CHAIN)	//big mess
{
	var commandBlock = editSession.getBlock(pos2);
	var conditional = Math.floor(commandBlock.getData()/8);
	var nbt = new HashMap(commandBlock.getNbtData().getValue());
	
	if (!clonemode)
	{
		editSession.setBlock(pos2, new BaseBlock(0));
	}
	dir = commandBlock.getData()%8;
	pos2 = pos2.add(forward[dir]);

	var dirX = finaldir + Math.floor(commandBlock.getData()/8) * 8;
	commandBlock.setData(dirX);
	editSession.setBlock(pos1, commandBlock);
	pos1 = pos1.add(forward[finaldir]);
}
