import { useEffect, useMemo, useState } from "react";
import {
    CharacterState,
    InstanceDifficulty,
    PopulatedInstance,
    PopulatedItemDrop,
    Quality,
} from "lib/types";
import { canUseItem, getItemValue, getMatchingCharacterItem } from "lib/characterParsing";

const InstanceC = ({
    instance,
    character,
    hideNonUpgrades = false,
    levelRestricted = true,
}: {
    instance: PopulatedInstance;
    character?: CharacterState;
    hideNonUpgrades?: boolean;
    levelRestricted?: boolean;
}): JSX.Element => {
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
            [key: number]: { usable: boolean; values: number[]; valueDiffs: number[] };
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
                    };
                    if (!output[item.id].usable) return;
                    output[item.id].values = getItemValue(character, item);
                    const matchingItems = getMatchingCharacterItem(character, item);
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

    return (
        <div className="mb-8">
            <div className="flex gap-4 items-center border-b-2 mb-4">
                <h1 className="text-4xl">{instance.name}</h1>
                {difficulties.length > 1 && (
                    <div className="flex gap-2">
                        {difficulties.includes("NORMAL_DIFF") && (
                            <button
                                className={`rounded px-2 py ${
                                    diff === "NORMAL_DIFF"
                                        ? "bg-neutral-600 text-neutral-400 border"
                                        : "bg-neutral-800 text-white"
                                }`}
                                disabled={diff === "NORMAL_DIFF"}
                                onClick={() => setDiff("NORMAL_DIFF")}
                            >
                                N
                            </button>
                        )}
                        {difficulties.includes("HEROIC_DIFF") && (
                            <button
                                className={`rounded px-2 py ${
                                    diff === "HEROIC_DIFF"
                                        ? "bg-neutral-600 text-neutral-400 border"
                                        : "bg-neutral-800 text-white"
                                }`}
                                disabled={diff === "HEROIC_DIFF"}
                                onClick={() => setDiff("HEROIC_DIFF")}
                            >
                                H
                            </button>
                        )}
                        {difficulties.includes("RAID10_DIFF") && (
                            <button
                                className={`rounded px-2 py ${
                                    diff === "RAID10_DIFF"
                                        ? "bg-neutral-600 text-neutral-400 border"
                                        : "bg-neutral-800 text-white"
                                }`}
                                disabled={diff === "RAID10_DIFF"}
                                onClick={() => setDiff("RAID10_DIFF")}
                            >
                                10 N
                            </button>
                        )}
                        {difficulties.includes("RAID10H_DIFF") && (
                            <button
                                className={`rounded px-2 py ${
                                    diff === "RAID10H_DIFF"
                                        ? "bg-neutral-600 text-neutral-400 border"
                                        : "bg-neutral-800 text-white"
                                }`}
                                disabled={diff === "RAID10H_DIFF"}
                                onClick={() => setDiff("RAID10H_DIFF")}
                            >
                                10 H
                            </button>
                        )}
                        {difficulties.includes("RAID25_DIFF") && (
                            <button
                                className={`rounded px-2 py ${
                                    diff === "RAID25_DIFF"
                                        ? "bg-neutral-600 text-neutral-400 border"
                                        : "bg-neutral-800 text-white"
                                }`}
                                disabled={diff === "RAID25_DIFF"}
                                onClick={() => setDiff("RAID25_DIFF")}
                            >
                                25 N
                            </button>
                        )}
                        {difficulties.includes("RAID25H_DIFF") && (
                            <button
                                className={`rounded px-2 py ${
                                    diff === "RAID25H_DIFF"
                                        ? "bg-neutral-600 text-neutral-400 border"
                                        : "bg-neutral-800 text-white"
                                }`}
                                disabled={diff === "RAID25H_DIFF"}
                                onClick={() => setDiff("RAID25H_DIFF")}
                            >
                                25 H
                            </button>
                        )}
                    </div>
                )}
            </div>
            {instance.sources.map(s => {
                return (
                    <div key={instance.name + "_" + s.name} className="mb-4">
                        {s.objectId?.length ? (
                            <a
                                href={`https://classic.wowhead.com/object=${s.objectId[0]}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xl"
                            >
                                {s.name}
                            </a>
                        ) : s.npcId?.length ? (
                            <a
                                href={`https://classic.wowhead.com/npc=${s.npcId[0]}`}
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
                                                href={`https://wowhead.com/wotlk/item=${i.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <img
                                                    src={`https://wow.zamimg.com/images/wow/icons/medium/${i.icon}.jpg`}
                                                    className={`border-2 rounded border-${getColor(
                                                        i.quality
                                                    )}`}
                                                />
                                                <p
                                                    className={`font-bold flex-grow text-${getColor(
                                                        i.quality
                                                    )}`}
                                                >
                                                    {i.name}
                                                </p>
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
