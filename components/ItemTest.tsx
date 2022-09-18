import { Item } from "lib/types";

const ItemTest = ({ item }: { item: Item }): JSX.Element => {
    return <pre>{JSON.stringify(item, null, 2)}</pre>;

    return (
        <div className="flex gap-2">
            <p className="w-72">{item.name}</p>
            {Object.keys(item.stats).map((key: string) => {
                return (
                    <div key={key} className="flex flex-col">
                        <p>{key}</p>
                        <p>{(item.stats as any)[key]}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default ItemTest;
