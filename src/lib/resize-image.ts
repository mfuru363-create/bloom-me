/** アップロード写真の長辺上限（px）— API 入力コスト削減 */
export const MAX_IMAGE_DIMENSION = 768;

/** JPEG 圧縮品質（0〜1） */
export const JPEG_QUALITY = 0.8;

export async function resizeImageForUpload(
  file: File,
): Promise<{ base64: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  let targetW = width;
  let targetH = height;

  if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
    if (width >= height) {
      targetW = MAX_IMAGE_DIMENSION;
      targetH = Math.round((height / width) * MAX_IMAGE_DIMENSION);
    } else {
      targetH = MAX_IMAGE_DIMENSION;
      targetW = Math.round((width / height) * MAX_IMAGE_DIMENSION);
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("画像の処理に失敗しました");
  }

  ctx.drawImage(bitmap, 0, 0, targetW, targetH);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("画像の圧縮に失敗しました"))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result?.toString() ?? "";
      const data = result.split(",")[1];
      if (data) resolve(data);
      else reject(new Error("画像の読み込みに失敗しました"));
    };
    reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
    reader.readAsDataURL(blob);
  });

  return { base64, mimeType: "image/jpeg" };
}
