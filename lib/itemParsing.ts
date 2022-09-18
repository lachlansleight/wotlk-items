import { Item, ItemStats } from "./types";

export const isEquippable = (item: any): boolean => {
    if (!item.class) return false;
    switch (item.class) {
        case "Quest":
            return false;
        case "Miscellaneous":
            return false;
        case "Trade Goods":
            return false;
        case "Consumable":
            return false;
    }
    if (!item.slot) return false;
    switch (item.slot) {
        case "Shirt":
            return false;
        case "Main Hand":
            return true;
        case "Legs":
            return true;
        case "Non-equippable":
            return false;
        case "Feet":
            return true;
        case "Chest":
            return true;
        case "Two-Hand":
            return true;
        case "Hands":
            return true;
        case "One-Hand":
            return true;
        case "Trinket":
            return true;
        case "Wrist":
            return true;
        case "Bag":
            return false;
        case "Waist":
            return true;
        case "Finger":
            return true;
        case "Off Hand":
            return true;
        case "Held In Off-hand":
            return true;
        case "Back":
            return true;
        case "Head":
            return true;
        case "Neck":
            return true;
        case "Shoulder":
            return true;
        case "Ranged":
            return true;
        case "Ammo":
            return false;
        case "Tabard":
            return false;
        case "Relic":
            return true;
        case "Thrown":
            return true;
    }
    return false;
};

export const ParseItem = (item: any): Item => {
    const output: Partial<Item> = {};
    output.id = item.itemId;
    output.name = item.name;
    output.icon = item.icon;
    output.class = item.class;
    output.subclass = item.subclass;
    output.iLvl = item.itemLevel || 0;
    output.sellPrice = item.sellPrice || 0;
    output.quality = item.quality;
    output.lvlReq = item.requiredLevel;
    output.slot = item.slot;
    output.contentPhase = item.contentPhase || 1;

    const stats: ItemStats = {};
    item.tooltip.forEach((tooltip: any, i: number) => {
        if (!tooltip.label) return;
        if (i === 0) return;

        try {
            //metadata
            if (tooltip.label === "Binds when picked up") output.bindsOn = "Pickup";
            else if (tooltip.label === "Binds when equipped") output.bindsOn = "Equip";
            else if (tooltip.label === "Unique-Equipped") output.unique = "Equip";
            else if (tooltip.label === "Unique") output.unique = "Pickup";
            else if (tooltip.label.includes("Durability"))
                output.durability = parseInt(tooltip.label.split("/ ")[1]);
            //socket bonus
            else if (tooltip.label.includes("Socket Bonus")) {
                const statType = tooltip.label
                    .split(": ")[1]
                    .replace("+", "")
                    .split(" ")
                    .slice(1)
                    .join(" ");
                const statValue = parseInt(tooltip.label.split(" ")[2].replace("+", ""));
                switch (statType) {
                    case "Stamina":
                        output.socketBonus = { stamina: statValue };
                        break;
                    case "Intellect":
                        output.socketBonus = { intellect: statValue };
                        break;
                    case "Hit Rating":
                        output.socketBonus = { hit: statValue };
                        break;
                    case "mana every 5 sec.":
                    case "mana per 5 sec.":
                    case "Mana per 5 sec.":
                    case "mana per 5 sec":
                        output.socketBonus = { mp5: statValue };
                        break;
                    case "Attack Power":
                        output.socketBonus = { attackPower: statValue };
                        break;
                    case "Dodge Rating":
                        output.socketBonus = { dodge: statValue };
                        break;
                    case "Defense Rating":
                        output.socketBonus = { defense: statValue };
                        break;
                    case "Parry Rating":
                        output.socketBonus = { parry: statValue };
                        break;
                    case "Agility":
                        output.socketBonus = { agility: statValue };
                        break;
                    case "Strength":
                        output.socketBonus = { strength: statValue };
                        break;
                    case "Critical Strike Rating":
                        output.socketBonus = { crit: statValue };
                        break;
                    case "Spell Power":
                        output.socketBonus = { spellPower: statValue };
                        break;
                    case "Resilience Rating":
                        output.socketBonus = { resilience: statValue };
                        break;
                    case "Spirit":
                        output.socketBonus = { spirit: statValue };
                        break;
                    case "Block Value":
                        output.socketBonus = { blockValue: statValue };
                        break;
                    case "Block Rating":
                        output.socketBonus = { blockRating: statValue };
                        break;
                    case "Expertise Rating":
                        output.socketBonus = { expertise: statValue };
                        break;
                    case "Haste Rating":
                        output.socketBonus = { haste: statValue };
                        break;
                    case "Armor Penetration Rating":
                        output.socketBonus = { armorPenetration: statValue };
                        break;
                    default:
                        console.log("Unknown socket bonus: ", tooltip.label);
                        break;
                }
                (output as any).socketBonusStat = statType;
                return;
            } else if (tooltip.label.includes("Socket")) {
                if (!output.gems) output.gems = [];
                output.gems.push(tooltip.label.split(" ")[0]);
            }

            //primary stats
            if (tooltip.label[0] === "+") {
                if (tooltip.label.includes("Strength"))
                    stats.strength = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Agility"))
                    stats.agility = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Stamina"))
                    stats.stamina = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Intellect"))
                    stats.intellect = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Spirit"))
                    stats.spirit = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
            } else if (tooltip.label.includes("Equip: ")) {
                try {
                    //secondary stats
                    if (tooltip.label.includes("hit rating"))
                        stats.hit = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("critical strike rating"))
                        stats.crit = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("haste rating"))
                        stats.haste = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    //spell stats
                    else if (tooltip.label.includes("spell power"))
                        stats.spellPower = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("spell penetration"))
                        stats.spellPenetration = parseInt(
                            tooltip.label.split("by ")[1].replace(".", "")
                        );
                    else if (tooltip.label.includes("mana per 5 sec"))
                        stats.mp5 = parseInt(
                            tooltip.label.split("Restores ")[1].replace(" mana per 5 sec.", "")
                        );
                    //melee stats
                    else if (tooltip.label.includes("attack power"))
                        stats.attackPower = parseInt(
                            tooltip.label.split("by ")[1].replace(".", "")
                        );
                    else if (tooltip.label.includes("armor penetration"))
                        stats.armorPenetration = parseInt(
                            tooltip.label.split("by ")[1].replace(".", "")
                        );
                    else if (tooltip.label.includes("expertise rating"))
                        stats.expertise = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    //defense stats
                    else if (tooltip.label.includes("defense rating"))
                        stats.defense = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("dodge rating"))
                        stats.dodge = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("parry rating"))
                        stats.parry = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("block rating"))
                        stats.blockRating = parseInt(
                            tooltip.label.split("by ")[1].replace(".", "")
                        );
                    else if (tooltip.label.includes("block value"))
                        stats.blockValue = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else if (tooltip.label.includes("resilience rating"))
                        stats.resilience = parseInt(tooltip.label.split("by ")[1].replace(".", ""));
                    else {
                        if (!output.specialEffects) output.specialEffects = [];
                        output.specialEffects.push(tooltip.label);
                    }
                } catch (e: any) {
                    if (!output.specialEffects) output.specialEffects = [];
                    output.specialEffects.push(tooltip.label);
                }
                return;
            }

            //resistances
            else if (tooltip.label.includes("Resistance")) {
                if (tooltip.label.includes("Arcane"))
                    stats.arcaneResistance = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Fire"))
                    stats.fireResistance = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Frost"))
                    stats.frostResistance = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Nature"))
                    stats.natureResistance = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                else if (tooltip.label.includes("Shadow"))
                    stats.shadowResistance = parseInt(tooltip.label.split(" ")[0].replace("+", ""));
                return;
            } else if (tooltip.label.includes("Armor")) {
                const newArmor = parseInt(tooltip.label.split(" ")[0]);
                if (!isNaN(newArmor)) stats.armor = newArmor;
            } else if (tooltip.label.includes("Speed"))
                stats.speed = parseFloat(tooltip.label.split(" ")[1]);
            else if (tooltip.label.includes("damage per second"))
                stats.dps = parseFloat(tooltip.label.split(" ")[0].replace("(", ""));
            else if (tooltip.label.includes(" Damage")) {
                const pieces = tooltip.label.split(" ");
                stats.dmgMin = parseInt(pieces[0]);
                stats.dmgMax = parseInt(pieces[2]);
            } else if (tooltip.label.includes("Chance on hit:")) {
                if (!output.specialEffects) output.specialEffects = [];
                output.specialEffects.push(tooltip.label);
            } else if (tooltip.label.includes("Use: ")) {
                if (!output.specialEffects) output.specialEffects = [];
                output.specialEffects.push(tooltip.label);
            } else if (tooltip.label.includes("Classes: ")) {
                const pieces = tooltip.label.split(": ")[1].split(", ");
                output.classes = pieces;
            }
        } catch (e: any) {
            console.error("Failed to parse '" + tooltip.label + "'", e);
        }
    });
    output.stats = stats;

    return {
        id: output.id || -1,
        name: output.name || "",
        icon: output.icon || "",
        bindsOn: output.bindsOn || "Equip",
        class: output.class || "Unknown",
        subclass: output.subclass || "Unknown",
        stats: output.stats || {},
        specialEffects: output.specialEffects,
        classes: output.classes,
        iLvl: output.iLvl || 0,
        sellPrice: output.sellPrice || 0,
        lvlReq: output.lvlReq,
        slot: output.slot || "Unknown",
        quality: output.quality || "Unknown",
        gems: output.gems,
        socketBonus: output.socketBonus,
        contentPhase: output.contentPhase || 1,
    };
};
