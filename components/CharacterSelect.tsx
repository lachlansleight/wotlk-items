import { useState } from "react";
import useCharacterData from "lib/useCharacter";
import { CharacterState } from "lib/types";
import { parseEightUpgradesCharacter } from "lib/characterParsing";
import useWowData from "lib/useWowData";

const CharacterSelect = (): JSX.Element => {
    const { items } = useWowData();
    const { character, setCharacter, characters, setCharacters } = useCharacterData();
    const [newCharacter, setNewCharacter] = useState<CharacterState | null>(null);
    const [importingCharacter, setImportingCharacter] = useState(false);
    const [error, setError] = useState("");

    return (
        <div>
            {importingCharacter ? (
                <div className="flex gap-4 items-center">
                    {newCharacter ? (
                        <p className="bg-neutral-800 text-white px-2 py-1 rounded text-3xl flex-grow">
                            {newCharacter.name}, level {newCharacter.level} {newCharacter.class}
                        </p>
                    ) : (
                        <input
                            value={""}
                            onChange={e => {
                                const json = e.target.value;
                                setError("");
                                const newChar = parseEightUpgradesCharacter(
                                    JSON.parse(json),
                                    items
                                );
                                setNewCharacter(newChar);
                            }}
                            placeholder={error || "Paste 80up JSON export Here"}
                            className="bg-neutral-800 text-white px-2 py-1 rounded text-3xl flex-grow"
                        />
                    )}
                    {newCharacter ? (
                        <>
                            <button
                                onClick={() => {
                                    setCharacters([
                                        ...characters.filter(c => c.id !== newCharacter.id),
                                        newCharacter,
                                    ]);
                                    setNewCharacter(null);
                                    setImportingCharacter(false);
                                }}
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => {
                                    setImportingCharacter(false);
                                    setNewCharacter(null);
                                }}
                            >
                                X
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => {
                                setImportingCharacter(false);
                                setNewCharacter(null);
                            }}
                        >
                            X
                        </button>
                    )}
                </div>
            ) : (
                <select
                    value={character ? character.id : ""}
                    onChange={e => {
                        if (e.target.value === "new") {
                            setImportingCharacter(true);
                        } else {
                            setCharacter(characters.find(c => c.id === e.target.value) || null);
                        }
                    }}
                    className="bg-neutral-800 text-white px-2 py-1 rounded text-3xl w-full"
                >
                    <option value="">Select Character</option>
                    {characters.map((c, i) => {
                        return (
                            <option key={`character-${c.id}-${i}`} value={c.id}>
                                {c.name}, Level {c.level} {c.class}
                            </option>
                        );
                    })}
                    <option value="new">Import Character</option>
                </select>
            )}
        </div>
    );
};

export default CharacterSelect;
