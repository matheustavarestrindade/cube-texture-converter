const selectImageButton = document.querySelector("#select-image");
const downloadButton = document.querySelector("#download-texture");
const previewContainer = document.querySelector("#preview");
const processedContainer = document.querySelector("#processed");

let imageFiles = [];

selectImageButton.addEventListener("click", () => {
    const input = document.createElement("input");
    input.type = "file";
    input.hidden = true;
    input.click();
    input.onchange = (e) => {
        var reader = new FileReader();
        console.log(e);
        if (e.path[0].files && e.path[0].files[0]) {
            reader.readAsDataURL(input.files[0]);
            const extension = input.files[0].name.split(".").pop();
            console.log(extension);
            reader.onload = (e) => {
                const bitImage = e.target.result;
                const imageElement = document.createElement("img");
                imageElement.src = bitImage;
                previewContainer.innerHTML = "";
                previewContainer.appendChild(imageElement);
                createImages(bitImage, "." + extension);
            };
        }
    };
});

downloadButton.addEventListener("click", () => {
    if (imageFiles.length != 0) {
        imageFiles.forEach((fileObj) => {
            var link = document.createElement("a");
            link.download = fileObj.name;
            link.href = fileObj.file;
            console.log(fileObj);
            link.click();
        });
    }
});

function createImages(imageSrc, extension) {
    const image = new Image();
    image.src = imageSrc;
    imageFiles = [];
    image.onload = () => {
        const pieceWidth = image.width / 4;
        const pieceHeigth = image.height / 3;

        for (let x = 0; x < 4; x++) {
            let faceName = "";
            switch (x) {
                case 0:
                    faceName = "Back" + extension;
                    break;
                case 1:
                    faceName = "Left" + extension;
                    break;
                case 2:
                    faceName = "Front" + extension;
                    break;
                case 3:
                    faceName = "Right" + extension;
                    break;
            }
            const imageFile = createImageAxys(image, x * pieceWidth, pieceHeigth, pieceWidth, pieceHeigth);
            imageFiles.push({
                name: faceName,
                file: imageFile,
            });
        }
        for (let y = 0; y < 3; y++) {
            if (y == 1) {
                continue;
            }
            let faceName = "";
            switch (y) {
                case 0:
                    faceName = "Up" + extension;
                    break;
                case 2:
                    faceName = "Down" + extension;
                    break;
            }
            const imageFile = createImageAxys(image, pieceWidth, y * pieceHeigth, pieceWidth, pieceHeigth);
            imageFiles.push({
                name: faceName,
                file: imageFile,
            });
        }
    };
}

function createImageAxys(image, sx, sy, pieceWidth, pieceHeigth) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = pieceWidth;
    canvas.height = pieceHeigth;
    context.drawImage(image, sx, sy, pieceWidth, pieceHeigth, 0, 0, pieceWidth, pieceHeigth);
    processedContainer.appendChild(canvas);
    return canvas.toDataURL();
}
