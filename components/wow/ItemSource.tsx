import { useCallback, useEffect, useMemo } from "react";
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
    onSrMax,
    globalMaxSr = 0,
}: {
    source: PopulatedItemSource;
    difficulty: InstanceDifficulty;
    softresData: Record<number, number>;
    ignoreRequiredLevel?: boolean;
    hideNonUpgrades?: boolean;
    onSrMax?: (sourceName: string, value: number) => void;
    globalMaxSr?: number;
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

    //https://gist.github.com/rosszurowski/67f04465c424a9bc0dae
    const lerpColor = (a: string, b: string, amount: number) => {
        amount = Math.max(0, Math.min(1, amount));
        const ah = parseInt(a.replace(/#/g, ""), 16);
        const ar = ah >> 16,
            ag = (ah >> 8) & 0xff,
            ab = ah & 0xff;
        const bh = parseInt(b.replace(/#/g, ""), 16);
        const br = bh >> 16,
            bg = (bh >> 8) & 0xff,
            bb = bh & 0xff;
        const rr = ar + amount * (br - ar);
        const rg = ag + amount * (bg - ag);
        const rb = ab + amount * (bb - ab);
        return "#" + (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1);
    };

    //todo - this somehow needs to go out to the parent instance layout!
    useEffect(() => {
        if (Object.keys(softresData).length === 0) return;
        if (onSrMax)
            onSrMax(
                source.name,
                filteredItems.reduce(
                    (acc, item) =>
                        Math.max(
                            acc,
                            Math.round(
                                (100 * item.droprate * valueDiffs[item.id]) /
                                    (1 + (softresData[item.id] || 0))
                            )
                        ),
                    0
                )
            );
    }, [softresData, valueDiffs, filteredItems, onSrMax]);

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
                                className="flex gap-2 flex-col border rounded border-opacity-10 border-white px-2 py-1"
                                href={`https://wowhead.com/wotlk/item=${
                                    (itemExchanges[item.id] || item).id
                                }`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <div className="flex gap-2 items-center">
                                    <ItemThumbnail item={item} subItem={itemExchanges[item.id]} />
                                    <p
                                        className={`font-bold flex-grow text-${getColor(
                                            (itemExchanges[item.id] || item).quality
                                        )}`}
                                    >
                                        {(itemExchanges[item.id] || item).name}
                                    </p>
                                    <div className="flex flex-col items-end pl-4">
                                        {item.droprate !== 0 && (
                                            <p className="font-bold text-xl">
                                                {item.reputation ||
                                                    `${Math.round(item.droprate * 100)}%`}
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
                                </div>
                                {Object.keys(softresData).length > 0 && (
                                    <div className="flex items-center font-bold text-cyan-400 gap-4">
                                        <div className="relative border border-white rounded border-opacity-20 w-full grid place-items-center">
                                            <p className="relative z-10 flex gap-2">
                                                <span
                                                    style={{
                                                        color: lerpColor(
                                                            "#3df59c",
                                                            "#db3737",
                                                            Math.min(
                                                                1.0,
                                                                (softresData[item.id] || 0) / 5.0
                                                            )
                                                        ),
                                                    }}
                                                >
                                                    {softresData[item.id] || 0} other SR
                                                    {softresData[item.id] === 1 ? ":" : "s:"}
                                                </span>
                                                <span
                                                    style={{
                                                        color: lerpColor(
                                                            "#FFFFFF",
                                                            "#13ed54",
                                                            Math.round(
                                                                (100 *
                                                                    item.droprate *
                                                                    valueDiffs[item.id]) /
                                                                    (1 +
                                                                        (softresData[item.id] || 0))
                                                            ) / globalMaxSr
                                                        ),
                                                    }}
                                                >
                                                    {Math.round(
                                                        (100 *
                                                            Math.round(
                                                                (100 *
                                                                    (item.droprate || 0) *
                                                                    valueDiffs[item.id]) /
                                                                    (1 +
                                                                        (softresData[item.id] || 0))
                                                            )) /
                                                            globalMaxSr
                                                    )}{" "}
                                                    %
                                                </span>
                                            </p>
                                            <div
                                                className="absolute left-0 top-0 h-full bg-neutral-700"
                                                style={{
                                                    width: `${
                                                        (100 *
                                                            Math.round(
                                                                (100 *
                                                                    (item.droprate || 0) *
                                                                    valueDiffs[item.id]) /
                                                                    (1 +
                                                                        (softresData[item.id] || 0))
                                                            )) /
                                                        globalMaxSr
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ItemSourceLayout;
