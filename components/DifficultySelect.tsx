import { useEffect, useMemo } from "react";
import { InstanceDifficulty, PopulatedInstance } from "lib/types";

const difficultySelects: [InstanceDifficulty, string][] = [
    ["NORMAL_DIFF", "N"],
    ["HEROIC_DIFF", "H"],
    ["RAID10_DIFF", "10"],
    ["RAID10H_DIFF", "10 H"],
    ["RAID25_DIFF", "25"],
    ["RAID25H_DIFF", "25 H"],
];

const DifficultySelect = ({
    instance,
    value,
    onChange,
}: {
    instance: PopulatedInstance;
    value: InstanceDifficulty;
    onChange: (val: InstanceDifficulty) => void;
}): JSX.Element => {
    const difficulties = useMemo<InstanceDifficulty[]>(() => {
        const allDiffs: InstanceDifficulty[] = [];
        instance.sources.forEach(source => {
            Object.keys(source).forEach(d => {
                if (d.includes("DIFF") && !allDiffs.includes(d as InstanceDifficulty))
                    allDiffs.push(d as InstanceDifficulty);
            });
        });
        return allDiffs;
    }, [instance]);

    useEffect(() => {
        if (!difficulties || difficulties.length === 0) return;
        onChange(difficulties[0] as InstanceDifficulty);
    }, [difficulties]);

    if (difficulties.length <= 1) return <></>;

    return (
        <div className="flex gap-2">
            {difficultySelects.map(key => {
                return difficulties.includes(key[0]) ? (
                    <button
                        key={`${instance.name}_${key}`}
                        className={`rounded px-2 py ${
                            value === key[0]
                                ? "bg-blue-700 text-white font-bold border"
                                : "bg-neutral-800 text-white"
                        }`}
                        disabled={value === key[0]}
                        onClick={() => onChange(key[0] as InstanceDifficulty)}
                    >
                        {key[1]}
                    </button>
                ) : (
                    <></>
                );
            })}
        </div>
    );
};

export default DifficultySelect;
