import { getColor } from "lib/itemParsing";
import { Item } from "lib/types";

const ItemThumbnail = ({ item, subItem }: { item: Item; subItem?: Item }): JSX.Element => {
    return (
        <div className="relative w-12 h-12">
            <img
                src={`https://wow.zamimg.com/images/wow/icons/medium/${(subItem || item).icon}.jpg`}
                className={`border-2 rounded border-${getColor(
                    (subItem || item).quality
                )} w-full h-full`}
            />
            {subItem && (
                <a
                    key={item.id}
                    className="flex gap-2 items-center border rounded border-opacity-10 border-white px-2"
                    href={`https://wowhead.com/wotlk/item=${item.id}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    <img
                        src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`}
                        className={`border rounded border-${getColor(
                            item.quality
                        )} absolute w-6 h-6 -left-1 -bottom-1`}
                    />
                </a>
            )}
        </div>
    );
};

export default ItemThumbnail;
