/**
WorldEdit command blocks CraftScripts pack
Author: WRIM
www.planetminecraft.com/member/wrim/
http://minecraft.wrim.pl

"1.10 to 1.11 Entity command converter" argorithm by:
MrGarretto
https://mrgarretto.com
**/

var entityConversions = {
	"FireworksRocketEntity":"fireworks_rocket",
	"ThrownExpBottle":"xp_bottle",
	"VillagerGolem":"villager_golem",
	"ItemFrame":"item_frame",
	"PigZombie":"zombie_pigman",
	"AreaEffectCloud":"area_effect_cloud",
	"EnderCrystal":"ender_crystal",
	"DragonFireball":"dragon_fireball",
	"ThrownEgg":"egg",
	"ThrownEnderpearl":"ender_pearl",
	"MinecartHopper":"hopper_minecart",
	"SmallFireball":"small_fireball",
	"WitherBoss":"wither",
	"FallingSand":"falling_block",
	"WitherSkull":"wither_skull",
	"PolarBear":"polar_bear",
	"ThrownPotion":"potion",
	"MinecartFurnace":"furnace_minecart",
	"SpectralArrow":"spectral_arrow",
	"MinecartTNT":"tnt_minecart",
	"CaveSpider":"cave_spider",
	"Ozelot":"ocelot",
	"LavaSlime":"magma_cube",
	"XPOrb":"xp_orb",
	"MushroomCow":"mooshroom",
	"MinecartCommandBlock":"commandblock_minecart",
	"ArmorStand":"armor_stand",
	"LeashKnot":"leash_knot",
	"EntityHorse":"horse",
	"MinecartSpawner":"spawner_minecart",
	"EyeOfEnderSignal":"eye_of_ender_signal",
	"ShulkerBullet":"shulker_bullet",
	"EnderDragon":"ender_dragon",
	"LightningBolt":"lightning_bolt",
	"PrimedTnt":"tnt",
	"MinecartRideable":"minecart",
	"Item":"item",
	"Arrow":"arrow",
	"Fireball":"fireball",
	"Spider":"spider",
	"Slime":"slime",
	"Pig":"pig",
	"Cow":"cow",
	"Villager":"villager",
	"EntityHorse":"horse",
	"Zombie":"zombie",
	"Skeleton":"skeleton",
	"Guardian":"guardian"
}

var horseConversions = {
	'0': 'horse',
	'1': 'donkey',
	'2': 'mule',
	'3': 'zombie_horse',
	'4': 'skeleton_horse'
}

var zombieConversions = {
	'0': 'zombie',
	'1': 'zombie_villager',
	'2': 'zombie_villager',
	'3': 'zombie_villager',
	'4': 'zombie_villager',
	'5': 'zombie_villager',
	'6': 'husk'
}

var zombieConversionsProfession = {
	'0': '',
	'1': ',Profession:0',
	'2': ',Profession:1',
	'3': ',Profession:2',
	'4': ',Profession:3',
	'5': ',Profession:4',
	'6': ''
}

var skeletonConversions = {
	'0': 'skeleton',
	'1': 'wither_skeleton',
	'2': 'stray'
}

function convert(input) {

	// Horse conversions
	for (var horseType in horseConversions) {
		// Summon commands
		input = input.replace(new RegExp('summon EntityHorse ([0-9.~\\s]+) {(.*)Type:\\s*' + horseType + '(.*)}', 'g'), 'summon ' + horseConversions[horseType] + ' $1 {$2$3}');
		// In a Passengers tag
		input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*EntityHorse[\\\\"]*([^{}]*)Type:\\s*' + horseType + '([^{}]*)}', 'g'), '{$3$2$1id:' + horseConversions[horseType] + '}');
		input = input.replace(new RegExp('{([^{}]*)Type:\\s*[\\\\"]*' + horseType + '[\\\\"]*([^{}]*)id:\\s*EntityHorse([^{}]*)}', 'g'), '{$3$2$1id:' + horseConversions[horseType] + '}');
	}

	// Skeleton conversions
	for (var skeletonType in skeletonConversions) {
		// Summon commands
		input = input.replace(new RegExp('summon Skeleton ([0-9.~\\s]+) {(.*)SkeletonType:\\s*' + skeletonType + '(.*)}', 'g'), 'summon ' + skeletonConversions[skeletonType] + ' $1 {$2$3}');
		// In a Passengers tag
		input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*Skeleton[\\\\"]*([^{}]*)SkeletonType:\\s*' + skeletonType + '([^{}]*)}', 'g'), '{$3$2$1id:' + skeletonConversions[skeletonType] + '}');
		input = input.replace(new RegExp('{([^{}]*)SkeletonType:\\s*' + skeletonType + '([^{}]*)id:\\s*[\\\\"]*Skeleton[\\\\"]*([^{}]*)}', 'g'), '{$3$2$1id:' + skeletonConversions[skeletonType] + '}');
	}

	// Zombie conversions
	for (var zombieType in zombieConversions) {
		// Summon commands
		input = input.replace(new RegExp('summon Zombie ([0-9.~\\s]+) {(.*)ZombieType:\\s*' + zombieType + '(.*)}', 'g'), 'summon ' + zombieConversions[zombieType] + ' $1 {$2$3' + zombieConversionsProfession[zombieType] + '}');
		// In a Passengers tag
		input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*Zombie[\\\\"]*([^{}]*)ZombieType:\\s*' + zombieType + '([^{}]*)}', 'g'), '{$3$2$1id:' + zombieConversions[zombieType] + zombieConversionsProfession[zombieType] + '}');
		input = input.replace(new RegExp('{([^{}]*)ZombieType:\\s*' + zombieType + '([^{}]*)id:\\s*[\\\\"]*Zombie[\\\\"]*([^{}]*)}', 'g'), '{$3$2$1id:' + zombieConversions[zombieType] + zombieConversionsProfession[zombieType] + '}');
	}

	// Elder guardian conversions
	// Summon commands
	input = input.replace(new RegExp('summon Guardian ([0-9.~\\s]+) {(.*)Elder:\\s*1b?(.*)}', 'g'), 'summon elder_guardian $1 {$2$3}');
	// In a Passengers tag
	input = input.replace(new RegExp('{([^{}]*)id:\\s*[\\\\"]*Guardian[\\\\"]*([^{}]*)Elder:\s*1b?([^{}]*)}', 'g'), '{$3$2$1id:elder_guardian}');
	input = input.replace(new RegExp('{([^{}]*)Elder:\s*1b?([^{}]*)id:\\s*[\\\\"]*Guardian[\\\\"]*([^{}]*)}', 'g'), '{$3$2$1id:elder_guardian}');

	// This must run after the code above, since this is for anything "leftover"
	for (var key in entityConversions) {

		// Simple entity ID conversions:

		input = input.replace(new RegExp('summon ' + key, 'g'), 'summon ' + entityConversions[key]);
		input = input.replace(new RegExp('id:[\\\\"]*' + key + '[\\\\"]*', 'g'), 'id:' + entityConversions[key]);
		input = input.replace(new RegExp('type=' + key, 'g'), 'type=' + entityConversions[key]);
		input = input.replace(new RegExp('type=!' + key, 'g'), 'type=!' + entityConversions[key]);
		input = input.replace(new RegExp('stat\\.killEntity\\.' + key, 'g'), 'stat.killEntity.' + entityConversions[key]);
		input = input.replace(new RegExp('stat\\.entityKilledBy\\.' + key, 'g'), 'stat.entityKilledBy.' + entityConversions[key]);

	}
	
	input = input.replace(new RegExp('stat\\.killEntity\\.([a-zA-Z_]+)', 'g'), 'stat.killEntity.minecraft:$1');
	input = input.replace(new RegExp('stat\\.entityKilledBy\\.([a-zA-Z_]+)', 'g'), 'stat.entityKilledBy.minecraft:$1');

	input = input.replace(new RegExp('EntityTag:\\s*{\\s*id:[\\\\"]*([a-zA-Z]+)[\\\\"]*\\s*', 'g'), function(v, m) {return 'EntityTag:{id:minecraft:' + m.toLowerCase()});

	input = updateItemCounts(input);

	input = input.replace(/summon ([a-zA-Z_]+) ([~0-9. ]+) {}/g, 'summon $1 $2');
	input = input.replace(/{,/g, '{');
	input = input.replace(/,}/g, '}');
	input = input.replace(/,,/g, ',');

	return input;

}

function strReplaceAt(string, start, end, insert) {
	return string.substr(0, start) + insert + string.substr(end);
}

function updateItemCounts(text) {

	var targetTags = ['ArmorItems', 'HandItems'];

	var itemLists = [];

	var bracketLevel = -1; // Curly bracket level tracker
	var startTagBracketLevel = -1;
	var strStartPos = 0; // Stores the starting position of the ArmorItems, HandItems, etc.. tags

	for (var i = 0; i < targetTags.length; i++) {

		// Reset for next tag check
		bracketLevel = -1;
		startTagBracketLevel = -1;

		for (var j = 0; j < text.length; j++) {

			// Adjust bracket level on encounter
			if (j + 1 <= text.length && text.substring(j, j + 1) === '{')
				bracketLevel++;
			if (j + 1 <= text.length && text.substring(j, j + 1) === '}')
				bracketLevel--;

			if (j + targetTags[i].length <= text.length && text.substring(j, j + targetTags[i].length) === targetTags[i]) {
				// Found start pos of a tag

				strStartPos = j;

				startTagBracketLevel = bracketLevel;

			}

			if (j + 2 <= text.length && text.substring(j, j + 2) === '}]' && bracketLevel === startTagBracketLevel) {
				// Found end pos of a tag
				// text.substring(strStartPos, j+2) is the current target tag, such as "ArmorItems"

				itemLists[itemLists.length] = text.substring(strStartPos, j+2);

				text = strReplaceAt(text, strStartPos, j+2, '``$$$@' + (itemLists.length - 1) + '@!!!``');

				// Change j back to the startpos since the tag that was just found was replaced with a reference
				j = strStartPos;

				startTagBracketLevel = -10;

			}

		}

	}

	// At this point, itemLists will contain something like ["ArmorItems:[{},{},{},{}]", "HandItems:[{},{}]"]
	// Text will contain 'references' to the elements in the itemLists array, such as ``$$$@3@!!!`` === 3rd index of itemLists

	var curListItems = []; // An array of each separated item in the current list (for the loops below)
	var itemStart = -1;

	for (var i = 0; i < itemLists.length; i++) {

		bracketLevel = -1;
		curListItems = [];

		for (var j = 0; j < itemLists[i].length; j++) {

			// Adjust bracket level on encounter
			if (j + 1 <= itemLists[i].length && itemLists[i].substring(j, j + 1) === '{') {
				bracketLevel++;

				if (bracketLevel === 0) {
					// Entering single item in the list

					itemStart = j;
				}
			}
			if (j + 1 <= itemLists[i].length && itemLists[i].substring(j, j + 1) === '}') {
				bracketLevel--;

				if (bracketLevel === -1) {
					// Leaving single item in the list

					curListItems[curListItems.length] = itemLists[i].substring(itemStart, j + 1);

					// Insert reference
					itemLists[i] = strReplaceAt(itemLists[i], itemStart, j + 1, '&&---%%%' + (curListItems.length - 1) + '%%%---&&');

					j = itemStart;
				}
			}

			// bracketLevel === 0 indicates a single item in the list

		}

		for (var j = 0; j < curListItems.length; j++) {
			// Each item in the curListItems array will be something like '{}' or '{id:diamond_sword}'

			if (curListItems[j].indexOf('Count:') === -1 && curListItems[j] !== '{}') {

				curListItems[j] = curListItems[j].replace('{', '{Count:1,');

			}

			// Reinsert the singular item back into the item list, wherever the reference is

			itemLists[i] = itemLists[i].replace('&&---%%%' + j + '%%%---&&', curListItems[j]);

		}

		// Reinsert the item list back into the entire text string, wherever the reference is

		text = text.replace('``$$$@' + i + '@!!!``', itemLists[i]);

	}

	return text;

}

function convertNested(fullString) {

	var currentInMemory = '';

	while (fullString.indexOf('Passengers:[{') > -1) {

		currentInMemory = fullString.match(/(Passengers:\[{.*\}])/)[0];

		fullString = fullString.replace(/(Passengers:\[{.*\}])/, '_*&*_');

		fullString = convert(fullString);

		fullString = fullString.replace('_*&*_', currentInMemory.replace('Passengers:[{', 'Passengers**:[{'));

	}

	// This runs for the top nested level of passengers
	fullString = convert(fullString);

	fullString = fullString.replace(/Passengers\*\*:\[\{/g, 'Passengers:[{');

	return fullString;

}

importPackage(Packages.com.sk89q.worldedit.blocks);
importPackage(Packages.com.sk89q.jnbt);
importClass(Packages.java.util.HashMap);

context.checkArgs(0, 0, "no parameters needed, just select region");

var COMMAND_ID = "Command";
var IMPULSE = 137;
var REPEAT = 210;
var CHAIN = 211;

var localSession = context.getSession();
//var editSession = localSession.createEditSession(player);
var editSession = context.remember();

for(var i = localSession.getSelection(player.getWorld()).iterator(); i.hasNext(); )
{
    var pt = i.next();
    var block = editSession.getBlock(pt);
    
    if(block.getType() == IMPULSE || block.getType() == REPEAT || block.getType() == CHAIN)
    {
        var nbt = new HashMap(block.getNbtData().getValue());
        
        var cmd = nbt.get("Command").getValue();
		cmd = new String(cmd);
		
		nbt.put("Command", new StringTag(convertNested(cmd)));
        var tag = new CompoundTag(nbt);
        
        block.setNbtData(tag);
        editSession.setBlock(pt, new BaseBlock(7));
        editSession.setBlock(pt, block);
    }
}
