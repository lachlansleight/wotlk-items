import { useCallback, useEffect, useState } from "react";
import { InstanceDifficulty, PopulatedInstance } from "lib/types";
import useCharacterData from "lib/useCharacter";
import DifficultySelect from "components/DifficultySelect";
import ItemSourceLayout from "./ItemSource";

const InstanceLayout = ({
    instance,
    hideNonUpgrades = false,
    ignoreRequiredLevel = true,
}: {
    instance: PopulatedInstance;
    hideNonUpgrades?: boolean;
    ignoreRequiredLevel?: boolean;
}): JSX.Element => {
    const { character } = useCharacterData();

    const [diff, setDiff] = useState<InstanceDifficulty>("NORMAL_DIFF");

    const [softresData, setSoftresData] = useState<Record<number, number>>({});
    const [srMax, setSrMax] = useState<Record<string, number>>({});
    const showSecretPopup = useCallback(() => {
        if (Object.keys(softresData).length > 0) {
            setSoftresData({});
            return;
        }
        if (!character) return;
        const newVal = prompt("Enter sneaky secret data");
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
            alert("Nope not that data, you donut.");
        }
    }, [character, softresData]);

    useEffect(() => {
        const savedDiff = localStorage.getItem("selectedDiff");
        console.log(savedDiff);
        if (savedDiff && Object.keys(instance.sources[0]).includes(savedDiff)) {
            setDiff(savedDiff as InstanceDifficulty);
        }
    }, [instance]);
    useEffect(() => {
        localStorage.setItem("selectedDiff", diff);
    }, [diff]);

    return (
        <div className="mb-8">
            <div className="flex gap-4 items-center border-b-2 mb-4 justify-between">
                <div className="flex gap-4 items-center">
                    <h1 className="text-4xl">{instance.name}</h1>
                    <DifficultySelect instance={instance} value={diff} onChange={setDiff} />
                </div>
                <button className="w-2 h-2 bg-blue-500 border rounded" onClick={showSecretPopup} />
            </div>
            {instance.sources.map(source => (
                <ItemSourceLayout
                    key={instance.name + "_" + source.name}
                    source={source}
                    difficulty={diff}
                    softresData={softresData}
                    hideNonUpgrades={hideNonUpgrades}
                    ignoreRequiredLevel={ignoreRequiredLevel}
                    globalMaxSr={Object.keys(srMax).reduce(
                        (acc, cur) => Math.max(acc, srMax[cur]),
                        0
                    )}
                    onSrMax={(name, max) => setSrMax(cur => ({ ...cur, [name]: max }))}
                />
            ))}
        </div>
    );
};

export default InstanceLayout;
