export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = (readerEvent) => {
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = image.width;
                let height = image.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(image, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        throw new Error('Error converting canvas to Blob.');
                    }
                }, file.type);
            };

            image.src = readerEvent.target?.result as string;
        };

        reader.readAsDataURL(file);
    });
};