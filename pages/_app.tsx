import { AppProps } from "next/dist/shared/lib/router/router";
import { ReactNode } from "react";
import { WowDataProvider } from "lib/useWowData";
import "../styles/app.css";
import { CharacterDataProvider } from "lib/useCharacter";

function MyApp({ Component, pageProps }: AppProps): ReactNode {
    return (
        <>
            <WowDataProvider filePath="/data.zip">
                <CharacterDataProvider>
                    <Component {...pageProps} />
                </CharacterDataProvider>
            </WowDataProvider>
        </>
    );
}

export default MyApp;
