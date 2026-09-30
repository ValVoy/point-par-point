import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import { ImageRefusee, preparerImage } from "./images";

const image = (largeur: number, hauteur: number, format: "jpeg" | "png" | "gif" = "jpeg") =>
  sharp({ create: { width: largeur, height: hauteur, channels: 3, background: "#64979d" } })
    .toFormat(format)
    .toBuffer();

describe("preparerImage", () => {
  it("redimensionne sans agrandir, en WebP", async () => {
    const grande = await preparerImage(await image(4000, 3000), "photo");
    assert.equal(grande.largeur, 1600);
    assert.equal(grande.hauteur, 1200);
    assert.equal((await sharp(grande.octets).metadata()).format, "webp");
    const petite = await preparerImage(await image(300, 200), "photo");
    assert.equal(petite.largeur, 300);
  });

  it("retire les metadonnees, position GPS comprise", async () => {
    const avecExif = await sharp(await image(800, 600))
      .withExif({ IFD0: { Artist: "Quelqu'un" }, IFD3: { GPSLatitudeRef: "N", GPSLatitude: "45/1 45/1 0/1" } })
      .jpeg()
      .toBuffer();
    assert.ok((await sharp(avecExif).metadata()).exif);
    const sortie = await preparerImage(avecExif, "photo");
    assert.equal((await sharp(sortie.octets).metadata()).exif, undefined);
  });

  it("refuse ce qui n'est pas une image, un SVG ou un GIF", async () => {
    await assert.rejects(preparerImage(Buffer.from("<html>pas une image</html>"), "photo"), ImageRefusee);
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><script>alert(1)</script></svg>');
    await assert.rejects(preparerImage(svg, "logo"), ImageRefusee);
    await assert.rejects(preparerImage(await image(10, 10, "gif"), "photo"), ImageRefusee);
  });

  it("refuse un fichier vide ou trop lourd", async () => {
    await assert.rejects(preparerImage(Buffer.alloc(0), "photo"), ImageRefusee);
    await assert.rejects(preparerImage(Buffer.alloc(13 * 1024 * 1024), "photo"), ImageRefusee);
  });

  it("refuse une image qui se deplie en trop de pixels", async () => {
    const immense = await sharp({ create: { width: 10000, height: 5000, channels: 3, background: "#000" } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await assert.rejects(preparerImage(immense, "photo"), ImageRefusee);
  });
});
