import { useCallback, useState } from "react";
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
                />
            ))}
        </div>
    );
};

export default InstanceLayout;
