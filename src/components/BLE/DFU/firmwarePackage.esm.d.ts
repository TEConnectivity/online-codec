declare class SecureDfuPackage {
    constructor(buffer: File);
    load(): Promise<void>;
    getBaseImage(): Promise<{
        type: string;
        initFile: string;
        imageFile: string;
        initData: ArrayBuffer;
        imageData: ArrayBuffer;
    } | undefined>;
    getAppImage(): Promise<{
        type: string;
        initFile: string;
        imageFile: string;
        initData: ArrayBuffer;
        imageData: ArrayBuffer;
    } | undefined>;
}

export default SecureDfuPackage;