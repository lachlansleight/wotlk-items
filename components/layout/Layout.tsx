import { ReactNode } from "react";
import Head from "next/head";
import packageJson from "package.json";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
    return (
        <>
            <Head>
                <title>WotLK Items</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="min-h-screen bg-neutral-900 text-white">
                <div className="h-12 bg-neutral-800" />
                <div
                    className="container m-auto py-8"
                    style={{
                        minHeight: "calc(100vh - 5rem)",
                    }}
                >
                    {children}
                </div>
                <div className="h-8 bg-neutral-800 flex items-center">
                    <div className="container m-auto">
                        <p className="text-white text-opacity-30">
                            WoTLK Items - v{packageJson.version}
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Layout;
