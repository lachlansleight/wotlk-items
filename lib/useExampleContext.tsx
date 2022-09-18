import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

//I made this file because I got so sick of copy-pasting this from my last project every time
//This is just a simple context template

//This is an mirror of React's SetState type, only using
//named properties for easier destructuring
//Note that I intend 'value' and 'setValue' to be renamed something more descriptive
//e.g. "midiDevices" and "setMidiDevices"
type SettableValue<S> = {
    value: S;
    setValue: (action: S | ((prevState: S) => S)) => void;
};

//This is whatever type of data to be exposed via the context API
export type ExampleContext = string;

//The actual context value, only used within this file
// eslint-disable-next-line @typescript-eslint/no-empty-function
const exampleContext = createContext<SettableValue<ExampleContext>>({
    value: "foo",
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setValue: () => {},
});

//This is the main provider which is used in the _app.tsx file
//We can provide it with declarative inputs like any react component
//We can do arbitrary internal logic in here to control how the context value works!
const ExampleContextProvider = ({
    children,
    initialValue,
}: {
    children: ReactNode;
    initialValue: ExampleContext;
}) => {
    const [value, setValue] = useState<ExampleContext>(initialValue);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    //note that we didn't have to make this a SettableValue, it just means that we
    //can expose setting the value to any context consumers, which can be quite
    //convenient
    return (
        <exampleContext.Provider value={{ value, setValue }}>{children}</exampleContext.Provider>
    );
};

//This is the actual context consumer. It's just a shorthand and simplifies the
//underlying logic of useContext to a simpler hook
const useExampleContext = () => {
    const context = useContext(exampleContext);
    return context;
};

//The only consumer of this export is the parent component that provides the context to its children
//(usually _app.tsx)
export { ExampleContextProvider };

//This is consumed by any component wishing to use the context
export default useExampleContext;
