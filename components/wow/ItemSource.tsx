import { useCallback, useMemo } from "react";
import { canUseItem, getItemValue, getMatchingCharacterItem } from "lib/characterParsing";
import { getColor } from "lib/itemParsing";
import { InstanceDifficulty, Item, PopulatedItemDrop, PopulatedItemSource } from "lib/types";
import useCharacterData from "lib/useCharacter";
import useWowData from "lib/useWowData";
import ItemThumbnail from "./ItemThumbnail";

const ItemSourceLayout = ({
    source,
    difficulty,
    softresData = {},
    ignoreRequiredLevel = false,
    hideNonUpgrades = false,
}: {
    source: PopulatedItemSource;
    difficulty: InstanceDifficulty;
    softresData: Record<number, number>;
    ignoreRequiredLevel?: boolean;
    hideNonUpgrades?: boolean;
}): JSX.Element => {
    const { exchanges, items } = useWowData();
    const { character } = useCharacterData();

    const isUsable = useCallback(
        (item: Item) => {
            if (!character) return true;
            return canUseItem(character, item, ignoreRequiredLevel);
        },
        [character, ignoreRequiredLevel]
    );

    const sourceItems = useMemo(() => {
        return (
            source[difficulty]?.filter(item => {
                if (!character) return true;
                if (!isUsable(item)) return false;
                if (!hideNonUpgrades) return true;
                return true;
            }) || []
        );
    }, [source, difficulty, character, isUsable]);

    const itemExchanges = useMemo<Record<number, Item>>(() => {
        if (!character) return {};
        const output: Record<number, Item> = {};
        sourceItems.forEach(item => {
            if (!exchanges[item.id]) return;

            //get all items that this drop can be exchanged for, that the character can use
            const baseItemValue = isUsable(item) ? getItemValue(character, item) : 0;
            const validExchanges = exchanges[item.id]
                .map(id => items.find(i => i.id === id))
                .filter(i => !!i && isUsable(i) && getItemValue(character, i) > baseItemValue);
            if (validExchanges.length > 0) {
                //get the best one
                const bestExchange = validExchanges.sort(
                    (a, b) =>
                        (b ? getItemValue(character, b)[0] : 0) -
                        (a ? getItemValue(character, a)[0] : 0)
                )[0];
                if (bestExchange) output[item.id] = bestExchange;
            }
        });
        return output;
    }, [sourceItems, character, isUsable, exchanges]);

    const values = useMemo<Record<number, number>>(() => {
        if (!character) return {};
        const output: Record<number, number> = {};
        sourceItems.forEach(item => {
            output[item.id] = getItemValue(character, itemExchanges[item.id] || item)[0];
        });
        return output;
    }, [sourceItems, itemExchanges, character]);

    const valueDiffs = useMemo<Record<number, number>>(() => {
        if (!character) return {};
        const output: Record<number, number> = {};
        sourceItems.forEach(item => {
            const itemValue = values[item.id];
            const currentItems = getMatchingCharacterItem(
                character,
                itemExchanges[item.id] || item
            );
            const worstCurrentItemValue =
                currentItems.length > 0
                    ? currentItems
                          .map(item => getItemValue(character, item)[0])
                          .sort((a, b) => a - b)[0]
                    : 0;
            output[item.id] = itemValue - worstCurrentItemValue;
        });
        return output;
    }, [character, sourceItems, values, exchanges]);

    const filteredItems = useMemo(() => {
        if (!hideNonUpgrades) return sourceItems;
        if (Object.keys(valueDiffs).length === 0) return sourceItems;
        return sourceItems.filter(item => (valueDiffs[item.id] || 0) > 0);
    }, [sourceItems, valueDiffs, hideNonUpgrades]);

    console.log(itemExchanges);

    return (
        <div className="mb-4">
            {source.objectId?.length ? (
                <a
                    href={`https://wowhead.com/wotlk/object=${source.objectId[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xl"
                >
                    {source.name}
                </a>
            ) : source.npcId?.length ? (
                <a
                    href={`https://wowhead.com/wotlk/npc=${source.npcId[0]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xl"
                >
                    {source.name}
                </a>
            ) : (
                <h2 className="text-xl">{source.name}</h2>
            )}
            {source[difficulty] && (
                <div className="grid grid-cols-3 gap-2 border-t border-white border-opacity-20 pt-2">
                    {filteredItems.map((item: PopulatedItemDrop) => {
                        return (
                            <a
                                key={item.id}
                                className="flex gap-2 items-center border rounded border-opacity-10 border-white px-2 py-1"
                                href={`https://wowhead.com/wotlk/item=${
                                    (itemExchanges[item.id] || item).id
                                }`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <ItemThumbnail item={item} subItem={itemExchanges[item.id]} />
                                <p
                                    className={`font-bold flex-grow text-${getColor(
                                        (itemExchanges[item.id] || item).quality
                                    )}`}
                                >
                                    {(itemExchanges[item.id] || item).name}
                                </p>
                                {Object.keys(softresData).length > 0 && (
                                    <div className="flex flex-col items-center font-bold text-cyan-400 w-24">
                                        <p>
                                            {softresData[item.id] || 0} SR
                                            {softresData[item.id] === 1 ? "" : "s"}
                                        </p>
                                        <p>
                                            {Math.round(
                                                (100 * item.droprate * valueDiffs[item.id]) /
                                                    (1 + (softresData[item.id] || 0))
                                            )}
                                        </p>
                                    </div>
                                )}
                                <div className="flex flex-col items-end pl-4">
                                    {item.droprate !== 0 && (
                                        <p className="font-bold text-xl">
                                            {Math.round(item.droprate * 100)}%
                                        </p>
                                    )}
                                    {character && (
                                        <p
                                            className={`text-lg ${
                                                valueDiffs[item.id] > 0
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {valueDiffs[item.id] > 0 ? "+" : ""}
                                            {Math.round(valueDiffs[item.id])}
                                        </p>
                                    )}
                                </div>
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ItemSourceLayout;
