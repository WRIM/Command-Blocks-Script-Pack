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
	context.checkArgs(0, 0, "[down|up|north|south|west|east|DATA|x|y|z|x-|y-|z-|invert]\n§r§aDefault:§r none parameter = continue direction of first block");
}

var invert = false;
var dir;
if (argv.length > 1)
{
	switch (argv[1].substring(0,1) + '')
	{
		case 'd':
		case '0':
			dir = 0;
			break;
		case 'u':
		case '1':
		case 'y':
			dir = 1;
			break;
		case 'n':
		case '2':
			dir = 2;
			break;
		case 's':
		case '3':
		case 'z':
			dir = 3;
			break;
		case 'w':
		case '4':
			dir = 4;
			break;
		case 'e':
		case '5':
		case 'x':
			dir = 5;
			break;
		case 'i':
			invert = true;
			break;
		case 'f':
			break;
		default:
			context.checkArgs(0, 0, "[down|up|north|south|west|east|DATA|x|y|z|x-|y-|z-|invert]\n§r§aDefault:§r none parameter = continue direction of first block");
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

var num = parseInt(argv[1]);

var editSession = context.remember();
var region = context.getSession().getSelection(player.getWorld());

var pos = region.getPos1();
var posList = new Array();
var blockList = new Array();
var i = 0;
var dirV;

while (editSession.getBlock(pos).getId() == IMPULSE || editSession.getBlock(pos).getId() == REPEAT || editSession.getBlock(pos).getId() == CHAIN)	//Wpisywanie do tablicy
{
	var commandBlock = editSession.getBlock(pos);
	posList[i] = pos;
	blockList[i++] = new BaseBlock(commandBlock);
	
	if (dir === undefined) dir = commandBlock.getData()%8;
	if (invert)
	{
		dir = commandBlock.getData()%8;
		if (dir%2 == 0)
			dir++;
		else
			dir--;
		invert = false;
	}
	editSession.setBlock(pos, new BaseBlock(0));
	
	dirV = forward[commandBlock.getData()%8];
	pos = pos.add(dirV);
}

pos = posList[0];
dirV = forward[dir];
for (i=0; i<posList.length; i++)	//Przetwarzanie ciągu
{
	if (dir == 0 && pos.getBlockY() == 0 || dir == 1 && pos.getBlockY() == 255)
	{
		dir = 5;
		dirV = forward[dir];
	}
	editSession.setBlock(pos, new BaseBlock(7));
	dirX = dir + Math.floor(blockList[i].getData()/8) * 8;
	blockList[i].setData(dirX);
	editSession.setBlock(pos, blockList[i]);
	pos = pos.add(dirV);
}
