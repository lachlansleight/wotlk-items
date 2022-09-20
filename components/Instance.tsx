import { useCallback, useEffect, useMemo, useState } from "react";
import { InstanceDifficulty, Item, PopulatedInstance, PopulatedItemDrop, Quality } from "lib/types";
import { canUseItem, getItemValue, getMatchingCharacterItem } from "lib/characterParsing";
import useCharacterData from "lib/useCharacter";
import useWowData from "lib/useWowData";

const InstanceC = ({
    instance,
    hideNonUpgrades = false,
    levelRestricted = true,
}: {
    instance: PopulatedInstance;
    hideNonUpgrades?: boolean;
    levelRestricted?: boolean;
}): JSX.Element => {
    const { character } = useCharacterData();
    const { items, exchanges } = useWowData();
    const difficulties = useMemo(() => {
        const allDiffs: string[] = [];
        instance.sources.forEach(source => {
            Object.keys(source).forEach(d => {
                if (d.includes("DIFF") && !allDiffs.includes(d)) allDiffs.push(d);
            });
        });
        return allDiffs;
    }, [instance]);

    const [diff, setDiff] = useState<InstanceDifficulty>("NORMAL_DIFF");

    useEffect(() => {
        if (!difficulties || difficulties.length === 0) return;
        setDiff(difficulties[0] as InstanceDifficulty);
    }, [difficulties]);

    const metadata = useMemo(() => {
        const output: {
            [key: number]: {
                usable: boolean;
                values: number[];
                valueDiffs: number[];
                bestExchange: Item | null;
            };
        } = {};
        if (!character) return output;

        instance.sources.forEach(source => {
            Object.keys(source).forEach(key => {
                if (!key.includes("_DIFF")) return;
                (source as any)[key].forEach((item: PopulatedItemDrop) => {
                    output[item.id] = {
                        usable: canUseItem(character, item, !levelRestricted),
                        values: [],
                        valueDiffs: [],
                        bestExchange: null,
                    };
                    let itemToEvaluate = item;
                    if (exchanges[item.id]) {
                        //get all items that this drop can be exchanged for, that the character can use
                        const validExchanges = exchanges[item.id]
                            .map(id => items.find(i => i.id === id))
                            .filter(i => !!i && canUseItem(character, i, !levelRestricted));
                        if (validExchanges.length > 0) {
                            //get the best one
                            const bestExchange = validExchanges.reduce((prev, curr) => {
                                if (!prev) return curr;
                                if (!curr) return prev;
                                return getItemValue(character, curr) > getItemValue(character, prev)
                                    ? curr
                                    : prev;
                            });
                            if (bestExchange) {
                                itemToEvaluate = { ...bestExchange, droprate: item.droprate };
                                output[item.id].bestExchange = itemToEvaluate;
                            }
                        }
                    }
                    if (!output[item.id].usable) return;
                    output[item.id].values = getItemValue(character, itemToEvaluate);
                    const matchingItems = getMatchingCharacterItem(character, itemToEvaluate);
                    if (matchingItems.length === 0) {
                        output[item.id].valueDiffs = output[item.id].values;
                    } else {
                        const values = matchingItems.map(i => getItemValue(character, i));
                        const finalValues = values[0];
                        if (finalValues.length > 1) {
                            for (let i = 0; i < finalValues.length; i++) {
                                if (values[1][i] < finalValues[i]) finalValues[i] = values[1][i];
                            }
                        }
                        const diffs = finalValues.map((v, i) => output[item.id].values[i] - v);
                        output[item.id].valueDiffs = diffs;
                    }
                });
            });
        });

        return output;
    }, [instance, character, levelRestricted]);

    const getColor = (quality: Quality): string => {
        switch (quality) {
            case "Poor":
                return "gray-400";
            case "Common":
                return "white";
            case "Uncommon":
                return "green-500";
            case "Rare":
                return "blue-500";
            case "Epic":
                return "purple-500";
            case "Legendary":
                return "orange-500";
            case "Heirloom":
                return "orange-200";
            case "Unknown":
                return "white";
        }
    };

    const difficultySelects = [
        ["NORMAL_DIFF", "N"],
        ["HEROIC_DIFF", "H"],
        ["RAID10_DIFF", "10"],
        ["RAID10H_DIFF", "10 H"],
        ["RAID25_DIFF", "25"],
        ["RAID25H_DIFF", "25 H"],
        ["RAID20_DIFF", "20"],
        ["RAID40_DIFF", "40"],
    ];

    const [softresData, setSoftresData] = useState<{ [key: number]: number } | null>(null);
    const showSecretPopup = useCallback(() => {
        if (!character) return;
        const newVal = prompt("Secret!");
        if (!newVal) return;
        try {
            const lines = newVal?.split("\n");
            const output: { [key: number]: number } = {};
            for (let i = 0; i < lines.length; i++) {
                const pieces = lines[i].split(",");
                if (pieces[1].toLowerCase() === character.name.toLowerCase()) continue;
                const id = parseInt(pieces[0]);
                if (isNaN(id)) continue;
                if (!output[id]) output[id] = 0;
                output[id]++;
            }
            setSoftresData(output);
        } catch {
            //do nothing
            alert("Wrong");
        }
    }, [character]);

    return (
        <div className="mb-8">
            <div className="flex gap-4 items-center border-b-2 mb-4 justify-between">
                <div className="flex gap-4 items-center">
                    <h1 className="text-4xl">{instance.name}</h1>
                    {difficulties.length > 1 && (
                        <div className="flex gap-2">
                            {difficultySelects.map(key => {
                                return difficulties.includes(key[0]) ? (
                                    <button
                                        key={`${instance.name}_${key}`}
                                        className={`rounded px-2 py ${
                                            diff === key[0]
                                                ? "bg-blue-700 text-white font-bold border"
                                                : "bg-neutral-800 text-white"
                                        }`}
                                        disabled={diff === key[0]}
                                        onClick={() => setDiff(key[0] as InstanceDifficulty)}
                                    >
                                        {key[1]}
                                    </button>
                                ) : (
                                    <></>
                                );
                            })}
                        </div>
                    )}
                </div>
                <button className="w-2 h-2 bg-blue-500 border rounded" onClick={showSecretPopup} />
            </div>
            {instance.sources.map(s => {
                return (
                    <div key={instance.name + "_" + s.name} className="mb-4">
                        {s.objectId?.length ? (
                            <a
                                href={`https://wowhead.com/wotlk/object=${s.objectId[0]}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xl"
                            >
                                {s.name}
                            </a>
                        ) : s.npcId?.length ? (
                            <a
                                href={`https://wowhead.com/wotlk/npc=${s.npcId[0]}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xl"
                            >
                                {s.name}
                            </a>
                        ) : (
                            <h2 className="text-xl">{s.name}</h2>
                        )}
                        {s[diff] && (
                            <div className="grid grid-cols-4 gap-2 border-t border-white border-opacity-20 pt-2">
                                {s[diff]
                                    ?.filter((i: PopulatedItemDrop) => {
                                        if (!character) return true;
                                        if (!metadata[i.id]) return false;
                                        if (!metadata[i.id].usable) return false;
                                        if (hideNonUpgrades) {
                                            if (Math.max(...metadata[i.id].valueDiffs) <= 0)
                                                return false;
                                        }
                                        return true;
                                    })
                                    .map((i: PopulatedItemDrop) => {
                                        return (
                                            <a
                                                key={i.id}
                                                className="flex gap-2 items-center border rounded border-opacity-10 border-white px-2"
                                                href={`https://wowhead.com/wotlk/item=${
                                                    metadata &&
                                                    metadata[i.id] &&
                                                    metadata[i.id].bestExchange
                                                        ? metadata[i.id]?.bestExchange?.id || i.id
                                                        : i.id
                                                }`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={`https://wow.zamimg.com/images/wow/icons/medium/${
                                                            metadata &&
                                                            metadata[i.id] &&
                                                            metadata[i.id].bestExchange
                                                                ? metadata[i.id]?.bestExchange
                                                                      ?.icon || i.icon
                                                                : i.icon
                                                        }.jpg`}
                                                        className={`border-2 rounded border-${getColor(
                                                            metadata &&
                                                                metadata[i.id] &&
                                                                metadata[i.id].bestExchange
                                                                ? metadata[i.id]?.bestExchange
                                                                      ?.quality || i.quality
                                                                : i.quality
                                                        )}`}
                                                    />
                                                    {metadata &&
                                                        metadata[i.id] &&
                                                        metadata[i.id].bestExchange && (
                                                            <a
                                                                key={i.id}
                                                                className="flex gap-2 items-center border rounded border-opacity-10 border-white px-2"
                                                                href={`https://wowhead.com/wotlk/item=${i.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                            >
                                                                <img
                                                                    src={`https://wow.zamimg.com/images/wow/icons/medium/${i.icon}.jpg`}
                                                                    className={`border rounded border-${getColor(
                                                                        i.quality
                                                                    )} absolute w-6 h-6 -left-1 -bottom-1`}
                                                                />
                                                            </a>
                                                        )}
                                                </div>
                                                <p
                                                    className={`font-bold flex-grow text-${getColor(
                                                        metadata &&
                                                            metadata[i.id] &&
                                                            metadata[i.id].bestExchange
                                                            ? metadata[i.id].bestExchange
                                                                  ?.quality || i.quality
                                                            : i.quality
                                                    )}`}
                                                >
                                                    {metadata &&
                                                    metadata[i.id] &&
                                                    metadata[i.id].bestExchange
                                                        ? metadata[i.id].bestExchange?.name ||
                                                          i.name
                                                        : i.name}
                                                </p>
                                                {softresData &&
                                                    metadata[i.id] &&
                                                    metadata[i.id].valueDiffs[0] > 0 && (
                                                        <div className="flex flex-col items-center font-bold text-cyan-400 w-24">
                                                            <p>
                                                                {softresData[i.id] || 0} SR
                                                                {softresData[i.id] === 1 ? "" : "s"}
                                                            </p>
                                                            <p>
                                                                {Math.round(
                                                                    (100 *
                                                                        i.droprate *
                                                                        metadata[i.id]
                                                                            .valueDiffs[0]) /
                                                                        (1 +
                                                                            (softresData[i.id] ||
                                                                                0))
                                                                )}
                                                            </p>
                                                        </div>
                                                    )}
                                                <div className="flex flex-col items-end pl-4">
                                                    {i.droprate !== 0 && (
                                                        <p className="font-bold text-xl">
                                                            {Math.round(i.droprate * 100)}%
                                                        </p>
                                                    )}
                                                    {character && (
                                                        <p
                                                            className={`text-lg ${
                                                                metadata[i.id].valueDiffs[0] > 0
                                                                    ? "text-green-500"
                                                                    : "text-red-500"
                                                            }`}
                                                        >
                                                            {metadata[i.id].valueDiffs[0] > 0
                                                                ? "+"
                                                                : ""}
                                                            {Math.round(
                                                                metadata[i.id].valueDiffs[0]
                                                            )}
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
            })}
        </div>
    );
};

export default InstanceC;
