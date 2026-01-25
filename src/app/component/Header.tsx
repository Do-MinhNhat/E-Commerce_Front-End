import Navbar from "./Navbar";

export default function Header() {
    return (
        <>
            <header className="flex justify-between">
                <div className="flex justify-center gap-2">
                    <h1>Logo</h1>
                    <h2>Tên </h2>
                </div>
                <div>
                    <h1>Anything goes to the Middle</h1>
                </div>
                <div>
                    <h1>Random</h1>
                    <h1>Settings</h1>
                </div>
            </header>
            <Navbar></Navbar>
        </>
    )
}