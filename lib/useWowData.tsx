import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BlobReader, ZipReader, TextWriter } from "@zip.js/zip.js";
import axios from "axios";
import { Item, PopulatedInstance } from "./types";
import { PopulateInstance } from "./populateInstance";
import { InstanceMetadata } from "./instanceMetadata";

export type WowData = {
    hasData: boolean;
    items: Item[];
    exchanges: { [key: number]: number[] };
    instances: {
        classic: PopulatedInstance[];
        tbc: PopulatedInstance[];
        wotlk: PopulatedInstance[];
    };
};

const dataContext = createContext<WowData>({
    hasData: false,
    items: [],
    exchanges: {},
    instances: {
        classic: [],
        tbc: [],
        wotlk: [],
    },
});

const WowDataProvider = ({ children, filePath }: { children: ReactNode; filePath: string }) => {
    const [value, setValue] = useState<WowData>({
        hasData: false,
        items: [],
        exchanges: {},
        instances: {
            classic: [],
            tbc: [],
            wotlk: [],
        },
    });

    useEffect(() => {
        const load = async () => {
            const res = await axios(filePath, {
                method: "GET",
                responseType: "arraybuffer",
            });
            const zipFileReader = new BlobReader(new Blob([res.data]));
            const zipReader = new ZipReader(zipFileReader);
            const entries = await zipReader.getEntries();
            const newWowData: WowData = {
                hasData: false,
                items: [],
                exchanges: {},
                instances: {
                    classic: [],
                    tbc: [],
                    wotlk: [],
                },
            };
            let repInstance: PopulatedInstance | null = null;
            for (let i = 0; i < entries.length; i++) {
                const textWriter = new TextWriter();
                const text = await entries[i].getData?.(textWriter);
                if (!text) continue;

                const json = JSON.parse(text);
                switch (entries[i].filename) {
                    case "items.json":
                        newWowData.items = json;
                        break;
                    case "exchanges.json":
                        newWowData.exchanges = json;
                        break;
                    case "instances-classic.json":
                        newWowData.instances.classic = json;
                        break;
                    case "instances-tbc.json":
                        newWowData.instances.tbc = json;
                        break;
                    case "instances-wotlk.json":
                        newWowData.instances.wotlk = json;
                        break;
                    case "reputations-wotlk.json":
                        repInstance = {
                            ...PopulateInstance("wotlk", json, newWowData.items),
                            name: "== All Reputations ==",
                        };
                        break;
                }
            }
            newWowData.instances.classic = newWowData.instances.classic.map(
                (i: PopulatedInstance) => PopulateInstance("classic", i, newWowData.items)
            );
            newWowData.instances.tbc = newWowData.instances.tbc.map((i: PopulatedInstance) =>
                PopulateInstance("tbc", i, newWowData.items)
            );
            newWowData.instances.wotlk = newWowData.instances.wotlk
                .map((i: PopulatedInstance) => PopulateInstance("wotlk", i, newWowData.items))
                .sort((a, b) => {
                    const metadataA = InstanceMetadata.find(im => im.name === a.name);
                    if (!metadataA) return 0;
                    const metadataB = InstanceMetadata.find(im => im.name === b.name);
                    if (!metadataB) return 0;

                    if (metadataA.minLevel === metadataB.minLevel) {
                        return metadataA.maxLevel - metadataB.maxLevel;
                    } else return metadataA.minLevel - metadataB.minLevel;
                });
            const allPhaseOneInstances: PopulatedInstance = {
                id: 100000,
                contentType: "DUNGEON_CONTENT",
                name: "== All Phase 1 Dungeons ==",
                xpac: "wotlk",
                sources: [],
            };
            const catchupInstances: PopulatedInstance = {
                id: 100001,
                contentType: "DUNGEON_CONTENT",
                name: "== All Catchup Dungeons ==",
                xpac: "wotlk",
                sources: [],
            };

            newWowData.instances.wotlk
                .filter(i => i.contentType === "DUNGEON_CONTENT")
                .forEach(i => {
                    switch (i.name) {
                        case "Ahn'Kahet: The Old Kingdom":
                        case "Azjol-Nerub":
                        case "Drak'Tharon Keep":
                        case "Gundrak":
                        case "Halls of Lightning":
                        case "Halls of Stone":
                        case "The Culling of Stratholme":
                        case "The Nexus":
                        case "The Oculus":
                        case "Violet Hold":
                        case "Utgarde Keep":
                        case "Utgarde Pinnacle":
                            allPhaseOneInstances.sources = [
                                ...allPhaseOneInstances.sources,
                                ...i.sources.map(s => ({
                                    ...s,
                                    name: i.name + " - " + s.name,
                                })),
                            ];
                            break;
                        case "Trial of the Champion":
                        case "Forge of Souls":
                        case "Pit of Saron":
                        case "Halls of Reflection":
                            catchupInstances.sources = [
                                ...catchupInstances.sources,
                                ...i.sources.map(s => ({
                                    ...s,
                                    name: i.name + " - " + s.name,
                                })),
                            ];
                            break;
                        case "Naxxramas":
                        case "The Eye of Eternity":
                        case "Obsidian Sanctum":
                        case "Ulduar":
                        case "Trial of the Crusader":
                        case "Onyxia's Lair":
                        case "Icecrown Citadel":
                        case "Ruby Sanctum":
                        case "Vault of Archavon":
                            break;
                    }
                });

            if (repInstance) {
                newWowData.instances.wotlk = [
                    allPhaseOneInstances,
                    catchupInstances,
                    repInstance,
                    ...newWowData.instances.wotlk,
                ];
            } else {
                newWowData.instances.wotlk = [
                    allPhaseOneInstances,
                    catchupInstances,
                    ...newWowData.instances.wotlk,
                ];
            }

            newWowData.hasData = true;
            setValue(newWowData);
        };
        load();
    }, [filePath]);

    return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
};

const useWowData = () => {
    const context = useContext(dataContext);
    return context;
};

//The only consumer of this export is the parent component that provides the context to its children
//(usually _app.tsx)
export { WowDataProvider };

//This is consumed by any component wishing to use the context
export default useWowData;
