import JSZip from "jszip";

// Manually invoke the factory from the UMD module
function FirmwarePackage(buffer) {
    this.buffer = buffer;
    this.zipFile = null;
    this.manifest = null;
}

FirmwarePackage.prototype.load = function () {
    return JSZip.loadAsync(this.buffer)
        .then(zipFile => {
            this.zipFile = zipFile;
            try {
                return this.zipFile.file("manifest.json").async("string");
            } catch (e) {
                throw new Error("Unable to find manifest, is this a proper DFU package?");
            }
        })
        .then(content => {
            this.manifest = JSON.parse(content).manifest;
            return this;
        });
};

FirmwarePackage.prototype.getImage = function (types) {
    for (var type of types) {
        if (this.manifest[type]) {
            var entry = this.manifest[type];
            var result = {
                type: type,
                initFile: entry.dat_file,
                imageFile: entry.bin_file
            };
            return this.zipFile.file(result.initFile).async("arraybuffer")
                .then(data => {
                    result.initData = data;
                    return this.zipFile.file(result.imageFile).async("arraybuffer");
                })
                .then(data => {
                    result.imageData = data;
                    return result;
                });
        }
    }
};

FirmwarePackage.prototype.getBaseImage = function () {
    return this.getImage(["softdevice", "bootloader", "softdevice_bootloader"]);
};

FirmwarePackage.prototype.getAppImage = function () {
    return this.getImage(["application"]);
};

export default FirmwarePackage;