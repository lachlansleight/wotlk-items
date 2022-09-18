import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Layout from "components/layout/Layout";
import { isEquippable, ParseItem } from "lib/itemParsing";
import { Instance, Item, PopulatedInstance } from "lib/types";
import InstanceC from "components/Instance";
import { PopulateInstance } from "lib/populateInstance";
import { parseEightUpgradesCharacter } from "lib/characterParsing";
import Toggle from "components/Toggle";

const HomePage = (): JSX.Element => {
    const [instances, setInstances] = useState<{
        classic: PopulatedInstance[];
        tbc: PopulatedInstance[];
        wotlk: PopulatedInstance[];
    }>({ classic: [], tbc: [], wotlk: [] });
    const [xpac, setXpac] = useState<"classic" | "tbc" | "wotlk">("classic");
    const [instance, setInstance] = useState<PopulatedInstance | null>(null);
    const [characterRaw, setCharacterRaw] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [hideNonUpgrades, setHideNonUpgrades] = useState(false);
    const [levelRestricted, setLevelRestricted] = useState(true);
    const character = useMemo(() => {
        if (!characterRaw) return null;
        const cha = parseEightUpgradesCharacter(JSON.parse(characterRaw), items);
        //const tempItem = items.find(i => i.id === 34347);
        console.log(cha);
        return cha;
    }, [characterRaw, items]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const res = await axios("/json/data.json");
            const summary: { [key: string]: string[] } = {};
            const items: any[] = [];
            res.data.forEach((d: any) => {
                if (!isEquippable(d)) return;
                const item = ParseItem(d);
                items.push(item);

                Object.keys(d).forEach(key => {
                    if (key === "itemId") return;
                    if (key === "name") return;
                    if (key === "icon") return;
                    if (key === "sellPrice") return;
                    if (key === "tooltip") return;
                    if (key === "itemLink") return;
                    if (key === "vendorPrice") return;
                    if (key === "source") return;
                    if (key === "uniqueName") return;
                    if (key === "createdBy") return;
                    if (key === "requiredLevel") return;
                    if (key === "itemLevel") return;

                    if (!summary[key]) summary[key] = [];
                    if (!summary[key].includes(d[key])) summary[key].push(d[key]);
                });
            });
            //setResults(summary);
            setItems(items);
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const doLoad = async () => {
            const resA = await axios("/json/instances-classic.json");
            const resB = await axios("/json/instances-tbc.json");
            const resC = await axios("/json/instances-wotlk.json");
            setInstances(cur => ({
                ...cur,
                classic: resA.data.map((i: Instance) => PopulateInstance(i, items)),
                tbc: resB.data.map((i: Instance) => PopulateInstance(i, items)),
                wotlk: resC.data.map((i: Instance) => PopulateInstance(i, items)),
            }));
        };

        if (!items || items.length === 0) return;
        doLoad();
    }, [items]);

    return (
        <Layout>
            {loading ? (
                <div className="h-48 grid place-items-center text-4xl">
                    <p>Loading...</p>
                </div>
            ) : (
                <>
                    <div>
                        <div className="flex flex-col gap-4">
                            {character ? (
                                <div className="flex gap-8 items-end">
                                    <h1 className="text-4xl">
                                        {character.name} - Level {character.level} {character.class}
                                    </h1>
                                    <button
                                        className="underline"
                                        onClick={() => setCharacterRaw("")}
                                    >
                                        Clear
                                    </button>
                                </div>
                            ) : (
                                <input
                                    value={characterRaw}
                                    onChange={e => setCharacterRaw(e.target.value)}
                                    placeholder="Paste 80up JSON export Here"
                                    className="bg-neutral-800 text-white px-2 py-1 rounded text-3xl"
                                />
                            )}
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
                                            value={instance ? instance.id : -1}
                                            onChange={e =>
                                                setInstance(
                                                    instances[xpac].find(
                                                        i => i.id === parseInt(e.target.value)
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
                                                        value={i.id}
                                                    >
                                                        {i.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <div className="text-2xl flex flex-col gap-4">
                                    <div className="flex gap-4 justify-end items-center">
                                        <p className="w-48">Only Upgrades</p>
                                        <Toggle
                                            value={hideNonUpgrades}
                                            onChange={setHideNonUpgrades}
                                        />
                                    </div>
                                    <div className="flex gap-4 justify-end items-center">
                                        <p className="w-48">Level Limited</p>
                                        <Toggle
                                            value={levelRestricted}
                                            onChange={setLevelRestricted}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {instance && (
                            <InstanceC
                                instance={instance}
                                character={character || undefined}
                                hideNonUpgrades={hideNonUpgrades}
                                levelRestricted={levelRestricted}
                            />
                        )}
                    </div>
                </>
            )}
        </Layout>
    );
};

export default HomePage;

/*
//Leaving this here so that I don't have to keep looking up the syntax...
import { GetServerSidePropsContext } from "next/types";
export async function getServerSideProps(ctx: GetServerSidePropsContext): Promise<{ props: any }> {
    return {
        props: {  },
    };
}
*/
