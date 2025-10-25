export default function Overlay({flag, setFlag, z = "z-10"}) {
    return (
        <div
            onClick={() => setFlag(false)}
            className={`fixed ${z} inset-0 bg-black/60 w-full h-full ${flag ? "block" : "hidden"}`}
        >
        </div>
    );
};