import {
    Instance,
    Item,
    ItemDrop,
    ItemSource,
    PopulatedInstance,
    PopulatedItemSource,
} from "./types";

const PopulateItemDrop = (itemDrop: ItemDrop, items: Item[]): (Item & ItemDrop) | null => {
    const item = items.find(i => i.id === itemDrop.id);
    if (item) {
        return { ...item, ...itemDrop };
    }
    return null;
};

const PopulateItemSource = (itemSource: ItemSource, items: Item[]): PopulatedItemSource => {
    const output: PopulatedItemSource = {
        name: itemSource.name,
        objectId: itemSource.objectId,
        npcId: itemSource.npcId,
    };
    if (itemSource.NORMAL_DIFF)
        output.NORMAL_DIFF = itemSource.NORMAL_DIFF.map(i => PopulateItemDrop(i, items)).filter(
            i => !!i
        ) as any;
    if (itemSource.HEROIC_DIFF)
        output.HEROIC_DIFF = itemSource.HEROIC_DIFF.map(i => PopulateItemDrop(i, items)).filter(
            i => !!i
        ) as any;
    if (itemSource.RAID10_DIFF)
        output.RAID10_DIFF = itemSource.RAID10_DIFF.map(i => PopulateItemDrop(i, items)).filter(
            i => !!i
        ) as any;
    if (itemSource.RAID10H_DIFF)
        output.RAID10H_DIFF = itemSource.RAID10H_DIFF.map(i => PopulateItemDrop(i, items)).filter(
            i => !!i
        ) as any;
    if (itemSource.RAID25_DIFF)
        output.RAID25_DIFF = itemSource.RAID25_DIFF.map(i => PopulateItemDrop(i, items)).filter(
            i => !!i
        ) as any;
    if (itemSource.RAID25H_DIFF)
        output.RAID25H_DIFF = itemSource.RAID25H_DIFF.map(i => PopulateItemDrop(i, items)).filter(
            i => !!i
        ) as any;

    return output;
};

export const PopulateInstance = (instance: Instance, items: Item[]): PopulatedInstance => {
    const output: PopulatedInstance = {
        name: instance.name,
        id: instance.id,
        contentType: instance.contentType,
        sources: instance.sources
            .map(s => PopulateItemSource(s, items))
            .filter(s => {
                if (!s) return false;
                return (
                    (s.NORMAL_DIFF?.length || 0) +
                        (s.HEROIC_DIFF?.length || 0) +
                        (s.RAID10H_DIFF?.length || 0) +
                        (s.RAID10_DIFF?.length || 0) +
                        (s.RAID25_DIFF?.length || 0) +
                        (s.RAID25H_DIFF?.length || 0) >
                    0
                );
            }),
    };

    return output;
};
