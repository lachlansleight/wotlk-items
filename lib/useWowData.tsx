import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { BlobReader, ZipReader, TextWriter } from "@zip.js/zip.js";
import axios from "axios";
import { Item, PopulatedInstance } from "./types";
import { PopulateInstance } from "./populateInstance";

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
            console.log("Loading at " + filePath);
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
                }
            }
            newWowData.instances.classic = newWowData.instances.classic.map(
                (i: PopulatedInstance) => PopulateInstance("classic", i, newWowData.items)
            );
            newWowData.instances.tbc = newWowData.instances.tbc.map((i: PopulatedInstance) =>
                PopulateInstance("tbc", i, newWowData.items)
            );
            newWowData.instances.wotlk = newWowData.instances.wotlk.map((i: PopulatedInstance) =>
                PopulateInstance("wotlk", i, newWowData.items)
            );
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
