/**
WorldEdit command blocks CraftScripts pack
Author: WRIM
www.planetminecraft.com/member/wrim/
http://minecraft.wrim.pl
**/

importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.worldedit);
importPackage(Packages.com.sk89q.jnbt);
importClass(Packages.java.util.HashMap);

var COMMAND_ID = "Command";
var IMPULSE = 137;
var REPEAT = 210;
var CHAIN = 211;
var BUTTON = 77;

forward = new Array();
forward[0] = new Vector(0, -1, 0);
forward[1] = new Vector(0, 1, 0);
forward[2] = new Vector(0, 0, -1);
forward[3] = new Vector(0, 0, 1);
forward[4] = new Vector(-1, 0, 0);
forward[5] = new Vector(1, 0, 0);
backward = new Array(
	forward[1], forward[0], forward[3], forward[2], forward[5], forward[4]);

if (argv.length > 1)
{
	if (argv[1] == 'help') context.checkArgs(0, 0, "[ArmorStand_common_Tag] [Remove_Armor_Stands]\n§r§aDefault:§r command false");
	var title = argv[1];
}
else title = 'command';

var remove = false;
if (argv.length > 2)
{
	context.checkArgs(0, 2, "[ArmorStand_common_Tag] [Remove_Armor_Stands]\n§r§aDefault:§r command false");
	if (argv[2].substring(0,1) == 't') remove = true;
}

var localSession = context.getSession();
var editSession = context.remember();

var button, commandBlock, nbt, cmd, dirB;
var dir = player.getCardinalDirection();
switch (dir.toString()+'')
{
	case "NORTH":
		dir = 2;
		dirB = 3;
		button = 3;
		break;
	case "SOUTH":
		dir = 3;
		dirB = 2;
		button = 4;
		break;
	case "WEST":
		dir = 4;
		dirB = 5;
		button = 1;
		break;
	case "EAST":
		dir = 5;
		dirB = 4;
		button = 2;
		break;
	default:
		context.checkArgs(1, 0, "you must facing one of 4 main directions");
}
var pos = player.getBlockIn().add(0,1,0).add(forward[dir].multiply(3));

function generateTag(pos)
{
	posx = pos.getX() + 32000000;
	posy = pos.getY();
	posz = pos.getZ() + 32000000;
	return 'x' + posx + 'y' + posy + 'z' + posz;
}

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

var num = 0;
if (!remove)	//very important and very simple line
for(var i = localSession.getSelection(player.getWorld()).iterator(); i.hasNext(); )
{
    var pt = i.next();
    var block = editSession.getBlock(pt);
    
    if(block.getType() == IMPULSE || block.getType() == REPEAT || block.getType() == CHAIN)
    {
        nbt = new HashMap(block.getNbtData().getValue());
        
        cmd = nbt.get("Command").getValue();
		cmd = new String(cmd);
		//if (!cmd.isNaN) cmd = '"' + cmd + '"';
		
		var auto = parseInt(nbt.get("auto").getValue());
		
		if (cmd+'' != '')
		{
			nbt = new HashMap();
			nbt.put("id", new StringTag("Control"));
			nbt.put("auto", new ByteTag(1));
			nbt.put("Command", new StringTag('/summon ArmorStand ' + (pt.getX() + 0.5) + ' ' + (pt.getY() + (auto ? 1 : 0.999)) + ' ' + (pt.getZ() + 0.5) +
				' {Tags:["' + generateTag(pt) + '","' + title + '","' + (auto ? title + 'Auto' : title + 'Noauto') + 
				'"],CustomNameVisible:1,Marker:1,Invisible:1,NoGravity:1,CustomName:"' + cmd.replaceAll('\\','\\\\').replaceAll('"','\\"') + '"}'));
			nbt = new CompoundTag(nbt);
			
			commandBlock = new BaseBlock(CHAIN, dirB, nbt);
			commandBlock.setNbtData(nbt);
			editSession.setBlock(pos, new BaseBlock(0));
			editSession.setBlock(pos, commandBlock);
			
			pos = pos.add(forward[dir]);
			num++;
		}
		
		nbt = new HashMap();
		nbt.put("id", new StringTag("Control"));
		nbt.put("auto", new ByteTag(1));
		nbt.put("Command", new StringTag('/kill @e[tag=' + generateTag(pt) + ']'));
		nbt = new CompoundTag(nbt);
		
		commandBlock = new BaseBlock(CHAIN, dirB, nbt);
		commandBlock.setNbtData(nbt);
		editSession.setBlock(pos, new BaseBlock(0));
		editSession.setBlock(pos, commandBlock);
		
		pos = pos.add(forward[dir]);
		num++;
    }	
}

nbt = new HashMap();
nbt.put("id", new StringTag("Control"));
nbt.put("auto", new ByteTag(0));
if (remove)
	nbt.put("Command", new StringTag('/kill @e[tag=' + title + ']'));
else
	nbt.put("Command", new StringTag(''));
nbt = new CompoundTag(nbt);

commandBlock = new BaseBlock(IMPULSE, dirB, nbt);
commandBlock.setNbtData(nbt);
editSession.setBlock(pos, new BaseBlock(0));
editSession.setBlock(pos, commandBlock);

pos = pos.add(forward[dir]);
editSession.setBlock(pos, new BaseBlock(152));
