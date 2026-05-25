import Header from "./Header";

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main className="main container">{children}</main>
        </>
    );
}