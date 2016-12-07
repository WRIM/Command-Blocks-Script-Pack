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
	context.checkArgs(0, 0, "§r[mode/color] [line_numbers] [limit]\n§r§aDefault:§r nozebra false 0");
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

var newline = '\n';		//linux or console style
var colors = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
var col = 15;
if (argv.length > 1)
{
	var zebra = true;
	
	start = argv[1].substring(0,1) + '';
	switch (start)
	{
		case 'a':
			col = 10;
			break;
			
		case 'b':
			col = 11;
			break;
			
		case 'c':
			col = 12;
			break;
			
		case 'd':
			col = 13;
			break;
			
		case 'e':
			col = 14;
			break;
			
		case 'f':
			col = 15;
			break;
			
		case 'o':
			zebra = false;
			newline = '\r';		//windows style - for export
			break;
			
		case 'n':
			zebra = false;
			break;

		default:
			col = parseInt(start);
			if (isNaN(col))
			{
				context.checkArgs(0, 0, "Invalid mode or color. Accepted values are: (o)utput, (n)ozebra or hex number 0-f");
			}
	}
}
var limit = 0;
if (argv.length > 3)
{
	limit = parseInt(argv[3]);
	if (isNaN(limit)) limit = 0;
}

var editSession = context.remember();
var region = context.getSession().getSelection(player.getWorld());

var pos = region.getPos1();
var i = 0;
var dir = 1;
var message = '';

while (editSession.getBlock(pos).getId() == IMPULSE || editSession.getBlock(pos).getId() == REPEAT || editSession.getBlock(pos).getId() == CHAIN)
{
	var commandBlock = editSession.getBlock(pos);
	var conditional = Math.floor(commandBlock.getData()/8);
	var nbt = new HashMap(commandBlock.getNbtData().getValue());
	var cmd = nbt.get('Command').getValue();
	
	if (i++ == limit && limit) break;
	
	var count = argv[2] == 'true' ? i + ':' : '' ;
	if (conditional) cmd = '>' + cmd;
	if (i%2==0 && zebra)
		message += '§' + colors[(col + 8)%16] + count + cmd + newline;
	else
		message += (zebra ? '§' + colors[col] : '') + count + cmd + newline;

	dir = forward[commandBlock.getData()%8];
	pos = pos.add(dir);
}

player.printRaw(message);
