import { useEffect, useState } from "react";
import Layout from "components/layout/Layout";
import { PopulatedInstance } from "lib/types";
import InstanceLayout from "components/wow/InstanceLayout";
import Toggle from "components/Toggle";
import useWowData from "lib/useWowData";
import CharacterSelect from "components/CharacterSelect";
import useCharacterData from "lib/useCharacter";

const HomePage = (): JSX.Element => {
    const { hasData, instances } = useWowData();
    const { character } = useCharacterData();
    const [xpac, setXpac] = useState<"classic" | "tbc" | "wotlk">("wotlk");
    const [instance, setInstance] = useState<PopulatedInstance | null>(null);
    const [hideNonUpgrades, setHideNonUpgrades] = useState(false);
    const [ignoreRequiredLevel, setIgnoreRequiredLevel] = useState(false);

    useEffect(() => {
        if (instances.classic.length === 0) return;
        setInstance(instances[xpac][Math.floor(Math.random() * instances[xpac].length)]);
    }, [instances, xpac]);

    return (
        <Layout>
            {!hasData ? (
                <div className="h-48 grid place-items-center text-4xl">
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <div>
                        <div className="flex flex-col gap-4">
                            <CharacterSelect />
                            <div className="grid grid-cols-2 mb-8">
                                <div className="text-2xl flex flex-col gap-4">
                                    <div className="flex gap-4 justify-left items-center">
                                        <p className="w-32">Expansion</p>
                                        <select
                                            value={xpac}
                                            onChange={e => setXpac(e.target.value as any)}
                                            className="bg-neutral-800 text-white px-2 py-1 rounded"
                                        >
                                            <option value="classic">Classic</option>
                                            <option value="tbc">TBC</option>
                                            <option value="wotlk">WotLK</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-4 justify-left items-center">
                                        <p className="w-32">Instance</p>
                                        <select
                                            value={instance ? instance.name : -1}
                                            onChange={e =>
                                                setInstance(
                                                    instances[xpac].find(
                                                        i => i.name === e.target.value
                                                    ) || null
                                                )
                                            }
                                            className="bg-neutral-800 text-white px-2 py-1 rounded"
                                        >
                                            <option value={-1}>Select Instance</option>
                                            {instances[xpac].map((i, j) => {
                                                return (
                                                    <option
                                                        key={`instance-${xpac}-${i.id}-${j}`}
                                                        value={i.name}
                                                    >
                                                        {i.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                {character ? (
                                    <div className="text-2xl flex flex-col gap-4">
                                        <div className="flex gap-4 justify-end items-center">
                                            <p className="w-48">Only Upgrades</p>
                                            <Toggle
                                                value={hideNonUpgrades}
                                                onChange={setHideNonUpgrades}
                                            />
                                        </div>
                                        <div className="flex gap-4 justify-end items-center">
                                            <p className="w-48">Ignore Level Req.</p>
                                            <Toggle
                                                value={ignoreRequiredLevel}
                                                onChange={setIgnoreRequiredLevel}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div />
                                )}
                            </div>
                        </div>
                        {instance && (
                            <InstanceLayout
                                instance={instance}
                                hideNonUpgrades={hideNonUpgrades}
                                ignoreRequiredLevel={ignoreRequiredLevel}
                            />
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
};

export default HomePage;
