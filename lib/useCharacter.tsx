import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { CharacterState } from "./types";

export type CharacterData = {
    character: CharacterState | null;
    setCharacter: (character: CharacterState | null) => void;
    characters: CharacterState[];
    setCharacters: (characters: CharacterState[]) => void;
};

const characterContext = createContext<CharacterData>({
    character: null,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setCharacter: () => {},
    characters: [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setCharacters: () => {},
});

const CharacterDataProvider = ({ children }: { children: ReactNode }) => {
    const [character, setCharacter] = useState<CharacterState | null>(null);
    const [characters, setCharacters] = useState<CharacterState[]>([]);

    useEffect(() => {
        setCharacters(JSON.parse(localStorage.getItem("characters") || "[]"));
    }, []);

    const setCharactersNew = (characters: CharacterState[]) => {
        setCharacters(characters);
        localStorage.setItem("characters", JSON.stringify(characters));
    };

    useEffect(() => {
        if (!characters || characters.length === 0) return;
        const existingCharacter = localStorage.getItem("character");
        if (!existingCharacter) return;
        setCharacter(characters.find(c => c.name === JSON.parse(existingCharacter).name) || null);
    }, [characters]);

    const setCharacterNew = (character: CharacterState | null) => {
        setCharacter(character);
        localStorage.setItem("character", JSON.stringify(character));
    };

    return (
        <characterContext.Provider
            value={{
                character,
                setCharacter: setCharacterNew,
                characters,
                setCharacters: setCharactersNew,
            }}
        >
            {children}
        </characterContext.Provider>
    );
};

const useCharacterData = () => {
    const context = useContext(characterContext);
    return context;
};

export { CharacterDataProvider };

export default useCharacterData;
