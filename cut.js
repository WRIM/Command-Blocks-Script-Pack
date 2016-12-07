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

context.checkArgs(0, 1, "[number]");
if (argv.length > 1 && argv[1] == 'help')
{
	context.checkArgs(0, 0, "[number]\n§r§aDefault:§r 1");
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

if (argv.length > 1) var num = parseInt(argv[1]);
else var num = 1;

var editSession = context.remember();
var region = context.getSession().getSelection(player.getWorld());

var pos = region.getPos1();
var posList = new Array();
var blockList = new Array();
var i = 0;
var dir = 1;

while (editSession.getBlock(pos).getId() == CHAIN)	//Wpisywanie do tablicy
{
	var commandBlock = editSession.getBlock(pos);
	posList[i] = pos;
	blockList[i++] = new BaseBlock(commandBlock);
	
	dir = forward[commandBlock.getData()%8];
	pos = pos.add(dir);
}

for (i=0; i<posList.length; i++)	//Przetwarzanie ciągu
{
	var dir = editSession.getBlock(posList[i]).getData()%8;
	if ((i+num) >= posList.length)	//Końcówka
	{
		editSession.setBlock(posList[i], new BaseBlock(0));
		continue;
	}
	editSession.setBlock(posList[i], new BaseBlock(7));
	dir += Math.floor(editSession.getBlock(posList[i+num]).getData()/8) * 8;
	blockList[i+num].setData(dir);
	editSession.setBlock(posList[i], blockList[i+num]);
}
