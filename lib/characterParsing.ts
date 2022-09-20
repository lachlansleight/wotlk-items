import { CharacterClass, CharacterState, Item, ItemSubclass } from "./types";

const parseGameClass = (gameClass: string): CharacterClass => {
    switch (gameClass) {
        case "WARRIOR":
            return "Warrior";
        case "PALADIN":
            return "Paladin";
        case "HUNTER":
            return "Hunter";
        case "ROGUE":
            return "Rogue";
        case "PRIEST":
            return "Priest";
        case "DEATHKNIGHT":
            return "Death Knight";
        case "SHAMAN":
            return "Shaman";
        case "MAGE":
            return "Mage";
        case "WARLOCK":
            return "Warlock";
        case "DRUID":
            return "Druid";
    }

    return "Unknown";
};

export const parseEightUpgradesCharacter = (input: any, items: Item[]): CharacterState => {
    const output: CharacterState = {
        id:
            input.character.race +
            "_" +
            input.character.gameClass +
            "_" +
            input.character.name +
            "_" +
            input.name,
        class: parseGameClass(input.character.gameClass),
        level: input.character.level,
        name: input.character.name,
        phase: input.phase,
        items: {},
        statWeightings: {},
    };

    input.items.forEach((item: any) => {
        switch (item.slot) {
            case "HEAD":
                output.items.Head = items.find(i => i.id === item.id);
                break;
            case "NECK":
                output.items.Neck = items.find(i => i.id === item.id);
                break;
            case "SHOULDERS":
                output.items.Shoulder = items.find(i => i.id === item.id);
                break;
            case "CHEST":
                output.items.Chest = items.find(i => i.id === item.id);
                break;
            case "WAIST":
                output.items.Waist = items.find(i => i.id === item.id);
                break;
            case "LEGS":
                output.items.Legs = items.find(i => i.id === item.id);
                break;
            case "FEET":
                output.items.Feet = items.find(i => i.id === item.id);
                break;
            case "WRISTS":
                output.items.Wrist = items.find(i => i.id === item.id);
                break;
            case "HANDS":
                output.items.Hands = items.find(i => i.id === item.id);
                break;
            case "FINGER_1":
                output.items.Finger1 = items.find(i => i.id === item.id);
                break;
            case "FINGER_2":
                output.items.Finger2 = items.find(i => i.id === item.id);
                break;
            case "TRINKET_1":
                output.items.Trinket1 = items.find(i => i.id === item.id);
                break;
            case "TRINKET_2":
                output.items.Trinket2 = items.find(i => i.id === item.id);
                break;
            case "BACK":
                output.items.Back = items.find(i => i.id === item.id);
                break;
            case "MAIN_HAND":
                output.items.MainHand = items.find(i => i.id === item.id);
                break;
            case "OFF_HAND":
                output.items.OffHand = items.find(i => i.id === item.id);
                break;
            case "RANGED":
                output.items.Ranged = items.find(i => i.id === item.id);
                break;
        }
    });

    input.points.forEach((points: any) => {
        output.statWeightings[points.name] = {};
        const stats = points.stats;
        if (stats.agility) output.statWeightings[points.name].agility = stats.agility;
        //if(stats.arcaneDamage) output.statWeightings[points.name].arcaneDamage = stats.arcaneDamage;
        if (stats.armor) output.statWeightings[points.name].armor = stats.armor;
        if (stats.attackPower) output.statWeightings[points.name].attackPower = stats.attackPower;
        if (stats.crit) output.statWeightings[points.name].crit = stats.crit;
        if (stats.critRating) output.statWeightings[points.name].crit = stats.critRating;
        if (stats.defense) output.statWeightings[points.name].defense = stats.defense;
        if (stats.dodge) output.statWeightings[points.name].dodge = stats.dodge;
        //if(stats.feralAttackPower) output.statWeightings[points.name].feralAttackPower = stats.feralAttackPower;
        //if(stats.fireDamage) output.statWeightings[points.name].fireDamage = stats.fireDamage;
        //if(stats.frostDamage) output.statWeightings[points.name].frostDamage = stats.frostDamage;
        if (stats.haste) output.statWeightings[points.name].haste = stats.haste;
        if (stats.hasteRating) output.statWeightings[points.name].haste = stats.hasteRating;
        //if(stats.health) output.statWeightings[points.name].health = stats.health;
        if (stats.hit) output.statWeightings[points.name].hit = stats.hit;
        if (stats.hitRating) output.statWeightings[points.name].hit = stats.hitRating;
        //if(stats.holyDamage) output.statWeightings[points.name].holyDamage = stats.holyDamage;
        if (stats.intellect) output.statWeightings[points.name].intellect = stats.intellect;
        if (stats.mainHandSpeed) output.statWeightings[points.name].speed = stats.mainHandSpeed;
        if (stats.dps) output.statWeightings[points.name].dps = stats.dps;
        //if(stats.mana) output.statWeightings[points.name].mana = stats.mana;
        if (stats.mp5) output.statWeightings[points.name].mp5 = stats.mp5;
        //if(stats.natureDamage) output.statWeightings[points.name].natureDamage = stats.natureDamage;
        if (stats.parry) output.statWeightings[points.name].parry = stats.parry;
        if (stats.resilience) output.statWeightings[points.name].resilience = stats.resilience;
        if (stats.resilienceRating)
            output.statWeightings[points.name].resilience = stats.resilienceRating;
        //if(stats.shadowDamage) output.statWeightings[points.name].shadowDamage = stats.shadowDamage;
        if (stats.spellCrit) output.statWeightings[points.name].crit = stats.spellCrit;
        if (stats.spellDamage) output.statWeightings[points.name].spellPower = stats.spellDamage;
        if (stats.spellHaste) output.statWeightings[points.name].haste = stats.spellHaste;
        if (stats.spellHit) output.statWeightings[points.name].hit = stats.spellHit;
        if (stats.spellPen) output.statWeightings[points.name].spellPenetration = stats.spellPen;
        if (stats.spirit) output.statWeightings[points.name].spirit = stats.spirit;
        if (stats.stamina) output.statWeightings[points.name].stamina = stats.stamina;
        if (stats.strength) output.statWeightings[points.name].strength = stats.strength;

        if (stats.metaSockets) output.statWeightings[points.name].metaGem = stats.metaSockets;
        if (stats.redSockets) output.statWeightings[points.name].redGem = stats.redSockets;
        if (stats.yellowSockets) output.statWeightings[points.name].yellowGem = stats.yellowSockets;
        if (stats.blueSockets) output.statWeightings[points.name].blueGem = stats.blueSockets;
        if (stats.prismaticSockets)
            output.statWeightings[points.name].prismaticGem = stats.prismaticSockets;
    });

    return output;
};

export const canUseItem = (
    character: CharacterState,
    item: Item,
    ignoreRequiredLevel = false
): boolean => {
    if (item.classes && !item.classes.includes(character.class)) return false;
    if (!ignoreRequiredLevel && item.lvlReq && item.lvlReq > character.level) return false;
    if (item.class === "Armor") {
        if (item.subclass === "Plate") {
            if (character.level < 40) return false;
            if (
                character.class !== "Warrior" &&
                character.class !== "Paladin" &&
                character.class !== "Death Knight"
            )
                return false;
        } else if (item.subclass === "Mail") {
            if (
                character.level < 40 &&
                (character.class === "Shaman" || character.class === "Hunter")
            )
                return false;
            if (
                character.class === "Rogue" ||
                character.class === "Druid" ||
                character.class === "Mage" ||
                character.class === "Priest" ||
                character.class === "Warlock"
            )
                return false;
        } else if (item.subclass === "Leather") {
            if (
                character.class === "Mage" ||
                character.class === "Priest" ||
                character.class === "Warlock"
            )
                return false;
        } else if (item.subclass === "Shield") {
            if (
                character.class !== "Warrior" &&
                character.class !== "Paladin" &&
                character.class !== "Death Knight"
            )
                return false;
        }
    } else if (item.class === "Weapon") {
        const classProficiencies: { [key: string]: ItemSubclass[] } = {
            "Death Knight": ["Axe", "Sword", "Mace", "Polearm"],
            Druid: ["Mace", "Polearm", "Staff", "Dagger", "Fist Weapon"],
            Hunter: [
                "Axe",
                "Sword",
                "Polearm",
                "Staff",
                "Dagger",
                "Fist Weapon",
                "Bow",
                "Crossbow",
                "Gun",
            ],
            Mage: ["Sword", "Staff", "Dagger", "Wand"],
            Paladin: ["Axe", "Sword", "Mace", "Polearm"],
            Priest: ["Mace", "Staff", "Dagger", "Wand"],
            Rogue: [
                "Axe",
                "Sword",
                "Mace",
                "Dagger",
                "Bow",
                "Fist Weapon",
                "Crossbow",
                "Gun",
                "Thrown",
            ],
            Shaman: ["Axe", "Mace", "Staff", "Dagger", "Fist Weapon"],
            Warlock: ["Sword", "Staff", "Dagger", "Wand"],
            Warrior: [
                "Axe",
                "Sword",
                "Mace",
                "Polearm",
                "Staff",
                "Dagger",
                "Fist Weapon",
                "Bow",
                "Crossbow",
                "Gun",
                "Thrown",
            ],
        };
        if (!classProficiencies[character.class].includes(item.subclass)) return false;
        if (item.slot === "Two-Hand" && item.subclass !== "Staff") {
            if (
                character.class === "Mage" ||
                character.class === "Priest" ||
                character.class === "Rogue" ||
                character.class === "Warlock"
            )
                return false;
        }
    }
    return true;
};

//note - doesn't check whether it's usable or not
export const getItemValue = (character: CharacterState, item: Item): number[] => {
    const values: number[] = [];
    Object.keys(character.statWeightings).forEach(key => {
        let value = 0;
        Object.keys(item.stats).forEach(stat => {
            value +=
                ((character.statWeightings[key] as any)[stat] || 0) * (item.stats as any)[stat];
        });
        if (item.gems) {
            item.gems.forEach(gem => {
                if (gem === "Meta") value += character.statWeightings[key]?.metaGem || 0;
                if (gem === "Red") value += character.statWeightings[key]?.redGem || 0;
                if (gem === "Yellow") value += character.statWeightings[key]?.yellowGem || 0;
                if (gem === "Blue") value += character.statWeightings[key]?.blueGem || 0;
                if (gem === "Prismatic") value += character.statWeightings[key]?.prismaticGem || 0;
            });
        }
        if (isNaN(value)) {
            console.log("NAN!", character, item);
        }
        values.push(value);
    });

    return values;
};

export const getMatchingCharacterItem = (character: CharacterState, item: Item): Item[] => {
    switch (item.slot) {
        case "Main Hand":
            return [character.items.MainHand].filter(i => !!i) as any;
        case "Legs":
            return [character.items.Legs].filter(i => !!i) as any;
        case "Feet":
            return [character.items.Feet].filter(i => !!i) as any;
        case "Chest":
            return [character.items.Chest].filter(i => !!i) as any;
        case "Two-Hand":
            return [character.items.MainHand].filter(i => !!i) as any;
        case "Hands":
            return [character.items.Hands].filter(i => !!i) as any;
        case "One-Hand":
            return [character.items.MainHand, character.items.OffHand].filter(i => !!i) as any;
        case "Trinket":
            return [character.items.Trinket1, character.items.Trinket2].filter(i => !!i) as any;
        case "Wrist":
            return [character.items.Wrist].filter(i => !!i) as any;
        case "Waist":
            return [character.items.Waist].filter(i => !!i) as any;
        case "Finger":
            return [character.items.Finger1, character.items.Finger2].filter(i => !!i) as any;
        case "Off Hand":
            return [character.items.OffHand].filter(i => !!i) as any;
        case "Held In Off-hand":
            return [character.items.OffHand].filter(i => !!i) as any;
        case "Back":
            return [character.items.Back].filter(i => !!i) as any;
        case "Head":
            return [character.items.Head].filter(i => !!i) as any;
        case "Neck":
            return [character.items.Neck].filter(i => !!i) as any;
        case "Shoulder":
            return [character.items.Shoulder].filter(i => !!i) as any;
        case "Ranged":
            return [character.items.Ranged].filter(i => !!i) as any;
        case "Relic":
            return [character.items.Ranged].filter(i => !!i) as any;
        case "Thrown":
            return [character.items.Ranged].filter(i => !!i) as any;
    }
    return [];
};
