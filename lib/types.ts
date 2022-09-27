export interface Item {
    id: number;
    name: string;
    icon: string;
    bindsOn: "Pickup" | "Equip";
    unique?: "Pickup" | "Equip";
    durability?: number;
    class: ItemClass;
    subclass: ItemSubclass;
    stats: ItemStats;
    specialEffects?: string[];
    classes?: CharacterClass[];
    iLvl: number;
    lvlReq?: number;
    slot: ItemSlot;
    quality: Quality;
    gems?: GemSocket[];
    socketBonus?: ItemStats;
    sellPrice: number;
    contentPhase: number;
}

export interface ItemStats {
    strength?: number;
    agility?: number;
    stamina?: number;
    intellect?: number;
    spirit?: number;
    crit?: number;
    hit?: number;
    haste?: number;
    spellPower?: number;
    spellPenetration?: number;
    mp5?: number;
    attackPower?: number;
    armorPenetration?: number;
    expertise?: number;
    armor?: number;
    defense?: number;
    resilience?: number;
    dodge?: number;
    parry?: number;
    blockRating?: number;
    blockValue?: number;
    arcaneResistance?: number;
    fireResistance?: number;
    natureResistance?: number;
    frostResistance?: number;
    shadowResistance?: number;
    dmgMin?: number;
    dmgMax?: number;
    speed?: number;
    dps?: number;
    rangedSpeed?: number;
    rangedDps?: number;
}

export type GemSocket = "Meta" | "Red" | "Yellow" | "Blue" | "Prismatic";
export type CharacterClass =
    | "Unknown"
    | "Warrior"
    | "Paladin"
    | "Hunter"
    | "Rogue"
    | "Priest"
    | "Death Knight"
    | "Shaman"
    | "Mage"
    | "Warlock"
    | "Druid";
export type ItemSlot =
    | "Unknown"
    | "Main Hand"
    | "Legs"
    | "Feet"
    | "Chest"
    | "Two-Hand"
    | "Hands"
    | "One-Hand"
    | "Trinket"
    | "Wrist"
    | "Waist"
    | "Finger"
    | "Off Hand"
    | "Held In Off-hand"
    | "Back"
    | "Head"
    | "Neck"
    | "Shoulder"
    | "Ranged"
    | "Relic"
    | "Thrown";
export type Quality =
    | "Unknown"
    | "Common"
    | "Poor"
    | "Epic"
    | "Uncommon"
    | "Rare"
    | "Legendary"
    | "Heirloom";
export type ItemClass = "Unknown" | "Weapon" | "Armor";
export type ItemSubclass =
    | "Unknown"
    | "Mace"
    | "Cloth"
    | "Sword"
    | "Axe"
    | "Miscellaneous"
    | "Leather"
    | "Staff"
    | "Mail"
    | "Dagger"
    | "Shield"
    | "Polearm"
    | "Gun"
    | "Bow"
    | "Fist Weapon"
    | "Wand"
    | "Fishing Pole"
    | "Crossbow"
    | "Plate"
    | "Totem"
    | "Idol"
    | "Libram"
    | "Thrown"
    | "Exotic"
    | "Sigil";

export interface CharacterState {
    id: string;
    name: string;
    level: number;
    class: CharacterClass;
    phase: number;
    items: {
        MainHand?: Item;
        Legs?: Item;
        Feet?: Item;
        Chest?: Item;
        Hands?: Item;
        "One-Hand"?: Item;
        Trinket1?: Item;
        Trinket2?: Item;
        Wrist?: Item;
        Waist?: Item;
        Finger1?: Item;
        Finger2?: Item;
        OffHand?: Item;
        Back?: Item;
        Head?: Item;
        Neck?: Item;
        Shoulder?: Item;
        Ranged?: Item;
    };
    statWeightings: {
        [key: string]: ItemStats & {
            metaGem?: number;
            redGem?: number;
            blueGem?: number;
            yellowGem?: number;
            prismaticGem?: number;
        };
    };
}

export interface Instance {
    name: string;
    id: number;
    contentType: InstanceContentType;
    sources: ItemSource[];
}

export type InstanceContentType =
    | "DUNGEON_CONTENT"
    | "RAID40_CONTENT"
    | "RAID20_CONTENT"
    | "RAID10_CONTENT"
    | "RAID25_CONTENT";
export type InstanceDifficulty =
    | "NORMAL_DIFF"
    | "HEROIC_DIFF"
    | "RAID10_DIFF"
    | "RAID10H_DIFF"
    | "RAID25_DIFF"
    | "RAID25H_DIFF";

export interface ItemSource {
    name: string;
    npcId?: number[];
    objectId?: number[];
    fromWotlkDb?: boolean;
    NORMAL_DIFF?: ItemDrop[];
    HEROIC_DIFF?: ItemDrop[];
    RAID10_DIFF?: ItemDrop[];
    RAID10H_DIFF?: ItemDrop[];
    RAID25_DIFF?: ItemDrop[];
    RAID25H_DIFF?: ItemDrop[];
}

export type ReputationLevel =
    | "Hated"
    | "Hostile"
    | "Unfriendly"
    | "Neutral"
    | "Friendly"
    | "Honored"
    | "Revered"
    | "Exalted";
export type ItemDrop = { id: number; droprate: number; reputation?: ReputationLevel };

export interface PopulatedInstance extends Instance {
    xpac: "classic" | "tbc" | "wotlk";
    sources: PopulatedItemSource[];
}

export interface PopulatedItemSource extends ItemSource {
    NORMAL_DIFF?: PopulatedItemDrop[];
    HEROIC_DIFF?: PopulatedItemDrop[];
    RAID10_DIFF?: PopulatedItemDrop[];
    RAID10H_DIFF?: PopulatedItemDrop[];
    RAID25_DIFF?: PopulatedItemDrop[];
    RAID25H_DIFF?: PopulatedItemDrop[];
}

export type PopulatedItemDrop = Item & ItemDrop;
