export const createThumbnail = async (file: File) => {
  return new Promise<string>(async (resolve, reject) => {
    const thumbSize = 256;
    const canvas = document.createElement('canvas');
    canvas.width = thumbSize;
    canvas.height = thumbSize;
    const c = canvas.getContext("2d");
    if (c) {
      const img = new Image();
      img.onload = (e) => {
        c.drawImage(img, 0, 0, thumbSize, thumbSize);
        const canvasDataUrl = canvas.toDataURL(file.type);
        resolve(canvasDataUrl);
      };
      img.src = await fileToDataURL(file);
    } else {
      reject('canvas not found');
    }
  });
};

/*
* imageType = File.type
* */
export const isSupportedImage = (imageType: string): boolean => {
  return [
    'image/png',
    'image/jpg',
    'image/jpeg',
  ].find(s => s === imageType) !== undefined;
};

let imageCache: {[key: string]: string} = {};

export const fileToDataURL = (imageFile: File) => {
  return new Promise<string>((resolve, reject) => {
    const fromCache = imageCache[imageFile.name];
    if (fromCache) {
      resolve(fromCache);
      return;
    }
    try {
      if (FileReader) {
        const fr = new FileReader();
        fr.onload = () => {
          const result = fr.result;
          if (typeof result === "string") {
            imageCache[imageFile.name] = result;
            setTimeout(() => {
              imageCache = {}; // auto clear cache
            }, 1000 * 60 * 30); // 30 mins

            resolve(result);
          } else {
            reject('FileResult is not a string; actual type is' + typeof result);
          }
        }
        fr.readAsDataURL(imageFile);
      } else {
        reject('Browser does not support FileReader');
      }
    } catch (e) {
      reject('' + e);
    }
  })
};